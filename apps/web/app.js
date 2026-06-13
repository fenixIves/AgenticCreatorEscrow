const campaign = {
  title: "Protocol explainer campaign",
  brief: {
    dao: "NebulaDAO Growth Team",
    taskType: "Protocol explainer script",
    taskOptions: ["Protocol explainer script", "Governance proposal draft", "Launch thread + video script", "Tokenomics research memo"],
    objective: "Turn a new restaking vault launch into a clear 60-second explainer for retail DeFi users.",
    audience: "ETH option traders and DeFi-curious community members",
    tone: "Clear, visual, slightly skeptical, no hype language",
    deliverables: ["60-second script", "shot list", "thumbnail copy", "source notes"],
    deadline: "24 hours",
    reviewRule: "Accuracy 40%, clarity 30%, visual potential 20%, cost 10%"
  },
  budget: 0.001,
  platformFee: 0.00001,
  sponsor: "0x0db0aa2bed1e0710a51d44a6f87ad62e28bbfbd7",
  creatorA: "0x1000000000000000000000000000000000001002",
  creatorB: "0x1000000000000000000000000000000000001006",
  supplier: "0x1000000000000000000000000000000000001003",
  platform: "0x1000000000000000000000000000000000001004",
  proposals: [
    {
      id: "proposal-a",
      agent: "Creator Agent A",
      payout: 0.0007,
      uri: "ipfs://creator-agent-a-proposal",
      tone: "Beginner-friendly explainer for new community members.",
      hash: "0x3b7d...a91f",
      score: 82,
      proof: "draft://creator-a-nebuladao-explainer",
      title: "What is this vault, in plain English?",
      preview:
        "NebulaDAO's new vault is like an automated covered-call desk for ETH yield seekers: it routes capital, manages risk windows, and reports strategy performance without asking users to babysit every rebalance.",
      strengths: ["Very beginner friendly", "Easy voiceover hook", "Good risk disclaimer"],
      risk: "Less depth for DeFi-native viewers",
      content:
        "Creator Agent A Draft\n\nHook: If your ETH could hire a risk manager, what would it ask them to do first?\n\nCore script: NebulaDAO packages a vault strategy into a simple user experience. Instead of manually tracking yield windows, users deposit into a strategy that handles routing, risk controls, and reporting. The main user benefit is not magic APY; it is fewer manual decisions and a clearer way to understand where returns come from.\n\nVisual notes: open with ETH desk metaphor, then split-screen vault flow, then risk checklist.\n"
    },
    {
      id: "proposal-b",
      agent: "Creator Agent B",
      payout: 0.00065,
      uri: "ipfs://creator-agent-b-proposal",
      tone: "Technical explainer for active DeFi users.",
      hash: "0x9ba0...615e",
      score: 91,
      proof: "draft://creator-b-nebuladao-explainer",
      title: "A DeFi-native vault story with risk controls",
      preview:
        "NebulaDAO is not selling passive yield as a black box. The angle is controlled execution: where funds move, what risk budget is reserved, and how users can verify strategy state before they allocate.",
      strengths: ["Stronger DeFi accuracy", "Better visual structure", "Lower payout ask"],
      risk: "Needs one more analogy for beginners",
      content:
        "Creator Agent B Draft\n\nHook: The question is not 'what APY can this vault promise?' The better question is 'who is allowed to move funds, under what rules, and how do users verify it?'\n\nCore script: NebulaDAO's vault turns a strategy into a bounded workflow. Funds enter a contract-defined path, the strategy exposes checkpoints, and the user can inspect risk rules instead of trusting a vague yield story. For DeFi users, that matters because automation is only useful when execution rights are narrow and evidence is visible.\n\nVisual notes: show a route map, then permission gates, then a final checklist: capital path, risk boundary, proof.\n"
    }
  ],
  selectedProposalId: "proposal-b",
  supplierSpend: 0.0001,
  supplierReceipt: "ipfs://chart-pack-receipt",
  deliveryUri: "ipfs://creator-agent-b-delivery",
  deliveryHash: "0x8537...c2be",
  deliveryPackage:
    "Agentic Creator Escrow - Final Delivery\n\nSelected creator: Creator Agent B\n\nFinal hook: The question is not what APY this vault can promise. The better question is who can move funds, under what rules, and how users verify it.\n\nFinal script: NebulaDAO's vault turns a strategy into a bounded workflow. Funds enter a contract-defined path, the strategy exposes checkpoints, and users inspect risk rules instead of trusting a vague yield story. For DeFi users, automation is only useful when execution rights are narrow and evidence is visible.\n\nShot list: 1) Route map, 2) Permission gates, 3) Risk boundary, 4) Verification checklist.\n\nThumbnail copy: Don't trust the APY. Inspect the rules.\n",
  jobEscrow: "0xJOB_ESCROW",
  pactId: "PACT_ID"
};

const cawProofReceipts = [
  {
    id: "basic-transfer",
    label: "CAW basic SETH transfer",
    action: "transfer_tokens",
    chain: "SETH",
    requestId: "caw-basic-seth-transfer-001",
    status: "awaiting",
    hash: "",
    note: "Paste the real hash from your completed CAW transfer test."
  },
  {
    id: "contract-call",
    label: "CAW WETH deposit contract_call",
    action: "contract_call",
    chain: "SETH",
    requestId: "caw-basic-weth-deposit-001",
    status: "awaiting",
    hash: "",
    note: "Paste the real hash from your completed WETH deposit contract_call test."
  }
];

const steps = [
  {
    key: "create",
    label: "Fund campaign",
    actor: "CAW Sponsor",
    command: `scripts/caw-jobescrow-calldata.sh sponsor-create-job`,
    tx: "jobescrow-create-001"
  },
  {
    key: "proposal-a",
    label: "Proposal A",
    actor: "Creator Agent A",
    command: `scripts/caw-jobescrow-calldata.sh creator-proposal-a`,
    tx: "jobescrow-proposal-a-001"
  },
  {
    key: "proposal-b",
    label: "Proposal B",
    actor: "Creator Agent B",
    command: `scripts/caw-jobescrow-calldata.sh creator-proposal-b`,
    tx: "jobescrow-proposal-b-001"
  },
  {
    key: "assign",
    label: "Select winner",
    actor: "CAW Sponsor",
    command: `scripts/caw-jobescrow-calldata.sh sponsor-assign-from-proposal`,
    tx: "jobescrow-assign-001"
  },
  {
    key: "procure",
    label: "Buy resource",
    actor: "CAW Sponsor",
    command: `scripts/caw-jobescrow-calldata.sh sponsor-pay-supplier`,
    tx: "jobescrow-supplier-001"
  },
  {
    key: "deliver",
    label: "Submit delivery",
    actor: "Creator Agent B",
    command: `scripts/caw-jobescrow-calldata.sh creator-submit-delivery`,
    tx: "jobescrow-delivery-001"
  },
  {
    key: "settle",
    label: "Settle payout",
    actor: "CAW Sponsor",
    command: `scripts/caw-jobescrow-calldata.sh sponsor-accept-and-pay`,
    tx: "jobescrow-pay-001"
  }
];

const productStages = [
  {
    key: "brief",
    label: "Campaign brief",
    actor: "DAO / Project",
    startAt: 0,
    completeAt: 1
  },
  {
    key: "competition",
    label: "Agent competition",
    actor: "Creator Agents",
    startAt: 1,
    completeAt: 3
  },
  {
    key: "review",
    label: "Review winner",
    actor: "DAO + CAW Sponsor",
    startAt: 3,
    completeAt: 4
  },
  {
    key: "procurement",
    label: "Buy resources",
    actor: "CAW Sponsor",
    startAt: 4,
    completeAt: 5
  },
  {
    key: "delivery",
    label: "Delivery package",
    actor: "Creator Agent B",
    startAt: 5,
    completeAt: 6
  },
  {
    key: "settlement",
    label: "Settlement",
    actor: "CAW Sponsor",
    startAt: 6,
    completeAt: 7
  }
];

const executionGroups = [
  {
    label: "Fund campaign",
    actor: "CAW",
    keys: ["create"]
  },
  {
    label: "Agent proposals",
    actor: "Creator tx x2",
    keys: ["proposal-a", "proposal-b"]
  },
  {
    label: "Select winner",
    actor: "CAW",
    keys: ["assign"]
  },
  {
    label: "Buy resource",
    actor: "CAW",
    keys: ["procure"]
  },
  {
    label: "Submit delivery",
    actor: "Creator tx",
    keys: ["deliver"]
  },
  {
    label: "Settle payout",
    actor: "CAW",
    keys: ["settle"]
  }
];

applyRuntimeConfig();

let completed = 0;
let activeRole = "dao";
let runner = {
  available: false,
  running: false,
  message: "Waiting for local runner at /api/runner/config",
  env: {},
  stepReadiness: {},
  steps: {},
  capabilities: {}
};

