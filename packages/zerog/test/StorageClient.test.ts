import { expect } from 'chai';
import { StorageClient } from '../src/StorageClient';
import { ethers } from 'ethers';

describe('StorageClient', () => {
  let client: StorageClient;
  const mockIndexerUrl = 'https://indexer-storage-testnet-turbo.0g.ai';
  const mockFlowContract = '0x22E03a6A89B950F1c82ec5e74F8eCa321a105296';

  beforeEach(() => {
    client = new StorageClient(mockIndexerUrl, mockFlowContract);
  });

  describe('submitRootHash', () => {
    it('should generate root hash for order data', async () => {
      const orderData = {
        buyer: '0x1234567890123456789012345678901234567890',
        amount: '1000000000000000000',
        status: 0,
      };

      const result = await client.submitRootHash('orders/order1', orderData);

      expect(result.rootHash).to.be.a('string');
      expect(result.rootHash).to.have.length(66); // 0x + 64 hex chars
      expect(result.expiry).to.be.a('number');
      expect(result.expiry).to.be.greaterThan(Math.floor(Date.now() / 1000));
    });

    it('should generate consistent root hash for same data', async () => {
      const data = { test: 'data' };
      const result1 = await client.submitRootHash('path1', data);
      const result2 = await client.submitRootHash('path1', data);

      expect(result1.rootHash).to.equal(result2.rootHash);
    });

    it('should generate different hash for different data', async () => {
      const result1 = await client.submitRootHash('path1', { a: 1 });
      const result2 = await client.submitRootHash('path1', { a: 2 });

      expect(result1.rootHash).to.not.equal(result2.rootHash);
    });
  });

  describe('storeOrder', () => {
    it('should store order and return root hash', async () => {
      const orderData = {
        buyer: '0x1234567890123456789012345678901234567890',
        vendor: '0x0987654321098765432109876543210987654321',
        amount: BigInt('1000000000000000000'),
        status: 0,
        timestamp: Math.floor(Date.now() / 1000),
      };

      const rootHash = await client.storeOrder('order1', orderData);

      expect(rootHash).to.be.a('string');
      expect(rootHash).to.have.length(66);
    });

    it('should convert bigint amounts to strings', async () => {
      const orderData = {
        buyer: '0x1234567890123456789012345678901234567890',
        vendor: '0x0987654321098765432109876543210987654321',
        amount: BigInt('999999999999999999'),
        status: 1,
        timestamp: 1234567890,
      };

      const rootHash = await client.storeOrder('order2', orderData);
      expect(rootHash).to.be.a('string');
    });
  });

  describe('storeReputation', () => {
    it('should store reputation snapshot', async () => {
      const vendor = '0x1234567890123456789012345678901234567890';
      const rootHash = await client.storeReputation(
        vendor,
        BigInt(100),
        true,
        Math.floor(Date.now() / 1000)
      );

      expect(rootHash).to.be.a('string');
      expect(rootHash).to.have.length(66);
    });
  });

  describe('storeSplit', () => {
    it('should store split payout record', async () => {
      const splitData = {
        reseller: '0x1111111111111111111111111111111111111111',
        vendor: '0x2222222222222222222222222222222222222222',
        resalePayout: BigInt('50000000000000000'),
        vendorPayout: BigInt('850000000000000000'),
        referralPayouts: [BigInt('20000000000000000')],
        treasuryPayout: BigInt('80000000000000000'),
        timestamp: Math.floor(Date.now() / 1000),
      };

      const rootHash = await client.storeSplit('order3', splitData);

      expect(rootHash).to.be.a('string');
      expect(rootHash).to.have.length(66);
    });
  });

  describe('verifyRootHash', () => {
    it('should verify matching root hash', async () => {
      const data = { test: 'data' };
      const result = await client.submitRootHash('path1', data);

      const isValid = await client.verifyRootHash('path1', data, result.rootHash);
      expect(isValid).to.be.true;
    });

    it('should reject mismatched root hash', async () => {
      const data = { test: 'data' };
      const wrongHash = ethers.keccak256(ethers.toUtf8Bytes('wrong'));

      const isValid = await client.verifyRootHash('path1', data, wrongHash);
      expect(isValid).to.be.false;
    });

    it('should reject modified data', async () => {
      const data = { test: 'data' };
      const result = await client.submitRootHash('path1', data);

      const modifiedData = { test: 'modified' };
      const isValid = await client.verifyRootHash('path1', modifiedData, result.rootHash);
      expect(isValid).to.be.false;
    });
  });

  describe('getAuditTrail', () => {
    it('should return audit trail (placeholder)', async () => {
      const trail = await client.getAuditTrail('orders', 'order1');
      expect(trail).to.be.an('array');
    });
  });
});
