# SatyaChain - Implementation Tasks

## Task List

### Phase 1: Foundry Setup (Smart Contract)
1. [ ] Initialize Foundry project with foundry.toml (S)
2. [ ] Write SatyaChain.sol smart contract (M)
3. [ ] Write Deploy.s.sol deployment script (S)
4. [ ] Test smart contract locally with forge test (S)
5. [ ] Provide deployment commands for testnet (S)

### Phase 2: Next.js Setup
6. [ ] Initialize Next.js project with TailwindCSS (S)
7. [ ] Configure Tailwind for Neubrutalist design (S)
8. [ ] Create layout.tsx with global styles (S)

### Phase 3: Backend API
9. [ ] Create in-memory data store with mock data (S)
10. [ ] POST /api/products endpoint (M)
11. [ ] GET /api/products endpoint (S)
12. [ ] GET /api/products/[id] endpoint (S)

### Phase 4: Blockchain Integration
13. [ ] Create lib/blockchain.ts for ethers.js (M)
14. [ ] Integrate contract calls in POST /api/products (M)

### Phase 5: Frontend Pages
15. [ ] Supplier page with dynamic BoM form (M)
16. [ ] Buyer dashboard with products table (M)
17. [ ] Product detail page with full info (M)

### Phase 6: Testing & Polish
18. [ ] Add mock market prices for risk engine (S)
19. [ ] Implement risk engine logic (M)
20. [ ] Verify all pages work together (S)
21. [ ] Add block explorer links (S)

## Acceptance Criteria

- [ ] Foundry contract compiles with forge build
- [ ] Deployment script works on testnet
- [ ] Supplier form adds products with dynamic components
- [ ] Dashboard displays all 5 mock products + new ones
- [ ] Product page shows BoM, classification, risk, tx hash
- [ ] UI follows Neubrutalist black-white design exactly
- [ ] At least one product shows HIGH risk
- [ ] At least one product shows MEDIUM risk
- [ ] Transaction hash links to block explorer

## Complexity Legend
- S = Small (1-2 hours)
- M = Medium (2-4 hours)
- L = Large (4+ hours)