const el = {
  advanceButton: document.querySelector("#advanceButton"),
  assetStack: document.querySelector("#assetStack"),
  budgetMetric: document.querySelector("#budgetMetric"),
  campaignTitle: document.querySelector("#campaignTitle"),
  chainStepList: document.querySelector("#chainStepList"),
  chainStepSummary: document.querySelector("#chainStepSummary"),
  commandBlock: document.querySelector("#commandBlock"),
  copyCommand: document.querySelector("#copyCommand"),
  creatorPayout: document.querySelector("#creatorPayout"),
  deliveryHash: document.querySelector("#deliveryHash"),
  deliveryState: document.querySelector("#deliveryState"),
  deliveryUri: document.querySelector("#deliveryUri"),
  escrowBalance: document.querySelector("#escrowBalance"),
  eventList: document.querySelector("#eventList"),
  fluidCanvases: Array.from(document.querySelectorAll(".fluid-shader-canvas")),
  homeDetails: document.querySelector("#homeDetails"),
  homeView: document.querySelector("#homeView"),
  jobStatus: document.querySelector("#jobStatus"),
  latestProofPanel: document.querySelector("#latestProofPanel"),
  pactState: document.querySelector("#pactState"),
  procurementRail: document.querySelector("#procurementRail"),
  proposalCounter: document.querySelector("#proposalCounter"),
  proposalGrid: document.querySelector("#proposalGrid"),
  presenterHeadline: document.querySelector("#presenterHeadline"),
  presenterProofGrid: document.querySelector("#presenterProofGrid"),
  presenterSubcopy: document.querySelector("#presenterSubcopy"),
  receiptList: document.querySelector("#receiptList"),
  receiptSummary: document.querySelector("#receiptSummary"),
  resetButton: document.querySelector("#resetButton"),
  resourceSpend: document.querySelector("#resourceSpend"),
  roleButtons: Array.from(document.querySelectorAll("[data-role-view]")),
  roleViewPanel: document.querySelector("#roleViewPanel"),
  roleList: document.querySelector("#roleList"),
  splitList: document.querySelector("#splitList"),
  stepFocusBody: document.querySelector("#stepFocusBody"),
  stepFocusEyebrow: document.querySelector("#stepFocusEyebrow"),
  stepFocusGrid: document.querySelector("#stepFocusGrid"),
  stepFocusPanel: document.querySelector("#stepFocusPanel"),
  stepFocusTitle: document.querySelector("#stepFocusTitle"),
  supplierState: document.querySelector("#supplierState"),
  timeline: document.querySelector("#timeline"),
  workbenchView: document.querySelector("#workbenchView")
};

const carousel = {
  dots: Array.from(document.querySelectorAll("[data-carousel-dot]")),
  next: document.querySelector("[data-carousel-next]"),
  prev: document.querySelector("[data-carousel-prev]"),
  slides: Array.from(document.querySelectorAll("[data-carousel-slide]")),
  timer: null,
  index: 0
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const AUTO_SYNC_ATTEMPTS = 10;
const AUTO_SYNC_INTERVAL_MS = 3000;
const fluidShaderResizers = [];
const initializedFluidCanvases = new WeakSet();

function formatEth(value) {
  return `${value.toFixed(5).replace(/0+$/, "").replace(/\.$/, "")} SETH`;
}

function shortAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-5)}`;
}

function shortHash(hash) {
  if (!hash) {
    return "Awaiting real tx hash";
  }

  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

function isUsableOverride(value) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

function getRuntimeOverride(config, params, names) {
  for (const name of names) {
    if (isUsableOverride(config[name])) {
      return String(config[name]).trim();
    }

    const exact = params.get(name);
    if (isUsableOverride(exact)) {
      return exact.trim();
    }

    const lower = params.get(name.toLowerCase());
    if (isUsableOverride(lower)) {
      return lower.trim();
    }
  }

  return "";
}

function setStepHash(stepKey, hash, status = "Completed", note = "") {
  const step = steps.find((item) => item.key === stepKey);
  if (!step) {
    return;
  }

  if (hash) {
    step.hash = hash;
  }
  if (status) {
    step.runStatus = status;
  }
  if (note) {
    step.note = note;
  }
}

function applyRuntimeConfig() {
  const config = window.ACE_DEMO_CONFIG || {};
  const params = new URLSearchParams(window.location.search);

  const campaignOverrides = [
    ["jobEscrow", ["jobEscrow", "JOB_ESCROW"]],
    ["pactId", ["pactId", "PACT_ID"]],
    ["sponsor", ["src", "SRC", "sponsor", "SPONSOR"]],
    ["platform", ["platform", "PLATFORM"]],
    ["creatorB", ["creator", "CREATOR"]],
    ["supplier", ["supplier", "SUPPLIER"]]
  ];

  campaignOverrides.forEach(([key, names]) => {
    const value = getRuntimeOverride(config, params, names);
    if (value) {
      campaign[key] = value;
    }
  });

  cawProofReceipts[0].hash = getRuntimeOverride(config, params, [
    "basicTransferTxHash",
    "CAW_BASIC_TRANSFER_TX_HASH"
  ]) || cawProofReceipts[0].hash;
  cawProofReceipts[1].hash = getRuntimeOverride(config, params, [
    "wethDepositTxHash",
    "CAW_WETH_DEPOSIT_TX_HASH"
  ]) || cawProofReceipts[1].hash;

  const stepHashKeys = {
    create: ["createJobTxHash", "JOBESCROW_CREATE_TX_HASH"],
    "proposal-a": ["proposalATxHash", "JOBESCROW_PROPOSAL_A_TX_HASH"],
    "proposal-b": ["proposalBTxHash", "JOBESCROW_PROPOSAL_B_TX_HASH"],
    assign: ["assignTxHash", "JOBESCROW_ASSIGN_TX_HASH"],
    procure: ["supplierTxHash", "JOBESCROW_SUPPLIER_TX_HASH"],
    deliver: ["deliveryTxHash", "JOBESCROW_DELIVERY_TX_HASH"],
    settle: ["settleTxHash", "JOBESCROW_SETTLE_TX_HASH"]
  };

  steps.forEach((step) => {
    const hash = getRuntimeOverride(config, params, stepHashKeys[step.key] || []);
    if (hash) {
      setStepHash(step.key, hash);
    }
  });
}

function applyRunnerConfig(config) {
  if (!config?.ok) {
    return;
  }

  const env = config.env || {};
  const envOverrides = [
    ["jobEscrow", env.JOB_ESCROW],
    ["pactId", env.PACT_ID],
    ["sponsor", env.SRC],
    ["platform", env.PLATFORM],
    ["creatorB", env.CREATOR],
    ["supplier", env.SUPPLIER]
  ];

  envOverrides.forEach(([key, value]) => {
    if (isUsableOverride(value)) {
      campaign[key] = value;
    }
  });

  if (isUsableOverride(env.CAW_BASIC_TRANSFER_TX_HASH)) {
    cawProofReceipts[0].hash = env.CAW_BASIC_TRANSFER_TX_HASH;
  }
  if (isUsableOverride(env.CAW_WETH_DEPOSIT_TX_HASH)) {
    cawProofReceipts[1].hash = env.CAW_WETH_DEPOSIT_TX_HASH;
  }

  Object.entries(config.steps || {}).forEach(([stepKey, result]) => {
    setStepHash(stepKey, result.txHash, result.status, result.message);
  });

  runner = {
    ...runner,
    available: true,
    env,
    stepReadiness: config.stepReadiness || {},
    steps: config.steps || {},
    capabilities: config.capabilities || {},
    message: "Live runner connected. Ready to execute allowlisted demo steps."
  };

  syncCompletedFromConfirmedSteps();
}

function syncCompletedFromConfirmedSteps() {
  let confirmedCount = 0;
  for (const step of steps) {
    if (!step.hash) {
      break;
    }
    confirmedCount += 1;
  }

  completed = Math.max(completed, confirmedCount);
}

function getSelectedProposal() {
  return campaign.proposals.find((proposal) => proposal.id === campaign.selectedProposalId);
}

function getState() {
  const hasJob = completed >= 1;
  const proposalCount = Math.min(Math.max(completed - 1, 0), 2);
  const hasAssignment = completed >= 4;
  const hasProcurement = completed >= 5;
  const hasDelivery = completed >= 6;
  const isSettled = completed >= 7;
  const selected = getSelectedProposal();
  const escrowAfterFunding = hasJob ? campaign.budget : 0;
  const escrowAfterSupplier = hasProcurement ? escrowAfterFunding - campaign.supplierSpend : escrowAfterFunding;
  const finalRefund = campaign.budget - campaign.supplierSpend - selected.payout - campaign.platformFee;

  return {
    hasJob,
    proposalCount,
    hasAssignment,
    hasProcurement,
    hasDelivery,
    isSettled,
    selected,
    escrow: isSettled ? 0 : escrowAfterSupplier,
    creatorPayout: isSettled ? selected.payout : 0,
    resourceSpend: hasProcurement ? campaign.supplierSpend : 0,
    refund: isSettled ? finalRefund : 0,
    platformFee: isSettled ? campaign.platformFee : 0,
    status: isSettled
      ? "Paid"
      : hasDelivery
        ? "Submitted"
        : hasProcurement
          ? "In progress"
          : hasAssignment
            ? "Assigned"
            : hasJob
              ? "Posted"
              : "Draft"
  };
}

function getCurrentStep() {
  return steps[Math.min(completed, steps.length - 1)];
}

function getReceiptStatus(receipt, index) {
  if (receipt.hash) {
    return "confirmed";
  }

  if (receipt.runStatus && /pending|submitted|broadcasting|confirming|authorization|signature/i.test(receipt.runStatus)) {
    return "awaiting";
  }

  if (receipt.status === "awaiting") {
    return "awaiting";
  }

  return index < completed ? "simulated" : "pending";
}

function getReceipts() {
  const lifecycleReceipts = steps.map((step, index) => ({
    id: step.key,
    label: step.label,
    action: step.command.split(" ").at(-1),
    chain: "SETH",
    requestId: step.tx,
    status: "lifecycle",
    runStatus: step.runStatus || "",
    hash: step.hash || "",
    note:
      step.note ||
      (index < completed
        ? "Workflow state advanced. Run live execution to attach a transaction hash."
        : "Waiting for this workflow step.")
  }));

  return [...cawProofReceipts, ...lifecycleReceipts];
}

function getLatestProofSummary() {
  const confirmed = getReceipts().find((receipt) => receipt.hash);
  if (confirmed) {
    return shortHash(confirmed.hash);
  }

  if (completed > 0) {
    return "Workflow state advanced";
  }

  return "Awaiting real CAW hash";
}

function getLatestConfirmedReceipt(receipts = getReceipts()) {
  return [...receipts].reverse().find((receipt) => receipt.hash);
}

function getStepResult(stepKey) {
  const step = steps.find((item) => item.key === stepKey);
  const runnerResult = runner.steps?.[stepKey] || {};
  return {
    status: step?.runStatus || runnerResult.status || "",
    subStatus: runnerResult.subStatus || "",
    txHash: step?.hash || runnerResult.txHash || "",
    message: step?.note || runnerResult.message || "",
    requestId: step?.tx || runnerResult.requestId || ""
  };
}

function getLatestConfirmedStep() {
  return [...steps].reverse().find((step) => step.hash);
}

function explorerLink(hash) {
  return `https://sepolia.etherscan.io/tx/${hash}`;
}

