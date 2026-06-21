// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./Reputation.sol";
import "./ReferralRegistry.sol";
import "./SplitPayout.sol";

contract Escrow is Ownable, ReentrancyGuard {
  enum OrderStatus {
    ESCROWED,
    DELIVERED,
    RELEASED,
    REFUNDED,
    DISPUTED
  }

  struct Order {
    address buyer;
    address vendor;
    address reseller;
    uint256 amount;
    OrderStatus status;
    uint256 depositedAt;
    uint256 deliveredAt;
    uint256 releasedAt;
    string refundReason;
  }

  SplitPayout public splitPayout;
  Reputation public reputation;
  ReferralRegistry public referralRegistry;

  mapping(bytes32 => Order) public orders;
  uint256 public minOrderAmount = 0.01 ether;

  event EscrowDeposited(
    bytes32 indexed orderId,
    address indexed buyer,
    address indexed vendor,
    address reseller,
    uint256 amount
  );
  event DeliveryConfirmed(bytes32 indexed orderId);
  event EscrowReleased(
    bytes32 indexed orderId,
    uint256 releaseAmount
  );
  event EscrowRefunded(
    bytes32 indexed orderId,
    address indexed buyer,
    uint256 amount,
    string reason
  );
  event DisputeOpened(
    bytes32 indexed orderId,
    address indexed initiator
  );
  event MinOrderAmountUpdated(uint256 newAmount);

  modifier orderExists(bytes32 orderId) {
    require(orders[orderId].buyer != address(0), "Order not found");
    _;
  }

  modifier onlyBuyer(bytes32 orderId) {
    require(msg.sender == orders[orderId].buyer, "Only buyer");
    _;
  }

  modifier onlyVendor(bytes32 orderId) {
    require(msg.sender == orders[orderId].vendor, "Only vendor");
    _;
  }

  modifier onlyBuyerOrVendor(bytes32 orderId) {
    require(
      msg.sender == orders[orderId].buyer ||
        msg.sender == orders[orderId].vendor,
      "Only buyer or vendor"
    );
    _;
  }

  constructor(
    address _splitPayout,
    address _reputation,
    address _referralRegistry
  ) Ownable(msg.sender) {
    require(_splitPayout != address(0), "Invalid split payout");
    require(_reputation != address(0), "Invalid reputation");
    require(_referralRegistry != address(0), "Invalid registry");

    splitPayout = SplitPayout(payable(_splitPayout));
    reputation = Reputation(_reputation);
    referralRegistry = ReferralRegistry(_referralRegistry);
  }

  function setMinOrderAmount(uint256 amount) external onlyOwner {
    minOrderAmount = amount;
    emit MinOrderAmountUpdated(amount);
  }

  function deposit(
    bytes32 orderId,
    address vendor,
    address reseller
  ) external payable nonReentrant {
    require(msg.value >= minOrderAmount, "Amount too small");
    require(vendor != address(0), "Invalid vendor");
    require(orders[orderId].buyer == address(0), "Order exists");

    Order storage order = orders[orderId];
    order.buyer = msg.sender;
    order.vendor = vendor;
    order.reseller = reseller;
    order.amount = msg.value;
    order.status = OrderStatus.ESCROWED;
    order.depositedAt = block.timestamp;

    emit EscrowDeposited(orderId, msg.sender, vendor, reseller, msg.value);
  }

  function confirmDelivery(bytes32 orderId)
    external
    orderExists(orderId)
    onlyBuyer(orderId)
    nonReentrant
  {
    Order storage order = orders[orderId];
    require(order.status == OrderStatus.ESCROWED, "Already confirmed");

    order.status = OrderStatus.DELIVERED;
    order.deliveredAt = block.timestamp;

    emit DeliveryConfirmed(orderId);
  }

  function release(bytes32 orderId)
    external
    orderExists(orderId)
    nonReentrant
  {
    Order storage order = orders[orderId];
    require(order.releasedAt == 0, "Already released");
    require(order.status == OrderStatus.DELIVERED, "Must be delivered");
    require(
      msg.sender == order.buyer || msg.sender == owner(),
      "Only buyer or owner"
    );

    order.status = OrderStatus.RELEASED;
    order.releasedAt = block.timestamp;

    // Transfer funds to SplitPayout and execute split
    uint256 amount = order.amount;
    (bool success, ) = payable(address(splitPayout)).call{value: amount}(
      abi.encodeWithSignature(
        "split(bytes32,uint256,address,address)",
        orderId,
        amount,
        order.reseller,
        order.vendor
      )
    );
    require(success, "Split payout failed");

    emit EscrowReleased(orderId, amount);
  }

  function refund(
    bytes32 orderId,
    string calldata reason
  ) external orderExists(orderId) onlyBuyerOrVendor(orderId) nonReentrant {
    Order storage order = orders[orderId];
    require(
      order.status == OrderStatus.ESCROWED ||
        order.status == OrderStatus.DELIVERED,
      "Cannot refund"
    );
    require(order.releasedAt == 0, "Already released");

    order.status = OrderStatus.REFUNDED;
    order.refundReason = reason;

    // Refund to buyer
    (bool success, ) = order.buyer.call{value: order.amount}("");
    require(success, "Refund failed");

    // Debit vendor reputation on refund
    reputation.debitReputation(order.vendor, 1, reason);

    emit EscrowRefunded(orderId, order.buyer, order.amount, reason);
  }

  function dispute(bytes32 orderId, string calldata reason)
    external
    orderExists(orderId)
    onlyBuyerOrVendor(orderId)
  {
    Order storage order = orders[orderId];
    require(order.status != OrderStatus.RELEASED, "Cannot dispute");
    require(order.status != OrderStatus.REFUNDED, "Cannot dispute");

    order.status = OrderStatus.DISPUTED;
    order.refundReason = reason;

    emit DisputeOpened(orderId, msg.sender);
  }

  function getOrder(bytes32 orderId)
    external
    view
    returns (Order memory)
  {
    return orders[orderId];
  }

  function getOrderStatus(bytes32 orderId)
    external
    view
    returns (OrderStatus)
  {
    return orders[orderId].status;
  }

  receive() external payable {}
}
