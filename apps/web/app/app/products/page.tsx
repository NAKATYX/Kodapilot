'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Products() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')

  useEffect(() => {
    fetchProducts()
  }, [category])

  async function fetchProducts() {
    try {
      setLoading(true)
      const res = await fetch('http://localhost:3001/products')
      const data = await res.json()
      setProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load products:', err)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['all', 'electronics', 'fashion', 'home', 'beauty']

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      {/* Search & Filter */}
      <div className="mb-6">
        <div className="bg-white border border-neutral-200 rounded-lg p-3 flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="m21 21-4.3-4.3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <input
            type="text"
            placeholder="find products..."
            className="flex-1 bg-transparent font-manrope text-sm focus:outline-none"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full font-manrope text-xs font-semibold whitespace-nowrap transition capitalize ${
                category === cat
                  ? 'bg-brand-primary text-white'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-brand-primary border-t-transparent"></div>
          <p className="text-neutral-600 mt-2">loading...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl">
          <div className="text-4xl mb-2">📦</div>
          <p className="text-neutral-600 font-manrope">no products in this category</p>
          <p className="text-sm text-neutral-500 mt-1">check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {products.map((product: any, i: number) => (
            <Link key={i} href={`/checkout/${product.id}`}>
              <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden hover:shadow-md transition cursor-pointer h-full flex flex-col">
                {/* Image */}
                <div className="w-full h-32 bg-brand-light flex items-center justify-center text-3xl">
                  📱
                </div>

                {/* Info */}
                <div className="p-3 flex-1 flex flex-col">
                  <h3 className="font-manrope font-semibold text-sm text-neutral-900 mb-2 line-clamp-2 flex-1">
                    {product.title || product.name || 'Product'}
                  </h3>

                  <div className="border-t border-neutral-200 pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-neutral-500">price</span>
                      <span className="font-sora font-bold text-sm text-neutral-900">
                        ₦{product.price || '15,000'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-500">you earn</span>
                      <span className="font-sora font-black text-sm text-earn">
                        ₦{product.margin || '3,400'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <button className="w-full py-2 bg-brand-primary text-white font-manrope font-bold text-xs rounded-lg mx-3 mb-3 hover:opacity-90 transition">
                  resell
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