function contractExplorerLink(address) {
  return `https://sepolia.etherscan.io/address/${address}`;
}

function isTransactionHash(value) {
  return /^0x[a-fA-F0-9]{64}$/.test(String(value || ""));
}

function isSuccessfulTxResult(result) {
  return isTransactionHash(result.txHash) && /success|completed|confirmed/i.test(String(result.status || ""));
}

function getCurrentProductStageIndex() {
  const index = productStages.findIndex((stage) => completed < stage.completeAt);
  return index === -1 ? productStages.length - 1 : index;
}

function getCurrentProductStage() {
  return productStages[getCurrentProductStageIndex()];
}

function getStepByKey(stepKey) {
  return steps.find((step) => step.key === stepKey);
}

function getStepForProposal(proposalId) {
  return getStepByKey(proposalId);
}

function getNextCawStep(fromIndex = completed) {
  return steps.slice(fromIndex).find((step) => step.actor === "CAW Sponsor");
}

function renderStageControls(liveLabel) {
  const step = getCurrentStep();
  const readiness = getCurrentRunnerReadiness();
  const missing = readiness.missing || [];
  const isComplete = completed >= steps.length;
  const alreadyConfirmed = Boolean(step.hash || runner.steps?.[step.key]?.txHash);
  const nextCawStep = getNextCawStep();
  const ready = runner.available && missing.length === 0 && !runner.running && !isComplete && !alreadyConfirmed;
  const modeNote =
    step.actor === "CAW Sponsor"
      ? "This action uses the CAW Sponsor wallet under the approved pact."
      : `This action records creator-side evidence. The next CAW sponsor action is ${nextCawStep?.label || "not required"}.`;

  if (isComplete) {
    return `
      <div class="stage-controls">
        <button class="primary-button" type="button" disabled>Workflow complete</button>
      </div>
    `;
  }

  return `
    <div class="stage-controls">
      <button class="primary-button" type="button" data-stage-action="execute-live" ${ready ? "" : "disabled"}>
        ${runner.running ? (step.actor === "CAW Sponsor" ? "Waiting for CAW approval..." : "Submitting transaction...") : alreadyConfirmed ? "On-chain confirmed" : liveLabel}
      </button>
      <button class="ghost-button" type="button" data-stage-action="simulate-next" ${runner.running ? "disabled" : ""}>Next step</button>
      <button class="mini-button" type="button" data-stage-action="sync" ${runner.running ? "disabled" : ""}>
        ${runner.running ? "Refreshing..." : "Refresh proofs"}
      </button>
    </div>
    <p class="stage-control-note">
      Current action: <strong>${step.label}</strong>. ${modeNote} ${
        alreadyConfirmed
          ? "This step already has a transaction record. Continue to the next step instead of submitting it again."
          : missing.length > 0
          ? `Live execution is not configured yet: ${missing.join(", ")}.`
          : runner.available
            ? "Live execution is ready. CAW sponsor actions may require mobile approval."
            : "Live execution is offline. Use Next step to move through the presentation flow."
      }
    </p>
  `;
}

function renderBriefStage() {
  const taskOptions = campaign.brief.taskOptions
    .map((option) => `<option ${option === campaign.brief.taskType ? "selected" : ""}>${option}</option>`)
    .join("");
  const deliverables = campaign.brief.deliverables
    .map((item) => `<span class="deliverable-chip">${item}</span>`)
    .join("");

  return `
    <div class="stage-brief-layout">
      <form class="campaign-brief-form">
        <label>
          DAO / Project
          <input value="${campaign.brief.dao}" aria-label="DAO project" />
        </label>
        <label>
          Task type
          <select aria-label="Task type">${taskOptions}</select>
        </label>
        <label class="is-wide">
          Campaign objective
          <textarea aria-label="Campaign objective">${campaign.brief.objective}</textarea>
        </label>
        <label>
          Target audience
          <input value="${campaign.brief.audience}" aria-label="Target audience" />
        </label>
        <label>
          Deadline
          <input value="${campaign.brief.deadline}" aria-label="Deadline" />
        </label>
        <label class="is-wide">
          Style requirements
          <textarea aria-label="Style requirements">${campaign.brief.tone}</textarea>
        </label>
      </form>
      <aside class="campaign-escrow-card">
        <p class="eyebrow">Escrow setup</p>
        <h4>${formatEth(campaign.budget)} campaign budget</h4>
        <div class="mini-ledger">
          <span>Contract</span><strong>${shortAddress(campaign.jobEscrow)}</strong>
          <span>CAW wallet</span><strong>${shortAddress(campaign.sponsor)}</strong>
          <span>Platform fee</span><strong>${formatEth(campaign.platformFee)}</strong>
        </div>
        <div class="deliverable-strip">${deliverables}</div>
      </aside>
    </div>
    ${renderStageControls("Fund campaign with CAW")}
  `;
}

function renderProposalCard(proposal, index, state) {
  const step = getStepForProposal(proposal.id);
  const result = getStepResult(proposal.id);
  const isSubmitted = Boolean(result.txHash) || index < state.proposalCount;
  const isSelected = proposal.id === campaign.selectedProposalId;

  return `
    <article class="agent-proposal-card ${isSubmitted ? "is-submitted" : ""} ${isSelected ? "is-selected" : ""}">
      <header>
        <div>
          <p class="eyebrow">${isSubmitted ? "On-chain proposal" : "Draft ready"}</p>
          <h4>${proposal.agent}</h4>
        </div>
        <strong class="score-pill">${proposal.score}</strong>
      </header>
      <h5>${proposal.title}</h5>
      <p>${proposal.preview}</p>
      <div class="proposal-evidence-grid">
        <span>Ask</span><strong>${formatEth(proposal.payout)}</strong>
        <span>Draft link</span><strong>${proposal.proof}</strong>
        <span>URI</span><strong>${proposal.uri}</strong>
        <span>Tx proof</span><strong>${result.txHash ? shortHash(result.txHash) : step.tx}</strong>
      </div>
      <div class="proposal-strengths">
        ${proposal.strengths.map((item) => `<span>${item}</span>`).join("")}
      </div>
      <button class="mini-button" type="button" data-stage-action="download-proposal" data-proposal-id="${proposal.id}">
        Download draft
      </button>
    </article>
  `;
}

