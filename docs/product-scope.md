# Product Scope

## One-Line Product

Agentic Creator Escrow lets a Web3 project or DAO give a CAW-controlled agent a
bounded campaign budget. Creator/analyst agents compete for the task, the
selected agent delivers a verifiable content/research asset, and CAW executes
procurement and settlement inside approved pact rules.

## Roles

- Sponsor / Project Agent: the CAW wallet that controls the campaign budget.
- Creator / Analyst Agent: generates proposals and submits delivery artifacts.
- Supplier: receives resource-procurement payments for data, design, charts, or other services.
- Platform: receives a small fee when the job is accepted.
- Human Owner: approves CAW pairing and pact boundaries in the CAW app.

## What The Contract Guarantees

- Budget is escrowed when the job is created.
- Multiple proposal records can be submitted before assignment.
- Sponsor can only assign a creator while the job is still posted.
- Supplier payments cannot consume the reserved creator payout or platform fee.
- Delivery is recorded by URI and hash.
- Acceptance pays creator/platform and refunds the sponsor's leftover budget.
- Rejection allows sponsor refund instead of creator payout.

## What CAW Guarantees In The Demo

- The sponsor wallet is not a raw private key in the agent runtime.
- The human owner approves the pact before the agent can move funds.
- Money-moving contract calls are limited to the JobEscrow contract.
- The pact can cap transaction count and require review.
- The CAW app provides the approval and audit trail around agent execution.

## Judging Criteria Alignment

### Scenario Fit

The demo shows Agentic Commerce because an agent is not just producing text. It
receives a budget, selects work, buys resources, records delivery, and settles
contributors. The content/research task is the economic activity.

### CAW Criticality

CAW is the execution layer for the sponsor agent's money-moving operations. The
demo should show the pact, the CAW wallet address, and CAW-originated contract
calls. Without CAW, the sponsor agent would either need a hot private key or a
manual wallet click for every payment.

### Funding Flow Completeness

The core flow is:

```text
create funded job
-> collect proposals
-> select creator
-> procure resource
-> submit delivery
-> accept and pay
```

Each money movement has a transaction record.

### Demonstrability

The stable demo path should use one job, two proposals, one supplier payment,
one delivery hash, and one final payout. The UI only needs to make these state
transitions and transaction hashes easy to follow.

## Deliberate MVP Boundaries

- This is ERC-8183-inspired, not a full ERC-8183 implementation.
- Native SETH is used for the first demo because Cobo DEV faucet support is available.
- AI scoring can be off-chain in the first demo; the accepted proposal is recorded on-chain.
- Supplier/resource services can be simulated by a controlled wallet and receipt URI.
- Full DAO voting, ERC20 settlement, and multi-round dispute resolution are future extensions.
