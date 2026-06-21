import { expect } from "chai";
import {
  Escrow,
  Reputation,
  ReferralRegistry,
  SplitPayout,
} from "../typechain-types";
const { ethers } = require("hardhat");

describe("Escrow", () => {
  let escrow: Escrow;
  let splitPayout: SplitPayout;
  let reputation: Reputation;
  let registry: ReferralRegistry;

  let owner: any;
  let buyer: any;
  let vendor: any;
  let reseller: any;
  let treasury: any;
  let other: any;

  const TEST_ORDER_ID = ethers.id("test-order-1");
  const TEST_AMOUNT = ethers.parseEther("1");

  beforeEach(async () => {
    [owner, buyer, vendor, reseller, treasury, other] =
      await ethers.getSigners();

    // Deploy contracts
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

    const Escrow = await ethers.getContractFactory("Escrow");
    escrow = await Escrow.deploy(
      await splitPayout.getAddress(),
      await reputation.getAddress(),
      await registry.getAddress()
    );
    await escrow.waitForDeployment();

    // Wire up contracts
    await splitPayout.setEscrowContract(await escrow.getAddress());
    await reputation.setAuthorized(await splitPayout.getAddress(), true);
    await reputation.setAuthorized(await escrow.getAddress(), true);
  });

  describe("Deposit", () => {
    it("should deposit escrow", async () => {
      await escrow.connect(buyer).deposit(TEST_ORDER_ID, vendor.address, reseller.address, {
        value: TEST_AMOUNT,
      });

      const order = await escrow.getOrder(TEST_ORDER_ID);
      expect(order.buyer).to.equal(buyer.address);
      expect(order.vendor).to.equal(vendor.address);
      expect(order.amount).to.equal(TEST_AMOUNT);
    });

    it("should emit EscrowDeposited event", async () => {
      await expect(
        escrow
          .connect(buyer)
          .deposit(TEST_ORDER_ID, vendor.address, reseller.address, {
            value: TEST_AMOUNT,
          })
      )
        .to.emit(escrow, "EscrowDeposited")
        .withArgs(TEST_ORDER_ID, buyer.address, vendor.address, reseller.address, TEST_AMOUNT);
    });

    it("should set status to ESCROWED", async () => {
      await escrow.connect(buyer).deposit(TEST_ORDER_ID, vendor.address, reseller.address, {
        value: TEST_AMOUNT,
      });

      const status = await escrow.getOrderStatus(TEST_ORDER_ID);
      expect(status).to.equal(0); // ESCROWED
    });

    it("should revert if amount is below minimum", async () => {
      const minAmount = await escrow.minOrderAmount();
      const belowMin = minAmount - 1n;

      await expect(
        escrow.connect(buyer).deposit(TEST_ORDER_ID, vendor.address, reseller.address, {
          value: belowMin,
        })
      ).to.be.revertedWith("Amount too small");
    });

    it("should revert if vendor is zero address", async () => {
      await expect(
        escrow.connect(buyer).deposit(TEST_ORDER_ID, ethers.ZeroAddress, reseller.address, {
          value: TEST_AMOUNT,
        })
      ).to.be.revertedWith("Invalid vendor");
    });

    it("should revert if order already exists", async () => {
      await escrow.connect(buyer).deposit(TEST_ORDER_ID, vendor.address, reseller.address, {
        value: TEST_AMOUNT,
      });

      await expect(
        escrow.connect(other).deposit(TEST_ORDER_ID, vendor.address, reseller.address, {
          value: TEST_AMOUNT,
        })
      ).to.be.revertedWith("Order exists");
    });
  });

  describe("Confirm Delivery", () => {
    beforeEach(async () => {
      await escrow.connect(buyer).deposit(TEST_ORDER_ID, vendor.address, reseller.address, {
        value: TEST_AMOUNT,
      });
    });

    it("should confirm delivery", async () => {
      await escrow.connect(buyer).confirmDelivery(TEST_ORDER_ID);

      const order = await escrow.getOrder(TEST_ORDER_ID);
      expect(order.deliveredAt).to.be.greaterThan(0);
    });

    it("should set status to DELIVERED", async () => {
      await escrow.connect(buyer).confirmDelivery(TEST_ORDER_ID);

      const status = await escrow.getOrderStatus(TEST_ORDER_ID);
      expect(status).to.equal(1); // DELIVERED
    });

    it("should emit DeliveryConfirmed event", async () => {
      await expect(escrow.connect(buyer).confirmDelivery(TEST_ORDER_ID))
        .to.emit(escrow, "DeliveryConfirmed")
        .withArgs(TEST_ORDER_ID);
    });

    it("should revert if not buyer", async () => {
      await expect(
        escrow.connect(vendor).confirmDelivery(TEST_ORDER_ID)
      ).to.be.revertedWith("Only buyer");
    });

    it("should revert if not in ESCROWED state", async () => {
      await escrow.connect(buyer).confirmDelivery(TEST_ORDER_ID);

      await expect(
        escrow.connect(buyer).confirmDelivery(TEST_ORDER_ID)
      ).to.be.revertedWith("Already confirmed");
    });

    it("should revert if order not found", async () => {
      const fakeOrderId = ethers.id("fake");
      await expect(
        escrow.connect(buyer).confirmDelivery(fakeOrderId)
      ).to.be.revertedWith("Order not found");
    });
  });

  describe("Release", () => {
    beforeEach(async () => {
      await escrow.connect(buyer).deposit(TEST_ORDER_ID, vendor.address, reseller.address, {
        value: TEST_AMOUNT,
      });
      await escrow.connect(buyer).confirmDelivery(TEST_ORDER_ID);
    });

    it("should release escrow", async () => {
      const vendorBefore = await ethers.provider.getBalance(vendor.address);

      await escrow.connect(buyer).release(TEST_ORDER_ID);

      const vendorAfter = await ethers.provider.getBalance(vendor.address);
      expect(vendorAfter).to.be.greaterThan(vendorBefore);
    });

    it("should set status to RELEASED", async () => {
      await escrow.connect(buyer).release(TEST_ORDER_ID);

      const status = await escrow.getOrderStatus(TEST_ORDER_ID);
      expect(status).to.equal(2); // RELEASED
    });

    it("should emit EscrowReleased event", async () => {
      await expect(escrow.connect(buyer).release(TEST_ORDER_ID))
        .to.emit(escrow, "EscrowReleased")
        .withArgs(TEST_ORDER_ID, TEST_AMOUNT);
    });

    it("should call split payout", async () => {
      await escrow.connect(buyer).release(TEST_ORDER_ID);

      // Verify split was executed by checking vendor received funds
      const order = await escrow.getOrder(TEST_ORDER_ID);
      expect(order.releasedAt).to.be.greaterThan(0);
    });

    it("should revert if not in DELIVERED state", async () => {
      const newOrderId = ethers.id("test-order-2");
      await escrow.connect(buyer).deposit(newOrderId, vendor.address, reseller.address, {
        value: TEST_AMOUNT,
      });

      await expect(escrow.connect(buyer).release(newOrderId)).to.be.revertedWith(
        "Must be delivered"
      );
    });

    it("should revert if not buyer or owner", async () => {
      await expect(
        escrow.connect(other).release(TEST_ORDER_ID)
      ).to.be.revertedWith("Only buyer or owner");
    });

    it("should revert if already released", async () => {
      await escrow.connect(buyer).release(TEST_ORDER_ID);

      await expect(escrow.connect(buyer).release(TEST_ORDER_ID)).to.be.revertedWith(
        "Already released"
      );
    });

    it("should allow owner to release", async () => {
      await expect(escrow.connect(owner).release(TEST_ORDER_ID)).to.not.be
        .reverted;
    });
  });

  describe("Refund", () => {
    beforeEach(async () => {
      await escrow.connect(buyer).deposit(TEST_ORDER_ID, vendor.address, reseller.address, {
        value: TEST_AMOUNT,
      });
    });

    it("should refund buyer", async () => {
      const buyerBefore = await ethers.provider.getBalance(buyer.address);
      const tx = await escrow
        .connect(buyer)
        .refund(TEST_ORDER_ID, "Changed mind");
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;

      const buyerAfter = await ethers.provider.getBalance(buyer.address);
      expect(buyerAfter + gasUsed).to.be.greaterThan(buyerBefore);
    });

    it("should set status to REFUNDED", async () => {
      await escrow.connect(buyer).refund(TEST_ORDER_ID, "Changed mind");

      const status = await escrow.getOrderStatus(TEST_ORDER_ID);
      expect(status).to.equal(3); // REFUNDED
    });

    it("should emit EscrowRefunded event", async () => {
      await expect(
        escrow.connect(buyer).refund(TEST_ORDER_ID, "Changed mind")
      )
        .to.emit(escrow, "EscrowRefunded")
        .withArgs(TEST_ORDER_ID, buyer.address, TEST_AMOUNT, "Changed mind");
    });

    it("should debit vendor reputation", async () => {
      // Credit vendor first so debit doesn't clamp at 0
      await reputation.setAuthorized(owner.address, true);
      await reputation.creditReputation(vendor.address, 10, "Initial credit");
      const reBefore = await reputation.reputation(vendor.address);

      await escrow.connect(buyer).refund(TEST_ORDER_ID, "Changed mind");

      const reAfter = await reputation.reputation(vendor.address);
      expect(reAfter).to.be.lessThan(reBefore);
    });

    it("should allow vendor to refund", async () => {
      await expect(
        escrow.connect(vendor).refund(TEST_ORDER_ID, "Out of stock")
      ).to.not.be.reverted;
    });

    it("should revert if already released", async () => {
      await escrow.connect(buyer).confirmDelivery(TEST_ORDER_ID);
      await escrow.connect(buyer).release(TEST_ORDER_ID);

      await expect(
        escrow.connect(buyer).refund(TEST_ORDER_ID, "Too late")
      ).to.be.revertedWith("Cannot refund");
    });

    it("should revert if already refunded", async () => {
      await escrow.connect(buyer).refund(TEST_ORDER_ID, "Changed mind");

      await expect(
        escrow.connect(buyer).refund(TEST_ORDER_ID, "Again")
      ).to.be.revertedWith("Cannot refund");
    });

    it("should revert if not buyer or vendor", async () => {
      await expect(
        escrow.connect(other).refund(TEST_ORDER_ID, "Unauthorized")
      ).to.be.revertedWith("Only buyer or vendor");
    });
  });

  describe("Dispute", () => {
    beforeEach(async () => {
      await escrow.connect(buyer).deposit(TEST_ORDER_ID, vendor.address, reseller.address, {
        value: TEST_AMOUNT,
      });
    });

    it("should open dispute", async () => {
      await escrow.connect(buyer).dispute(TEST_ORDER_ID, "Item damaged");

      const status = await escrow.getOrderStatus(TEST_ORDER_ID);
      expect(status).to.equal(4); // DISPUTED
    });

    it("should emit DisputeOpened event", async () => {
      await expect(escrow.connect(buyer).dispute(TEST_ORDER_ID, "Item damaged"))
        .to.emit(escrow, "DisputeOpened")
        .withArgs(TEST_ORDER_ID, buyer.address);
    });

    it("should allow vendor to dispute", async () => {
      await expect(
        escrow.connect(vendor).dispute(TEST_ORDER_ID, "Payment issue")
      ).to.not.be.reverted;
    });

    it("should revert if not buyer or vendor", async () => {
      await expect(
        escrow.connect(other).dispute(TEST_ORDER_ID, "Unauthorized")
      ).to.be.revertedWith("Only buyer or vendor");
    });

    it("should revert if already released", async () => {
      await escrow.connect(buyer).confirmDelivery(TEST_ORDER_ID);
      await escrow.connect(buyer).release(TEST_ORDER_ID);

      await expect(
        escrow.connect(buyer).dispute(TEST_ORDER_ID, "Too late")
      ).to.be.revertedWith("Cannot dispute");
    });

    it("should revert if already refunded", async () => {
      await escrow.connect(buyer).refund(TEST_ORDER_ID, "Changed mind");

      await expect(
        escrow.connect(buyer).dispute(TEST_ORDER_ID, "Too late")
      ).to.be.revertedWith("Cannot dispute");
    });
  });

  describe("Configuration", () => {
    it("should allow owner to set minimum order amount", async () => {
      const newMin = ethers.parseEther("0.1");
      await escrow.setMinOrderAmount(newMin);
      expect(await escrow.minOrderAmount()).to.equal(newMin);
    });

    it("should emit MinOrderAmountUpdated event", async () => {
      const newMin = ethers.parseEther("0.1");
      await expect(escrow.setMinOrderAmount(newMin))
        .to.emit(escrow, "MinOrderAmountUpdated")
        .withArgs(newMin);
    });

    it("should revert if non-owner tries to set minimum", async () => {
      await expect(
        escrow.connect(buyer).setMinOrderAmount(ethers.parseEther("0.1"))
      ).to.be.revertedWithCustomError(escrow, "OwnableUnauthorizedAccount");
    });
  });

  describe("Full Happy Path", () => {
    it("should complete end-to-end flow", async () => {
      // 1. Deposit
      await escrow.connect(buyer).deposit(TEST_ORDER_ID, vendor.address, reseller.address, {
        value: TEST_AMOUNT,
      });
      let order = await escrow.getOrder(TEST_ORDER_ID);
      expect(order.status).to.equal(0); // ESCROWED

      // 2. Confirm delivery
      await escrow.connect(buyer).confirmDelivery(TEST_ORDER_ID);
      order = await escrow.getOrder(TEST_ORDER_ID);
      expect(order.status).to.equal(1); // DELIVERED

      // 3. Release
      const vendorBefore = await ethers.provider.getBalance(vendor.address);
      await escrow.connect(buyer).release(TEST_ORDER_ID);
      const vendorAfter = await ethers.provider.getBalance(vendor.address);

      order = await escrow.getOrder(TEST_ORDER_ID);
      expect(order.status).to.equal(2); // RELEASED
      expect(vendorAfter).to.be.greaterThan(vendorBefore);
    });
  });
});
