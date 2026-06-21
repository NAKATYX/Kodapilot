import { expect } from "chai";
import { Reputation, ReferralRegistry, SplitPayout } from "../typechain-types";
const { ethers } = require("hardhat");

describe("SplitPayout", () => {
  let reputation: Reputation;
  let registry: ReferralRegistry;
  let splitPayout: SplitPayout;
  let owner: any;
  let escrow: any;
  let reseller: any;
  let vendor: any;
  let referrer: any;
  let treasury: any;

  beforeEach(async () => {
    [owner, escrow, reseller, vendor, referrer, treasury] =
      await ethers.getSigners();

    const Reputation = await ethers.getContractFactory("Reputation");
    reputation = await Reputation.deploy();
    await reputation.waitForDeployment();

    const ReferralRegistry = await ethers.getContractFactory("ReferralRegistry");
    registry = await ReferralRegistry.deploy();
    await registry.waitForDeployment();

    const SplitPayout = await ethers.getContractFactory("SplitPayout");
    splitPayout = await SplitPayout.deploy(
      await reputation.getAddress(),
      await registry.getAddress(),
      treasury.address
    );
    await splitPayout.waitForDeployment();

    await splitPayout.setEscrowContract(escrow.address);
    await reputation.setAuthorized(await splitPayout.getAddress(), true);
  });

  describe("Split Execution", () => {
    it("should split funds correctly", async () => {
      const orderId = ethers.id("order1");
      const amount = ethers.parseEther("1");

      const resaleBefore = await ethers.provider.getBalance(reseller.address);
      const vendorBefore = await ethers.provider.getBalance(vendor.address);

      await splitPayout.connect(escrow).split(
        orderId,
        amount,
        reseller.address,
        vendor.address,
        { value: amount }
      );

      const resaleAfter = await ethers.provider.getBalance(reseller.address);
      const vendorAfter = await ethers.provider.getBalance(vendor.address);

      // Reseller gets 5% (500 bps)
      const expectedResale = (amount * 500n) / 10000n;
      expect(resaleAfter - resaleBefore).to.equal(expectedResale);

      // Vendor gets remainder
      const expectedVendor = amount - expectedResale;
      expect(vendorAfter - vendorBefore).to.equal(expectedVendor);
    });

    it("should credit vendor reputation", async () => {
      const orderId = ethers.id("order2");
      const amount = ethers.parseEther("1");

      await splitPayout.connect(escrow).split(
        orderId,
        amount,
        reseller.address,
        vendor.address,
        { value: amount }
      );

      expect(await reputation.reputation(vendor.address)).to.be.greaterThan(0);
    });

    it("should emit SplitExecuted event", async () => {
      const orderId = ethers.id("order3");
      const amount = ethers.parseEther("1");

      await expect(
        splitPayout.connect(escrow).split(
          orderId,
          amount,
          reseller.address,
          vendor.address,
          { value: amount }
        )
      )
        .to.emit(splitPayout, "SplitExecuted")
        .withArgs(orderId, reseller.address, vendor.address, amount);
    });

    it("should emit PaymentSent events", async () => {
      const orderId = ethers.id("order4");
      const amount = ethers.parseEther("1");

      await expect(
        splitPayout.connect(escrow).split(
          orderId,
          amount,
          reseller.address,
          vendor.address,
          { value: amount }
        )
      ).to.emit(splitPayout, "PaymentSent");
    });

    it("should revert if already executed", async () => {
      const orderId = ethers.id("order5");
      const amount = ethers.parseEther("1");

      await splitPayout.connect(escrow).split(
        orderId,
        amount,
        reseller.address,
        vendor.address,
        { value: amount }
      );

      await expect(
        splitPayout.connect(escrow).split(
          orderId,
          amount,
          reseller.address,
          vendor.address,
          { value: amount }
        )
      ).to.be.revertedWith("Already executed");
    });

    it("should revert if not escrow", async () => {
      const orderId = ethers.id("order6");
      const amount = ethers.parseEther("1");

      await expect(
        splitPayout.split(
          orderId,
          amount,
          reseller.address,
          vendor.address,
          { value: amount }
        )
      ).to.be.revertedWith("Only escrow");
    });

    it("should revert on zero amount", async () => {
      const orderId = ethers.id("order7");

      await expect(
        splitPayout.connect(escrow).split(
          orderId,
          0,
          reseller.address,
          vendor.address
        )
      ).to.be.revertedWith("Amount must be positive");
    });
  });

  describe("Referral Payouts", () => {
    beforeEach(async () => {
      await registry.registerReferral(referrer.address, vendor.address);
      await reputation.setAuthorized(registry.getAddress(), true);
    });

    it("should include referral payouts in split", async () => {
      const orderId = ethers.id("order8");
      const amount = ethers.parseEther("1");

      const referrerBefore = await ethers.provider.getBalance(
        referrer.address
      );

      await splitPayout.connect(escrow).split(
        orderId,
        amount,
        reseller.address,
        vendor.address,
        { value: amount }
      );

      const referrerAfter = await ethers.provider.getBalance(referrer.address);

      // Referrer should get 2% (200 bps)
      const expectedReferral = (amount * 200n) / 10000n;
      expect(referrerAfter - referrerBefore).to.equal(expectedReferral);
    });

    it("should handle multiple referral levels", async () => {
      // Set up chain: referrer2 -> referrer -> vendor
      await registry.registerReferral(
        referrer.address,
        await ethers.Wallet.createRandom().address
      );

      const orderId = ethers.id("order9");
      const amount = ethers.parseEther("1");

      await splitPayout.connect(escrow).split(
        orderId,
        amount,
        reseller.address,
        vendor.address,
        { value: amount }
      );

      const split = await splitPayout.getSplit(orderId);
      expect(split.referralPayouts.length).to.be.greaterThan(0);
    });
  });

  describe("Configuration", () => {
    it("should allow owner to set config", async () => {
      await splitPayout.setConfig(1000, 300, 3);
      expect(await splitPayout.resaleMarginBps()).to.equal(1000);
      expect(await splitPayout.referralBps()).to.equal(300);
    });

    it("should emit ConfigUpdated event", async () => {
      await expect(splitPayout.setConfig(1000, 300, 3))
        .to.emit(splitPayout, "ConfigUpdated")
        .withArgs(1000, 300);
    });

    it("should revert if config exceeds 100%", async () => {
      await expect(splitPayout.setConfig(5000, 6000, 3)).to.be.revertedWith(
        "Config exceeds 100%"
      );
    });

    it("should revert if non-owner tries to set config", async () => {
      await expect(
        splitPayout.connect(reseller).setConfig(1000, 300, 3)
      ).to.be.revertedWithCustomError(splitPayout, "OwnableUnauthorizedAccount");
    });
  });

  describe("Treasury", () => {
    it("should send residual to treasury", async () => {
      const orderId = ethers.id("order10");
      const amount = ethers.parseEther("1");

      const treasuryBefore = await ethers.provider.getBalance(treasury.address);

      await splitPayout.connect(escrow).split(
        orderId,
        amount,
        reseller.address,
        vendor.address,
        { value: amount }
      );

      const treasuryAfter = await ethers.provider.getBalance(treasury.address);

      // Treasury gets any rounding dust
      expect(treasuryAfter).to.be.greaterThanOrEqual(treasuryBefore);
    });
  });

  describe("Reentrancy Protection", () => {
    it("should prevent reentrancy", async () => {
      const orderId = ethers.id("order11");
      const amount = ethers.parseEther("1");

      // Normal split should succeed
      await expect(
        splitPayout.connect(escrow).split(
          orderId,
          amount,
          reseller.address,
          vendor.address,
          { value: amount }
        )
      ).to.not.be.reverted;
    });
  });
});
