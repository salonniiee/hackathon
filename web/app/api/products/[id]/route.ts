import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

const CONTRACT_ABI = [
  'function products(bytes32) view returns (bytes32,string,uint256,string,string,uint256,address)',
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const rpcUrl = process.env.RPC_URL || process.env.NEXT_PUBLIC_RPC_URL;

  if (!contractAddress || !rpcUrl) {
    return NextResponse.json(
      { success: false, error: 'Contract not configured' },
      { status: 500 }
    );
  }

  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, provider);
    
    const result = await contract.products(id);
    
    if (!result || result[5] === BigInt(0)) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    const product = {
      id: id,
      productName: result[1],
      localPercentage: Number(result[2]) / 100,
      classification: result[3],
      riskLevel: result[4],
      timestamp: Number(result[5]),
      verifier: result[6],
      txHash: '',
    };

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error fetching product:', error, 'id:', id, 'contract:', contractAddress, 'rpc:', rpcUrl);
    return NextResponse.json(
      { success: false, error: 'Product not found' },
      { status: 404 }
    );
  }
}
