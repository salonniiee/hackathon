export interface Component {
  name: string;
  origin: 'India' | 'Imported';
  cost: number;
}

export type Classification = 'Class I' | 'Class II' | 'Non-local';
export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Product {
  id: string;
  name: string;
  price: number;
  components: Component[];
  totalCost: number;
  localCost: number;
  localPercentage: number;
  classification: Classification;
  riskLevel: RiskLevel;
  riskReasons: string[];
  timestamp: number;
  txHash?: string;
  contractAddress?: string;
}

export const MOCK_MARKET_PRICES: Record<string, number> = {
  'Electronic Watch': 500,
  'Cotton Shirt': 800,
  'Indian Handloom Shawl': 2500,
  'Plastic Toys Set': 300,
  'Ayurvedic Medicine': 450,
  'Smartphone': 15000,
  'Leather Bag': 2000,
  'Silk Saree': 3500,
  'Sports Shoes': 1200,
  'Copper Utensils': 800,
};

export function calculateLocalPercentage(components: Component[]): { localCost: number; totalCost: number; percentage: number } {
  const totalCost = components.reduce((sum, c) => sum + c.cost, 0);
  const localCost = components.filter(c => c.origin === 'India').reduce((sum, c) => sum + c.cost, 0);
  const percentage = totalCost > 0 ? (localCost / totalCost) * 100 : 0;
  return { localCost, totalCost, percentage: Math.round(percentage * 100) / 100 };
}

export function classifyProduct(percentage: number): Classification {
  if (percentage >= 50) return 'Class I';
  if (percentage >= 20) return 'Class II';
  return 'Non-local';
}

export function calculateRisk(product: Product): { level: RiskLevel; reasons: string[] } {
  const reasons: string[] = [];
  let level: RiskLevel = 'LOW';

  const marketPrice = MOCK_MARKET_PRICES[product.name];
  if (marketPrice && product.price > marketPrice * 2) {
    reasons.push(`Price anomaly: ₹${product.price} is 2x+ above market (₹${marketPrice})`);
    level = 'HIGH';
  }

  const importPercentage = 100 - product.localPercentage;
  if (importPercentage > 50 && product.classification === 'Class I') {
    reasons.push(`Suspicious BoM: ${Math.round(importPercentage)}% imports but classified as Class I`);
    if (level !== 'HIGH') level = 'MEDIUM';
  }

  if (Math.random() < 0.2 && reasons.length === 0) {
    reasons.push('Random flag: Manual review recommended');
    level = 'LOW';
  }

  if (reasons.length === 0) {
    reasons.push('No risk factors identified');
  }

  return { level, reasons };
}

export function generateProductId(name: string, components: Component[], timestamp: number): string {
  const data = name + JSON.stringify(components) + timestamp.toString();
  return '0x' + Buffer.from(data).toString('hex').slice(0, 64);
}

const mockProducts: Product[] = [
  {
    id: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890',
    name: 'Indian Handloom Shawl',
    price: 2800,
    components: [
      { name: 'Cotton Fabric', origin: 'India', cost: 1200 },
      { name: 'Natural Dyes', origin: 'India', cost: 300 },
      { name: 'Silk Thread', origin: 'India', cost: 500 },
      { name: 'Wooden Loom', origin: 'Imported', cost: 200 },
    ],
    totalCost: 2200,
    localCost: 2000,
    localPercentage: 90.91,
    classification: 'Class I',
    riskLevel: 'LOW',
    riskReasons: ['No risk factors identified'],
    timestamp: Date.now() - 86400000 * 5,
    txHash: '0xabc123def4567890123456789012345678901234567890123456789012345678',
    contractAddress: '0x1234567890123456789012345678901234567890',
  },
  {
    id: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef12345678901',
    name: 'Electronic Watch',
    price: 2500,
    components: [
      { name: 'Quartz Movement', origin: 'Imported', cost: 600 },
      { name: 'Plastic Case', origin: 'Imported', cost: 200 },
      { name: 'LCD Display', origin: 'Imported', cost: 400 },
      { name: 'Rubber Strap', origin: 'Imported', cost: 100 },
      { name: 'Battery', origin: 'Imported', cost: 50 },
    ],
    totalCost: 1350,
    localCost: 0,
    localPercentage: 0,
    classification: 'Non-local',
    riskLevel: 'HIGH',
    riskReasons: ['Price anomaly: ₹2500 is 5x above market (₹500)', '100% imported components'],
    timestamp: Date.now() - 86400000 * 4,
    txHash: '0xdef4567890123456789012345678901234567890123456789012345678901234',
    contractAddress: '0x1234567890123456789012345678901234567890',
  },
  {
    id: '0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef123456789012',
    name: 'Cotton Shirt',
    price: 1500,
    components: [
      { name: 'Cotton Fabric', origin: 'India', cost: 500 },
      { name: 'Buttons', origin: 'Imported', cost: 50 },
      { name: 'Thread', origin: 'India', cost: 30 },
      { name: 'Label', origin: 'Imported', cost: 20 },
      { name: 'Packaging', origin: 'India', cost: 100 },
    ],
    totalCost: 700,
    localCost: 630,
    localPercentage: 90,
    classification: 'Class I',
    riskLevel: 'MEDIUM',
    riskReasons: ['Suspicious BoM: 10% imports but classified as Class I', 'High local content but low price'],
    timestamp: Date.now() - 86400000 * 3,
    txHash: '0x789abcdef012345678901234567890123456789012345678901234567890123',
    contractAddress: '0x1234567890123456789012345678901234567890',
  },
  {
    id: '0x4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890123',
    name: 'Plastic Toys Set',
    price: 450,
    components: [
      { name: 'Plastic Pellets', origin: 'Imported', cost: 150 },
      { name: 'Paint', origin: 'Imported', cost: 50 },
      { name: 'Packaging', origin: 'India', cost: 30 },
    ],
    totalCost: 230,
    localCost: 30,
    localPercentage: 13.04,
    classification: 'Non-local',
    riskLevel: 'LOW',
    riskReasons: ['No risk factors identified'],
    timestamp: Date.now() - 86400000 * 2,
    txHash: '0xabcDEF78901234567890123456789012345678901234567890123456789012',
    contractAddress: '0x1234567890123456789012345678901234567890',
  },
  {
    id: '0x5e6f7890abcdef1234567890abcdef1234567890abcdef12345678901234',
    name: 'Ayurvedic Medicine',
    price: 600,
    components: [
      { name: 'Herbal Extracts', origin: 'India', cost: 280 },
      { name: 'Ghee', origin: 'India', cost: 120 },
      { name: 'Honey', origin: 'India', cost: 80 },
      { name: 'Capsule Shell', origin: 'Imported', cost: 40 },
      { name: 'Packaging Box', origin: 'India', cost: 30 },
    ],
    totalCost: 550,
    localCost: 510,
    localPercentage: 92.73,
    classification: 'Class I',
    riskLevel: 'LOW',
    riskReasons: ['No risk factors identified'],
    timestamp: Date.now() - 86400000,
    txHash: '0x123456789ABCDEF012345678901234567890123456789012345678901234567',
    contractAddress: '0x1234567890123456789012345678901234567890',
  },
];

export const productsStore = new Map<string, Product>();
mockProducts.forEach(p => productsStore.set(p.id, p));

export function getAllProducts(): Product[] {
  return Array.from(productsStore.values()).sort((a, b) => b.timestamp - a.timestamp);
}

export function getProduct(id: string): Product | undefined {
  return productsStore.get(id);
}

export function addProduct(product: Product): Product {
  productsStore.set(product.id, product);
  return product;
}