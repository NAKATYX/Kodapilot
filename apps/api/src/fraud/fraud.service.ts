import { Injectable } from '@nestjs/common';
import { CheckFraudDto, FraudResponseDto } from './fraud.dto';
import { ChainClient, ComputeClient } from '@kodapilot/zerog';
import { ethers } from 'ethers';

@Injectable()
export class FraudService {
  private chainClient: ChainClient;
  private computeClient: ComputeClient;

  constructor() {
    const rpcUrl = process.env.OG_RPC_TESTNET || 'https://evmrpc-testnet.0g.ai';
    const chainId = parseInt(process.env.OG_CHAIN_ID_TESTNET || '16602');
    const deployerKey = process.env.DEPLOYER_PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000001';

    this.chainClient = new ChainClient(rpcUrl, chainId, {
      address: ethers.getAddress('0x0000000000000000000000000000000000000000'),
      privateKey: deployerKey,
    });

    const routerUrl = process.env.OG_COMPUTE_ROUTER || 'https://router-api-testnet.integratenetwork.work/v1';
    const apiKey = process.env.OG_COMPUTE_API_KEY || '';
    this.computeClient = new ComputeClient(routerUrl, apiKey);
  }

  async checkFraud(dto: CheckFraudDto): Promise<FraudResponseDto> {
    try {
      // Read vendor reputation from chain
      const rep = await this.chainClient.readReputation(ethers.getAddress(dto.vendor));
      const reputationScore = Number(rep.score);

      // Call compute client for fraud check
      const result = await this.computeClient.checkFraud(
        reputationScore,
        BigInt(dto.amount)
      );

      return {
        score: result.score,
        reason: result.reason,
        proof: result.proof,
        flagged: result.score > 70,
      };
    } catch (err) {
      console.error('Error checking fraud:', err);
      // Return conservative estimate on error
      return {
        score: 50,
        reason: 'Unable to assess risk; defaulting to moderate caution',
        proof: 'error',
        flagged: false,
      };
    }
  }

  async verifyProof(proof: string): Promise<boolean> {
    return await this.computeClient.verifyProof(proof);
  }
}
