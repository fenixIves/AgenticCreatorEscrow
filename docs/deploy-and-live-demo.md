# Deploy And Live Demo Runbook

This runbook turns the local prototype into a judge-facing Sepolia demo.

## 0. Prepare Local Env

Copy the template and fill only local values:

```bash
cp .env.example .env
```

Required values for the first live run:

- `SEPOLIA_RPC_URL`: Sepolia RPC endpoint.
- `DEPLOYER_PRIVATE_KEY`: testnet deployer key with enough SETH for deployment gas.
- `SRC`: paired CAW DEV wallet address.
- `PLATFORM`: platform fee recipient.
- `CREATOR`: selected creator recipient.
- `SUPPLIER`: supplier/resource recipient.

Do not commit `.env`.

## 1. Verify Locally

```bash
forge build
forge test -vv
```

The deploy script is:

```text
script/DeployJobEscrow.s.sol:DeployJobEscrowScript
```

## 2. Deploy `JobEscrow`

```bash
source .env

forge script script/DeployJobEscrow.s.sol:DeployJobEscrowScript \
  --rpc-url "$SEPOLIA_RPC_URL" \
  --private-key "$DEPLOYER_PRIVATE_KEY" \
  --broadcast
```

Copy the deployed contract address into:

```bash
JOB_ESCROW=<deployed JobEscrow address>
```

Optional verification, if `ETHERSCAN_API_KEY` is configured:

```bash
forge verify-contract "$JOB_ESCROW" packages/contracts/src/JobEscrow.sol:JobEscrow \
  --chain sepolia \
  --etherscan-api-key "$ETHERSCAN_API_KEY"
```

## 3. Submit The CAW Pact

This pact gives the Sponsor Agent authority to call only the deployed `JobEscrow`
contract on Sepolia, capped to the demo lifecycle.

```bash
source .env

caw pact submit \
  --name "JobEscrow demo calls" \
  --intent "Run a one-job agentic creator escrow demo on Sepolia" \
  --original-intent "Create, assign, procure, and settle one Web3 content job" \
  --policies '[{"name":"jobescrow-calls","type":"contract_call","rules":{"effect":"allow","when":{"chain_in":["SETH"],"target_in":[{"chain_id":"SETH","contract_addr":"'"$JOB_ESCROW"'"}]},"deny_if":{"usage_limits":{"rolling_24h":{"tx_count_gt":4}}}}}]' \
  --completion-conditions '[{"type":"tx_count","threshold":"4"}]' \
  --execution-plan '# Summary
Run one JobEscrow lifecycle for an agentic creator campaign.

# Operations
- createJob with a small SETH budget.
- assignCreatorFromProposal after creator/analyst agents submit proposals.
- paySupplier.
- acceptAndPay after delivery evidence is submitted.

# Risk Controls
- Contract target limited to JobEscrow.
- Chain limited to SETH.
- At most four sponsor contract calls in 24 hours.'
```

Approve it in the CAW DEV app, then check:

```bash
caw pact show --pact-id <PACT_ID>
```

When `status` is `active`, paste the ID into:

```bash
PACT_ID=<approved pact id>
```

## 4. Run The First CAW Contract Call

Recommended for the judge-facing demo: start the local Agent Runner and execute
from the browser workbench.

```bash
source .env
node apps/agent-runner/server.js
```

Open:

```text
http://127.0.0.1:4180/#workbench
```

Click **Execute live: Fund campaign**. The browser calls the local runner, the
runner submits the CAW `contract_call`, and the CAW DEV app may ask for approval
depending on pact and policy state. Once the transaction hash is returned, the
CAW Receipts panel switches to confirmed.

CLI fallback:

Create the funded campaign through CAW:

```bash
source .env
scripts/caw-jobescrow-calldata.sh sponsor-create-job
```

The helper prints the `caw tx call` command with encoded calldata. Run that
printed command, then poll the request until the transaction is confirmed:

```bash
caw tx get --request-id jobescrow-create-001
```

Record the returned transaction hash:

```bash
JOBESCROW_CREATE_TX_HASH=<confirmed createJob tx hash>
```

## 5. Continue The Demo Lifecycle

In the browser, keep clicking **Execute live** step by step:

```text
Fund campaign
-> Proposal A
-> Proposal B
-> Select winner
-> Buy resource
-> Submit delivery
-> Settle payout
```

Sponsor actions use CAW because they control campaign money. Creator proposal
and delivery actions use the creator test wallets configured in `.env`.

CLI fallback helper commands:

```bash
scripts/caw-jobescrow-calldata.sh creator-proposal-a
scripts/caw-jobescrow-calldata.sh creator-proposal-b
scripts/caw-jobescrow-calldata.sh sponsor-assign-from-proposal
scripts/caw-jobescrow-calldata.sh sponsor-pay-supplier
scripts/caw-jobescrow-calldata.sh creator-submit-delivery
scripts/caw-jobescrow-calldata.sh sponsor-accept-and-pay
```

## 6. Show Real Proof In The Frontend

The browser demo accepts runtime overrides through URL parameters. Example:

```text
http://127.0.0.1:4173/index.html?JOB_ESCROW=0x...&PACT_ID=...&JOBESCROW_CREATE_TX_HASH=0x...#workbench
```

Supported proof parameters:

- `CAW_BASIC_TRANSFER_TX_HASH`
- `CAW_WETH_DEPOSIT_TX_HASH`
- `JOBESCROW_CREATE_TX_HASH`
- `JOBESCROW_PROPOSAL_A_TX_HASH`
- `JOBESCROW_PROPOSAL_B_TX_HASH`
- `JOBESCROW_ASSIGN_TX_HASH`
- `JOBESCROW_SUPPLIER_TX_HASH`
- `JOBESCROW_DELIVERY_TX_HASH`
- `JOBESCROW_SETTLE_TX_HASH`

Once a hash is present, the CAW Receipts panel shows it as confirmed and links to
the Sepolia explorer.

## Demo Safety Notes

- Use Sepolia only for this runbook.
- Keep the pact target allowlist to the deployed `JobEscrow` address.
- Wait for each CAW transaction to complete before submitting the next sponsor
  action from the same CAW wallet.
- If a transaction is pending owner authorization, approve or reject it in the
  CAW DEV app before retrying.
