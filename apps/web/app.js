const campaign = {
  title: "Protocol explainer campaign",
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
      hash: "0x3b7d...a91f"
    },
    {
      id: "proposal-b",
      agent: "Creator Agent B",
      payout: 0.00065,
      uri: "ipfs://creator-agent-b-proposal",
      tone: "Technical explainer for active DeFi users.",
      hash: "0x9ba0...615e"
    }
  ],
  selectedProposalId: "proposal-b",
  supplierSpend: 0.0001,
  supplierReceipt: "ipfs://chart-pack-receipt",
  deliveryUri: "ipfs://creator-agent-b-delivery",
  deliveryHash: "0x8537...c2be",
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
  commandBlock: document.querySelector("#commandBlock"),
  copyCommand: document.querySelector("#copyCommand"),
  creatorPayout: document.querySelector("#creatorPayout"),
  deliveryHash: document.querySelector("#deliveryHash"),
  deliveryState: document.querySelector("#deliveryState"),
  deliveryUri: document.querySelector("#deliveryUri"),
  escrowBalance: document.querySelector("#escrowBalance"),
  eventList: document.querySelector("#eventList"),
  executeLiveButton: document.querySelector("#executeLiveButton"),
  homeDetails: document.querySelector("#homeDetails"),
  homeView: document.querySelector("#homeView"),
  jobStatus: document.querySelector("#jobStatus"),
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
  refreshRunnerButton: document.querySelector("#refreshRunnerButton"),
  roleButtons: Array.from(document.querySelectorAll("[data-role-view]")),
  roleViewPanel: document.querySelector("#roleViewPanel"),
  roleList: document.querySelector("#roleList"),
  runnerLog: document.querySelector("#runnerLog"),
  runnerStatusBadge: document.querySelector("#runnerStatusBadge"),
  runnerStatusText: document.querySelector("#runnerStatusText"),
  splitList: document.querySelector("#splitList"),
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
      (index < completed ? "Prototype state advanced. Replace with CAW/contract tx hash after live run." : "Waiting for this demo step.")
  }));

  return [...cawProofReceipts, ...lifecycleReceipts];
}

function getLatestProofSummary() {
  const confirmed = getReceipts().find((receipt) => receipt.hash);
  if (confirmed) {
    return shortHash(confirmed.hash);
  }

  if (completed > 0) {
    return "Lifecycle state simulated";
  }

  return "Awaiting real CAW hash";
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
        ["Next command", getCurrentStep().tx]
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
  el.receiptSummary.textContent = `${confirmedCount} confirmed`;

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
              ? "simulated"
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
              ? `<a class="receipt-link" href="${explorer}" target="_blank" rel="noreferrer">View on Sepolia explorer</a>`
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

function renderRunnerPanel() {
  if (!el.runnerStatusBadge) {
    return;
  }

  const step = getCurrentStep();
  const readiness = getCurrentRunnerReadiness();
  const missing = readiness.missing || [];
  const isComplete = completed >= steps.length;
  const ready = runner.available && missing.length === 0 && !runner.running && !isComplete;
  const badgeClass = runner.available ? (missing.length > 0 ? "is-warning" : "is-live") : "is-offline";

  el.runnerStatusBadge.className = `runner-badge ${badgeClass}`;
  el.runnerStatusBadge.textContent = runner.available
    ? missing.length > 0
      ? "Needs env"
      : "Runner live"
    : "Runner offline";

  el.runnerStatusText.textContent = runner.available
    ? missing.length > 0
      ? `Current step "${step.label}" needs: ${missing.join(", ")}.`
      : `Current live step: ${step.label} via ${readiness.type === "caw" ? "CAW pact" : "creator wallet"}.`
    : "Start the local Agent Runner to execute real CAW/cast transactions from the workbench.";

  el.runnerLog.textContent = runner.message;
  el.executeLiveButton.disabled = !ready;
  el.executeLiveButton.textContent = runner.running
    ? "Executing..."
    : isComplete
      ? "Live workflow complete"
      : `Execute live: ${step.label}`;
  el.refreshRunnerButton.disabled = runner.running;
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
  el.timeline.innerHTML = steps
    .map((step, index) => {
      const statusClass = index < completed ? "is-done" : index === completed ? "is-current" : "";
      return `
        <article class="step ${statusClass}">
          <span class="step-index">${index + 1}</span>
          <strong>${step.label}</strong>
          <small>${step.actor}</small>
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
                : `${step.tx} | simulated lifecycle record`
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
  el.advanceButton.disabled = completed >= steps.length;
  el.advanceButton.textContent = completed >= steps.length ? "Workflow complete" : "Simulate next state";
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

function render() {
  const state = getState();
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
  renderRunnerPanel();
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
    renderRunnerPanel();
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

async function executeLiveStep() {
  const step = getCurrentStep();
  runner = {
    ...runner,
    running: true,
    message: `Executing ${step.label}. CAW sponsor steps may require approval in the CAW DEV app.`
  };
  renderRunnerPanel();

  try {
    const payload = await postRunner("/api/runner/run", { stepKey: step.key });
    applyRunnerConfig(payload.config);
    const result = payload.result || {};
    if (result.txHash) {
      setStepHash(step.key, result.txHash, result.status, result.message);
      completed = Math.max(completed, steps.findIndex((item) => item.key === step.key) + 1);
      runner.message = `${step.label} confirmed: ${shortHash(result.txHash)}`;
    } else {
      setStepHash(step.key, "", result.status || "Submitted", result.message);
      runner.message = result.message || `${step.label} submitted. Sync again after approval.`;
    }
  } catch (error) {
    runner.message = error.message;
  } finally {
    runner.running = false;
    render();
  }
}

async function refreshRunnerState() {
  const step = getCurrentStep();
  runner = { ...runner, running: true, message: `Syncing ${step.label} status...` };
  renderRunnerPanel();

  try {
    const payload = await postRunner("/api/runner/refresh", { stepKey: step.key });
    applyRunnerConfig(payload.config);
    runner.message = payload.result?.message || "Runner state synced.";
  } catch (error) {
    const config = await fetchRunnerConfig();
    runner.message = config ? "Runner config synced." : error.message;
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

  document.querySelectorAll(".nav-link").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === (isWorkbench ? "workbench" : "home"));
  });

  if (shouldUpdateHash) {
    history.replaceState(null, "", isWorkbench ? "#workbench" : "#overview");
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => {
    setView(button.dataset.view);
  });
});

el.roleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeRole = button.dataset.roleView;
    renderRoleView(getState());
  });
});

el.advanceButton.addEventListener("click", () => {
  completed = Math.min(completed + 1, steps.length);
  render();
});

el.executeLiveButton.addEventListener("click", () => {
  executeLiveStep();
});

el.refreshRunnerButton.addEventListener("click", () => {
  refreshRunnerState();
});

el.resetButton.addEventListener("click", () => {
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
initializeCarousel();
initializeRevealAnimations();
setView(window.location.hash === "#workbench" ? "workbench" : "home", false);
fetchRunnerConfig();
