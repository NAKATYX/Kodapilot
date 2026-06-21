// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./Reputation.sol";
import "./ReferralRegistry.sol";

contract SplitPayout is Ownable, ReentrancyGuard {
  struct Split {
    address reseller;
    address vendor;
    uint256 amount;
    uint256 resalePayout;
    uint256 vendorPayout;
    uint256[] referralPayouts;
    uint256 treasuryPayout;
    bool executed;
  }

  Reputation public reputation;
  ReferralRegistry public referralRegistry;
  address public escrowContract;
  address public treasuryAddress;

  uint256 public resaleMarginBps = 500; // 5%
  uint256 public referralBps = 200; // 2% per level
  uint256 public maxReferralDepth = 5;

  mapping(bytes32 => Split) public splits;

  event SplitExecuted(
    bytes32 indexed orderId,
    address indexed reseller,
    address indexed vendor,
    uint256 totalAmount
  );
  event PaymentSent(
    address indexed to,
    uint256 amount,
    string reason
  );
  event ConfigUpdated(uint256 resaleMarginBps, uint256 referralBps);

  modifier onlyEscrow() {
    require(msg.sender == escrowContract, "Only escrow");
    _;
  }

  constructor(
    address _reputation,
    address _referralRegistry,
    address _treasury
  ) Ownable(msg.sender) {
    require(_reputation != address(0), "Invalid reputation");
    require(_referralRegistry != address(0), "Invalid registry");
    require(_treasury != address(0), "Invalid treasury");

    reputation = Reputation(_reputation);
    referralRegistry = ReferralRegistry(_referralRegistry);
    treasuryAddress = _treasury;
  }

  function setEscrowContract(address _escrow) external onlyOwner {
    require(_escrow != address(0), "Invalid escrow");
    escrowContract = _escrow;
  }

  function setConfig(
    uint256 _resaleMarginBps,
    uint256 _referralBps,
    uint256 _maxReferralDepth
  ) external onlyOwner {
    require(
      _resaleMarginBps + _referralBps * _maxReferralDepth <= 10000,
      "Config exceeds 100%"
    );
    resaleMarginBps = _resaleMarginBps;
    referralBps = _referralBps;
    maxReferralDepth = _maxReferralDepth;
    emit ConfigUpdated(_resaleMarginBps, _referralBps);
  }

  function split(
    bytes32 orderId,
    uint256 amount,
    address reseller,
    address vendor
  ) external payable onlyEscrow nonReentrant {
    require(amount > 0, "Amount must be positive");
    require(reseller != address(0), "Invalid reseller");
    require(vendor != address(0), "Invalid vendor");
    require(!splits[orderId].executed, "Already executed");

    Split storage order = splits[orderId];
    order.reseller = reseller;
    order.vendor = vendor;
    order.amount = amount;
    order.executed = true;

    // Resale margin to reseller
    uint256 resalePayout = (amount * resaleMarginBps) / 10000;
    order.resalePayout = resalePayout;
    if (resalePayout > 0) {
      (bool success, ) = reseller.call{value: resalePayout}("");
      require(success, "Reseller transfer failed");
      emit PaymentSent(reseller, resalePayout, "Resale margin");
    }

    // Vendor gets remainder after resale margin
    uint256 remainingAfterResale = amount - resalePayout;

    // Referral payouts
    address[] memory chain = referralRegistry.getReferralChain(vendor);
    uint256 totalReferralPayout = 0;

    for (uint256 i = 0; i < chain.length && i < maxReferralDepth; i++) {
      address referrer = chain[i];
      uint256 referralPayout = (amount * referralBps) / 10000;
      order.referralPayouts.push(referralPayout);
      totalReferralPayout += referralPayout;

      if (referralPayout > 0) {
        (bool success, ) = referrer.call{value: referralPayout}("");
        require(success, "Referral transfer failed");
        emit PaymentSent(referrer, referralPayout, "Referral override");
      }
    }

    // Vendor gets remainder after resale and referral payouts
    uint256 vendorPayout = remainingAfterResale > totalReferralPayout
      ? remainingAfterResale - totalReferralPayout
      : 0;
    order.vendorPayout = vendorPayout;

    if (vendorPayout > 0) {
      (bool success, ) = vendor.call{value: vendorPayout}("");
      require(success, "Vendor transfer failed");
      emit PaymentSent(vendor, vendorPayout, "Vendor payment");

      // Credit reputation for delivery
      reputation.creditReputation(vendor, 1, "Order delivered");
    }

    // Treasury gets any residual (rounding)
    uint256 totalPayout = resalePayout + vendorPayout + totalReferralPayout;
    uint256 treasuryPayout = amount - totalPayout;
    order.treasuryPayout = treasuryPayout;

    if (treasuryPayout > 0) {
      (bool success, ) = treasuryAddress.call{value: treasuryPayout}("");
      require(success, "Treasury transfer failed");
      emit PaymentSent(treasuryAddress, treasuryPayout, "Treasury");
    }

    emit SplitExecuted(orderId, reseller, vendor, amount);
  }

  function getSplit(bytes32 orderId)
    external
    view
    returns (Split memory)
  {
    return splits[orderId];
  }

  receive() external payable {}
}
