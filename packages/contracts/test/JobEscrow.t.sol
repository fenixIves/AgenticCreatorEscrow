// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import { JobEscrow } from "../src/JobEscrow.sol";

interface Vm {
    function deal(address who, uint256 newBalance) external;
    function prank(address msgSender) external;
    function expectRevert(bytes4 revertData) external;
}

contract JobEscrowTest {
    Vm private constant VM = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    JobEscrow private escrow;

    address private constant SPONSOR = address(0x1001);
    address private constant CREATOR = address(0x1002);
    address private constant CREATOR_B = address(0x1006);
    address private constant SUPPLIER = address(0x1003);
    address private constant PLATFORM = address(0x1004);
    address private constant ATTACKER = address(0x1005);

    function setUp() public {
        escrow = new JobEscrow();
        VM.deal(SPONSOR, 10 ether);
    }

    function testFullWorkAgreementFlowPaysCreatorPlatformAndSupplier() public {
        uint256 jobId = _createJob(1 ether, 0.05 ether);

        VM.prank(SPONSOR);
        escrow.assignCreator(jobId, CREATOR, 0.7 ether);

        VM.prank(SPONSOR);
        escrow.paySupplier(jobId, SUPPLIER, 0.1 ether, "ipfs://resource-receipt");

        VM.prank(CREATOR);
        escrow.submitDelivery(jobId, "ipfs://delivery", keccak256("delivery-v1"));

        uint256 sponsorBefore = SPONSOR.balance;
        VM.prank(SPONSOR);
        escrow.acceptAndPay(jobId);

        assertEq(CREATOR.balance, 0.7 ether);
        assertEq(SUPPLIER.balance, 0.1 ether);
        assertEq(PLATFORM.balance, 0.05 ether);
        assertEq(SPONSOR.balance - sponsorBefore, 0.15 ether);

        (
            ,,,
            uint256 budget,
            uint256 escrowBalance,,,
            uint256 resourceSpend,
            JobEscrow.Status status,,,,
        ) = escrow.jobs(jobId);
        assertEq(budget, 1 ether);
        assertEq(escrowBalance, 0);
        assertEq(resourceSpend, 0.1 ether);
        assertStatus(status, JobEscrow.Status.Paid);
    }

    function testRejectedDeliveryCanBeRefunded() public {
        uint256 jobId = _createJob(1 ether, 0.05 ether);

        VM.prank(SPONSOR);
        escrow.assignCreator(jobId, CREATOR, 0.7 ether);

        VM.prank(CREATOR);
        escrow.submitDelivery(jobId, "ipfs://bad-delivery", keccak256("bad-delivery"));

        VM.prank(SPONSOR);
        escrow.rejectDelivery(jobId, "Missing required sources");

        uint256 sponsorBefore = SPONSOR.balance;
        VM.prank(SPONSOR);
        escrow.refundRejected(jobId);

        assertEq(SPONSOR.balance - sponsorBefore, 1 ether);
        assertEq(CREATOR.balance, 0);
        assertEq(PLATFORM.balance, 0);

        (,,,, uint256 escrowBalance,,,, JobEscrow.Status status,,,,) = escrow.jobs(jobId);
        assertEq(escrowBalance, 0);
        assertStatus(status, JobEscrow.Status.Refunded);
    }

    function testProposalSelectionCanDriveWorkAgreementFlow() public {
        uint256 jobId = _createJob(1 ether, 0.05 ether);

        VM.prank(CREATOR);
        escrow.submitProposal(jobId, 0.7 ether, "ipfs://proposal-a", keccak256("proposal-a"));

        VM.prank(CREATOR_B);
        escrow.submitProposal(jobId, 0.65 ether, "ipfs://proposal-b", keccak256("proposal-b"));

        assertEq(escrow.proposalCount(jobId), 2);
        assertAddressEq(escrow.proposalCreatorAt(jobId, 0), CREATOR);
        assertAddressEq(escrow.proposalCreatorAt(jobId, 1), CREATOR_B);

        (address proposalCreator, uint256 requestedPayout,,, bytes32 proposalHash, bool exists) =
            escrow.proposals(jobId, CREATOR_B);
        assertAddressEq(proposalCreator, CREATOR_B);
        assertEq(requestedPayout, 0.65 ether);
        assertBytes32Eq(proposalHash, keccak256("proposal-b"));
        assertTrue(exists);

        VM.prank(SPONSOR);
        escrow.assignCreatorFromProposal(jobId, CREATOR_B);

        VM.prank(CREATOR_B);
        escrow.submitDelivery(jobId, "ipfs://delivery-b", keccak256("delivery-b"));

        VM.prank(SPONSOR);
        escrow.acceptAndPay(jobId);

        assertEq(CREATOR.balance, 0);
        assertEq(CREATOR_B.balance, 0.65 ether);
        assertEq(PLATFORM.balance, 0.05 ether);
    }

    function testUnassignedJobCanBeCancelledAndRefunded() public {
        uint256 jobId = _createJob(1 ether, 0.05 ether);

        VM.prank(CREATOR);
        escrow.submitProposal(jobId, 0.7 ether, "ipfs://proposal-a", keccak256("proposal-a"));

        uint256 sponsorBefore = SPONSOR.balance;
        VM.prank(SPONSOR);
        escrow.cancelUnassignedJob(jobId);

        assertEq(SPONSOR.balance - sponsorBefore, 1 ether);

        (,,,, uint256 escrowBalance,,,, JobEscrow.Status status,,,,) = escrow.jobs(jobId);
        assertEq(escrowBalance, 0);
        assertStatus(status, JobEscrow.Status.Refunded);
    }

    function testSupplierSpendCannotConsumeReservedPayouts() public {
        uint256 jobId = _createJob(1 ether, 0.05 ether);

        VM.prank(SPONSOR);
        escrow.assignCreator(jobId, CREATOR, 0.8 ether);

        VM.expectRevert(JobEscrow.InsufficientReservedBudget.selector);
        VM.prank(SPONSOR);
        escrow.paySupplier(jobId, SUPPLIER, 0.2 ether, "ipfs://too-expensive");
    }

    function testOnlySponsorCanAssignOrPaySupplier() public {
        uint256 jobId = _createJob(1 ether, 0.05 ether);

        VM.expectRevert(JobEscrow.NotSponsor.selector);
        VM.prank(ATTACKER);
        escrow.assignCreator(jobId, CREATOR, 0.7 ether);

        VM.prank(SPONSOR);
        escrow.assignCreator(jobId, CREATOR, 0.7 ether);

        VM.expectRevert(JobEscrow.NotSponsor.selector);
        VM.prank(ATTACKER);
        escrow.paySupplier(jobId, SUPPLIER, 0.1 ether, "ipfs://resource");
    }

    function testOnlyCreatorCanSubmitDelivery() public {
        uint256 jobId = _createJob(1 ether, 0.05 ether);

        VM.prank(SPONSOR);
        escrow.assignCreator(jobId, CREATOR, 0.7 ether);

        VM.expectRevert(JobEscrow.NotCreator.selector);
        VM.prank(ATTACKER);
        escrow.submitDelivery(jobId, "ipfs://fake", keccak256("fake"));
    }

    function _createJob(uint256 budget, uint256 platformFee) private returns (uint256 jobId) {
        VM.prank(SPONSOR);
        jobId = escrow.createJob{ value: budget }(
            "Protocol explainer campaign", "ipfs://brief", PLATFORM, platformFee
        );
    }

    function assertEq(uint256 actual, uint256 expected) private pure {
        require(actual == expected, "uint mismatch");
    }

    function assertAddressEq(address actual, address expected) private pure {
        require(actual == expected, "address mismatch");
    }

    function assertBytes32Eq(bytes32 actual, bytes32 expected) private pure {
        require(actual == expected, "bytes32 mismatch");
    }

    function assertTrue(bool value) private pure {
        require(value, "bool mismatch");
    }

    function assertStatus(JobEscrow.Status actual, JobEscrow.Status expected) private pure {
        require(actual == expected, "status mismatch");
    }
}
