import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, addProduct, calculateLocalPercentage, classifyProduct, calculateRisk, generateProductId, type Product } from '@/lib/store';
import { storeProductOnChain, isConfigured, setBlockchainConfig } from '@/lib/blockchain';

export async function GET() {
  const products = getAllProducts();
  return NextResponse.json({ success: true, products });
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