function renderCompetitionStage(state) {
  const submitted = Math.min(state.proposalCount, campaign.proposals.length);
  const proposalSteps = ["proposal-a", "proposal-b"].map((key) => getStepByKey(key));
  const missing = proposalSteps.flatMap((step) => runner.stepReadiness?.[step.key]?.missing || []);
  const uniqueMissing = [...new Set(missing)];
  const confirmedCount = proposalSteps.filter((step) => getStepResult(step.key).txHash).length;
  const ready = runner.available && uniqueMissing.length === 0 && !runner.running && confirmedCount < proposalSteps.length;

  return `
    <div class="stage-callout">
      <strong>${submitted}/2 agent proposals submitted</strong>
      <span>Drafts are prepared for this campaign; proposal records can still be written on-chain before review.</span>
    </div>
    <div class="agent-competition-grid">
      ${campaign.proposals.map((proposal, index) => renderProposalCard(proposal, index, state)).join("")}
    </div>
    <div class="stage-controls">
      <button class="primary-button" type="button" data-stage-action="execute-proposals" ${ready ? "" : "disabled"}>
        ${runner.running ? "Submitting proposals..." : confirmedCount > 0 ? "Submit remaining proposals" : "Submit both agent proposals"}
      </button>
      <button class="ghost-button" type="button" data-stage-action="simulate-proposals" ${runner.running ? "disabled" : ""}>Next step</button>
      <button class="mini-button" type="button" data-stage-action="sync" ${runner.running ? "disabled" : ""}>
        ${runner.running ? "Refreshing..." : "Refresh proofs"}
      </button>
    </div>
    <p class="stage-control-note">
      One click records Creator Agent A and B proposals sequentially. These proposal records are signed by the creator wallets.
      ${
        uniqueMissing.length > 0
          ? `Live proposal submission is not configured yet: ${uniqueMissing.join(", ")}.`
          : runner.available
            ? "Live proposal submission is ready."
            : "Live execution is offline. Use Next step to move through the presentation flow."
      }
    </p>
  `;
}

function renderReviewStage() {
  const selected = getSelectedProposal();
  const reviewCards = campaign.proposals
    .map(
      (proposal) => `
        <article class="review-card ${proposal.id === selected.id ? "is-winner" : ""}">
          <header>
            <label>
              <input type="radio" name="winner" ${proposal.id === selected.id ? "checked" : ""} />
              <span>${proposal.agent}</span>
            </label>
            <strong>${proposal.score}<small>/100</small></strong>
          </header>
          <h5>${proposal.title}</h5>
          <p>${proposal.preview}</p>
          <div class="review-meta">
            <div><span>Payout ask</span><strong>${formatEth(proposal.payout)}</strong></div>
            <div><span>Draft proof</span><strong>${proposal.proof}</strong></div>
            <div><span>Review note</span><strong>${proposal.risk}</strong></div>
          </div>
          <div class="proposal-strengths">
            ${proposal.strengths.map((item) => `<span>${item}</span>`).join("")}
          </div>
        </article>
      `
    )
    .join("");

  return `
    <div class="review-layout">
      <div class="review-intro-card">
        <p class="eyebrow">Human review checkpoint</p>
        <h4>Review submitted drafts, then let the Sponsor Agent record the winner.</h4>
        <p class="review-note">Default winner is ${selected.agent}: better DeFi accuracy, stronger visual structure, and lower payout ask.</p>
      </div>
      <aside class="review-decision-card">
        <p class="eyebrow">Selected creator</p>
        <h4>${selected.agent}</h4>
        <div class="mini-ledger">
          <span>Score</span><strong>${selected.score}/100</strong>
          <span>Payout</span><strong>${formatEth(selected.payout)}</strong>
          <span>On-chain action</span><strong>assignCreatorFromProposal</strong>
        </div>
      </aside>
    </div>
    <div class="review-board">
      <div class="review-scoreboard">${reviewCards}</div>
    </div>
    ${renderStageControls("Confirm Creator Agent B with CAW")}
  `;
}

function renderProcurementStage(state) {
  const step = getStepByKey("procure");
  const result = getStepResult(step.key);

  return `
    <div class="procurement-stage-layout">
      <article class="supplier-invoice-card">
        <p class="eyebrow">Resource request</p>
        <h4>Chart Pack Supplier</h4>
        <p>Creator B needs a reusable vault-flow chart pack and data-source notes before final delivery.</p>
        <div class="mini-ledger">
          <span>Spend</span><strong>${formatEth(campaign.supplierSpend)}</strong>
          <span>Receipt</span><strong>${campaign.supplierReceipt}</strong>
          <span>Status</span><strong>${state.hasProcurement ? "Paid" : "Awaiting CAW payment"}</strong>
        </div>
      </article>
      <article class="policy-card">
        <p class="eyebrow">CAW policy checks</p>
        <h4>Agent can spend, but only inside the pact.</h4>
        <ul>
          <li>Target contract: JobEscrow only</li>
          <li>Supplier spend cannot consume reserved creator payout</li>
          <li>Transaction hash is captured for Sepolia Scan review</li>
        </ul>
        <code>${result.txHash || step.tx}</code>
      </article>
    </div>
    ${renderStageControls("Pay supplier with CAW")}
  `;
}

function renderDeliveryStage(state) {
  const selected = getSelectedProposal();
  const files = ["final-script.md", "shot-list.md", "thumbnail-copy.txt", "source-notes.md"];

  return `
    <div class="delivery-stage-layout">
      <article class="delivery-package-card">
        <p class="eyebrow">Creator delivery</p>
        <h4>${selected.agent} final package</h4>
        <p>${campaign.deliveryPackage.split("\n\n")[2]}</p>
        <div class="download-list">
          ${files.map((file) => `<button class="mini-button" type="button" data-stage-action="download-delivery">${file}</button>`).join("")}
        </div>
      </article>
      <article class="delivery-proof-card">
        <p class="eyebrow">Verifiable handoff</p>
        <div class="mini-ledger">
          <span>Delivery URI</span><strong>${state.hasDelivery ? campaign.deliveryUri : "Ready to submit"}</strong>
          <span>Delivery hash</span><strong>${state.hasDelivery ? campaign.deliveryHash : "Pending contract write"}</strong>
          <span>Creator</span><strong>${shortAddress(campaign.creatorB)}</strong>
        </div>
      </article>
    </div>
    ${renderStageControls("Submit delivery hash")}
  `;
}

function renderSettlementStage(state) {
  const selected = getSelectedProposal();
  const refund = campaign.budget - campaign.supplierSpend - selected.payout - campaign.platformFee;

  return `
    <div class="settlement-stage-layout">
      <article class="settlement-check-card">
        <p class="eyebrow">Acceptance checklist</p>
        <h4>${state.isSettled ? "Settlement complete" : "Ready to accept and pay"}</h4>
        <div class="check-row is-done">Campaign funded</div>
        <div class="check-row is-done">Winner selected</div>
        <div class="check-row is-done">Supplier receipt recorded</div>
        <div class="check-row ${state.hasDelivery ? "is-done" : ""}">Delivery hash submitted</div>
      </article>
      <article class="settlement-split-card">
        <p class="eyebrow">Payout split</p>
        <div class="mini-ledger">
          <span>Creator B</span><strong>${formatEth(selected.payout)}</strong>
          <span>Platform</span><strong>${formatEth(campaign.platformFee)}</strong>
          <span>Sponsor refund</span><strong>${formatEth(refund)}</strong>
        </div>
      </article>
    </div>
    ${renderStageControls(state.isSettled ? "Settlement complete" : "Accept delivery and settle with CAW")}
  `;
}

function renderStageWorkspace(stage, state) {
  if (stage.key === "brief") {
    return renderBriefStage(state);
  }
  if (stage.key === "competition") {
    return renderCompetitionStage(state);
  }
  if (stage.key === "review") {
    return renderReviewStage(state);
  }
  if (stage.key === "procurement") {
    return renderProcurementStage(state);
  }
  if (stage.key === "delivery") {
    return renderDeliveryStage(state);
  }
  return renderSettlementStage(state);
}

function getStageCopy(stage, state) {
  const copies = {
    brief: [
      "Fund campaign",
      "Define the DAO content brief and let the CAW Sponsor Agent escrow the campaign budget into JobEscrow."
    ],
    competition: [
      "Agent competition",
      "Two Creator / Analyst Agents generate candidate drafts, payout asks, and proof links. Proposal records can be written on-chain before review."
    ],
    review: [
      "Select winner",
      "The DAO reviews draft quality, payout asks, and risk notes, then the CAW Sponsor Agent records the selected creator on-chain."
    ],
    procurement: [
      "Buy resource",
      "The Sponsor Agent purchases a chart pack or research resource for the selected creator. This is the clearest CAW-controlled real fund execution step."
    ],
    delivery: [
      "Submit delivery",
      "The selected creator delivers the final content package. Users can download the assets while the delivery URI and hash are recorded on-chain."
    ],
    settlement: [
      state.isSettled ? "Settlement complete" : "Settle payout",
      "After accepting the delivery, the CAW Sponsor Agent releases the creator payout, platform fee, and remaining sponsor refund."
    ]
  };

  return copies[stage.key];
}

