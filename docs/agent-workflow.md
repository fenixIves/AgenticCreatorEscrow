# Agent Workflow

## Agent Roles

### Sponsor Agent

Represents a Web3 project or DAO campaign budget. In the demo, this is the CAW
wallet and the only actor that can move escrowed funds.

Responsibilities:

- Create funded jobs.
- Review proposal metadata.
- Select a creator proposal.
- Pay suppliers for allowed resources.
- Accept or reject delivery.
- Trigger final payout or refund.

### Creator / Analyst Agent

Represents a content or research worker. It does not need CAW in the MVP, but
its proposal and delivery are recorded on-chain.

Responsibilities:

- Submit a proposal URI and hash.
- Produce the delivery package.
- Submit the delivery URI and hash.
- Receive payout.

### Supplier

Represents a resource provider such as a dataset, chart pack, design service, or
translation service. In the MVP, this can be a controlled wallet plus receipt
URI.

Responsibilities:

- Receive procurement payment.
- Provide a receipt URI for the resource.

## Proposal Schema

The proposal can be generated off-chain and stored as JSON. The contract records
only its URI and hash.

```json
{
  "agent": "Creator Agent B",
  "campaign": "Protocol explainer campaign",
  "requestedPayoutWei": "650000000000000",
  "style": "technical but creator-friendly",
  "deliverables": [
    "60-second script",
    "shot list",
    "thumbnail copy",
    "source notes"
  ],
  "resourcePlan": [
    {
      "name": "chart pack",
      "budgetWei": "100000000000000"
    }
  ],
  "selectionRationale": "Best fit for a DeFi-native audience."
}
```

## Delivery Schema

```json
{
  "campaign": "Protocol explainer campaign",
  "selectedAgent": "Creator Agent B",
  "assets": {
    "script": "ipfs://...",
    "shotList": "ipfs://...",
    "thumbnailCopy": "ipfs://...",
    "sourceNotes": "ipfs://..."
  },
  "resourceReceipts": [
    "ipfs://chart-pack-receipt"
  ],
  "review": {
    "accepted": true,
    "reason": "Meets brief, includes source notes, ready for edit."
  }
}
```

## On-Chain Mapping

- `createJob`: Sponsor Agent creates the funded campaign.
- `submitProposal`: Creator/Analyst Agents record proposal URI and hash.
- `assignCreatorFromProposal`: Sponsor Agent selects the winning proposal.
- `paySupplier`: Sponsor Agent procures a resource from unreserved budget.
- `submitDelivery`: Creator Agent records delivery URI and hash.
- `acceptAndPay`: Sponsor Agent settles creator, platform, and refund.

## CAW Boundary

CAW should control the Sponsor Agent actions that move money:

- `createJob`
- `paySupplier`
- `acceptAndPay`
- `cancelUnassignedJob`
- `refundRejected`

The pact should allow only the `JobEscrow` contract on `SETH`, cap transaction
count, and show the execution plan in the CAW app.
