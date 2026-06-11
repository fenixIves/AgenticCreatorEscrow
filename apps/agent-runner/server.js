#!/usr/bin/env node

const { spawn } = require("node:child_process");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { URL } = require("node:url");

const rootDir = path.resolve(__dirname, "../..");
const webDir = path.join(rootDir, "apps/web");
const envFile = path.resolve(rootDir, process.env.ACE_ENV_FILE || ".env");
const stateFile = path.resolve(rootDir, ".ace-runner-state.json");
const port = Number(process.env.ACE_RUNNER_PORT || 4180);
const host = process.env.ACE_RUNNER_HOST || "127.0.0.1";

const fileEnv = loadEnvFile(envFile);
const env = { ...fileEnv, ...process.env };
const state = loadState();

const STEP_HASH_ENV = {
  create: "JOBESCROW_CREATE_TX_HASH",
  "proposal-a": "JOBESCROW_PROPOSAL_A_TX_HASH",
  "proposal-b": "JOBESCROW_PROPOSAL_B_TX_HASH",
  assign: "JOBESCROW_ASSIGN_TX_HASH",
  procure: "JOBESCROW_SUPPLIER_TX_HASH",
  deliver: "JOBESCROW_DELIVERY_TX_HASH",
  settle: "JOBESCROW_SETTLE_TX_HASH"
};

const STEPS = {
  create: {
    label: "Fund campaign",
    type: "caw",
    requestId: "jobescrow-create-001",
    required: ["JOB_ESCROW", "SRC", "PLATFORM", "PACT_ID"],
    description: "Create a funded JobEscrow campaign",
    method: "createJob(string,string,address,uint256)",
    value: "0.001",
    args: () => ["Protocol explainer campaign", "ipfs://brief-cid", env.PLATFORM, "10000000000000"]
  },
  "proposal-a": {
    label: "Proposal A",
    type: "cast",
    requestId: "jobescrow-proposal-a-001",
    required: ["JOB_ESCROW", "SEPOLIA_RPC_URL", "CREATOR_A_PRIVATE_KEY"],
    description: "Creator Agent A records its proposal",
    signature: "submitProposal(uint256,uint256,string,bytes32)",
    args: async () => ["1", "700000000000000", "ipfs://creator-agent-a-proposal", await castKeccak("proposal-a")],
    privateKeyEnv: "CREATOR_A_PRIVATE_KEY"
  },
  "proposal-b": {
    label: "Proposal B",
    type: "cast",
    requestId: "jobescrow-proposal-b-001",
    required: ["JOB_ESCROW", "SEPOLIA_RPC_URL", "CREATOR_B_PRIVATE_KEY"],
    description: "Creator Agent B records its proposal",
    signature: "submitProposal(uint256,uint256,string,bytes32)",
    args: async () => ["1", "650000000000000", "ipfs://creator-agent-b-proposal", await castKeccak("proposal-b")],
    privateKeyEnv: "CREATOR_B_PRIVATE_KEY"
  },
  assign: {
    label: "Select winner",
    type: "caw",
    requestId: "jobescrow-assign-001",
    required: ["JOB_ESCROW", "SRC", "CREATOR", "PACT_ID"],
    description: "Assign selected creator from proposal",
    method: "assignCreatorFromProposal(uint256,address)",
    args: () => ["1", env.CREATOR]
  },
  procure: {
    label: "Buy resource",
    type: "caw",
    requestId: "jobescrow-supplier-001",
    required: ["JOB_ESCROW", "SRC", "SUPPLIER", "PACT_ID"],
    description: "Pay supplier for campaign resource",
    method: "paySupplier(uint256,address,uint256,string)",
    args: () => ["1", env.SUPPLIER, "100000000000000", "ipfs://chart-pack-receipt"]
  },
  deliver: {
    label: "Submit delivery",
    type: "cast",
    requestId: "jobescrow-delivery-001",
    required: ["JOB_ESCROW", "SEPOLIA_RPC_URL", "CREATOR_B_PRIVATE_KEY"],
    description: "Selected creator records final delivery",
    signature: "submitDelivery(uint256,string,bytes32)",
    args: async () => ["1", "ipfs://creator-agent-b-delivery", await castKeccak("delivery-b")],
    privateKeyEnv: "CREATOR_B_PRIVATE_KEY"
  },
  settle: {
    label: "Settle payout",
    type: "caw",
    requestId: "jobescrow-pay-001",
    required: ["JOB_ESCROW", "SRC", "PACT_ID"],
    description: "Accept delivery and settle payouts",
    method: "acceptAndPay(uint256)",
    args: () => ["1"]
  }
};

