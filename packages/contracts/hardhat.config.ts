import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });
dotenv.config({ path: '../../.env.local' });

const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000000';

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.24',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: 'cancun', // Required by 0G
    },
  },

  networks: {
    // 0G Testnet (Galileo)
    'og-testnet': {
      url: process.env.OG_RPC_TESTNET || 'https://evmrpc-testnet.0g.ai',
      chainId: 16602,
      accounts: [DEPLOYER_PRIVATE_KEY],
      gasPrice: 1000000000, // 1 Gwei
    },

    // 0G Mainnet (for future)
    'og-mainnet': {
      url: process.env.OG_RPC_MAINNET || 'https://evmrpc.0g.ai',
      chainId: 16661,
      accounts: [DEPLOYER_PRIVATE_KEY],
    },

    // Local hardhat network (testing)
    hardhat: {
      chainId: 31337,
    },
  },

  defaultNetwork: 'hardhat',

  paths: {
    sources: './contracts',
    tests: './test',
    artifacts: './artifacts',
    cache: './cache',
  },

  gasReporter: {
    enabled: process.env.REPORT_GAS === 'true',
    currency: 'USD',
  },

  typechain: {
    outDir: 'typechain-types',
    target: 'ethers-v6',
  },
};

export default config;
