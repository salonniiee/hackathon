'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  name?: string;
  productName?: string;
  price?: number;
  localPercentage: number;
  classification: 'Class I' | 'Class II' | 'Non-local';
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducts(data.products);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8 border-b-3 border-black pb-4">
        <h2 className="text-3xl font-bold">BUYER DASHBOARD</h2>
        <span className="brutalist-border px-4 py-2 font-bold">{products.length} Products</span>
      </div>

      <div className="brutalist-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th className="table-header text-left">Product Name</th>
              <th className="table-header text-right">Price (₹)</th>
              <th className="table-header text-right">Local %</th>
              <th className="table-header text-center">Classification</th>
              <th className="table-header text-center">Risk Level</th>
              <th className="table-header text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id} className="table-row">
                <td className="table-cell font-bold">{product.name || product.productName || 'Unknown'}</td>
                <td className="table-cell text-right">{product.price ? `₹${product.price.toLocaleString()}` : '-'}</td>
                <td className="table-cell text-right">{product.localPercentage?.toFixed(2) || '0.00'}%</td>
                <td className="table-cell text-center">
                  <span className={`badge ${
                    product.classification === 'Class I' ? 'badge-class-i' :
                    product.classification === 'Class II' ? 'badge-class-ii' :
                    'badge-non-local'
                  }`}>
                    {product.classification}
                  </span>
                </td>
                <td className="table-cell text-center">
                  <span className={`badge ${
                    product.riskLevel === 'HIGH' ? 'badge-risk-high' :
                    product.riskLevel === 'MEDIUM' ? 'badge-risk-medium' :
                    'badge-risk-low'
                  }`}>
                    {product.riskLevel}
                  </span>
                </td>
                <td className="table-cell text-center">
                  <Link href={`/product/${product.id}`} className="nav-link text-xs">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {products.length === 0 && (
        <div className="brutalist-border p-8 text-center">
          <p className="font-bold">No products verified yet.</p>
          <Link href="/supplier" className="brutalist-button mt-4 inline-block">
            Submit First Product
          </Link>
        </div>
      )}
    </div>
  );
}