let activeRun = null;

const server = http.createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url, `http://${req.headers.host || `${host}:${port}`}`);

    if (req.method === "GET" && requestUrl.pathname === "/api/runner/config") {
      return sendJson(res, 200, getConfig());
    }

    if (req.method === "POST" && requestUrl.pathname === "/api/runner/run") {
      const body = await readJson(req);
      return sendJson(res, 200, await runStep(body.stepKey));
    }

    if (req.method === "POST" && requestUrl.pathname === "/api/runner/refresh") {
      const body = await readJson(req);
      return sendJson(res, 200, await refreshStep(body.stepKey));
    }

    return serveStatic(req, res, requestUrl);
  } catch (error) {
    return sendJson(res, 500, {
      ok: false,
      error: "RUNNER_ERROR",
      message: redact(error.message || String(error))
    });
  }
});

server.listen(port, host, () => {
  console.log(`ACE Agent Runner listening on http://${host}:${port}`);
  console.log(`Serving frontend from ${webDir}`);
  console.log(`Env file: ${fs.existsSync(envFile) ? envFile : `${envFile} (missing)`}`);
});

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  return fs
    .readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .reduce((acc, line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        return acc;
      }

      const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (!match) {
        return acc;
      }

      let value = match[2].trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      acc[match[1]] = value;
      return acc;
    }, {});
}

function loadState() {
  if (!fs.existsSync(stateFile)) {
    return { steps: {} };
  }

  try {
    return JSON.parse(fs.readFileSync(stateFile, "utf8"));
  } catch {
    return { steps: {} };
  }
}

function saveState() {
  fs.writeFileSync(stateFile, `${JSON.stringify(state, null, 2)}\n`);
}

function getConfig() {
  const stepReadiness = Object.fromEntries(
    Object.entries(STEPS).map(([key, step]) => [
      key,
      {
        type: step.type,
        label: step.label,
        requestId: step.requestId,
        missing: missingEnv(step.required)
      }
    ])
  );

  return {
    ok: true,
    runner: "connected",
    chainId: "SETH",
    explorerBaseUrl: "https://sepolia.etherscan.io/tx/",
    env: {
      JOB_ESCROW: publicValue("JOB_ESCROW"),
      SRC: publicValue("SRC"),
      PLATFORM: publicValue("PLATFORM"),
      CREATOR: publicValue("CREATOR"),
      SUPPLIER: publicValue("SUPPLIER"),
      PACT_ID: publicValue("PACT_ID"),
      CAW_BASIC_TRANSFER_TX_HASH: publicValue("CAW_BASIC_TRANSFER_TX_HASH"),
      CAW_WETH_DEPOSIT_TX_HASH: publicValue("CAW_WETH_DEPOSIT_TX_HASH")
    },
    capabilities: {
      hasSepoliaRpc: Boolean(env.SEPOLIA_RPC_URL),
      hasCreatorAKey: Boolean(env.CREATOR_A_PRIVATE_KEY),
      hasCreatorBKey: Boolean(env.CREATOR_B_PRIVATE_KEY)
    },
    stepReadiness,
    steps: currentStepResults()
  };
}

function publicValue(key) {
  return env[key] || "";
}

function currentStepResults() {
  return Object.fromEntries(
    Object.keys(STEPS).map((key) => {
      const saved = state.steps[key] || {};
      const hashFromEnv = env[STEP_HASH_ENV[key]];
      return [
        key,
        {
          ...saved,
          txHash: saved.txHash || hashFromEnv || "",
          status: saved.status || (hashFromEnv ? "Completed" : "")
        }
      ];
    })
  );
}

async function runStep(stepKey) {
  if (activeRun) {
    return {
      ok: false,
      error: "RUNNER_BUSY",
      message: `Runner is already executing ${STEPS[activeRun]?.label || activeRun}.`
    };
  }

  const step = STEPS[stepKey];
  if (!step) {
    return { ok: false, error: "UNKNOWN_STEP", message: `Step is not allowlisted: ${stepKey}` };
  }

  const missing = missingEnv(step.required);
  if (missing.length > 0) {
    return {
      ok: false,
      error: "MISSING_ENV",
      message: `Missing required env vars: ${missing.join(", ")}`,
      missing
    };
  }

  activeRun = stepKey;

  try {
    const result = step.type === "caw" ? await runCawStep(stepKey, step) : await runCastStep(stepKey, step);
    state.steps[stepKey] = result;
    saveState();
    return { ok: true, stepKey, result, config: getConfig() };
  } finally {
    activeRun = null;
  }
}

