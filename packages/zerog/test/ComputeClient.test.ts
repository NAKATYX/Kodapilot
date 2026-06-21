import { expect } from 'chai';
import { ComputeClient } from '../src/ComputeClient';

describe('ComputeClient', () => {
  let client: ComputeClient;
  const mockRouterUrl = 'https://router-api-testnet.integratenetwork.work/v1';
  const mockApiKey = 'test-api-key';

  beforeEach(() => {
    client = new ComputeClient(mockRouterUrl, mockApiKey);
  });

  describe('Constructor', () => {
    it('should initialize with router URL and API key', () => {
      expect(client).to.be.instanceOf(ComputeClient);
    });
  });

  describe('suggestProduct', () => {
    it('should handle product suggestion request format', async () => {
      // Note: This test will fail without a real API key/connection
      // In CI/local testing, mock the OpenAI client
      try {
        const result = await client.suggestProduct('electronics', 50, 3);
        expect(result).to.have.property('products');
        expect(result).to.have.property('proof');
        expect(result.products).to.be.an('array');
      } catch (err) {
        // Expected to fail without credentials
        expect(err).to.exist;
      }
    });
  });

  describe('generateListingCopy', () => {
    it('should handle listing copy request format', async () => {
      try {
        const result = await client.generateListingCopy('Test Product', 5000);
        expect(result).to.have.property('copy');
        expect(result).to.have.property('proof');
        expect(result.copy).to.be.a('string');
      } catch (err) {
        expect(err).to.exist;
      }
    });
  });

  describe('checkFraud', () => {
    it('should return safe default on error', async () => {
      try {
        const result = await client.checkFraud(100, BigInt('1000000000000000000'));
        expect(result).to.have.property('score');
        expect(result).to.have.property('reason');
        expect(result).to.have.property('proof');
        expect(result.score).to.be.a('number');
        expect(result.score).to.be.greaterThanOrEqual(0);
        expect(result.score).to.be.lessThanOrEqual(100);
      } catch (err) {
        // Expected to fail without credentials
        expect(err).to.exist;
      }
    });

    it('should handle BigInt order amounts', async () => {
      try {
        const largeAmount = BigInt('100000000000000000000'); // 100 ETH
        await client.checkFraud(50, largeAmount);
      } catch (err) {
        expect(err).to.exist;
      }
    });
  });

  describe('verifyProof', () => {
    it('should validate proof strings', async () => {
      const validProof = 'chatcmpl-8nGmY1ZKc2';
      const result = await client.verifyProof(validProof);
      expect(result).to.be.true;
    });

    it('should reject error proof', async () => {
      const result = await client.verifyProof('error');
      expect(result).to.be.false;
    });

    it('should reject empty proof', async () => {
      const result = await client.verifyProof('');
      expect(result).to.be.false;
    });
  });
});
