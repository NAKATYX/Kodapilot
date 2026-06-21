/**
 * KodaPilot Constants
 * Single source of truth for 0G endpoints, chain IDs, and configuration.
 * Update these at the start of each build session if testnet addresses change.
 * Reference: https://docs.0g.ai
 */

export const NETWORK = process.env.NETWORK || 'testnet';

export const OG_CHAIN = {
  testnet: {
    chainId: 16602,
    rpc: 'https://evmrpc-testnet.0g.ai',
    explorer: 'https://chainscan-galileo.0g.ai',
    faucet: 'https://faucet.0g.ai',
    name: 'Galileo (Testnet)',
  },
  mainnet: {
    chainId: 16661,
    rpc: 'https://evmrpc.0g.ai',
    explorer: 'https://chainscan.0g.ai',
    name: 'Mainnet',
  },
};

export const OG_STORAGE = {
  testnet: {
    indexer: 'https://indexer-storage-testnet-turbo.0g.ai',
    flowContract: '0x22E03a6A89B950F1c82ec5e74F8eCa321a105296',
  },
  mainnet: {
    indexer: 'https://indexer-storage.0g.ai',
    flowContract: '0x...', // Update when mainnet is live
  },
};

export const OG_COMPUTE = {
  testnet: {
    baseURL: 'https://router-api-testnet.integratenetwork.work/v1',
    consoleURL: 'https://pc.testnet.0g.ai',
  },
  mainnet: {
    baseURL: 'https://router-api.0g.ai/v1',
    consoleURL: 'https://pc.0g.ai',
  },
};

// Active endpoints (flip NETWORK env var to switch)
export const chain = OG_CHAIN[NETWORK as keyof typeof OG_CHAIN];
export const storage = OG_STORAGE[NETWORK as keyof typeof OG_STORAGE];
export const compute = OG_COMPUTE[NETWORK as keyof typeof OG_COMPUTE];

// Contract compilation
export const SOLIDITY_VERSION = '0.8.24';
export const EVM_VERSION = 'cancun'; // Required by 0G

// App
export const APP_NAME = 'KodaPilot';
export const DEMO_TIMEOUT = 90000; // 90 seconds for demo loop

// Currency
export const CURRENCY_SYMBOL = '₦';
export const STABLECOIN_DECIMALS = 6; // USDC-like