function renderStepFocus() {
  const state = getState();
  const stage = getCurrentProductStage();
  const stageNumber = getCurrentProductStageIndex() + 1;
  const [title, body] = getStageCopy(stage, state);

  el.stepFocusEyebrow.textContent = `Stage ${String(stageNumber).padStart(2, "0")} of ${productStages.length}`;
  el.stepFocusTitle.textContent = title;
  el.stepFocusBody.textContent = body;
  el.stepFocusGrid.innerHTML = renderStageWorkspace(stage, state);
}

function getRoleCopy(role, state) {
  const selected = state.selected;
  const creatorStage = state.isSettled
    ? "Payment received"
    : state.hasDelivery
      ? "Delivery submitted"
      : state.hasAssignment
        ? "Producing selected package"
        : state.proposalCount >= 2
          ? "Waiting for selection"
          : "Preparing proposal";
  const daoStage = state.isSettled
    ? "Campaign settled"
    : state.hasDelivery
      ? "Review delivery"
      : state.hasProcurement
        ? "Monitor execution"
        : state.hasAssignment
          ? "Creator assigned"
          : state.hasJob
            ? "Proposal intake"
            : "Approve funded job";
  const supplierStage = state.hasProcurement ? "Receipt paid" : "Waiting for purchase order";

  const roleCopies = {
    dao: {
      badge: "DAO / Project Console",
      title: "The project gives an agent a bounded campaign budget.",
      body:
        "This is the buyer-side interface. The DAO operator sees whether the CAW Sponsor Agent is allowed to fund, assign, procure, and settle only inside this campaign scope.",
      actions: [
        ["Current stage", daoStage],
        ["Next money action", getCurrentStep().actor === "CAW Sponsor" ? getCurrentStep().label : "Wait for agent evidence"],
        ["Budget guardrail", `${formatEth(campaign.budget)} escrow cap`]
      ],
      evidenceTitle: "DAO checks before approval",
      evidence: [
        ["Pact status", completed > 0 ? "Active" : "Ready"],
        ["Escrow balance", formatEth(state.escrow)],
        ["Reserved payout", formatEth(selected.payout)]
      ]
    },
    creator: {
      badge: "Creator / Analyst Agent",
      title: "Agents compete, then one creator turns the brief into verifiable work.",
      body:
        "This view is for the supply side. Creator and analyst agents care about the brief, proposal URI, requested payout, assignment result, and delivery hash.",
      actions: [
        ["Current stage", creatorStage],
        ["Selected proposal", state.hasAssignment ? selected.agent : "Not selected yet"],
        [
          state.hasAssignment ? "Winner payout" : "Bid range",
          state.hasAssignment
            ? formatEth(selected.payout)
            : `${formatEth(campaign.proposals[0].payout)} / ${formatEth(campaign.proposals[1].payout)}`
        ]
      ],
      evidenceTitle: "Creator evidence",
      evidence: [
        ["Proposal count", `${state.proposalCount} / ${campaign.proposals.length}`],
        ["Delivery URI", state.hasDelivery ? campaign.deliveryUri : "Pending"],
        ["Delivery hash", state.hasDelivery ? campaign.deliveryHash : "Pending"]
      ]
    },
    supplier: {
      badge: "Supplier Portal",
      title: "Resource vendors get paid only when the agent is allowed to procure.",
      body:
        "Supplier is intentionally narrow: it does not see the whole treasury. It only sees the purchase request, receipt URI, payment status, and amount released from the job budget.",
      actions: [
        ["Current stage", supplierStage],
        ["Purchase amount", formatEth(campaign.supplierSpend)],
        ["Receipt URI", state.hasProcurement ? campaign.supplierReceipt : "Not issued"]
      ],
      evidenceTitle: "Supplier receipt",
      evidence: [
        ["Payer", "CAW Sponsor Agent"],
        ["Supplier address", shortAddress(campaign.supplier)],
        ["Payment status", state.hasProcurement ? "Paid" : "Pending"]
      ]
    },
    audit: {
      badge: "Judge / Audit View",
      title: "Every agent decision is tied to a fund movement or a verifiable artifact.",
      body:
        "This is the cleanest view for judges. It compresses the whole demo into a trace: funded job, proposals, assignment, supplier spend, delivery hash, and settlement split.",
      actions: [
        ["Current state", state.status],
        ["Executed records", `${completed} / ${steps.length}`],
        ["Next transaction", getCurrentStep().tx]
      ],
      evidenceTitle: "Evidence chain",
      evidence: [
        ["Proposal URI", state.proposalCount >= 2 ? selected.uri : state.proposalCount > 0 ? campaign.proposals[0].uri : "Pending"],
        ["Supplier receipt", state.hasProcurement ? campaign.supplierReceipt : "Pending"],
        ["Final split", state.isSettled ? "Creator + platform + refund" : "Pending"]
      ]
    }
  };

  return roleCopies[role] || roleCopies.dao;
}

