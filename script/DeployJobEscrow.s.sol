// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import { JobEscrow } from "../packages/contracts/src/JobEscrow.sol";

interface Vm {
    function startBroadcast() external;
    function stopBroadcast() external;
}

contract DeployJobEscrowScript {
    Vm private constant VM = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    function run() external returns (JobEscrow escrow) {
        VM.startBroadcast();
        escrow = new JobEscrow();
        VM.stopBroadcast();
    }
}
