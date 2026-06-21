# KodaPilot — Claude Code Rules & Context

## Product (one-liner)
**KodaPilot**: AI-native trust-commerce network on 0G. Your selling copilot — earn from reselling, invite friends, buy/sell safely. AI does the work, 0G guarantees the money.

## The Demo Loop (90 seconds)
1. AI suggests a deliverable, genuine product → reseller reshares
2. Buyer pays into escrow on 0G testnet
3. Vendor delivers in-zone → buyer confirms delivery
4. Escrow releases, resale margin + 1-level referral settle on-chain
5. Reputation mints, leaderboard updates

## 0G (Load-Bearing)

| Service | Job | Testnet |
|---------|-----|---------|
| **0G Chain** | Escrow, splits, reputation | RPC: `https://evmrpc-testnet.0g.ai` · Chain ID: `16602` |
| **0G Storage** | Ledger, reach maps, reputation (root hashes) | Indexer: `https://indexer-storage-testnet-turbo.0g.ai` |
| **0G Compute** | AI copilot (product picks, listing copy, fraud checks) | Router: `https://router-api-testnet.integratenetwork.work/v1` |

**Hard rule:** Always compile contracts with `--evm-version cancun`. Solidity pin to `0.8.24`.

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Frontend | Next.js 14 (App Router) + Tailwind + PWA | Mobile-first, Vercel deploy, vibe-code friendly |
| Backend | NestJS | Structured, testable, lean |
| DB | Postgres + Prisma (+ PostGIS) | Type-safe, fast geo queries |
| Contracts | Hardhat + OpenZeppelin | Mature, great Claude Code support |
| AI | OpenAI SDK → 0G Compute Router | ~90% cheaper, verifiable, TEE-signed |
| 0G Storage | `@0gfoundation/0g-storage-ts-sdk` | Official, root-hash + KV + encryption |
| Auth | SIWE (Sign-In With Ethereum) | Web3-native |
| Infra | Vercel (FE) + Railway/Render (BE+DB) | Simple, free tiers for MVP |

## Repo Structure

```
kodapilot/
├── apps/
│   ├── web/          # Next.js PWA (5 screens)
│   └── api/          # NestJS backend
├── packages/
│   ├── contracts/    # Hardhat + Solidity
│   ├── zerog/        # 0G wrappers (storage, compute, chain)
│   └── shared/       # Types, constants, zod schemas
├── prisma/           # DB schema + migrations
├── docs/adr/         # Architecture Decision Records
├── specs/            # Mini-specs per feature
└── [plan.md, PROGRESS.md, WORKFLOW.md, KodaPilot_Build_Plan.md]
```

## Conventions

- **TypeScript strict mode** on everywhere. No `any`.
- **Prettier + ESLint**. Format on save.
- **Conventional Commits**: `feat:`, `fix:`, `docs:`, `test:`, refactor:`
- **Prisma only** for DB access. No raw SQL.
- **ethers v6** for on-chain interactions.
- **Hardhat tests** for every contract function (100% coverage target).
- **Zod** for all API input validation.

## Hard Rules (Non-negotiable)

🚫 **Never:**
- Commit private keys or secrets (use `.env.example` only)
- Custody user funds (escrow contract holds them; users sign txs)
- Compile without `--evm-version cancun`
- Skip pre-commit hooks
- Leave contract functions untested

✅ **Always:**
- Write a test before/alongside the contract function
- Validate API input with Zod
- Use SIWE for auth (wallet sign-in)
- Store root hashes, not secrets, in Postgres
- Emit events from contract state changes

## Build Discipline

Follow **WORKFLOW.md**:
1. **Plan before code** (mini-spec in `/specs/`)
2. **Pre-mortem review** (checklist in WORKFLOW.md §2)
3. **Milestone verification** (tests green, tx on ChainScan, screenshots)
4. **Session log** (append to PROGRESS.md)

## Commands

```bash
# Dev
pnpm dev              # boot web + api
pnpm test             # all tests
pnpm hardhat test     # contract tests only

# Deploy (testnet)
pnpm deploy:testnet   # contracts → 0G testnet
pnpm prisma migrate deploy  # DB migrations

# Lint & format
pnpm lint
pnpm format
```

## Endpoints (Update at Session Start)

From `packages/shared/constants.ts`:

```ts
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
```

**Verify these at the start of each build session** — testnet endpoints can change.

## Timeline

- **M0**: Foundations (1–2 days) ← we are here
- **M1**: Chain core (2–3 days)
- **M2–M3**: 0G wrappers (2 days)
- **M4**: Backend + matching (2–3 days)
- **M5**: Frontend 5 screens (3–4 days)
- **M6**: Demo loop wired (2–3 days)
- **M7**: Harden + submit (1 day)
- **Target**: Group stage submit **June 23** ✅

## Reference

- **Plan**: `plan.md` (architecture decisions, security, file structure, checklist)
- **Progress**: `PROGRESS.md` (session log, milestone ledger)
- **Workflow**: `WORKFLOW.md` (plan-first discipline, design review, docs)
- **Build plan**: `KodaPilot_Build_Plan.md` (full AâZ, phases 0â7)
- **Product blueprint**: `KodaPilot_Product_Blueprint.pdf`

---

**Read this every session.** It's the anchor. 🚀
