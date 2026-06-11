# CAW JobEscrow Contract Call Demo

This is the first project-specific CAW test after the basic `transfer` and WETH
`deposit()` checks.

## 1. Deploy `JobEscrow`

Compile first:

```bash
forge build
```

Use the project deploy script:

```bash
source .env

forge script script/DeployJobEscrow.s.sol:DeployJobEscrowScript \
  --rpc-url "$SEPOLIA_RPC_URL" \
  --private-key "$DEPLOYER_PRIVATE_KEY" \
  --broadcast
```

Then set:

```bash
JOB_ESCROW=<deployed JobEscrow address>
SRC=<your CAW EVM address>
PLATFORM=<platform fee recipient>
CREATOR=<creator payout recipient>
SUPPLIER=<supplier/resource recipient>
```

For the complete deployment and browser proof flow, see
[deploy-and-live-demo.md](deploy-and-live-demo.md).

## 2. Submit A Contract Call Pact

This pact allows a short demo sequence against the `JobEscrow` contract only.

```bash
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
- acceptAndPay.

# Risk Controls
- Contract target limited to JobEscrow.
- At most four sponsor contract calls in 24 hours.'
```

Approve the pact in the CAW DEV app, then confirm it is active:

```bash
caw pact show --pact-id <PACT_ID>
```

## 3. Encode And Call `createJob`

```bash
CALLDATA=$(caw util abi encode \
  --method "createJob(string,string,address,uint256)" \
  --args '["Protocol explainer campaign","ipfs://brief-cid","'"$PLATFORM"'","10000000000000"]' \
  | jq -r .calldata)

caw tx call \
  --pact-id <PACT_ID> \
  --chain-id SETH \
  --contract "$JOB_ESCROW" \
  --calldata "$CALLDATA" \
  --value 0.001 \
  --src-address "$SRC" \
  --request-id jobescrow-create-001 \
  --description "Create a funded JobEscrow campaign"
```

The helper script can print this command after `JOB_ESCROW`, `SRC`, `PLATFORM`,
and `PACT_ID` are set:

```bash
scripts/caw-jobescrow-calldata.sh sponsor-create-job
```

After the transaction is confirmed, read logs or contract state to get `jobId`.
The first created job is usually `1` on a fresh deployment.

## 4. Record Agent Proposals

Creator/analyst agents can submit proposals through a normal wallet or a second
agent wallet. For the first demo, two controlled wallets are enough.

```bash
submitProposal(uint256,uint256,string,bytes32)
```

Helper templates:

```bash
scripts/caw-jobescrow-calldata.sh creator-proposal-a
scripts/caw-jobescrow-calldata.sh creator-proposal-b
```

Use proposal URIs such as:

```text
ipfs://creator-agent-a-proposal
ipfs://creator-agent-b-proposal
```

## 5. Continue The Lifecycle

The Sponsor Agent keeps using CAW for money-controlling calls:

```bash
assignCreatorFromProposal(uint256,address)
paySupplier(uint256,address,uint256,string)
acceptAndPay(uint256)
```

The selected Creator Agent records delivery with its own wallet:

```bash
submitDelivery(uint256,string,bytes32)
```

Helper templates:

```bash
scripts/caw-jobescrow-calldata.sh sponsor-assign-from-proposal
scripts/caw-jobescrow-calldata.sh sponsor-pay-supplier
scripts/caw-jobescrow-calldata.sh creator-submit-delivery
scripts/caw-jobescrow-calldata.sh sponsor-accept-and-pay
```

For the demo budget above, a simple split is:

- creator payout: `700000000000000`
- supplier spend: `100000000000000`
- platform fee: `10000000000000`
- sponsor refund: remaining escrow