async function refreshStep(stepKey) {
  const step = STEPS[stepKey];
  if (!step) {
    return { ok: false, error: "UNKNOWN_STEP", message: `Step is not allowlisted: ${stepKey}` };
  }

  if (step.type !== "caw") {
    return { ok: true, stepKey, result: state.steps[stepKey] || {}, config: getConfig() };
  }

  const missing = missingEnv(["PACT_ID"]);
  if (missing.length > 0) {
    return { ok: false, error: "MISSING_ENV", message: `Missing required env vars: ${missing.join(", ")}`, missing };
  }

  const refreshed = await pollCawRequest(step.requestId, 1, 0);
  state.steps[stepKey] = {
    ...(state.steps[stepKey] || {}),
    ...refreshed,
    label: step.label,
    type: step.type,
    requestId: step.requestId,
    updatedAt: new Date().toISOString()
  };
  saveState();

  return { ok: true, stepKey, result: state.steps[stepKey], config: getConfig() };
}

async function runCawStep(stepKey, step) {
  const calldata = await encodeCalldata(step.method, await step.args());
  const txArgs = [
    "tx",
    "call",
    "--pact-id",
    env.PACT_ID,
    "--chain-id",
    "SETH",
    "--contract",
    env.JOB_ESCROW,
    "--calldata",
    calldata,
    "--src-address",
    env.SRC,
    "--request-id",
    step.requestId,
    "--description",
    step.description
  ];

  if (step.value) {
    txArgs.splice(10, 0, "--value", step.value);
  }

  const submit = await runCommand("caw", txArgs);
  const parsedSubmit = parseMaybeJson(submit.stdout);
  const polled = await pollCawRequest(step.requestId, Number(env.ACE_POLL_ATTEMPTS || 15), Number(env.ACE_POLL_INTERVAL_MS || 2500));

  return {
    label: step.label,
    type: step.type,
    requestId: step.requestId,
    status: polled.status || extractStatus(parsedSubmit) || "Submitted",
    subStatus: polled.subStatus || extractSubStatus(parsedSubmit) || "",
    txHash: polled.txHash || extractTxHash(parsedSubmit) || "",
    message: polled.message || "CAW transaction submitted. Approve in the CAW DEV app if prompted.",
    submittedAt: new Date().toISOString(),
    rawSummary: summarizeJson(parsedSubmit)
  };
}

async function runCastStep(stepKey, step) {
  const args = [
    "send",
    env.JOB_ESCROW,
    step.signature,
    ...(await step.args()),
    "--rpc-url",
    env.SEPOLIA_RPC_URL,
    "--private-key",
    env[step.privateKeyEnv],
    "--json"
  ];

  const result = await runCommand("cast", args);
  const parsed = parseMaybeJson(result.stdout);
  const txHash = extractTxHash(parsed) || findHash(result.stdout) || findHash(result.stderr);

  return {
    label: step.label,
    type: step.type,
    requestId: step.requestId,
    status: txHash ? "Completed" : "Submitted",
    txHash,
    message: txHash ? "Creator-side transaction confirmed or broadcast by cast." : "Creator-side transaction submitted.",
    submittedAt: new Date().toISOString(),
    rawSummary: summarizeJson(parsed)
  };
}

async function encodeCalldata(method, args) {
  const result = await runCommand("caw", ["util", "abi", "encode", "--method", method, "--args", JSON.stringify(args)]);
  const parsed = parseMaybeJson(result.stdout);
  const calldata = parsed?.calldata || parsed?.data || findHexCalldata(result.stdout);
  if (!calldata) {
    throw new Error(`Unable to encode calldata for ${method}: ${redact(result.stdout || result.stderr)}`);
  }
  return calldata;
}

async function castKeccak(value) {
  const result = await runCommand("cast", ["keccak", value]);
  return result.stdout.trim();
}

async function pollCawRequest(requestId, attempts, intervalMs) {
  let last = {};

  for (let i = 0; i < attempts; i += 1) {
    if (i > 0 && intervalMs > 0) {
      await delay(intervalMs);
    }

    const result = await runCommand("caw", ["tx", "get", "--request-id", requestId], { allowFailure: true });
    const parsed = parseMaybeJson(result.stdout);
    last = {
      status: extractStatus(parsed),
      subStatus: extractSubStatus(parsed),
      txHash: extractTxHash(parsed),
      message: result.code === 0 ? "CAW transaction status refreshed." : redact(result.stderr || result.stdout),
      rawSummary: summarizeJson(parsed)
    };

    if (last.txHash && isTerminalStatus(last.status)) {
      return last;
    }

    if (last.status && /failed|rejected/i.test(last.status)) {
      return last;
    }
  }

  return {
    ...last,
    message:
      last.txHash
        ? "Transaction hash is available; final confirmation may still be updating."
        : "Waiting for CAW signing, owner approval, or broadcast. Use Sync after approving in the CAW DEV app."
  };
}

