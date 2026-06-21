import { Contract, Provider, Signer, ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';

interface DeployedContracts {
  reputation: string;
  referralRegistry: string;
  splitPayout: string;
  escrow: string;
}

interface OrderData {
  buyer: string;
  vendor: string;
  reseller: string;
  amount: bigint;
  status: number;
  depositedAt: bigint;
  deliveredAt: bigint;
  releasedAt: bigint;
}

interface ReputationData {
  score: bigint;
  isGenuine: boolean;
}

export class ChainClient {
  private provider: Provider;
  private signer: Signer;
  private deployer: string;
  private cacheFile: string;
  private contractAddresses: DeployedContracts | null = null;

  constructor(
    rpcUrl: string,
    chainId: number,
    deployer: { address: string; privateKey: string }
  ) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl, chainId);
    this.signer = new ethers.Wallet(deployer.privateKey, this.provider);
    this.deployer = deployer.address;
    this.cacheFile = path.join(process.cwd(), 'contracts.json');
    this.loadCache();
  }

  private loadCache(): void {
    try {
      if (fs.existsSync(this.cacheFile)) {
        const data = fs.readFileSync(this.cacheFile, 'utf-8');
        this.contractAddresses = JSON.parse(data);
      }
    } catch (err) {
      console.warn('Failed to load contract cache:', err);
    }
  }

  private saveCache(): void {
    try {
      fs.writeFileSync(this.cacheFile, JSON.stringify(this.contractAddresses, null, 2));
    } catch (err) {
      console.error('Failed to save contract cache:', err);
    }
  }

  async deploy(): Promise<DeployedContracts> {
    throw new Error(
      'Deployment via ChainClient not supported. Use hardhat: pnpm hardhat run scripts/deploy.ts --network 0g-testnet'
    );
  }

  getContractAddresses(): DeployedContracts | null {
    return this.contractAddresses;
  }

  async readReputation(vendor: string): Promise<ReputationData> {
    if (!this.contractAddresses) {
      throw new Error('Contracts not deployed. Call deploy() first.');
    }

    // Simple ABI for reading reputation
    const abi = [
      'function reputation(address) view returns (int256)',
      'function isGenuine(address) view returns (bool)',
    ];

    const contract = new Contract(this.contractAddresses.reputation, abi, this.provider);
    const score = await contract.reputation(vendor);
    const isGenuine = await contract.isGenuine(vendor);

    return { score: BigInt(score.toString()), isGenuine };
  }

  async readOrder(orderId: string): Promise<OrderData | null> {
    if (!this.contractAddresses) {
      throw new Error('Contracts not deployed. Call deploy() first.');
    }

    const abi = [
      'function getOrder(bytes32) view returns (tuple(address buyer, address vendor, address reseller, uint256 amount, uint8 status, uint256 depositedAt, uint256 deliveredAt, uint256 releasedAt, string refundReason))',
    ];

    const contract = new Contract(this.contractAddresses.escrow, abi, this.provider);

    try {
      const order = await contract.getOrder(orderId);

      if (order.buyer === ethers.ZeroAddress) {
        return null;
      }

      return {
        buyer: order.buyer,
        vendor: order.vendor,
        reseller: order.reseller,
        amount: BigInt(order.amount.toString()),
        status: order.status,
        depositedAt: BigInt(order.depositedAt.toString()),
        deliveredAt: BigInt(order.deliveredAt.toString()),
        releasedAt: BigInt(order.releasedAt.toString()),
      };
    } catch (err) {
      return null;
    }
  }

  async getOrderStatus(orderId: string): Promise<number | null> {
    if (!this.contractAddresses) {
      throw new Error('Contracts not deployed. Call deploy() first.');
    }

    const abi = ['function getOrderStatus(bytes32) view returns (uint8)'];
    const contract = new Contract(this.contractAddresses.escrow, abi, this.provider);

    try {
      const status = await contract.getOrderStatus(orderId);
      return status;
    } catch (err) {
      return null;
    }
  }

  async getReferralChain(vendor: string): Promise<string[]> {
    if (!this.contractAddresses) {
      throw new Error('Contracts not deployed. Call deploy() first.');
    }

    const abi = ['function getReferralChain(address) view returns (address[])'];
    const contract = new Contract(this.contractAddresses.referralRegistry, abi, this.provider);

    return await contract.getReferralChain(vendor);
  }

  async getReferralCount(vendor: string): Promise<bigint> {
    if (!this.contractAddresses) {
      throw new Error('Contracts not deployed. Call deploy() first.');
    }

    const abi = ['function getReferralCount(address) view returns (uint256)'];
    const contract = new Contract(this.contractAddresses.referralRegistry, abi, this.provider);

    const count = await contract.getReferralCount(vendor);
    return BigInt(count.toString());
  }
}
