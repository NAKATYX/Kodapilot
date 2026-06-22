'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Checkout({ params }: { params: { productId: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [buyer, setBuyer] = useState('');
  const [vendor, setVendor] = useState('');
  const [reseller, setReseller] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  async function handleCheckout() {
    try {
      setLoading(true);
      setError('');

      if (!buyer || !vendor || !amount) {
        setError('Please fill in all required fields');
        return;
      }

      // Create order
      const orderId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      const res = await fetch('http://localhost:3001/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer,
          vendor,
          reseller: reseller || '0x0000000000000000000000000000000000000000',
          amount,
          productId: params.productId,
        }),
      });

      if (!res.ok) throw new Error('Failed to create order');

      const data = await res.json();
      router.push(`/orders/${data.data.orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-indigo-600 font-medium mb-4 inline-block hover:underline">← Back</Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Resell Order</h1>

        <div className="bg-white p-8 rounded-lg shadow">
          <div className="space-y-6">
            {/* Buyer Address */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Your Wallet Address (Buyer)</label>
              <input
                type="text"
                value={buyer}
                onChange={(e) => setBuyer(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
              />
            </div>

            {/* Vendor Address */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Vendor Address</label>
              <input
                type="text"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
              />
            </div>

            {/* Reseller Address (Optional) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Your Referrer (Optional)</label>
              <input
                type="text"
                value={reseller}
                onChange={(e) => setReseller(e.target.value)}
                placeholder="0x... (who referred you?)"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Amount (ETH)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.01"
                step="0.001"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* CTA */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Order...' : 'Create Escrow Order'}
            </button>
          </div>

          {/* Info Box */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-3">How it works:</h3>
            <ol className="space-y-2 text-sm text-slate-700">
              <li>1. Enter buyer (you), vendor, and amount</li>
              <li>2. Funds are locked in escrow on 0G Chain</li>
              <li>3. Vendor ships the item</li>
              <li>4. Confirm delivery to release funds</li>
              <li>5. Vendor & referrers get paid, reputation updates</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
