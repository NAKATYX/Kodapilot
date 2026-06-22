'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  description: string;
  margin_bps: number;
  authenticity_score: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [category]);

  async function fetchProducts() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (category) params.append('category', category);

      const res = await fetch(`http://localhost:3001/products?${params}`);
      const data = await res.json();
      setProducts(data.data || []);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  }

  const formatPrice = (wei: string) => {
    const eth = Number(wei) / 1e18;
    return eth.toFixed(3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <header className="max-w-6xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">KodaPilot</h1>
        <p className="text-lg text-slate-600">AI-native trust-commerce network. Resell with confidence.</p>
      </header>

      <div className="max-w-6xl mx-auto">
        {/* Category Filter */}
        <div className="mb-8 flex gap-2 flex-wrap">
          <button
            onClick={() => setCategory('')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              category === ''
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            All
          </button>
          {['electronics', 'fashion', 'home'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                category === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
            <p className="text-slate-600 mt-4">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600">No products found. Try a different category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/checkout/${product.id}`}>
                <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden">
                  {/* Product Image Placeholder */}
                  <div className="h-40 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl mb-2">📦</div>
                      <p className="text-xs text-slate-600">Product Image</p>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-slate-900 mb-1 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <p className="text-xs text-slate-500">Price</p>
                        <p className="text-lg font-bold text-indigo-600">{formatPrice(product.price)} ETH</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Margin</p>
                        <p className="text-lg font-bold text-green-600">{(product.margin_bps / 100).toFixed(1)}%</p>
                      </div>
                    </div>

                    {/* Authenticity Score */}
                    <div className="mb-3">
                      <p className="text-xs text-slate-500 mb-1">Genuine Score</p>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 transition"
                          style={{ width: `${product.authenticity_score}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* CTA */}
                    <button className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition">
                      Resell Now
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <footer className="max-w-6xl mx-auto mt-12 pt-8 border-t border-slate-300">
        <div className="flex gap-6 justify-center text-sm text-slate-600">
          <Link href="/orders" className="hover:text-indigo-600 font-medium">
            My Orders
          </Link>
          <a href="http://localhost:3001/swagger" target="_blank" className="hover:text-indigo-600 font-medium">
            API Docs
          </a>
        </div>
      </footer>
    </div>
  );
}
