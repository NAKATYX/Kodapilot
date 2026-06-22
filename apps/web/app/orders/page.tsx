'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Order {
  orderId: string;
  buyer: string;
  vendor: string;
  amount: string;
  status: number;
  depositedAt: number;
  deliveredAt: number;
  releasedAt: number;
}

const STATUS_LABELS = ['Escrowed', 'Delivered', 'Released', 'Refunded', 'Disputed'];
const STATUS_COLORS = ['bg-yellow-100 text-yellow-800', 'bg-blue-100 text-blue-800', 'bg-green-100 text-green-800', 'bg-red-100 text-red-800', 'bg-purple-100 text-purple-800'];

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyer] = useState('0x0000000000000000000000000000000000000000');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3001/orders/buyer/${buyer}`);
        const data = await res.json();
        setOrders(data.data || []);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [buyer]);

  const formatPrice = (wei: string) => (Number(wei) / 1e18).toFixed(3);
  const formatDate = (ts: number) => (ts ? new Date(ts * 1000).toLocaleDateString() : '-');

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-indigo-600 font-medium mb-4 inline-block hover:underline">← Back</Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-8">My Orders</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-8 rounded-lg text-center">
            <p className="text-slate-600">No orders yet. <Link href="/" className="text-indigo-600 font-medium">Browse products</Link> to create one.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link key={order.orderId} href={`/orders/${order.orderId}`}>
                <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-mono text-sm text-slate-600">{order.orderId.slice(0, 10)}...</p>
                      <p className="text-sm text-slate-600">Vendor: {order.vendor.slice(0, 6)}...{order.vendor.slice(-4)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-700">
                    <span>{formatPrice(order.amount)} ETH</span>
                    <span className="text-slate-500">{formatDate(order.depositedAt)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
