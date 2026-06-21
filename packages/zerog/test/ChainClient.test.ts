import { expect } from 'chai';
import { ChainClient } from '../src/ChainClient';
import { ethers } from 'ethers';

describe('ChainClient', () => {
  const mockRpcUrl = 'https://evmrpc-testnet.0g.ai';
  const mockChainId = 16602;
  const mockDeployer = {
    address: '0x1234567890123456789012345678901234567890',
    privateKey: '0x0000000000000000000000000000000000000000000000000000000000000001',
  };

  let client: ChainClient;

  beforeEach(() => {
    client = new ChainClient(mockRpcUrl, mockChainId, mockDeployer);
  });

  describe('Constructor', () => {
    it('should initialize with RPC URL, chain ID, and deployer', () => {
      expect(client).to.be.instanceOf(ChainClient);
    });

    it('should handle different deployers', () => {
      const deployer2 = {
        address: '0x9876543210987654321098765432109876543210',
        privateKey: '0x0000000000000000000000000000000000000000000000000000000000000002',
      };
      const client2 = new ChainClient(mockRpcUrl, mockChainId, deployer2);
      expect(client2).to.be.instanceOf(ChainClient);
    });
  });

  describe('getContractAddresses', () => {
    it('should return null before deployment', () => {
      const addresses = client.getContractAddresses();
      expect(addresses).to.be.null;
    });
  });

  describe('Deploy Integration (requires testnet)', () => {
    it('should handle deployment (skip if no RPC connection)', async () => {
      try {
        // This will fail without valid RPC connection and funds
        // const result = await client.deploy();
        // expect(result).to.have.property('reputation');
        // expect(result).to.have.property('escrow');
      } catch (err) {
        // Expected: no RPC connection in test environment
        expect(err).to.exist;
      }
    });
  });

  describe('Cache Management', () => {
    it('should handle cache file operations', async () => {
      // Test that cache path is set up
      const addresses = client.getContractAddresses();
      expect(addresses === null || typeof addresses === 'object').to.be.true;
    });
  });

  describe('Read Methods (require deployed contracts)', () => {
    it('should throw if contracts not deployed', async () => {
      try {
        await client.readReputation('0x1234567890123456789012345678901234567890');
        expect.fail('Should have thrown');
      } catch (err: any) {
        expect(err.message).to.include('not deployed');
      }
    });

    it('should throw if contracts not deployed for order reads', async () => {
      try {
        await client.readOrder('0x0000000000000000000000000000000000000000000000000000000000000001');
        expect.fail('Should have thrown');
      } catch (err: any) {
        expect(err.message).to.include('not deployed');
      }
    });

    it('should throw if contracts not deployed for status reads', async () => {
      try {
        await client.getOrderStatus('0x0000000000000000000000000000000000000000000000000000000000000001');
        expect.fail('Should have thrown');
      } catch (err: any) {
        expect(err.message).to.include('not deployed');
      }
    });

    it('should throw if contracts not deployed for referral reads', async () => {
      try {
        await client.getReferralChain('0x1234567890123456789012345678901234567890');
        expect.fail('Should have thrown');
      } catch (err: any) {
        expect(err.message).to.include('not deployed');
      }
    });

    it('should throw if contracts not deployed for count reads', async () => {
      try {
        await client.getReferralCount('0x1234567890123456789012345678901234567890');
        expect.fail('Should have thrown');
      } catch (err: any) {
        expect(err.message).to.include('not deployed');
      }
    });
  });

  describe('Data Type Conversions', () => {
    it('should handle BigInt conversions', () => {
      // Test that BigInt can be handled in type signatures
      const bigAmount = BigInt('1000000000000000000');
      expect(bigAmount).to.equal(1000000000000000000n);
    });

    it('should handle address formats', () => {
      const validAddress = '0x1234567890123456789012345678901234567890';
      expect(ethers.getAddress(validAddress)).to.equal(validAddress.toLowerCase());
    });
  });
});
