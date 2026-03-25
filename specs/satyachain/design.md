# SatyaChain - Design Specification

## 1. Architecture

### 1.1 Tech Stack
- **Frontend**: Next.js 14 (App Router), TailwindCSS, Neubrutalist design
- **Backend**: Next.js API Routes (Route Handlers)
- **Blockchain**: Solidity + Foundry, ethers.js
- **Database**: In-memory (Map<string, Product>)

### 1.2 Project Structure
```
/Users/haardsolanki/Developer/projects/hackathon/
├── foundry/           # Foundry project (smart contract)
│   ├── src/
│   │   └── SatyaChain.sol
│   ├── script/
│   │   └── Deploy.s.sol
│   ├── foundry.toml
│   └── out/
├── app/               # Next.js app
│   ├── layout.tsx
│   ├── page.tsx
│   ├── supplier/
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── product/
│   │   └── [id]/
│   │       └── page.tsx
│   └── api/
│       └── products/
│           ├── route.ts
│           └── [id]/
│               └── route.ts
├── lib/
│   └── blockchain.ts  # ethers.js integration
├── data/
│   └── mock.ts       # Mock data
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

### 1.3 Data Models

#### Product (Backend/Frontend)
```typescript
interface Component {
  name: string;
  origin: 'India' | 'Imported';
  cost: number;
}

interface Product {
  id: string;                    // keccak256 hash
  name: string;
  price: number;
  components: Component[];
  totalCost: number;
  localCost: number;
  localPercentage: number;
  classification: 'Class I' | 'Class II' | 'Non-local';
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  riskReasons: string[];
  timestamp: number;
  txHash?: string;
  contractAddress?: string;
}
```

#### Product (Solidity)
```solidity
struct ProductVerification {
    bytes32 productId;
    string productName;
    uint256 localPercentage;
    string classification;
    string riskLevel;
    uint256 timestamp;
    address verifier;
}
```

## 2. API Contracts

### 2.1 POST /api/products
**Request Body:**
```json
{
  "name": "string",
  "price": number,
  "components": [
    { "name": "string", "origin": "India" | "Imported", "cost": number }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "product": { ...Product }
}
```

### 2.2 GET /api/products
**Response:**
```json
{
  "success": true,
  "products": [ ...Product ]
}
```

### 2.3 GET /api/products/[id]
**Response:**
```json
{
  "success": true,
  "product": { ...Product }
}
```

## 3. Component Interactions

### 3.1 Supplier Submission Flow
```
[Supplier Page] 
    → POST /api/products 
    → Backend calculates local %
    → Backend runs risk engine
    → Backend calls smart contract (ethers.js)
    → Save tx hash
    → Return product with verification
```

### 3.2 Blockchain Flow
```
[Backend] 
    → Connect to wallet (deployer account)
    → Call storeProduct(productId, local %, classification)
    → Wait for transaction confirmation
    → Return tx hash
```

## 4. UI Design Specification

### 4.1 Design System
- **Colors**: Black (#000), White (#fff), Gray (#888 for secondary)
- **Borders**: 3px solid black
- **Corners**: 0px border-radius (sharp edges)
- **Typography**: 
  - Headings: Bold monospace (font-family: 'Courier New', monospace)
  - Body: Monospace
- **No**: Gradients, shadows, rounded corners

### 4.2 Page Layouts

#### Supplier Page
- Header: "SUPPLIER PORTAL" with thick border bottom
- Form container with thick border
- Input fields: 3px black border, white bg
- Button: Black bg, white text, uppercase, hover: invert

#### Dashboard
- Header: "BUYER DASHBOARD"
- Table: Thick black borders, alternating row colors (white/#f0f0f0)
- Classification badges: Class I (black), Class II (gray), Non-local (dashed border)

#### Product Detail
- Full-width container with thick borders
- Section headers with border bottoms
- Risk flags in bordered boxes
- Tx hash in monospace, clickable to block explorer

## 5. Blockchain Design

### 5.1 Smart Contract Functions
```solidity
function storeProduct(
    bytes32 productId,
    uint256 localPercentage,
    string classification,
    string riskLevel
) external;

function getProduct(bytes32 productId) external view returns (ProductVerification memory);

event ProductStored(
    bytes32 indexed productId,
    string productName,
    uint256 localPercentage,
    string classification,
    string riskLevel
);
```

### 5.2 Deployment
- Network: Arbitrum Sepolia or Polygon Mumbai
- Constructor: No parameters
- Verification: Hardcoded RPC URL and private key in .env

## 6. Risk Engine Implementation

### 6.1 Mock Market Prices
```typescript
const MOCK_MARKET_PRICES: Record<string, number> = {
  'Electronic Watch': 500,
  'Cotton Shirt': 800,
  'Indian Handloom Shawl': 2500,
  'Plastic Toys Set': 300,
  'Ayurvedic Medicine': 450
};
```

### 6.2 Risk Rules
```typescript
function calculateRisk(product: Product): { level: RiskLevel, reasons: string[] }
```

## 7. Error Handling

- Invalid form input → Show inline validation errors
- Blockchain transaction failure → Show error toast, still save locally
- Product not found → 404 page
- Network error → Retry with exponential backoff

## 8. Environment Variables

```env
# Blockchain
PRIVATE_KEY=your_private_key
RPC_URL=arbitrum_sepolia_rpc_url
CONTRACT_ADDRESS=deployed_contract_address

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```