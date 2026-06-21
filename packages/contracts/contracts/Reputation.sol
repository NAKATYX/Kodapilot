// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Reputation is Ownable {
  struct ReputationEntry {
    int256 delta;
    string reason;
    uint256 timestamp;
  }

  mapping(address => int256) public reputation;
  mapping(address => ReputationEntry[]) public auditLog;
  mapping(address => bool) public authorizedCallers;

  uint256 public minReputationThreshold = 10;
  uint256 public maxReputationCap = 1000;

  event ReputationCredited(
    address indexed vendor,
    uint256 amount,
    string reason,
    int256 newScore
  );
  event ReputationDebited(
    address indexed vendor,
    uint256 amount,
    string reason,
    int256 newScore
  );
  event GenuinessStatusChanged(address indexed vendor, bool isGenuine);
  event AuthorizationChanged(address indexed caller, bool authorized);
  event ThresholdUpdated(uint256 newThreshold);

  modifier onlyAuthorized() {
    require(
      authorizedCallers[msg.sender] || msg.sender == owner(),
      "Not authorized"
    );
    _;
  }

  constructor() Ownable(msg.sender) {}

  function setAuthorized(address caller, bool authorized) external onlyOwner {
    authorizedCallers[caller] = authorized;
    emit AuthorizationChanged(caller, authorized);
  }

  function setMinReputationThreshold(uint256 threshold) external onlyOwner {
    minReputationThreshold = threshold;
    emit ThresholdUpdated(threshold);
  }

  function creditReputation(
    address vendor,
    uint256 amount,
    string calldata reason
  ) external onlyAuthorized {
    require(vendor != address(0), "Invalid vendor");
    require(amount > 0, "Amount must be positive");

    int256 delta = int256(amount);
    int256 newScore = reputation[vendor] + delta;

    if (newScore > int256(maxReputationCap)) {
      newScore = int256(maxReputationCap);
    }

    int256 actualDelta = newScore - reputation[vendor];
    reputation[vendor] = newScore;

    auditLog[vendor].push(
      ReputationEntry({delta: actualDelta, reason: reason, timestamp: block.timestamp})
    );

    bool wasGenuine = reputation[vendor] - actualDelta >=
      int256(minReputationThreshold);
    bool nowGenuine = newScore >= int256(minReputationThreshold);
    if (wasGenuine != nowGenuine) {
      emit GenuinessStatusChanged(vendor, nowGenuine);
    }

    emit ReputationCredited(vendor, amount, reason, newScore);
  }

  function debitReputation(
    address vendor,
    uint256 amount,
    string calldata reason
  ) external onlyAuthorized {
    require(vendor != address(0), "Invalid vendor");
    require(amount > 0, "Amount must be positive");

    int256 delta = -int256(amount);
    int256 newScore = reputation[vendor] + delta;

    if (newScore < 0) {
      newScore = 0;
    }

    int256 actualDelta = newScore - reputation[vendor];
    reputation[vendor] = newScore;

    auditLog[vendor].push(
      ReputationEntry({delta: actualDelta, reason: reason, timestamp: block.timestamp})
    );

    bool wasGenuine = reputation[vendor] - actualDelta >=
      int256(minReputationThreshold);
    bool nowGenuine = newScore >= int256(minReputationThreshold);
    if (wasGenuine != nowGenuine) {
      emit GenuinessStatusChanged(vendor, nowGenuine);
    }

    emit ReputationDebited(vendor, amount, reason, newScore);
  }

  function getReputation(address vendor) external view returns (int256) {
    return reputation[vendor];
  }

  function isGenuine(address vendor) external view returns (bool) {
    return reputation[vendor] >= int256(minReputationThreshold);
  }

  function getAuditLogLength(address vendor) external view returns (uint256) {
    return auditLog[vendor].length;
  }

  function getAuditLogEntry(
    address vendor,
    uint256 index
  ) external view returns (ReputationEntry memory) {
    require(index < auditLog[vendor].length, "Index out of bounds");
    return auditLog[vendor][index];
  }
}
