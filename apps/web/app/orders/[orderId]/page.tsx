'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Order {
  orderId: string;
  buyer: string;
  vendor: string;
  reseller: string;
  amount: string;
  status: number;
  depositedAt: number;
  deliveredAt: number;
  releasedAt: number;
}

const STATUS_LABELS = ['Escrowed', 'Delivered', 'Released', 'Refunded', 'Disputed'];
const STATUS_COLORS = ['bg-yellow-100 text-yellow-800', 'bg-blue-100 text-blue-800', 'bg-green-100 text-green-800', 'bg-red-100 text-red-800', 'bg-purple-100 text-purple-800'];

export default function OrderDetail({ params }: { params: { orderId: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [buyer, setBuyer] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 3000); // Poll every 3s
    return () => clearInterval(interval);
  }, [params.orderId]);

  async function fetchOrder() {
    try {
      const res = await fetch(`http://localhost:3001/orders/${params.orderId}`);
      const data = await res.json();
      if (data.data) {
        setOrder(data.data);
        setLoading(false);
      }
    } catch (err) {
      console.error('Failed to fetch order:', err);
    }
  }

  async function confirmDelivery() {
    try {
      setActionLoading(true);
      setError('');
      const res = await fetch(`http://localhost:3001/orders/${params.orderId}/confirm-delivery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyer }),
      });
      if (!res.ok) throw new Error('Failed to confirm delivery');
      await fetchOrder();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setActionLoading(false);
    }
  }

  async function releaseEscrow() {
    try {
      setActionLoading(true);
      setError('');
      const res = await fetch(`http://localhost:3001/orders/${params.orderId}/release`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyer }),
      });
      if (!res.ok) throw new Error('Failed to release escrow');
      await fetchOrder();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-2xl mx-auto">
          <Link href="/orders" className="text-indigo-600 font-medium mb-4 inline-block hover:underline">← Back</Link>
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-2xl mx-auto">
          <Link href="/orders" className="text-indigo-600 font-medium mb-4 inline-block hover:underline">← Back</Link>
          <div className="bg-white p-8 rounded-lg text-center">
            <p className="text-slate-600">Order not found</p>
          </div>
        </div>
      </div>
    );
  }

  const formatPrice = (wei: string) => (Number(wei) / 1e18).toFixed(3);
  const formatAddr = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/orders" className="text-indigo-600 font-medium mb-4 inline-block hover:underline">← Back</Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Order Details</h1>

        <div className="bg-white p-8 rounded-lg shadow space-y-6">
          {/* Status */}
          <div className="flex justify-between items-center pb-6 border-b">
            <h2 className="text-lg font-semibold text-slate-900">Status</h2>
            <span className={`px-4 py-2 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
              {STATUS_LABELS[order.status]}
            </span>
          </div>

          {/* Order Info */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <p className="text-slate-600">Order ID:</p>
              <p className="font-mono text-sm text-slate-900">{order.orderId.slice(0, 12)}...</p>
            </div>
            <div className="flex justify-between">
              <p className="text-slate-600">Buyer:</p>
              <p className="font-mono text-sm text-slate-900">{formatAddr(order.buyer)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-slate-600">Vendor:</p>
              <p className="font-mono text-sm text-slate-900">{formatAddr(order.vendor)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-slate-600">Amount:</p>
              <p className="font-semibold text-indigo-600">{formatPrice(order.amount)} ETH</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="pt-6 border-t space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <p className="text-sm text-slate-700">Escrowed: {new Date(order.depositedAt * 1000).toLocaleDateString()}</p>
            </div>
            {order.deliveredAt > 0 && (
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <p className="text-sm text-slate-700">Delivered: {new Date(order.deliveredAt * 1000).toLocaleDateString()}</p>
              </div>
            )}
            {order.releasedAt > 0 && (
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-600"></div>
                <p className="text-sm text-slate-700">Released: {new Date(order.releasedAt * 1000).toLocaleDateString()}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          {order.status < 2 && (
            <div className="pt-6 border-t space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Your Address (to authorize)</label>
                <input
                  type="text"
                  value={buyer}
                  onChange={(e) => setBuyer(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {order.status === 0 && (
                <button
                  onClick={confirmDelivery}
                  disabled={!buyer || actionLoading}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {actionLoading ? 'Confirming...' : '✓ Confirm Delivery'}
                </button>
              )}

              {order.status === 1 && (
                <button
                  onClick={releaseEscrow}
                  disabled={!buyer || actionLoading}
                  className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
                >
                  {actionLoading ? 'Releasing...' : '💰 Release Escrow'}
                </button>
              )}
            </div>
          )}

          {order.status === 2 && (
            <div className="pt-6 border-t bg-green-50 p-4 rounded-lg text-center">
              <p className="text-green-800 font-medium">✓ Order Completed</p>
              <p className="text-sm text-green-700 mt-1">Funds released. Vendor & referrers paid.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
