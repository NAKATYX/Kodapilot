# KodaPilot

**AI-native trust-commerce network on 0G.**

Your selling copilot — earn from reselling, invite friends, buy/sell safely. AI does the work, 0G guarantees the money.

## Quick Start

```bash
# Install dependencies
pnpm install

# Boot dev servers (web + api)
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

## Project Structure

```
kodapilot/
├── apps/
│   ├── web/          # Next.js PWA (5 screens)
│   └── api/          # NestJS backend
├── packages/
│   ├── contracts/    # Hardhat + Solidity
│   ├── zerog/        # 0G Chain, Storage, Compute wrappers
│   └── shared/       # Types, constants, schemas
├── prisma/           # Database schema
└── docs/
    └── adr/          # Architecture Decision Records
```

## Documentation

- **[plan.md](./plan.md)** — Architecture decisions, security, file structure, implementation checklist
- **[PROGRESS.md](./PROGRESS.md)** — Build milestones, session log, overall progress
- **[WORKFLOW.md](./WORKFLOW.md)** — Plan-first engineering discipline
- **[CLAUDE.md](./CLAUDE.md)** — Claude Code rules, conventions, hard rules
- **[KodaPilot_Build_Plan.md](./KodaPilot_Build_Plan.md)** — Full A–Z build plan (phases 0–7)
- **[KodaPilot_Product_Blueprint.pdf](./KodaPilot_Product_Blueprint.pdf)** — Product strategy & design

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14 + Tailwind + PWA |
| Backend | NestJS + Postgres + Prisma |
| Contracts | Hardhat + OpenZeppelin (Solidity 0.8.24) |
| AI | OpenAI SDK → 0G Compute Router |
| Chain | 0G Testnet (EVM-compatible) |
| Storage | 0G Storage (root hashes + KV) |

## Build Timeline

- **M0**: Foundations ← current phase
- **M1**: Chain core (Escrow, Splits, Referral, Reputation)
- **M2–M3**: 0G wrappers (Storage, Compute)
- **M4**: Backend API + matching engine
- **M5**: Frontend (5 screens)
- **M6**: Demo loop wired end-to-end
- **M7**: Harden + submit
- **Target**: Group stage submit **June 23**

## Key Rules

🚫 **Never:**
- Commit private keys or secrets
- Custody user funds (escrow contract only)
- Compile contracts without `--evm-version cancun`

✅ **Always:**
- Write tests for every contract function
- Validate API input with Zod
- Use SIWE for wallet auth

## Setup for Development

1. Install Node.js 18+ and pnpm 8+
2. Copy `.env.example` → `.env.local` (fill in testnet secrets)
3. Run `pnpm install`
4. Set up a Postgres database locally (or via Railway for staging)

## Deployment

- **Frontend**: Vercel (auto-deploy from main)
- **API**: Railway or Render (Postgres included)
- **Contracts**: Hardhat deploy → 0G testnet RPC

---

Built with ❤️ for the 0G Zero Cup. [Read the full blueprint →](./KodaPilot_Product_Blueprint.pdf)