function renderRoleView(state) {
  const copy = getRoleCopy(activeRole, state);

  el.roleButtons.forEach((button) => {
    const isActive = button.dataset.roleView === activeRole;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  el.roleViewPanel.innerHTML = `
    <div class="role-main">
      <span class="role-badge">${copy.badge}</span>
      <h3>${copy.title}</h3>
      <p>${copy.body}</p>
      <div class="role-action-strip">
        ${copy.actions
          .map(
            ([label, value]) => `
              <div class="role-action">
                <small>${label}</small>
                <strong>${value}</strong>
              </div>
            `
          )
          .join("")}
      </div>
    </div>
    <aside class="role-side">
      <h4>${copy.evidenceTitle}</h4>
      <div class="role-evidence-list">
        ${copy.evidence
          .map(
            ([label, value]) => `
              <div class="role-evidence">
                <span>${label}</span>
                <strong>${value}</strong>
              </div>
            `
          )
          .join("")}
      </div>
    </aside>
  `;

  el.roleViewPanel.classList.remove("is-refreshing");
  void el.roleViewPanel.offsetWidth;
  el.roleViewPanel.classList.add("is-refreshing");
}

function renderPresenter(state) {
  const currentStep = getCurrentStep();
  const nextMoneyAction = currentStep.actor === "CAW Sponsor" ? currentStep.label : "Waiting for non-sponsor evidence";
  const proofSummary = getLatestProofSummary();

  el.presenterHeadline.textContent = state.isSettled
    ? "The agent completed the economic loop: escrow, procurement, delivery, settlement."
    : "CAW turns this agent from recommender into bounded spender.";
  el.presenterSubcopy.textContent = state.isSettled
    ? "The judge can inspect a complete money trail and compare it with the delivery hash."
    : "The judge should see one live loop: task trigger, CAW permission boundary, money action, and proof.";

  const proofItems = [
    ["Current money action", nextMoneyAction, "is-caw"],
    ["CAW boundary", "JobEscrow-only pact, SETH budget cap", "is-caw"],
    ["Transaction proof", proofSummary, ""],
    ["Pain solved", "No hot key, no broad treasury access", ""]
  ];

  el.presenterProofGrid.innerHTML = proofItems
    .map(
      ([label, value, className]) => `
        <div class="presenter-proof ${className}">
          <small>${label}</small>
          <strong>${value}</strong>
        </div>
      `
    )
    .join("");
}

function renderReceipts() {
  const receipts = getReceipts();
  const confirmedCount = receipts.filter((receipt) => receipt.hash).length;
  const latest = getLatestConfirmedReceipt(receipts);
  const currentStep = getCurrentStep();

  el.receiptSummary.textContent = `${confirmedCount} confirmed`;
  el.latestProofPanel.innerHTML = latest
    ? `
        <p class="eyebrow">Confirmed transaction</p>
        <h4>${latest.label}</h4>
        <code>${latest.hash}</code>
        <a class="receipt-link primary-proof-link" href="${explorerLink(latest.hash)}" target="_blank" rel="noreferrer">
          View on Sepolia Scan
        </a>
      `
    : `
        <p class="eyebrow">Waiting for proof</p>
        <h4>${currentStep.label}</h4>
        <code>No transaction hash yet</code>
        <small>Use the current live action to create the first on-chain proof.</small>
      `;

  el.receiptList.innerHTML = receipts
    .map((receipt, index) => {
      const status = getReceiptStatus(receipt, index - cawProofReceipts.length);
      const explorer = receipt.hash ? `https://sepolia.etherscan.io/tx/${receipt.hash}` : "";
      const statusLabel =
        status === "confirmed"
          ? "confirmed"
            : status === "awaiting"
              ? "awaiting hash"
            : status === "simulated"
              ? "advanced"
              : "pending";

      return `
        <article class="receipt-card">
          <header>
            <strong>${receipt.label}</strong>
            <span class="receipt-status is-${status === "pending" ? "awaiting" : status}">${statusLabel}</span>
          </header>
          <code>${shortHash(receipt.hash)}</code>
          <div class="receipt-meta">
            <span>${receipt.chain}</span>
            <span>${receipt.action}</span>
            <span>${receipt.requestId}</span>
          </div>
          ${
            receipt.hash
              ? `<a class="receipt-link" href="${explorer}" target="_blank" rel="noreferrer">View on Sepolia Scan</a>`
              : `<small>${receipt.note}</small>`
          }
        </article>
      `;
    })
    .join("");
}

function getCurrentRunnerReadiness() {
  const step = getCurrentStep();
  return runner.stepReadiness?.[step.key] || { missing: [] };
}

function renderChainSteps() {
  if (!el.chainStepList) {
    return;
  }

  const confirmedCount = steps.filter((step) => isSuccessfulTxResult(getStepResult(step.key))).length;
  el.chainStepSummary.textContent = `${confirmedCount} tx confirmed`;
  el.chainStepList.innerHTML = executionGroups
    .map((group, index) => {
      const results = group.keys.map((key) => ({ key, ...getStepResult(key) }));
      const doneCount = results.filter(isSuccessfulTxResult).length;
      const isDone = doneCount === group.keys.length;
      const isCurrent = group.keys.includes(getCurrentStep().key) && !isDone;
      const proofText =
        doneCount > 0
          ? `${doneCount}/${group.keys.length} tx confirmed`
          : group.keys.map((key) => getStepByKey(key)?.tx).join(" + ");
      const txLinks = results
        .filter(isSuccessfulTxResult)
        .map((result) => {
          const label = result.key.includes("proposal") ? (result.key.endsWith("a") ? "A Scan" : "B Scan") : "Scan";
          return `<a href="${explorerLink(result.txHash)}" target="_blank" rel="noreferrer">${label}</a>`;
        })
        .join("");
      const fallbackLink =
        group.actor === "CAW" && !txLinks
          ? `<a href="${contractExplorerLink(campaign.jobEscrow)}" target="_blank" rel="noreferrer">Contract</a>`
          : "";

      return `
        <article class="chain-step ${isDone ? "is-done" : ""} ${isCurrent ? "is-current" : ""}">
          <span>${index + 1}</span>
          <div>
            <strong>${group.label}</strong>
            <small>${group.actor} · ${proofText}</small>
          </div>
          ${txLinks || fallbackLink || `<em>${isCurrent ? "Now" : "Waiting"}</em>`}
        </article>
      `;
    })
    .join("");
}

function renderRoles() {
  const roles = [
    ["Sponsor CAW", campaign.sponsor],
    ["Creator Agent A", campaign.creatorA],
    ["Creator Agent B", campaign.creatorB],
    ["Supplier", campaign.supplier],
    ["Platform", campaign.platform]
  ];

  el.roleList.innerHTML = roles
    .map(
      ([label, address]) => `
        <div class="role-row">
          <strong>${label}</strong>
          <code>${shortAddress(address)}</code>
        </div>
      `
    )
    .join("");
}

function renderTimeline() {
  const currentStageIndex = getCurrentProductStageIndex();

  el.timeline.innerHTML = productStages
    .map((stage, index) => {
      const statusClass = completed >= stage.completeAt ? "is-done" : index === currentStageIndex ? "is-current" : "";
      return `
        <article class="step ${statusClass}">
          <span class="step-index">${index + 1}</span>
          <strong>${stage.label}</strong>
          <small>${stage.actor}</small>
        </article>
      `;
    })
    .join("");
}

function renderProposals(state) {
  el.proposalCounter.textContent = `${state.proposalCount} proposals`;
  el.proposalGrid.innerHTML = campaign.proposals
    .map((proposal, index) => {
      const available = index < state.proposalCount;
      const selected = state.hasAssignment && proposal.id === campaign.selectedProposalId;
      const className = selected ? "is-selected" : available ? "is-available" : "";
      return `
        <article class="proposal-card ${className}">
          <div class="proposal-top">
            <div>
              <h4>${proposal.agent}</h4>
              <p>${proposal.tone}</p>
            </div>
            <span class="proposal-price">${formatEth(proposal.payout)}</span>
          </div>
          <div class="receipt-line">
            <span>Proposal URI</span>
            <strong>${available ? proposal.uri : "Pending"}</strong>
          </div>
          <div class="receipt-line">
            <span>Hash</span>
            <strong>${available ? proposal.hash : "Pending"}</strong>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderProcurement(state) {
  el.supplierState.textContent = state.hasProcurement ? "Paid" : "Waiting";
  el.procurementRail.className = `procurement-rail ${state.hasProcurement ? "is-paid" : "is-waiting"}`;
  el.procurementRail.innerHTML = state.hasProcurement
    ? `<strong>Resource purchased</strong><p class="eyebrow">${campaign.supplierReceipt}</p>`
    : `<strong>Reserved budget protected</strong><p class="eyebrow">Supplier payment waits for selected creator</p>`;
}

function renderDelivery(state) {
  const assets = ["60-second script", "visual shot list", "thumbnail copy", "source notes"];
  el.deliveryState.textContent = state.hasDelivery ? "Submitted" : "Not submitted";
  el.deliveryUri.textContent = state.hasDelivery ? campaign.deliveryUri : "Pending";
  el.deliveryHash.textContent = state.hasDelivery ? campaign.deliveryHash : "Pending";
  el.assetStack.innerHTML = assets
    .map(
      (asset) => `
        <div class="asset-row ${state.hasDelivery ? "is-ready" : ""}">
          <strong>${asset}</strong>
          <small>${state.hasDelivery ? "Ready" : "Queued"}</small>
        </div>
      `
    )
    .join("");
}

function renderSplit(state) {
  const selected = state.selected;
  const rows = [
    ["Creator", selected.payout, "bar-creator", state.isSettled],
    ["Supplier", campaign.supplierSpend, "bar-supplier", state.hasProcurement],
    ["Platform", campaign.platformFee, "bar-platform", state.isSettled],
    ["Sponsor refund", campaign.budget - campaign.supplierSpend - selected.payout - campaign.platformFee, "bar-refund", state.isSettled]
  ];

  el.splitList.innerHTML = rows
    .map(([label, amount, barClass, active]) => {
      const percent = Math.max(4, Math.round((amount / campaign.budget) * 100));
      return `
        <div class="split-row">
          <header>
            <strong>${label}</strong>
            <small>${active ? formatEth(amount) : "Pending"}</small>
          </header>
          <div class="split-bar"><span class="${barClass}" style="width: ${active ? percent : 0}%"></span></div>
        </div>
      `;
    })
    .join("");
}

function renderEvents() {
  const done = steps.slice(0, completed);
  if (done.length === 0) {
    el.eventList.innerHTML = `<div class="event-row is-empty">No transaction records yet.</div>`;
    return;
  }

  el.eventList.innerHTML = done
    .map(
      (step) => `
        <div class="event-row">
          <header>
            <strong>${step.label}</strong>
            <small>${step.actor}</small>
          </header>
          <code>${
            step.hash
              ? `${shortHash(step.hash)} | confirmed`
              : step.runStatus
                ? `${step.tx} | ${step.runStatus}`
                : `${step.tx} | guided record`
          }</code>
        </div>
      `
    )
    .join("");
}

function renderCommand() {
  const step = steps[Math.min(completed, steps.length - 1)];
  const liveEnv = runner.available ? runner.env || {} : {};
  const envValue = (key, fallback) => (runner.available ? liveEnv[key] || `<missing ${key}>` : fallback);

  el.commandBlock.textContent = [
    `JOB_ESCROW=${envValue("JOB_ESCROW", campaign.jobEscrow)}`,
    `SRC=${envValue("SRC", campaign.sponsor)}`,
    `PLATFORM=${envValue("PLATFORM", campaign.platform)}`,
    `CREATOR=${envValue("CREATOR", campaign.creatorB)}`,
    `SUPPLIER=${envValue("SUPPLIER", campaign.supplier)}`,
    `PACT_ID=${envValue("PACT_ID", campaign.pactId)}`,
    step.command
  ].join("\n");
}

function renderMetrics(state) {
  el.campaignTitle.textContent = campaign.title;
  el.budgetMetric.textContent = formatEth(campaign.budget);
  el.jobStatus.textContent = state.status;
  el.escrowBalance.textContent = formatEth(state.escrow);
  el.creatorPayout.textContent = formatEth(state.creatorPayout);
  el.resourceSpend.textContent = formatEth(state.resourceSpend);
  el.pactState.textContent = completed > 0 ? "Active" : "Ready";
  el.advanceButton.disabled = runner.running || completed >= steps.length;
  el.advanceButton.textContent = runner.running
    ? "Waiting for live execution"
    : completed >= steps.length
      ? "Workflow complete"
      : "Next step";
  el.resetButton.disabled = runner.running;
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function downloadProposal(proposalId) {
  const proposal = campaign.proposals.find((item) => item.id === proposalId);
  if (!proposal) {
    return;
  }

  downloadTextFile(`${proposal.id}-draft.md`, proposal.content);
}

function downloadDeliveryPackage() {
  downloadTextFile("creator-agent-b-final-delivery.md", campaign.deliveryPackage);
}

function render() {
  const state = getState();
  renderChainSteps();
  renderStepFocus();
  renderRoles();
  renderRoleView(state);
  renderPresenter(state);
  renderReceipts();
  renderTimeline();
  renderProposals(state);
  renderProcurement(state);
  renderDelivery(state);
  renderSplit(state);
  renderEvents();
  renderCommand();
  renderMetrics(state);
}

async function fetchRunnerConfig() {
  try {
    const response = await fetch("/api/runner/config", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Runner returned ${response.status}`);
    }

    const config = await response.json();
    applyRunnerConfig(config);
    render();
    return config;
  } catch (error) {
    runner = {
      ...runner,
      available: false,
      message: `Runner offline. Start it with: node apps/agent-runner/server.js`
    };
    render();
    return null;
  }
}

async function postRunner(path, body) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  const payload = await response.json();
  if (!response.ok || payload.ok === false) {
    throw new Error(payload.message || `Runner request failed: ${response.status}`);
  }
  return payload;
}

