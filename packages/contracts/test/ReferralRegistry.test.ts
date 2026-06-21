import { expect } from "chai";
import { ReferralRegistry } from "../typechain-types";
const { ethers } = require("hardhat");

describe("ReferralRegistry", () => {
  let registry: ReferralRegistry;
  let owner: any;
  let referrer: any;
  let referree: any;
  let chain: any[];

  beforeEach(async () => {
    [owner, referrer, referree, ...chain] = await ethers.getSigners();

    const ReferralRegistry = await ethers.getContractFactory("ReferralRegistry");
    registry = await ReferralRegistry.deploy();
    await registry.waitForDeployment();
  });

  describe("Register Referral", () => {
    it("should register a referral", async () => {
      await registry.registerReferral(referrer.address, referree.address);
      expect(await registry.getReferrer(referree.address)).to.equal(
        referrer.address
      );
    });

    it("should increment referral count", async () => {
      await registry.registerReferral(referrer.address, referree.address);
      expect(await registry.getReferralCount(referrer.address)).to.equal(1);
    });

    it("should emit ReferralRegistered event", async () => {
      await expect(registry.registerReferral(referrer.address, referree.address))
        .to.emit(registry, "ReferralRegistered")
        .withArgs(referrer.address, referree.address);
    });

    it("should mark account as registered", async () => {
      await registry.registerReferral(referrer.address, referree.address);
      expect(await registry.isRegistered(referree.address)).to.be.true;
    });

    it("should revert if already registered", async () => {
      await registry.registerReferral(referrer.address, referree.address);
      await expect(
        registry.registerReferral(chain[0].address, referree.address)
      ).to.be.revertedWith("Already registered");
    });

    it("should revert on self-referral", async () => {
      await expect(
        registry.registerReferral(referrer.address, referrer.address)
      ).to.be.revertedWith("Cannot self-refer");
    });

    it("should revert if referrer is zero address", async () => {
      await expect(
        registry.registerReferral(ethers.ZeroAddress, referree.address)
      ).to.be.revertedWith("Invalid referrer");
    });

    it("should revert if referree is zero address", async () => {
      await expect(
        registry.registerReferral(referrer.address, ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid referree");
    });
  });

  describe("Referral Chain", () => {
    beforeEach(async () => {
      // Build chain: chain[0] <- chain[1] <- chain[2] <- chain[3] <- chain[4]
      await registry.registerReferral(chain[0].address, chain[1].address);
      await registry.registerReferral(chain[1].address, chain[2].address);
      await registry.registerReferral(chain[2].address, chain[3].address);
      await registry.registerReferral(chain[3].address, chain[4].address);
    });

    it("should return empty chain for unregistered account", async () => {
      const result = await registry.getReferralChain(referrer.address);
      expect(result).to.have.lengthOf(0);
    });

    it("should return single parent", async () => {
      const result = await registry.getReferralChain(chain[1].address);
      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.equal(chain[0].address);
    });

    it("should return full chain up to depth", async () => {
      const result = await registry.getReferralChain(chain[4].address);
      expect(result).to.have.lengthOf(4);
      expect(result[0]).to.equal(chain[3].address);
      expect(result[1]).to.equal(chain[2].address);
      expect(result[2]).to.equal(chain[1].address);
      expect(result[3]).to.equal(chain[0].address);
    });

    it("should respect maxChainDepth", async () => {
      await registry.setMaxChainDepth(2);
      const result = await registry.getReferralChain(chain[4].address);
      expect(result).to.have.lengthOf(2);
      expect(result[0]).to.equal(chain[3].address);
      expect(result[1]).to.equal(chain[2].address);
    });
  });

  describe("Chain Depth Configuration", () => {
    it("should allow owner to set max depth", async () => {
      await registry.setMaxChainDepth(3);
      expect(await registry.maxChainDepth()).to.equal(3);
    });

    it("should emit MaxChainDepthUpdated event", async () => {
      await expect(registry.setMaxChainDepth(3))
        .to.emit(registry, "MaxChainDepthUpdated")
        .withArgs(3);
    });

    it("should revert if depth is zero", async () => {
      await expect(registry.setMaxChainDepth(0)).to.be.revertedWith(
        "Depth must be positive"
      );
    });

    it("should revert if non-owner tries to set depth", async () => {
      await expect(
        registry.connect(referrer).setMaxChainDepth(3)
      ).to.be.revertedWithCustomError(registry, "OwnableUnauthorizedAccount");
    });
  });

  describe("Edge Cases", () => {
    it("should handle large referral counts", async () => {
      for (let i = 0; i < 10; i++) {
        const signer = chain[i % 5];
        const referree = ethers.Wallet.createRandom().address;
        await registry.registerReferral(referrer.address, referree);
      }
      expect(await registry.getReferralCount(referrer.address)).to.equal(10);
    });

    it("should not affect unrelated accounts", async () => {
      await registry.registerReferral(referrer.address, referree.address);
      expect(await registry.getReferralCount(chain[0].address)).to.equal(0);
      expect(await registry.isRegistered(chain[0].address)).to.be.false;
    });
  });
});
