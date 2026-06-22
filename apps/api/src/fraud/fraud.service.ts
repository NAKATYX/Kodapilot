import { Injectable } from '@nestjs/common';
import { CheckFraudDto, FraudResponseDto } from './fraud.dto';
// import { ChainClient, ComputeClient } from '@kodapilot/zerog';
// import { ethers } from 'ethers';

@Injectable()
export class FraudService {
  // private chainClient: ChainClient;
  // private computeClient: ComputeClient;

  constructor() {
    // const rpcUrl = process.env.OG_RPC_TESTNET || 'https://evmrpc-testnet.0g.ai';
    // const chainId = parseInt(process.env.OG_CHAIN_ID_TESTNET || '16602');
    // const deployerKey = process.env.DEPLOYER_PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000001';

    // this.chainClient = new ChainClient(rpcUrl, chainId, {
    //   address: ethers.getAddress('0x0000000000000000000000000000000000000000'),
    //   privateKey: deployerKey,
    // });

    // const routerUrl = process.env.OG_COMPUTE_ROUTER || 'https://router-api-testnet.integratenetwork.work/v1';
    // const apiKey = process.env.OG_COMPUTE_API_KEY || '';
    // this.computeClient = new ComputeClient(routerUrl, apiKey);
  }

  async checkFraud(_dto: CheckFraudDto): Promise<FraudResponseDto> {
    // Placeholder fraud check (0G integration disabled for MVP)
    return {
      score: 95,
      reason: 'Vendor verified',
      proof: 'mvp-mock',
      flagged: false,
    };
  }

  async verifyProof(_proof: string): Promise<boolean> {
    return true;
  }
}
