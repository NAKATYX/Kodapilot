import { expect } from "chai";
import { Reputation } from "../typechain-types";
const { ethers } = require("hardhat");

describe("Reputation", () => {
  let reputation: Reputation;
  let owner: any;
  let vendor: any;
  let caller: any;
  let other: any;

  beforeEach(async () => {
    [owner, vendor, caller, other] = await ethers.getSigners();

    const Reputation = await ethers.getContractFactory("Reputation");
    reputation = await Reputation.deploy();
    await reputation.waitForDeployment();
  });

  describe("Authorization", () => {
    it("should allow owner to authorize callers", async () => {
      await reputation.setAuthorized(caller.address, true);
      expect(await reputation.authorizedCallers(caller.address)).to.be.true;
    });

    it("should emit AuthorizationChanged event", async () => {
      await expect(reputation.setAuthorized(caller.address, true))
        .to.emit(reputation, "AuthorizationChanged")
        .withArgs(caller.address, true);
    });

    it("should revert if non-owner tries to authorize", async () => {
      await expect(
        reputation.connect(other).setAuthorized(caller.address, true)
      ).to.be.revertedWithCustomError(reputation, "OwnableUnauthorizedAccount");
    });
  });

  describe("Credit Reputation", () => {
    beforeEach(async () => {
      await reputation.setAuthorized(caller.address, true);
    });

    it("should credit reputation to vendor", async () => {
      await reputation.connect(caller).creditReputation(vendor.address, 10, "Delivery");
      expect(await reputation.reputation(vendor.address)).to.equal(10);
    });

    it("should cap reputation at maxReputationCap", async () => {
      await reputation.connect(caller).creditReputation(vendor.address, 1000, "Max");
      expect(await reputation.reputation(vendor.address)).to.equal(1000);

      await reputation.connect(caller).creditReputation(vendor.address, 100, "Over");
      expect(await reputation.reputation(vendor.address)).to.equal(1000);
    });

    it("should emit ReputationCredited event", async () => {
      await expect(
        reputation.connect(caller).creditReputation(vendor.address, 5, "Test")
      )
        .to.emit(reputation, "ReputationCredited")
        .withArgs(vendor.address, 5, "Test", 5);
    });

    it("should update audit log", async () => {
      await reputation.connect(caller).creditReputation(vendor.address, 10, "Delivery");
      const entry = await reputation.getAuditLogEntry(vendor.address, 0);
      expect(entry.delta).to.equal(10);
      expect(entry.reason).to.equal("Delivery");
    });

    it("should emit GenuinessStatusChanged when crossing threshold", async () => {
      await expect(
        reputation.connect(caller).creditReputation(vendor.address, 10, "Genuine")
      )
        .to.emit(reputation, "GenuinessStatusChanged")
        .withArgs(vendor.address, true);
    });

    it("should revert if amount is zero", async () => {
      await expect(
        reputation.connect(caller).creditReputation(vendor.address, 0, "Zero")
      ).to.be.revertedWith("Amount must be positive");
    });

    it("should revert if vendor is zero address", async () => {
      await expect(
        reputation.connect(caller).creditReputation(ethers.ZeroAddress, 10, "Bad")
      ).to.be.revertedWith("Invalid vendor");
    });

    it("should revert if caller is not authorized", async () => {
      await expect(
        reputation.connect(other).creditReputation(vendor.address, 10, "Bad")
      ).to.be.revertedWith("Not authorized");
    });
  });

  describe("Debit Reputation", () => {
    beforeEach(async () => {
      await reputation.setAuthorized(caller.address, true);
      await reputation.connect(caller).creditReputation(vendor.address, 50, "Initial");
    });

    it("should debit reputation from vendor", async () => {
      await reputation.connect(caller).debitReputation(vendor.address, 10, "Dispute");
      expect(await reputation.reputation(vendor.address)).to.equal(40);
    });

    it("should not go below zero", async () => {
      await reputation.connect(caller).debitReputation(vendor.address, 100, "Over");
      expect(await reputation.reputation(vendor.address)).to.equal(0);
    });

    it("should emit ReputationDebited event", async () => {
      await expect(
        reputation.connect(caller).debitReputation(vendor.address, 5, "Dispute")
      )
        .to.emit(reputation, "ReputationDebited")
        .withArgs(vendor.address, 5, "Dispute", 45);
    });

    it("should emit GenuinessStatusChanged when dropping below threshold", async () => {
      // Start at 50, debit to 9 (still above threshold of 10... wait, 9 is below 10)
      // Actually, debit 40 to bring to 10, then debit 1 more to bring below threshold
      await reputation.connect(caller).debitReputation(vendor.address, 40, "Bad");
      await expect(
        reputation.connect(caller).debitReputation(vendor.address, 1, "Terrible")
      )
        .to.emit(reputation, "GenuinessStatusChanged")
        .withArgs(vendor.address, false);
    });
  });

  describe("Genuineness", () => {
    beforeEach(async () => {
      await reputation.setAuthorized(caller.address, true);
    });

    it("should return true when reputation >= threshold", async () => {
      await reputation.connect(caller).creditReputation(vendor.address, 10, "Genuine");
      expect(await reputation.isGenuine(vendor.address)).to.be.true;
    });

    it("should return false when reputation < threshold", async () => {
      expect(await reputation.isGenuine(vendor.address)).to.be.false;
    });

    it("should return true after reaching threshold", async () => {
      await reputation.connect(caller).creditReputation(vendor.address, 5, "Half");
      expect(await reputation.isGenuine(vendor.address)).to.be.false;

      await reputation.connect(caller).creditReputation(vendor.address, 5, "Full");
      expect(await reputation.isGenuine(vendor.address)).to.be.true;
    });
  });

  describe("Threshold Configuration", () => {
    it("should allow owner to set minimum threshold", async () => {
      await reputation.setMinReputationThreshold(20);
      expect(await reputation.minReputationThreshold()).to.equal(20);
    });

    it("should emit ThresholdUpdated event", async () => {
      await expect(reputation.setMinReputationThreshold(20))
        .to.emit(reputation, "ThresholdUpdated")
        .withArgs(20);
    });

    it("should revert if non-owner tries to set threshold", async () => {
      await expect(
        reputation.connect(other).setMinReputationThreshold(20)
      ).to.be.revertedWithCustomError(reputation, "OwnableUnauthorizedAccount");
    });
  });

  describe("Audit Log", () => {
    beforeEach(async () => {
      await reputation.setAuthorized(caller.address, true);
    });

    it("should track multiple entries", async () => {
      await reputation.connect(caller).creditReputation(vendor.address, 10, "First");
      await reputation.connect(caller).creditReputation(vendor.address, 5, "Second");

      const length = await reputation.getAuditLogLength(vendor.address);
      expect(length).to.equal(2);

      const entry0 = await reputation.getAuditLogEntry(vendor.address, 0);
      const entry1 = await reputation.getAuditLogEntry(vendor.address, 1);

      expect(entry0.delta).to.equal(10);
      expect(entry1.delta).to.equal(5);
    });

    it("should revert on out of bounds access", async () => {
      await expect(
        reputation.getAuditLogEntry(vendor.address, 0)
      ).to.be.revertedWith("Index out of bounds");
    });
  });
});