function missingEnv(keys) {
  return keys.filter((key) => !env[key]);
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: rootDir,
      env,
      stdio: ["ignore", "pipe", "pipe"]
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", (error) => {
      reject(new Error(`${command} failed to start: ${error.message}`));
    });

    child.on("close", (code) => {
      const result = { code, stdout: redact(stdout), stderr: redact(stderr) };
      if (code !== 0 && !options.allowFailure) {
        reject(new Error(`${command} exited ${code}: ${result.stderr || result.stdout}`));
        return;
      }

      resolve(result);
    });
  });
}

function parseMaybeJson(text) {
  const trimmed = (text || "").trim();
  if (!trimmed) {
    return null;
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(trimmed.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

function extractStatus(value) {
  return findField(value, ["status", "state", "result_status"]) || "";
}

function extractSubStatus(value) {
  return findField(value, ["sub_status", "subStatus"]) || "";
}

function extractTxHash(value) {
  const found = findField(value, [
    "transaction_hash",
    "transactionHash",
    "tx_hash",
    "txHash",
    "hash",
    "transactionHash"
  ]);
  return isTxHash(found) ? found : "";
}

function findField(value, names) {
  if (!value || typeof value !== "object") {
    return "";
  }

  const wanted = new Set(names.map((name) => name.toLowerCase()));
  const stack = [value];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || typeof current !== "object") {
      continue;
    }

    for (const [key, fieldValue] of Object.entries(current)) {
      if (wanted.has(key.toLowerCase()) && typeof fieldValue === "string" && fieldValue.trim()) {
        return fieldValue.trim();
      }

      if (fieldValue && typeof fieldValue === "object") {
        stack.push(fieldValue);
      }
    }
  }

  return "";
}

function findHash(text) {
  const match = String(text || "").match(/0x[a-fA-F0-9]{64}/);
  return match ? match[0] : "";
}

function findHexCalldata(text) {
  const match = String(text || "").match(/0x[a-fA-F0-9]{8,}/);
  return match ? match[0] : "";
}

function isTxHash(value) {
  return /^0x[a-fA-F0-9]{64}$/.test(String(value || ""));
}

function isTerminalStatus(status) {
  return /completed|success|succeeded|failed|rejected/i.test(String(status || ""));
}

function summarizeJson(value) {
  if (!value || typeof value !== "object") {
    return "";
  }

  const status = extractStatus(value);
  const subStatus = extractSubStatus(value);
  const txHash = extractTxHash(value);
  return [status && `status=${status}`, subStatus && `sub=${subStatus}`, txHash && `hash=${txHash}`]
    .filter(Boolean)
    .join(" | ");
}

function redact(text) {
  let output = String(text || "");
  const secrets = [
    "DEPLOYER_PRIVATE_KEY",
    "CREATOR_A_PRIVATE_KEY",
    "CREATOR_B_PRIVATE_KEY",
    "SEPOLIA_RPC_URL",
    "ETHERSCAN_API_KEY"
  ];

  for (const key of secrets) {
    const value = env[key];
    if (value) {
      output = output.split(value).join(`[redacted:${key}]`);
    }
  }

  output = output.replace(/0x[a-fA-F0-9]{64}/g, (match) => {
    if (match === findHash(match)) {
      return match;
    }
    return "[redacted:private-key]";
  });

  return output;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function readJson(req) {
  let data = "";
  for await (const chunk of req) {
    data += chunk;
  }

  return data ? JSON.parse(data) : {};
}

function sendJson(res, statusCode, data) {
  const body = `${JSON.stringify(data, null, 2)}\n`;
  res.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  });
  res.end(body);
}

function serveStatic(req, res, requestUrl) {
  const pathname = decodeURIComponent(requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname);
  const target = path.normalize(path.join(webDir, pathname));

  if (!target.startsWith(webDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(target, (error, contents) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    res.writeHead(200, {
      "content-type": contentType(target),
      "cache-control": "no-store"
    });
    res.end(contents);
  });
}

function contentType(filePath) {
  const ext = path.extname(filePath);
  const types = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp"
  };

  return types[ext] || "application/octet-stream";
}
