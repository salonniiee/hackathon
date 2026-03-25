# SatyaChain - Requirements Specification

## 1. Problem Statement

SatyaChain is a hackathon MVP that demonstrates automated verification of "Made in India" claims using a Bill of Materials (BoM). The system calculates local content percentage, classifies products into risk categories, runs a basic risk engine, and stores verification results on-chain using a Foundry-deployed Solidity smart contract.

## 2. User Stories

1. **Supplier** - As a supplier, I want to submit a product with its BoM and get instant verification of local content percentage so that I can prove my product's origin claims.

2. **Buyer** - As a buyer, I want to view a dashboard of all verified products with their classification and risk levels so that I can make informed purchasing decisions.

3. **Verifier** - As a verifier, I want to view detailed product information including BoM breakdown, on-chain transaction hash, and risk flags so that I can audit the verification process.

## 3. Functional Requirements

### 3.1 Supplier Page (/supplier)
- Product name input field
- Price input field (INR)
- Dynamic component list with:
  - Component name
  - Origin (dropdown: India/Imported)
  - Cost (INR)
- "Add Component" button to add more rows
- "Verify Product" CTA button
- Form validation (required fields)

### 3.2 Buyer Dashboard (/dashboard)
- Table displaying all products with columns:
  - Product Name
  - Local Content %
  - Classification (Class I / Class II / Non-local)
  - Risk Level (HIGH / MEDIUM / LOW)
- Clickable row to view product details

### 3.3 Product Page (/product/[id])
- Full BoM breakdown table
- Local content percentage display
- Classification badge
- Risk level with reasons[]
- Transaction hash display
- "Stored On-Chain" indicator with block explorer link

### 3.4 Backend API
- POST /api/products - Create new product verification
- GET /api/products - List all products
- GET /api/products/[id] - Get product details

### 3.5 Blockchain Integration
- Solidity smart contract using Foundry
- Store product verification results on-chain
- Emit events for audit trail
- Use Arbitrum Sepolia or Polygon Mumbai testnet

## 4. Core Logic

### 4.1 Local Content Calculation
```
local_percentage = (sum of Indian component costs / total cost) * 100
```

### 4.2 Classification
- >= 50% → Class I (High local content)
- 20-50% → Class II (Medium local content)
- < 20% → Non-local (Imported)

### 4.3 Risk Engine Rules
1. **Price Anomaly**: if price > 2x mock market price → HIGH risk
2. **Suspicious BoM**: high imports (>50%) but high classification → MEDIUM risk
3. **Random Flag**: 20% chance → LOW risk (for demo variety)

### 4.4 Product ID Generation
- productId = keccak256(productName + timestamp + random)

## 5. Mock Data Requirements

Preload 5 products:
1. "Indian Handloom Shawl" - Clean, Class I, LOW risk
2. "Electronic Watch" - High imports, Non-local, HIGH risk (price anomaly)
3. "Cotton Shirt" - Class II, MEDIUM risk (suspicious BoM)
4. "Plastic Toys Set" - Non-local, LOW risk
5. "Ayurvedic Medicine" - Class I, LOW risk

## 6. Non-Functional Requirements

- Frontend: Neubrutalist black-white design with thick borders, sharp edges
- Typography: Monospace + bold
- No gradients, no shadows
- No authentication required
- In-memory storage for MVP

## 7. Constraints

- NO authentication
- NO external APIs
- NO ZK proofs
- NO ML
- NO overengineering
- Must use Foundry (NOT Hardhat)
- Must use ethers.js for frontend blockchain interaction

## 8. Acceptance Criteria

1. Supplier can add product with dynamic BoM components
2. System correctly calculates local content %
3. Products are correctly classified into Class I/II/Non-local
4. Risk engine returns appropriate risk levels with reasons
5. Product verification stored on-chain with real transaction
6. Dashboard displays all products with correct data
7. Product detail page shows all verification info + tx hash
8. UI follows Neubrutalist black-white design