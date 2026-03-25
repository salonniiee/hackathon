'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Component {
  name: string;
  origin: 'India' | 'Imported';
  cost: number;
}

export default function SupplierPage() {
  const router = useRouter();
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [components, setComponents] = useState<Component[]>([
    { name: '', origin: 'India', cost: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addComponent = () => {
    setComponents([...components, { name: '', origin: 'India', cost: 0 }]);
  };

  const removeComponent = (index: number) => {
    if (components.length > 1) {
      setComponents(components.filter((_, i) => i !== index));
    }
  };

  const updateComponent = (index: number, field: keyof Component, value: string | number) => {
    const updated = [...components];
    if (field === 'cost') {
      updated[index][field] = typeof value === 'string' ? parseFloat(value) || 0 : value;
    } else {
      updated[index][field] = value as 'India' | 'Imported';
    }
    setComponents(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!productName || !price || components.some(c => !c.name || c.cost <= 0)) {
      setError('Please fill in all fields with valid values');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: productName,
          price: parseFloat(price),
          components,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/product/${data.product.id}`);
      } else {
        setError(data.error || 'Failed to verify product');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }

    setLoading(false);
  };

  const totalCost = components.reduce((sum, c) => sum + (c.cost || 0), 0);
  const localCost = components
    .filter(c => c.origin === 'India')
    .reduce((sum, c) => sum + (c.cost || 0), 0);
  const localPercentage = totalCost > 0 ? ((localCost / totalCost) * 100).toFixed(2) : '0.00';

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8 border-b-3 border-black pb-4">SUPPLIER PORTAL</h2>

      <form onSubmit={handleSubmit} className="brutalist-border p-6">
        <div className="mb-6">
          <label className="brutalist-label">Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={e => setProductName(e.target.value)}
            className="brutalist-input"
            placeholder="Enter product name"
          />
        </div>

        <div className="mb-6">
          <label className="brutalist-label">Price (₹)</label>
          <input
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            className="brutalist-input"
            placeholder="Enter price in INR"
            min="0"
          />
        </div>

        <div className="mb-6">
          <label className="brutalist-label">Bill of Materials (BoM)</label>
          <p className="text-sm mb-4">List all components with their origin and cost</p>

          {components.map((component, index) => (
            <div key={index} className="flex gap-4 mb-3 items-end">
              <div className="flex-1">
                <input
                  type="text"
                  value={component.name}
                  onChange={e => updateComponent(index, 'name', e.target.value)}
                  className="brutalist-input"
                  placeholder="Component name"
                />
              </div>
              <div className="w-32">
                <select
                  value={component.origin}
                  onChange={e => updateComponent(index, 'origin', e.target.value)}
                  className="brutalist-select w-full"
                >
                  <option value="India">India</option>
                  <option value="Imported">Imported</option>
                </select>
              </div>
              <div className="w-32">
                <input
                  type="number"
                  value={component.cost || ''}
                  onChange={e => updateComponent(index, 'cost', e.target.value)}
                  className="brutalist-input"
                  placeholder="Cost"
                  min="0"
                />
              </div>
              {components.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeComponent(index)}
                  className="px-4 py-2 border-2 border-black hover:bg-black hover:text-white font-bold"
                >
                  X
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addComponent}
            className="brutalist-button-inverse text-sm mt-2"
          >
            + Add Component
          </button>
        </div>

        <div className="brutalist-border p-4 mb-6 bg-gray-100">
          <div className="flex justify-between text-sm">
            <span>Total Cost: <strong>₹{totalCost.toFixed(2)}</strong></span>
            <span>Local Cost: <strong>₹{localCost.toFixed(2)}</strong></span>
            <span>Local Content: <strong>{localPercentage}%</strong></span>
          </div>
        </div>

        {error && (
          <div className="brutalist-border p-4 mb-6 bg-red-100 text-red-800 font-bold">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="brutalist-button w-full"
        >
          {loading ? 'Verifying...' : 'Verify Product'}
        </button>
      </form>
    </div>
  );
}