// Shared types and constants
export const OG = {
  chainId: 16602,
  rpc: 'https://evmrpc-testnet.0g.ai',
  explorer: 'https://chainscan-galileo.0g.ai',
  storage: {
    indexer: 'https://indexer-storage-testnet-turbo.0g.ai',
    flowContract: '0x22E03a6A89B950F1c82ec5e74F8eCa321a105296',
  },
  compute: {
    router: 'https://router-api-testnet.integratenetwork.work/v1',
    apiUrl: 'https://pc.testnet.0g.ai',
  },
  faucet: 'https://faucet.0g.ai',
};

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  vendor: string;
  authenticity: number;
  margin: number;
}

export interface Order {
  id: string;
  productId: string;
  buyer: string;
  vendor: string;
  reseller: string;
  amount: number;
  status: number;
  txHash?: string;
}
