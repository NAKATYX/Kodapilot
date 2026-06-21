# M2: 0G Wrappers — Chain, Storage, Compute

## Overview
Abstraction layer for 0G services. Wrappers encapsulate RPC calls, SDK usage, and business logic.

All exports from `@kodapilot/zerog`:
- `ChainClient` — Escrow, SplitPayout, Reputation, ReferralRegistry deployment & reads
- `StorageClient` — Root hash minting, KV ledger storage
- `ComputeClient` — LLM inference on 0G Compute Router

---

## ChainClient

**Purpose:** Deploy contracts to 0G testnet, read contract state, execute transactions.

**Constructor:**
```ts
new ChainClient(rpcUrl, chainId, deployer: { address, privateKey })
```

**Methods:**
- `deploy()` — Deploy all 4 contracts in order, return addresses
  - Returns: `{ reputation, referralRegistry, splitPayout, escrow }`
  - Compiles contracts, reads ABIs, deploys with owner = deployer
  - Logs to console (for verification on ChainScan)

- `getContractAddresses()` — Read from local `contracts.json` cache
  - Returns: addresses or null if not deployed

- `readReputation(vendor: string)` — Call `reputation.reputation(vendor)`
  - Returns: `{ score: bigint, isGenuine: boolean }`

- `readOrder(orderId: string)` — Call `escrow.getOrder(orderId)`
  - Returns: `{ buyer, vendor, amount, status, ... }`

**Event Listeners (optional for later):**
- `watchEscrowDeposits(callback)`
- `watchReleases(callback)`

---

## StorageClient

**Purpose:** Store immutable records (orders, payouts, reputation snapshots) in 0G Storage.

**Constructor:**
```ts
new StorageClient(indexerUrl, flowContract)
```

**Methods:**
- `submitRootHash(path: string, data: object)` — Submit KV pair + get root hash
  - path = `orders/{orderId}` or `reputation/{vendor}` etc
  - Returns: `{ rootHash, expiry }`

- `getRootHash(path: string)` — Query indexer for root hash
  - Returns: `{ rootHash, timestamp }`

- `storeOrder(orderId, orderData)` — Convenience: store order snapshot
  - Submits to path `orders/{orderId}`
  - Returns: rootHash

- `storeReputation(vendor, score, isGenuine)` — Snapshot reputation
  - Submits to path `reputation/{vendor}`
  - Returns: rootHash

---

## ComputeClient

**Purpose:** Call 0G Compute Router for AI recommendations (product picks, listing copy, fraud checks).

**Constructor:**
```ts
new ComputeClient(routerUrl, apiKey)
```

**Methods:**
- `suggestProduct(category, budget, count = 3)` — LLM picks products
  - Calls OpenAI via router with prompt:
    - "Given category '{category}' and budget {budget}, suggest {count} products to resell. Return JSON array of { name, price, margin_bps }."
  - Returns: `{ products: [ { name, price, margin_bps } ], proof: string }`
  - proof = TEE attestation from router (included in response)

- `generateListingCopy(product: string, margin: number)` — AI writes product copy
  - Prompt: "Write compelling 1-line product listing for {product} at {margin_bps}% margin. Focus on resale value."
  - Returns: `{ copy: string, proof: string }`

- `checkFraud(vendorReputation: number, orderAmount: bigint)` — Risk assessment
  - Prompt: "Vendor reputation={vendorReputation}, order amount={amount}. Risk score 0-100? Return JSON { score, reason }."
  - Returns: `{ score: number (0-100), reason: string, proof: string }`

---

## Integration Points

### ChainClient → SplitPayout
After `escrow.release()` confirms delivery:
1. ChainClient reads `order` from escrow
2. StorageClient stores order snapshot (→ root hash)
3. Backend emits `OrderReleased` event → triggers SplitPayout.split()

### StorageClient → Reputation
After delivery + split:
1. StorageClient stores reputation snapshot
2. Root hash minted on-chain (optional: via Reputation.setRootHash())
3. Leaderboard indexer watches root hashes

### ComputeClient → Backend
On listing creation:
1. Backend calls `ComputeClient.suggestProduct()` → product picks
2. Backend calls `ComputeClient.generateListingCopy()` → auto-description
3. Both calls include TEE proof for verifiability

On order creation:
1. Backend calls `ComputeClient.checkFraud()` → risk score
2. If score > 70, flag for manual review or require escrow increase

---

## Testing

**Unit tests (mocking):**
- ChainClient deployment flow
- StorageClient KV submission
- ComputeClient prompt formatting + response parsing

**Integration tests (testnet):**
- Deploy contracts to 0G testnet (separate from unit tests)
- Submit root hash to 0G Storage indexer
- Call 0G Compute Router (with valid API key)

---

## Deployment Sequence

1. **ChainClient.deploy()** → get contract addresses
2. **Wire contracts** → authorize SplitPayout in Reputation, set Escrow in SplitPayout
3. **Store addresses** → write to `contracts.json` + env
4. **Test reads** → verify contract state is readable

Later phases:
5. Backend uses ChainClient for reads, StorageClient for ledger, ComputeClient for AI
