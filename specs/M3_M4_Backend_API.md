# M3-M4: Backend API (NestJS + Prisma + 0G Wrappers)

## Critical Path for Demo (6 hours)

3 modules:
1. **Orders** — deposit, confirm, release (uses Escrow contract)
2. **Products** — list, create, suggest via AI (uses ComputeClient)
3. **Fraud** — risk assessment (uses ComputeClient)

Each endpoint returns JSON + emits events for frontend to consume.

---

## OrdersController

```
POST /orders
  { buyer: address, vendor: address, productId: string, amount: wei }
  → Creates order in DB, calls Escrow.deposit() via ChainClient
  → Returns { orderId, status, txHash }

GET /orders/:id
  → Reads from DB + ChainClient for on-chain state
  → Returns { buyer, vendor, amount, status, deliveredAt, releasedAt }

POST /orders/:id/confirm-delivery
  { buyer: address }
  → Sets order.status = DELIVERED in DB
  → Returns { orderId, status }

POST /orders/:id/release
  { buyer: address }
  → Calls Escrow.release() via ChainClient (calls SplitPayout → Reputation)
  → Stores root hash to 0G Storage (StorageClient)
  → Returns { orderId, status, splits { reseller, vendor, referral } }
```

---

## ProductsController

```
GET /products
  ?category=electronics&minPrice=10&maxPrice=100
  → List products from DB, paginated
  → Returns { id, name, price, margin, genuineVendor, rating }

POST /products
  { name, price, description, category, vendorId }
  → Create product in DB
  → Call ComputeClient.generateListingCopy() if desc missing
  → Returns { id, name, listing_copy, proof }

POST /products/suggest
  { category, budget, count }
  → Call ComputeClient.suggestProduct()
  → Return { products: [ { name, price, margin_bps, proof } ] }
```

---

## FraudController

```
POST /fraud/check
  { vendorId: address, orderAmount: wei }
  → Read vendor reputation from ChainClient
  → Call ComputeClient.checkFraud(reputation, amount)
  → Return { score (0-100), reason, proof }
```

---

## Database Schema (Prisma)

Already defined in `prisma/schema.prisma`:
- User (buyer, vendor, reseller)
- Product (name, price, margin, vendor)
- Order (buyer, vendor, escrowId, status)
- Listing (product, vendor, price)
- EarningEvent (type, amount, recipient)

Key change: Add `escrowId` (bytes32 from contract) to Order for linkage.

---

## Integration Points

1. **OrdersService** uses ChainClient
   - `readOrder()` to check onchain status
   - Caches escrowId for future reads

2. **ProductsService** uses ComputeClient
   - `suggestProduct()` returns AI picks
   - `generateListingCopy()` writes descriptions

3. **FraudService** uses ChainClient + ComputeClient
   - `readReputation()` to get vendor score
   - `checkFraud()` to assess risk

---

## Deployment Order (NestJS)

1. Create AppModule, seed 0G endpoints from env
2. Orders module (controller, service, DTOs)
3. Products module (controller, service, DTOs)
4. Fraud module (controller, service, DTOs)
5. Bootstrap app on port 3001

Test each endpoint locally before frontend integration.

---

## Error Handling

All endpoints return:
- Success: `{ success: true, data: ... }`
- Error: `{ success: false, error: "reason", code: "ERROR_CODE" }`

HTTP status:
- 200: OK
- 400: Bad request (validation)
- 404: Not found
- 500: Server error (chain/0G call failed)
