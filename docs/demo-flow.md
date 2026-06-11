# Demo Flow

## Demo Goal

Show a Web3 project using a CAW-controlled sponsor agent to run a content
campaign from budget to payout:

```text
funded campaign
-> creator/analyst proposals
-> selected agent
-> resource procurement
-> delivery record
-> acceptance and payout
```

The judge should leave with one clear idea: CAW makes it safe for a project to
give an agent a bounded wallet budget and let it execute real economic actions.

## Three-Minute Script

### 0:00 - 0:25: The Problem

Web3 projects constantly pay for research, explainers, tutorials, short videos,
and launch campaign assets. Today that work is coordinated through chats,
spreadsheets, bounty platforms, and manual wallet transfers.

The missing piece is not another content board. The missing piece is a safe way
for an agent to receive a budget, buy resources, settle work, and leave an
auditable trail.

### 0:25 - 0:55: The Setup

Show the campaign:

- Sponsor: a project or DAO campaign agent.
- Budget: small SETH test budget controlled by CAW.
- Task: create a 60-second Web3 protocol explainer package.
- Deliverable: proposal, brief, source receipt, final content package hash.

Show the CAW wallet and pact:

- Wallet address.
- Pact status.
- Target contract allowlist.
- Transaction count cap.

### 0:55 - 1:30: Agent Proposals

Two creator/analyst agents submit proposals:

- Agent A: more educational and beginner-friendly.
- Agent B: more technical, aimed at active DeFi users.

The sponsor agent selects one proposal and records it on-chain through
`assignCreatorFromProposal`.

### 1:30 - 2:05: Resource Procurement

The selected agent needs a source package or chart pack. The sponsor agent calls
`paySupplier`, sending test funds to a supplier wallet and recording a resource
receipt URI.

This is the first key Agentic Commerce moment: the agent is spending from the
campaign budget, but only inside the CAW-approved pact boundary.

### 2:05 - 2:35: Delivery

The selected creator agent submits a delivery URI and hash:

- Script outline.
- Visual shot list.
- Thumbnail copy.
- Source notes.

This creates a verifiable delivery record without forcing the entire content
asset on-chain.

### 2:35 - 3:00: Settlement

The sponsor agent accepts the delivery. `acceptAndPay` releases:

- Creator payout.
- Platform fee.
- Sponsor refund for unused budget.

Show transaction hash, final balances, and final job status.

## Stable MVP Path

Use one job with:

- Two proposal records.
- One selected creator.
- One supplier payment.
- One delivery hash.
- One final payout.

Do not demo disputes, DAO voting, ERC20 settlement, or automated scoring in the
first pass.

## Judge-Facing Summary

Agentic Creator Escrow turns campaign work into a CAW-governed economic loop.
The AI agent is not just writing content; it is controlling budget, selecting
work, buying resources, and settling contributors under human-approved wallet
policy.