function applyStepResult(step, result) {
  if (result.txHash) {
    setStepHash(step.key, result.txHash, result.status, result.message);
    completed = Math.max(completed, steps.findIndex((item) => item.key === step.key) + 1);
    return true;
  }

  setStepHash(step.key, "", result.status || "Submitted", result.message);
  return false;
}

async function waitForStepConfirmation(step) {
  for (let attempt = 1; attempt <= AUTO_SYNC_ATTEMPTS; attempt += 1) {
    runner.message = `Waiting for ${step.label} approval/confirmation... auto-sync ${attempt}/${AUTO_SYNC_ATTEMPTS}`;
    render();
    await delay(AUTO_SYNC_INTERVAL_MS);

    const payload = await postRunner("/api/runner/refresh", { stepKey: step.key });
    applyRunnerConfig(payload.config);
    const result = payload.result || {};

    if (result.txHash) {
      applyStepResult(step, result);
      runner.message = `${step.label} confirmed: ${shortHash(result.txHash)}`;
      return true;
    }

    if (/failed|rejected/i.test(String(result.status || ""))) {
      runner.message = result.message || `${step.label} was rejected or failed.`;
      return false;
    }
  }

  runner.message = `${step.label} is still waiting for CAW approval or broadcast. You can approve in CAW DEV, then click Sync all proofs.`;
  return false;
}

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function executeLiveStep() {
  const step = getCurrentStep();
  if (runner.running) {
    return;
  }

  runner = {
    ...runner,
    running: true,
    message: `Executing ${step.label}. CAW sponsor steps may require approval in the CAW DEV app.`
  };
  render();

  try {
    const payload = await postRunner("/api/runner/run", { stepKey: step.key });
    applyRunnerConfig(payload.config);
    const result = payload.result || {};
    if (applyStepResult(step, result)) {
      runner.message = `${step.label} confirmed: ${shortHash(result.txHash)}`;
    } else if (step.actor === "CAW Sponsor") {
      runner.message = result.message || `${step.label} submitted. Waiting for CAW approval...`;
      await waitForStepConfirmation(step);
    } else {
      runner.message = result.message || `${step.label} submitted. Sync again after approval.`;
    }
  } catch (error) {
    runner.message = error.message;
  } finally {
    runner.running = false;
    render();
  }
}

async function executeProposalBatch() {
  if (runner.running) {
    return;
  }

  const proposalStepKeys = ["proposal-a", "proposal-b"];
  runner = {
    ...runner,
    running: true,
    message: "Submitting both creator proposals sequentially via cast wallets..."
  };
  render();

  try {
    for (const stepKey of proposalStepKeys) {
      const step = getStepByKey(stepKey);
      if (!step || getStepResult(stepKey).txHash) {
        completed = Math.max(completed, steps.findIndex((item) => item.key === stepKey) + 1);
        continue;
      }

      runner.message = `Executing ${step.label}. This is a creator-wallet transaction, not a CAW sponsor call.`;
      render();
      const payload = await postRunner("/api/runner/run", { stepKey });
      applyRunnerConfig(payload.config);
      const result = payload.result || {};

      if (!applyStepResult(step, result)) {
        runner.message = result.message || `${step.label} submitted. Sync again after broadcast.`;
        break;
      }
    }

    runner.message = "Agent proposal batch finished. Review both candidates, then confirm the winner with CAW.";
  } catch (error) {
    runner.message = error.message;
  } finally {
    runner.running = false;
    render();
  }
}

async function refreshAllProofs() {
  if (runner.running) {
    return;
  }

  const cawSteps = steps.filter((step) => step.actor === "CAW Sponsor");
  let newProofCount = 0;
  runner = { ...runner, running: true, message: "Syncing all CAW sponsor proofs..." };
  render();

  try {
    for (let index = 0; index < cawSteps.length; index += 1) {
      const step = cawSteps[index];
      runner.message = `Syncing CAW proof ${index + 1}/${cawSteps.length}: ${step.label}...`;
      render();

      const beforeHash = getStepResult(step.key).txHash;
      const payload = await postRunner("/api/runner/refresh", { stepKey: step.key });
      applyRunnerConfig(payload.config);
      const result = payload.result || {};

      if (result.txHash) {
        applyStepResult(step, result);
        if (!beforeHash) {
          newProofCount += 1;
        }
      }
    }

    runner.message =
      newProofCount > 0
        ? `Synced ${newProofCount} new CAW proof${newProofCount > 1 ? "s" : ""}.`
        : "No new CAW proofs found yet. If approval is pending, approve in CAW DEV and sync again.";
  } catch (error) {
    runner.message = error.message;
  } finally {
    runner.running = false;
    render();
  }
}

function showCarouselSlide(index) {
  if (carousel.slides.length === 0) {
    return;
  }

  carousel.index = (index + carousel.slides.length) % carousel.slides.length;
  carousel.slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === carousel.index);
  });
  carousel.dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === carousel.index);
  });
}

function startCarousel() {
  if (prefersReducedMotion.matches || carousel.slides.length <= 1) {
    return;
  }

  window.clearInterval(carousel.timer);
  carousel.timer = window.setInterval(() => {
    showCarouselSlide(carousel.index + 1);
  }, 4200);
}

function resetCarouselTimer() {
  window.clearInterval(carousel.timer);
  startCarousel();
}

function createGlShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) || "Unknown shader compile error";
    gl.deleteShader(shader);
    throw new Error(message);
  }

  return shader;
}

function initializeFluidShader() {
  const canvases = el.fluidCanvases || [];
  if (canvases.length === 0) {
    return;
  }

  canvases.forEach((canvas) => initializeFluidShaderCanvas(canvas));
}

