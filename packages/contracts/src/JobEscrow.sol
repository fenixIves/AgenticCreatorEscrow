// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/// @title JobEscrow
/// @notice Minimal escrow for agentic content/research work agreements.
contract JobEscrow {
    enum Status {
        None,
        Posted,
        Assigned,
        InProgress,
        Submitted,
        Rejected,
        Paid,
        Refunded
    }

    struct Job {
        address sponsor;
        address creator;
        address platform;
        uint256 budget;
        uint256 escrowBalance;
        uint256 creatorPayout;
        uint256 platformFee;
        uint256 resourceSpend;
        Status status;
        string title;
        string briefURI;
        string deliveryURI;
        bytes32 deliveryHash;
    }

    struct Proposal {
        address creator;
        uint256 requestedPayout;
        uint256 submittedAt;
        string proposalURI;
        bytes32 proposalHash;
        bool exists;
    }

    error InvalidAddress();
    error InvalidAmount();
    error InvalidStatus(Status current);
    error NotSponsor();
    error NotCreator();
    error ProposalNotFound();
    error InsufficientReservedBudget();
    error TransferFailed();

    event JobCreated(
        uint256 indexed jobId,
        address indexed sponsor,
        string title,
        string briefURI,
        uint256 budget
    );
    event ProposalSubmitted(
        uint256 indexed jobId,
        address indexed creator,
        uint256 requestedPayout,
        string proposalURI,
        bytes32 proposalHash
    );
    event CreatorAssigned(uint256 indexed jobId, address indexed creator, uint256 creatorPayout);
    event ResourcePurchased(
        uint256 indexed jobId, address indexed supplier, uint256 amount, string resourceURI
    );
    event DeliverySubmitted(
        uint256 indexed jobId, address indexed creator, string deliveryURI, bytes32 deliveryHash
    );
    event DeliveryRejected(uint256 indexed jobId, string reason);
    event JobPaid(
        uint256 indexed jobId,
        address indexed creator,
        uint256 creatorPayout,
        address indexed platform,
        uint256 platformFee,
        uint256 sponsorRefund
    );
    event JobRefunded(uint256 indexed jobId, address indexed sponsor, uint256 amount);

    uint256 public nextJobId = 1;
    mapping(uint256 jobId => Job job) public jobs;
    mapping(uint256 jobId => address[] creators) private proposalCreators;
    mapping(uint256 jobId => mapping(address creator => Proposal proposal)) public proposals;

    bool private locked;

    modifier nonReentrant() {
        _nonReentrantBefore();
        _;
        _nonReentrantAfter();
    }

    modifier onlySponsor(uint256 jobId) {
        _onlySponsor(jobId);
        _;
    }

    modifier onlyCreator(uint256 jobId) {
        _onlyCreator(jobId);
        _;
    }

    function _nonReentrantBefore() private {
        require(!locked, "REENTRANT");
        locked = true;
    }

    function _nonReentrantAfter() private {
        locked = false;
    }

    function _onlySponsor(uint256 jobId) private view {
        if (msg.sender != jobs[jobId].sponsor) revert NotSponsor();
    }

    function _onlyCreator(uint256 jobId) private view {
        if (msg.sender != jobs[jobId].creator) revert NotCreator();
    }

    function createJob(
        string calldata title,
        string calldata briefURI,
        address platform,
        uint256 platformFee
    ) external payable returns (uint256 jobId) {
        if (msg.value == 0) revert InvalidAmount();
        if (platform == address(0)) revert InvalidAddress();
        if (platformFee > msg.value) revert InvalidAmount();

        jobId = nextJobId++;

        Job storage job = jobs[jobId];
        job.sponsor = msg.sender;
        job.platform = platform;
        job.budget = msg.value;
        job.escrowBalance = msg.value;
        job.platformFee = platformFee;
        job.status = Status.Posted;
        job.title = title;
        job.briefURI = briefURI;

        emit JobCreated(jobId, msg.sender, title, briefURI, msg.value);
    }

    function assignCreator(uint256 jobId, address creator, uint256 creatorPayout)
        external
        onlySponsor(jobId)
    {
        Job storage job = jobs[jobId];
        if (job.status != Status.Posted) revert InvalidStatus(job.status);
        if (creator == address(0)) revert InvalidAddress();
        if (creatorPayout == 0) revert InvalidAmount();
        if (creatorPayout + job.platformFee > job.escrowBalance) {
            revert InsufficientReservedBudget();
        }

        job.creator = creator;
        job.creatorPayout = creatorPayout;
        job.status = Status.Assigned;

        emit CreatorAssigned(jobId, creator, creatorPayout);
    }

    function submitProposal(
        uint256 jobId,
        uint256 requestedPayout,
        string calldata proposalURI,
        bytes32 proposalHash
    ) external {
        Job storage job = jobs[jobId];
        if (job.status != Status.Posted) revert InvalidStatus(job.status);
        if (requestedPayout == 0) revert InvalidAmount();
        if (proposalHash == bytes32(0)) revert InvalidAmount();
        if (requestedPayout + job.platformFee > job.escrowBalance) {
            revert InsufficientReservedBudget();
        }

        Proposal storage proposal = proposals[jobId][msg.sender];
        if (!proposal.exists) {
            proposalCreators[jobId].push(msg.sender);
        }

        proposals[jobId][msg.sender] = Proposal({
            creator: msg.sender,
            requestedPayout: requestedPayout,
            submittedAt: block.timestamp,
            proposalURI: proposalURI,
            proposalHash: proposalHash,
            exists: true
        });

        emit ProposalSubmitted(jobId, msg.sender, requestedPayout, proposalURI, proposalHash);
    }

    function assignCreatorFromProposal(uint256 jobId, address creator) external onlySponsor(jobId) {
        Job storage job = jobs[jobId];
        if (job.status != Status.Posted) revert InvalidStatus(job.status);

        Proposal storage proposal = proposals[jobId][creator];
        if (!proposal.exists) revert ProposalNotFound();

        job.creator = creator;
        job.creatorPayout = proposal.requestedPayout;
        job.status = Status.Assigned;

        emit CreatorAssigned(jobId, creator, proposal.requestedPayout);
    }

    function proposalCount(uint256 jobId) external view returns (uint256) {
        return proposalCreators[jobId].length;
    }

    function proposalCreatorAt(uint256 jobId, uint256 index) external view returns (address) {
        return proposalCreators[jobId][index];
    }

    function paySupplier(
        uint256 jobId,
        address supplier,
        uint256 amount,
        string calldata resourceURI
    ) external onlySponsor(jobId) nonReentrant {
        Job storage job = jobs[jobId];
        if (job.status != Status.Assigned && job.status != Status.InProgress) {
            revert InvalidStatus(job.status);
        }
        if (supplier == address(0)) revert InvalidAddress();
        if (amount == 0) revert InvalidAmount();

        uint256 reserved = job.creatorPayout + job.platformFee;
        if (job.escrowBalance < reserved + amount) revert InsufficientReservedBudget();

        job.escrowBalance -= amount;
        job.resourceSpend += amount;
        job.status = Status.InProgress;

        _sendValue(supplier, amount);

        emit ResourcePurchased(jobId, supplier, amount, resourceURI);
    }

    function submitDelivery(uint256 jobId, string calldata deliveryURI, bytes32 deliveryHash)
        external
        onlyCreator(jobId)
    {
        Job storage job = jobs[jobId];
        if (job.status != Status.Assigned && job.status != Status.InProgress) {
            revert InvalidStatus(job.status);
        }
        if (deliveryHash == bytes32(0)) revert InvalidAmount();

        job.deliveryURI = deliveryURI;
        job.deliveryHash = deliveryHash;
        job.status = Status.Submitted;

        emit DeliverySubmitted(jobId, msg.sender, deliveryURI, deliveryHash);
    }

    function rejectDelivery(uint256 jobId, string calldata reason) external onlySponsor(jobId) {
        Job storage job = jobs[jobId];
        if (job.status != Status.Submitted) revert InvalidStatus(job.status);

        job.status = Status.Rejected;

        emit DeliveryRejected(jobId, reason);
    }

    function acceptAndPay(uint256 jobId) external onlySponsor(jobId) nonReentrant {
        Job storage job = jobs[jobId];
        if (job.status != Status.Submitted) revert InvalidStatus(job.status);

        uint256 creatorPayout = job.creatorPayout;
        uint256 platformFee = job.platformFee;
        uint256 sponsorRefund = job.escrowBalance - creatorPayout - platformFee;

        job.escrowBalance = 0;
        job.status = Status.Paid;

        _sendValue(job.creator, creatorPayout);
        if (platformFee > 0) {
            _sendValue(job.platform, platformFee);
        }
        if (sponsorRefund > 0) {
            _sendValue(job.sponsor, sponsorRefund);
        }

        emit JobPaid(jobId, job.creator, creatorPayout, job.platform, platformFee, sponsorRefund);
    }

    function refundRejected(uint256 jobId) external onlySponsor(jobId) nonReentrant {
        Job storage job = jobs[jobId];
        if (job.status != Status.Rejected) revert InvalidStatus(job.status);

        uint256 amount = job.escrowBalance;
        job.escrowBalance = 0;
        job.status = Status.Refunded;

        _sendValue(job.sponsor, amount);

        emit JobRefunded(jobId, job.sponsor, amount);
    }

    function cancelUnassignedJob(uint256 jobId) external onlySponsor(jobId) nonReentrant {
        Job storage job = jobs[jobId];
        if (job.status != Status.Posted) revert InvalidStatus(job.status);

        uint256 amount = job.escrowBalance;
        job.escrowBalance = 0;
        job.status = Status.Refunded;

        _sendValue(job.sponsor, amount);

        emit JobRefunded(jobId, job.sponsor, amount);
    }

    function _sendValue(address recipient, uint256 amount) private {
        (bool ok,) = recipient.call{ value: amount }("");
        if (!ok) revert TransferFailed();
    }
}
