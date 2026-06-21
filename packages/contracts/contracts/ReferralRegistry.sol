// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ReferralRegistry is Ownable {
  mapping(address => address) public referrers;
  mapping(address => uint256) public referralCounts;
  mapping(address => bool) public registered;

  uint256 public maxChainDepth = 5;

  event ReferralRegistered(
    address indexed referrer,
    address indexed referree
  );
  event MaxChainDepthUpdated(uint256 newDepth);

  constructor() Ownable(msg.sender) {}

  function setMaxChainDepth(uint256 depth) external onlyOwner {
    require(depth > 0, "Depth must be positive");
    maxChainDepth = depth;
    emit MaxChainDepthUpdated(depth);
  }

  function registerReferral(address referrer, address referree) external {
    require(referrer != address(0), "Invalid referrer");
    require(referree != address(0), "Invalid referree");
    require(referrer != referree, "Cannot self-refer");
    require(!registered[referree], "Already registered");

    referrers[referree] = referrer;
    referralCounts[referrer]++;
    registered[referree] = true;

    emit ReferralRegistered(referrer, referree);
  }

  function getReferrer(address account) external view returns (address) {
    return referrers[account];
  }

  function getReferralChain(address account)
    external
    view
    returns (address[] memory)
  {
    address[] memory chain = new address[](maxChainDepth);
    uint256 count = 0;
    address current = account;

    while (current != address(0) && count < maxChainDepth) {
      current = referrers[current];
      if (current != address(0)) {
        chain[count] = current;
        count++;
      }
    }

    address[] memory result = new address[](count);
    for (uint256 i = 0; i < count; i++) {
      result[i] = chain[i];
    }

    return result;
  }

  function getReferralCount(address account) external view returns (uint256) {
    return referralCounts[account];
  }

  function isRegistered(address account) external view returns (bool) {
    return registered[account];
  }
}
