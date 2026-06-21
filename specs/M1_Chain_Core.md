# M1: Chain Core — Smart Contracts

## Overview
Four core contracts handle the trust-commerce loop on 0G Chain (testnet 16602):
1. **Escrow.sol** — Non-custodial fund custody
2. **SplitPayout.sol** — Commission splitting
3. **ReferralRegistry.sol** — Referral tracking
4. **Reputation.sol** — On-chain reputation

## Escrow.sol

**Purpose:** Hold buyer funds in escrow; release on vendor delivery confirmation.

**Key Functions:**
- `deposit(orderId, vendorAddress)` — Buyer locks payment
- `confirmDelivery(orderId)` — Buyer signals received
- `release(orderId)` — Escrow sends funds to SplitPayout
- `refund(orderId, reason)` — Dispute → refund to buyer

**State:**
- `orders[orderId]` → (buyer, vendor, amount, status, deliveredAt, releasedAt)
- `statuses` → ESCROWED, DELIVERED, RELEASED, REFUNDED, DISPUTED

**Events:**
- `EscrowDeposited(orderId, buyer, vendor, amount)`
- `DeliveryConfirmed(orderId, deliveredAt)`
- `EscrowReleased(orderId, releaseAmount)`
- `EscrowRefunded(orderId, reason)`

**Guards:**
- Only buyer can confirm; only vendor/buyer can dispute
- No reentrance (ReentrancyGuard)
- Amount > 0

## SplitPayout.sol

**Purpose:** Take escrowed amount, split to reseller, vendor, referral chain.

**Key Functions:**
- `split(orderId, amount, resellerId, vendorId, referralChainLength)` — Called by Escrow
  - Reseller gets `resaleMarginBps` (e.g., 5% = 500 bps)
  - Vendor gets remainder after resale margin
  - Each referral level gets `referralBps` (e.g., 2% = 200 bps) up to `maxReferralDepth`
  - Residual → treasury (DAO)

**State:**
- `splits[orderId]` → tracking
- `configurable: resaleMarginBps, referralBps, maxReferralDepth, treasuryAddress`

**Events:**
- `SplitExecuted(orderId, reseller, vendor, referralChain[], amounts[])`
- `PaymentSent(to, amount, reason)`

**Guards:**
- Only callable by Escrow contract
- totalBps ≤ 10000 (100%)

## ReferralRegistry.sol

**Purpose:** Track who referred whom, build referral chains for payout.

**Key Functions:**
- `registerReferral(referrer, referree)` — Record relationship
- `getReferralChain(address)` → array of ancestors (max depth configurable)
- `getReferralCount(address)` → total referred

**State:**
- `referrers[address]` → direct referrer
- `referralCounts[address]` → count of people referred
- `maxChainDepth` → hard limit (e.g., 5)

**Events:**
- `ReferralRegistered(referrer, referree, timestamp)`

**Guards:**
- Cannot self-refer
- Chain depth ≤ maxChainDepth
- Idempotent (only register once per pair)

## Reputation.sol

**Purpose:** Mint reputation credits on delivery; gate future listings by reputation.

**Key Functions:**
- `creditReputation(vendorId, amount, reason)` — Called by Escrow/SplitPayout
- `debitReputation(vendorId, amount, reason)` — Dispute/refund penalty
- `getReputation(vendorId)` → current score
- `isGenuine(vendorId)` → bool (score ≥ minReputationThreshold)

**State:**
- `reputation[address]` → cumulative score
- `auditLog[address][]` → (reason, delta, timestamp)
- `minReputationThreshold` → configurable (e.g., 10)

**Events:**
- `ReputationCredited(vendor, amount, reason, newScore)`
- `ReputationDebited(vendor, amount, reason, newScore)`
- `GenuinessStatusChanged(vendor, isGenuine)`

**Guards:**
- Only callable by authorized contracts (Escrow, SplitPayout)
- Score never goes negative

## Deployment & Integration

**Deploy Order:**
1. `Reputation.sol` (no deps)
2. `ReferralRegistry.sol` (no deps)
3. `SplitPayout.sol` (needs Reputation, ReferralRegistry)
4. `Escrow.sol` (needs SplitPayout, Reputation, ReferralRegistry)

**Wiring:**
- Escrow → authorizes SplitPayout
- SplitPayout → authorized in Reputation, ReferralRegistry

## Test Coverage

**Each contract: 100% line coverage**
- Happy path (deposit → deliver → release)
- Edge cases (zero amount, self-referral, depth limits)
- Error cases (unauthorized caller, invalid state transitions)
- Reentrancy (ReentrancyGuard)

**Integration tests:**
- Full flow: escrow → delivery → split → reputation update

---

## Hardhat Configuration

- **Network:** `0g-testnet` (chainId 16602, RPC: https://evmrpc-testnet.0g.ai)
- **EVM version:** `cancun` (0G requirement)
- **Solidity:** `0.8.24`
- **Gas reporter:** Enabled
- **Compiler runs:** 200 (optimize for size on testnet)
