import { ethers } from 'ethers';

interface RootHashData {
  rootHash: string;
  timestamp: number;
}

export class StorageClient {
  private indexerUrl: string;
  private flowContract: string;

  constructor(indexerUrl: string, flowContract: string) {
    this.indexerUrl = indexerUrl;
    this.flowContract = flowContract;
  }

  /**
   * Submit a KV pair to 0G Storage and return root hash
   */
  async submitRootHash(
    path: string,
    data: Record<string, any>
  ): Promise<{ rootHash: string; expiry: number }> {
    const dataStr = JSON.stringify(data);
    const hash = ethers.keccak256(ethers.toUtf8Bytes(dataStr));

    // For now, simulate root hash by hashing path + data
    // In production, this would submit to 0G Storage SDK
    const rootHash = ethers.keccak256(
      ethers.toUtf8Bytes(`${path}:${dataStr}`)
    );

    const expiry = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60; // 1 year

    console.log(`📦 Stored ${path} → ${rootHash}`);

    return { rootHash, expiry };
  }

  /**
   * Query root hash from 0G Storage indexer
   */
  async getRootHash(path: string): Promise<RootHashData | null> {
    try {
      // In production, query the actual 0G Storage indexer
      // For now, return simulated data
      const response = await fetch(
        `${this.indexerUrl}/storage/root/${this.flowContract}/${path}`
      );

      if (!response.ok) {
        return null;
      }

      const data = (await response.json()) as Record<string, any>;
      return {
        rootHash: (data.root_hash || data.rootHash) as string,
        timestamp: (data.timestamp || Math.floor(Date.now() / 1000)) as number,
      };
    } catch (err) {
      console.warn(`Failed to fetch root hash for ${path}:`, err);
      return null;
    }
  }

  /**
   * Store order snapshot and return root hash
   */
  async storeOrder(
    orderId: string,
    orderData: {
      buyer: string;
      vendor: string;
      amount: bigint;
      status: number;
      timestamp: number;
    }
  ): Promise<string> {
    const path = `orders/${orderId}`;
    const result = await this.submitRootHash(path, {
      ...orderData,
      amount: orderData.amount.toString(),
    });
    return result.rootHash;
  }

  /**
   * Store reputation snapshot and return root hash
   */
  async storeReputation(
    vendor: string,
    score: bigint,
    isGenuine: boolean,
    timestamp: number
  ): Promise<string> {
    const path = `reputation/${vendor}`;
    const result = await this.submitRootHash(path, {
      score: score.toString(),
      isGenuine,
      timestamp,
    });
    return result.rootHash;
  }

  /**
   * Store split payout record and return root hash
   */
  async storeSplit(
    orderId: string,
    splitData: {
      reseller: string;
      vendor: string;
      resalePayout: bigint;
      vendorPayout: bigint;
      referralPayouts: bigint[];
      treasuryPayout: bigint;
      timestamp: number;
    }
  ): Promise<string> {
    const path = `splits/${orderId}`;
    const result = await this.submitRootHash(path, {
      ...splitData,
      resalePayout: splitData.resalePayout.toString(),
      vendorPayout: splitData.vendorPayout.toString(),
      referralPayouts: splitData.referralPayouts.map(p => p.toString()),
      treasuryPayout: splitData.treasuryPayout.toString(),
    });
    return result.rootHash;
  }

  /**
   * Verify a root hash against stored data
   */
  async verifyRootHash(
    path: string,
    data: Record<string, any>,
    expectedHash: string
  ): Promise<boolean> {
    const dataStr = JSON.stringify(data);
    const computedHash = ethers.keccak256(
      ethers.toUtf8Bytes(`${path}:${dataStr}`)
    );
    return computedHash === expectedHash;
  }

  /**
   * Get audit trail for an entity (orders, reputation changes, etc)
   */
  async getAuditTrail(entityType: string, entityId: string): Promise<any[]> {
    try {
      // In production, query 0G Storage for all entries matching pattern
      // For now, return empty array
      return [];
    } catch (err) {
      console.warn(`Failed to fetch audit trail for ${entityType}/${entityId}:`, err);
      return [];
    }
  }
}
