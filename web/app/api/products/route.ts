import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { calculateLocalPercentage, classifyProduct, calculateRisk, generateProductId, type Product, addProduct } from '@/lib/store';
import { storeProductOnChain, isConfigured } from '@/lib/blockchain';

const CONTRACT_ABI = [
  'function productIds(uint256) view returns (bytes32)',
  'function getProductCount() view returns (uint256)',
  'function products(bytes32) view returns (bytes32,string,uint256,string,string,uint256,address)',
];

export async function GET() {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || process.env.CONTRACT_ADDRESS;
  const rpcUrl = process.env.RPC_URL || process.env.NEXT_PUBLIC_RPC_URL;

  if (!contractAddress || !rpcUrl) {
    return NextResponse.json({ success: false, error: 'Contract not configured' }, { status: 500 });
  }

  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, provider);

    const count = await contract.getProductCount();
    const products = [];

    for (let i = 0; i < Number(count); i++) {
      const productId = await contract.productIds(i);
      const result = await contract.products(productId);
      
      if (result && result[5] !== BigInt(0)) {
        const localPercentage = Number(result[2]) / 100;

        products.push({
          id: result[0],
          productName: result[1],
          name: result[1],
          localPercentage,
          classification: result[3],
          riskLevel: result[4],
          timestamp: Number(result[5]),
          verifier: result[6],
        });
      }
    }

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, price, components } = body;

    if (!name || !price || !components || !Array.isArray(components)) {
      return NextResponse.json(
        { success: false, error: 'Invalid request: name, price, and components are required' },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const { localCost, totalCost, percentage } = calculateLocalPercentage(components);
    const classification = classifyProduct(percentage);

    const product: Product = {
      id: '',
      name,
      price,
      components,
      totalCost,
      localCost,
      localPercentage: percentage,
      classification,
      riskLevel: 'LOW',
      riskReasons: [],
      timestamp,
    };

    const riskResult = calculateRisk(product);
    product.riskLevel = riskResult.level;
    product.riskReasons = riskResult.reasons;

    product.id = generateProductId(name, components, timestamp);

    const useBlockchain = isConfigured();
    
    if (useBlockchain) {
      const txHash = await storeProductOnChain(
        product.id,
        product.name,
        product.localPercentage,
        product.classification,
        product.riskLevel
      );
      product.txHash = txHash;
    } else {
      product.txHash = '0x' + Math.random().toString(16).slice(2, 66).padEnd(64, '0');
    }

    addProduct(product);

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
