'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

const searchResults = [
  {
    id: '1',
    product: 'iphone 15 pro max',
    seller: 'Segun K.',
    price: 1280000,
    rating: 4.9,
    location: 'VI',
    status: 'in stock',
    icon: '📱',
  },
  {
    id: '2',
    product: 'macbook air m2',
    seller: 'Amara T.',
    price: 2850000,
    rating: 4.8,
    location: 'Yaba',
    status: 'arriving tomorrow',
    icon: '💻',
  },
  {
    id: '3',
    product: 'sony wh-1000xm5 headphones',
    seller: 'Emeka N.',
    price: 185000,
    rating: 4.7,
    location: 'Surulere',
    status: 'in stock',
    icon: '🎧',
  },
]

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<typeof searchResults | null>(null)

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsSearching(true)
    // Simulate AI search on 0G compute
    await new Promise(r => setTimeout(r, 2000))
    setResults(searchResults)
    setIsSearching(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-sora font-black text-2xl text-neutral-900 mb-2">find it for me</h1>
        <p className="font-manrope text-sm text-neutral-600">
          AI scans vetted vendors near you. instant price comparison.
        </p>
      </div>

      {/* Search Input */}
      <Card className="border-2 border-brand-primary">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="what are you looking for?"
            className="flex-1 bg-transparent font-manrope text-sm focus:outline-none"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching || !query.trim()}
            className="px-4 py-2 bg-brand-primary text-white rounded-lg font-manrope font-semibold text-xs hover:opacity-90 disabled:opacity-50"
          >
            {isSearching ? '🔍' : '→'}
          </button>
        </div>
      </Card>

      {/* Searching State */}
      {isSearching && (
        <Card className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-brand-primary border-t-transparent mb-4"></div>
          <p className="font-manrope text-sm text-neutral-600">
            scanning {query} across verified vendors...
          </p>
          <p className="font-manrope text-xs text-neutral-500 mt-2">powered by 0G compute</p>
        </Card>
      )}

      {/* Results */}
      {results && !isSearching && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="font-sora font-bold text-neutral-900">{results.length} results found</span>
            <span className="font-manrope text-xs text-neutral-500">sorted by price</span>
          </div>

          {results.map((vendor) => (
            <Card key={vendor.id} className="hover:shadow-md transition cursor-pointer">
              <div className="flex gap-3">
                {/* Vendor Icon */}
                <div className="w-12 h-12 rounded-lg bg-brand-light flex items-center justify-center text-2xl flex-shrink-0">
                  {vendor.icon}
                </div>

                {/* Vendor Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-manrope font-semibold text-sm text-neutral-900 truncate">
                    {vendor.product}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-manrope text-xs text-neutral-600">{vendor.seller}</span>
                    <Badge variant="teal">⭐ {vendor.rating}</Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-manrope text-xs text-neutral-500">📍 {vendor.location}</span>
                    <Badge variant="neutral">{vendor.status}</Badge>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right">
                  <div className="font-sora font-black text-lg text-brand-primary">
                    ₦{vendor.price.toLocaleString()}
                  </div>
                  <button className="text-xs text-brand-primary font-semibold mt-2 hover:underline">
                    check →
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isSearching && !results && (
        <div className="text-center py-12 space-y-4">
          <div className="text-4xl">🔍</div>
          <div>
            <div className="font-sora font-bold text-neutral-900">search for anything</div>
            <p className="font-manrope text-sm text-neutral-600 mt-1">
              iphones, laptops, headphones, fashion, electronics...
            </p>
          </div>

          {/* Quick Suggestions */}
          <div className="pt-4 space-y-2">
            <div className="font-manrope text-xs text-neutral-600 mb-3">trending now</div>
            <div className="flex flex-wrap gap-2 justify-center">
              {['iPhone 15', 'MacBook', 'AirPods', 'Smart TV'].map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-3 py-1.5 bg-neutral-100 rounded-full font-manrope text-xs text-neutral-700 hover:bg-neutral-200"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <Card className="bg-blue-50 border border-info/30">
        <div className="space-y-2">
          <div className="font-sora font-bold text-neutral-900">⚡ powered by 0G</div>
          <p className="font-manrope text-sm text-neutral-700">
            AI scans verified vendors using 0G compute. results are instant, prices are real-time, payments are escrow-protected.
          </p>
        </div>
      </Card>
    </div>
  )
}
