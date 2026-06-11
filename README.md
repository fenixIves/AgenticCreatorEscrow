# Agentic Creator Escrow

Hackathon MVP for Cobo Agentic Wallet: a DAO/project campaign workflow where an
agent-controlled wallet can fund a content/research task, pay for resources,
record delivery, and settle creator/platform payouts under pact-scoped control.

## Current Goal

Build a narrow demo for:

- Trustless Agent Work Agreements: post, fund, assign, deliver, accept/reject, pay.
- Agent Resource Procurement: the sponsor agent can pay a supplier from the task budget.
- CAW value: pact approval, controlled contract calls, wallet-level spend boundaries.

## Demo Thesis

This is not a generic DAO bounty board. It is an agent-native campaign escrow:

- A sponsor/project agent controls a CAW wallet with a limited campaign budget.
- Creator/analyst agents submit proposals for a Web3 content or research task.
- The selected agent can deliver work and optionally trigger resource procurement.
- CAW executes the money-moving steps under pact-scoped human approval.
- The contract records proposal, procurement, delivery, payout, and refund events.

## Contract MVP

`JobEscrow` supports one SETH-funded job lifecycle:

1. Sponsor creates a job with an escrowed budget.
2. Creator/analyst agents submit proposal records.
3. Sponsor selects a proposal and reserves creator/platform payouts.
4. Sponsor pays a supplier from unreserved budget.
5. Creator submits an IPFS/hash delivery record.
6. Sponsor accepts and pays creator/platform, with leftover budget refunded.
7. Sponsor can reject and refund remaining escrow.

In the CAW demo, the sponsor address is the CAW wallet. That makes `createJob`,
`assignCreatorFromProposal`, `paySupplier`, and `acceptAndPay` pact-controlled
agent actions instead of ordinary manual transfers.

## Commands

```bash
forge build
forge test -vv
```

Live Sepolia deployment uses:

```bash
forge script script/DeployJobEscrow.s.sol:DeployJobEscrowScript \
  --rpc-url "$SEPOLIA_RPC_URL" \
  --private-key "$DEPLOYER_PRIVATE_KEY" \
  --broadcast
```

## Demo Workbench

Open [apps/web/index.html](apps/web/index.html) in a browser to run the static
frontend demo. The workbench simulates the campaign state machine and shows the
CAW/cast command template for each lifecycle step.

For the live clickable demo, fill `.env` and start the local Agent Runner:

```bash
node apps/agent-runner/server.js
```

Then open:

```text
http://127.0.0.1:4180/#workbench
```

The runner serves the frontend and exposes a local allowlisted API for the seven
demo steps. Browser code never receives private keys; creator keys and CAW
credentials stay in the local runner process.

## CAW Demo Notes

See [docs/deploy-and-live-demo.md](docs/deploy-and-live-demo.md) for the full
deployment, pact approval, live `contract_call`, and frontend receipt flow.

See [docs/caw-jobescrow-demo.md](docs/caw-jobescrow-demo.md) for the first
`contract_call` sequence to run through Cobo Agentic Wallet.

See [docs/product-scope.md](docs/product-scope.md) for the judging-criteria
alignment and scope boundaries.

Before deploying, use [docs/demo-flow.md](docs/demo-flow.md),
[docs/agent-workflow.md](docs/agent-workflow.md),
[demo/sample-campaign.json](demo/sample-campaign.json), and
[scripts/caw-jobescrow-calldata.sh](scripts/caw-jobescrow-calldata.sh) to align
the demo story, agent roles, sample data, and transaction commands.
