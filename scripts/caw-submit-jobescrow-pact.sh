#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ACE_ENV_FILE:-$ROOT_DIR/.env}"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

if [[ -z "${JOB_ESCROW:-}" ]]; then
  echo "Missing JOB_ESCROW. Set it in .env before submitting a pact." >&2
  exit 1
fi

RUN_LABEL="${ACE_RUN_ID:-$(date +%Y%m%d%H%M%S)}"
TX_COUNT="${PACT_TX_COUNT:-4}"

caw pact submit \
  --name "JobEscrow demo calls ${RUN_LABEL}" \
  --intent "Run one agentic creator escrow demo on Sepolia via JobEscrow" \
  --original-intent "Create, assign, procure, and settle one Web3 content job with CAW-controlled sponsor calls" \
  --policies '[{"name":"jobescrow-calls","type":"contract_call","rules":{"effect":"allow","when":{"chain_in":["SETH"],"target_in":[{"chain_id":"SETH","contract_addr":"'"$JOB_ESCROW"'"}]},"deny_if":{"usage_limits":{"rolling_24h":{"tx_count_gt":'"$TX_COUNT"'}}}}}]' \
  --completion-conditions '[{"type":"tx_count","threshold":"'"$TX_COUNT"'"}]' \
  --execution-plan '# Summary
Run one JobEscrow lifecycle for an agentic creator campaign on Sepolia.

# Operations
- createJob with a small SETH campaign budget.
- assignCreatorFromProposal after creator agents submit proposal records.
- paySupplier for approved resource procurement.
- acceptAndPay after delivery evidence is submitted.

# Risk Controls
- Contract target limited to the deployed JobEscrow address.
- Chain limited to SETH.
- Sponsor authority terminates after the configured transaction count.'