function initializeFluidShaderCanvas(canvas) {
  if (!canvas) {
    return;
  }

  const scene = canvas.closest(".hero-section, .workbench-view");
  if (initializedFluidCanvases.has(canvas) || scene?.hidden) {
    return;
  }

  const shaderMode = canvas.dataset.shaderMode === "workbench" ? 1 : 0;
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    powerPreference: "high-performance"
  });

  if (!gl) {
    scene?.classList.add("is-shader-fallback");
    return;
  }

  const vertexSource = `
    attribute vec2 a_position;

    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const fragmentSource = `
    precision highp float;

    uniform vec2 u_resolution;
    uniform float u_time;
    uniform float u_mode;

    float ridge(float value, float width, float softness) {
      return 1.0 - smoothstep(width, width + softness, abs(value));
    }

    float curve(vec2 p, float offset, float phase, float ampA, float ampB) {
      float y =
        offset +
        sin(p.x * 1.34 + phase) * ampA +
        sin(p.x * 2.36 - phase * 0.72) * ampB +
        sin(p.x * 0.62 + phase * 1.35) * 0.10;
      return p.y - y;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      vec2 p = uv * 2.0 - 1.0;
      p.x *= u_resolution.x / u_resolution.y;

      float t = u_time * mix(0.34, 0.68, u_mode);
      vec2 q = p;
      q.x += sin(p.y * 1.15 + t * 0.8) * 0.08;
      q.y += sin(p.x * 0.9 - t * 0.7) * 0.05;
      q.x += u_mode * sin(p.y * 2.4 - u_time * 0.55) * 0.14;
      q.y += u_mode * sin(p.x * 1.7 + u_time * 0.42) * 0.08;

      vec3 cream = vec3(0.965, 0.925, 0.78);
      vec3 ivory = vec3(1.0, 0.982, 0.91);
      vec3 green = vec3(0.62, 0.92, 0.24);
      vec3 lime = vec3(0.78, 1.0, 0.39);
      vec3 moss = vec3(0.29, 0.45, 0.16);
      vec3 black = vec3(0.025, 0.033, 0.033);
      vec3 graphite = vec3(0.13, 0.16, 0.16);
      black = mix(black, vec3(0.13, 0.16, 0.14), u_mode * 0.68);
      graphite = mix(graphite, vec3(0.25, 0.30, 0.25), u_mode * 0.55);
      green = mix(green, vec3(0.72, 0.94, 0.34), u_mode * 0.35);

      vec3 color = mix(cream, ivory, smoothstep(-1.0, 1.0, p.y) * 0.36);

      float topGreen = ridge(curve(q, 0.76, t * 0.9 + 0.4, 0.22, 0.075), 0.22, 0.20);
      float midGreen = ridge(curve(q, 0.18, -t * 0.74 + 1.2, 0.18, 0.10), 0.18, 0.18);
      float blackWave = ridge(curve(q, -0.34, t * 0.52 - 0.9, 0.23, 0.14), 0.31, 0.23);
      float lowerGreen = ridge(curve(q, -0.84, -t * 0.66 + 2.1, 0.21, 0.09), 0.24, 0.22);

      color = mix(color, mix(green, lime, smoothstep(-0.1, 0.9, q.y)), topGreen * mix(0.92, 0.82, u_mode));
      color = mix(color, vec3(0.78, 1.0, 0.42), midGreen * mix(0.72, 0.58, u_mode));
      color = mix(color, mix(graphite, black, 0.74), blackWave * mix(0.96, 0.68, u_mode));
      color = mix(color, mix(moss, green, 0.5), lowerGreen * mix(0.82, 0.64, u_mode));

      float darkCore = ridge(curve(q + vec2(0.18, 0.0), -0.22, t * 0.42 - 0.35, 0.18, 0.08), 0.2, 0.18);
      color = mix(color, black, darkCore * mix(0.52, 0.32, u_mode));

      float specA = ridge(curve(q, 0.42, t * 0.8 + 0.2, 0.2, 0.08), 0.015, 0.08);
      float specB = ridge(curve(q, -0.58, -t * 0.62 + 1.5, 0.24, 0.1), 0.018, 0.08);
      color += vec3(0.22, 0.28, 0.18) * (specA + specB) * 0.5;

      float contactShadow =
        ridge(curve(q, 0.51, t * 0.8 + 0.2, 0.2, 0.08), 0.035, 0.15) +
        ridge(curve(q, -0.04, -t * 0.74 + 1.2, 0.18, 0.1), 0.035, 0.15) +
        ridge(curve(q, -0.62, t * 0.52 - 0.9, 0.23, 0.14), 0.045, 0.16);
      color = mix(color, black, clamp(contactShadow * mix(0.12, 0.07, u_mode), 0.0, 0.22));

      vec2 glowPoint = vec2(0.55 + sin(t * 0.7) * 0.15, -0.04 + cos(t * 0.5) * 0.12);
      float glow = smoothstep(0.75, 0.0, length(q - glowPoint));
      color += vec3(0.34, 0.62, 0.18) * glow * 0.18;

      float flowLight = sin((q.x * 2.2 + q.y * 0.8 - u_time * 1.15) * 3.14159) * 0.5 + 0.5;
      float flowMask = smoothstep(0.58, 0.96, flowLight) * smoothstep(1.35, 0.15, length(p * vec2(0.7, 1.0)));
      color += vec3(0.20, 0.34, 0.08) * flowMask * u_mode * 0.18;

      float vignette = smoothstep(1.55, 0.18, length(p * vec2(0.88, 1.04)));
      color = mix(vec3(0.055, 0.06, 0.055), color, mix(vignette, max(vignette, 0.72), u_mode));
      color = mix(color, mix(cream, ivory, 0.58), u_mode * 0.12);

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  try {
    const vertexShader = createGlShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = createGlShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || "Unknown shader link error");
    }

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const modeLocation = gl.getUniformLocation(program, "u_mode");
    const positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    gl.useProgram(program);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    fluidShaderResizers.push(resize);
    const renderFrame = (now = 0) => {
      resize();
      gl.useProgram(program);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, now * 0.001);
      gl.uniform1f(modeLocation, shaderMode);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (!prefersReducedMotion.matches) {
        window.requestAnimationFrame(renderFrame);
      }
    };

    window.addEventListener("resize", resize, { passive: true });
    initializedFluidCanvases.add(canvas);
    renderFrame(0);
  } catch (error) {
    console.warn("Fluid shader disabled:", error.message);
    scene?.classList.add("is-shader-fallback");
  }
}

function initializeCarousel() {
  if (carousel.slides.length === 0) {
    return;
  }

  carousel.next?.addEventListener("click", () => {
    showCarouselSlide(carousel.index + 1);
    resetCarouselTimer();
  });

  carousel.prev?.addEventListener("click", () => {
    showCarouselSlide(carousel.index - 1);
    resetCarouselTimer();
  });

  carousel.dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      showCarouselSlide(Number(dot.dataset.carouselDot));
      resetCarouselTimer();
    });
  });

  showCarouselSlide(0);
  startCarousel();
}

function initializeRevealAnimations() {
  const revealNodes = Array.from(document.querySelectorAll(".reveal-on-scroll"));
  if (revealNodes.length === 0) {
    return;
  }

  if (!("IntersectionObserver" in window) || prefersReducedMotion.matches) {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.14 }
  );

  revealNodes.forEach((node, index) => {
    node.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
    observer.observe(node);
  });
}

function setView(view, shouldUpdateHash = true) {
  if (view === "home-details") {
    setView("home", false);
    el.homeDetails.scrollIntoView({ behavior: "smooth", block: "start" });
    if (shouldUpdateHash) {
      history.replaceState(null, "", "#overview");
    }
    return;
  }

  const isWorkbench = view === "workbench";
  el.homeView.hidden = isWorkbench;
  el.workbenchView.hidden = !isWorkbench;
  initializeFluidShader();

  document.querySelectorAll(".nav-link").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === (isWorkbench ? "workbench" : "home"));
  });

  if (shouldUpdateHash) {
    history.replaceState(null, "", isWorkbench ? "#workbench" : "#overview");
  }

  window.requestAnimationFrame(() => {
    fluidShaderResizers.forEach((resize) => resize());
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => {
    setView(button.dataset.view);
  });
});

window.addEventListener("hashchange", () => {
  setView(window.location.hash === "#workbench" ? "workbench" : "home", false);
});

el.roleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeRole = button.dataset.roleView;
    renderRoleView(getState());
  });
});

el.advanceButton.addEventListener("click", () => {
  if (runner.running) {
    return;
  }

  completed = Math.min(completed + 1, steps.length);
  render();
});

el.stepFocusPanel.addEventListener("click", (event) => {
  const actionTarget = event.target.closest("[data-stage-action]");
  if (!actionTarget) {
    return;
  }

  const action = actionTarget.dataset.stageAction;
  const passiveActions = new Set(["download-proposal", "download-delivery"]);
  if (runner.running && !passiveActions.has(action)) {
    return;
  }

  if (action === "execute-live") {
    executeLiveStep();
    return;
  }

  if (action === "execute-proposals") {
    executeProposalBatch();
    return;
  }

  if (action === "sync") {
    refreshAllProofs();
    return;
  }

  if (action === "simulate-proposals") {
    completed = Math.max(completed, 3);
    render();
    return;
  }

  if (action === "simulate-next") {
    completed = Math.min(completed + 1, steps.length);
    render();
    return;
  }

  if (action === "download-proposal") {
    downloadProposal(actionTarget.dataset.proposalId);
    return;
  }

  if (action === "download-delivery") {
    downloadDeliveryPackage();
  }
});

el.resetButton.addEventListener("click", () => {
  if (runner.running) {
    return;
  }

  completed = 0;
  render();
});

el.copyCommand.addEventListener("click", async () => {
  await copyText(el.commandBlock.textContent);
  el.copyCommand.textContent = "Copied";
  setTimeout(() => {
    el.copyCommand.textContent = "Copy";
  }, 1100);
});

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    await copyText(button.dataset.copy);
  });
});

render();
initializeFluidShader();
initializeCarousel();
initializeRevealAnimations();
setView(window.location.hash === "#workbench" ? "workbench" : "home", false);
fetchRunnerConfig();
