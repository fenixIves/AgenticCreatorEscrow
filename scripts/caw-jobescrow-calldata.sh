#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage:
  JOB_ESCROW=0x... SRC=0x... PLATFORM=0x... CREATOR=0x... SUPPLIER=0x... PACT_ID=... scripts/caw-jobescrow-calldata.sh <command>

Commands:
  sponsor-create-job
  creator-proposal-a
  creator-proposal-b
  sponsor-assign-from-proposal
  sponsor-pay-supplier
  creator-submit-delivery
  sponsor-accept-and-pay

The script prints the command for the selected lifecycle step. Sponsor commands
use CAW because they move or control escrowed funds. Creator commands use cast
templates because proposals and delivery are submitted by creator/analyst wallets.
USAGE
}

require_env() {
  local name="$1"
  if [[ -z "${!name:-}" ]]; then
    echo "Missing required env var: $name" >&2
    exit 1
  fi
}

encode() {
  caw util abi encode --method "$1" --args "$2" | jq -r .calldata
}

tx_call() {
  local calldata="$1"
  local request_id="$2"
  local description="$3"
  local value="${4:-0}"

  require_env JOB_ESCROW
  require_env SRC
  require_env PACT_ID

  printf '%s\n' "caw tx call \\"
  printf '  --pact-id %q \\\n' "$PACT_ID"
  printf '  --chain-id SETH \\\n'
  printf '  --contract %q \\\n' "$JOB_ESCROW"
  printf '  --calldata %q \\\n' "$calldata"
  printf '  --value %q \\\n' "$value"
  printf '  --src-address %q \\\n' "$SRC"
  printf '  --request-id %q \\\n' "$request_id"
  printf '  --description %q\n' "$description"
}

creator_cast_send() {
  local signature="$1"
  local args="$2"
  local request="$3"
  local private_key_placeholder="${4:-<CREATOR_PRIVATE_KEY>}"

  require_env JOB_ESCROW

  printf '# %s\n' "$request"
  printf 'cast send %q %q %s \\\n' "$JOB_ESCROW" "$signature" "$args"
  printf '  --rpc-url <SEPOLIA_RPC_URL> \\\n'
  printf '  --private-key %s\n' "$private_key_placeholder"
}

command="${1:-}"
if [[ -z "$command" ]]; then
  usage
  exit 1
fi

case "$command" in
  sponsor-create-job)
    require_env PLATFORM
    calldata="$(encode "createJob(string,string,address,uint256)" "[\"Protocol explainer campaign\",\"ipfs://brief-cid\",\"$PLATFORM\",\"10000000000000\"]")"
    tx_call "$calldata" "jobescrow-create-001" "Create a funded JobEscrow campaign" "0.001"
    ;;
  creator-proposal-a)
    creator_cast_send \
      "submitProposal(uint256,uint256,string,bytes32)" \
      "1 700000000000000 ipfs://creator-agent-a-proposal $(cast keccak proposal-a)" \
      "Creator Agent A records its proposal" \
      "${CREATOR_A_PRIVATE_KEY:-<CREATOR_A_PRIVATE_KEY>}"
    ;;
  creator-proposal-b)
    creator_cast_send \
      "submitProposal(uint256,uint256,string,bytes32)" \
      "1 650000000000000 ipfs://creator-agent-b-proposal $(cast keccak proposal-b)" \
      "Creator Agent B records its proposal" \
      "${CREATOR_B_PRIVATE_KEY:-<CREATOR_B_PRIVATE_KEY>}"
    ;;
  sponsor-assign-from-proposal)
    require_env CREATOR
    calldata="$(encode "assignCreatorFromProposal(uint256,address)" "[\"1\",\"$CREATOR\"]")"
    tx_call "$calldata" "jobescrow-assign-001" "Assign selected creator from proposal"
    ;;
  sponsor-pay-supplier)
    require_env SUPPLIER
    calldata="$(encode "paySupplier(uint256,address,uint256,string)" "[\"1\",\"$SUPPLIER\",\"100000000000000\",\"ipfs://chart-pack-receipt\"]")"
    tx_call "$calldata" "jobescrow-supplier-001" "Pay supplier for campaign resource"
    ;;
  creator-submit-delivery)
    creator_cast_send \
      "submitDelivery(uint256,string,bytes32)" \
      "1 ipfs://creator-agent-b-delivery $(cast keccak delivery-b)" \
      "Selected creator records final delivery" \
      "${CREATOR_B_PRIVATE_KEY:-<CREATOR_B_PRIVATE_KEY>}"
    ;;
  sponsor-accept-and-pay)
    calldata="$(encode "acceptAndPay(uint256)" "[\"1\"]")"
    tx_call "$calldata" "jobescrow-pay-001" "Accept delivery and settle payouts"
    ;;
  *)
    usage
    exit 1
    ;;
esac
