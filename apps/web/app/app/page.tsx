'use client'

import { BalanceCard } from '@/components/BalanceCard'
import { ProductCard } from '@/components/ProductCard'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface Product {
  id: string
  name: string
  price: number
  margin: number
  icon: string
}

const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'oraimo freepods 4', price: 15900, margin: 3400, icon: '🎧' },
  { id: '2', name: 'anker 20,000mAh power bank', price: 19500, margin: 3100, icon: '🔋' },
  { id: '3', name: 'itel p55 5g · 128gb', price: 92000, margin: 4800, icon: '📱' },
  { id: '4', name: 'hisense 43" smart tv', price: 268000, margin: 9500, icon: '📺' },
  { id: '5', name: 'oraimo watch 5', price: 21000, margin: 1800, icon: '⌚' },
  { id: '6', name: 'tecno phantom x', price: 145000, margin: 8200, icon: '📱' },
  { id: '7', name: 'samsung soundbar', price: 45000, margin: 6100, icon: '🔊' },
]

export default function SellFeed() {
  const topProduct = MOCK_PRODUCTS[0]
  const otherProducts = MOCK_PRODUCTS.slice(1)

  return (
    <div className="space-y-6">
      {/* Balance Header */}
      <BalanceCard balance={48200} resale={30100} referral={18100} />

      {/* Copilot Picks Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-sora font-black text-2xl text-neutral-900">copilot picks</h2>
              <button className="text-brand-primary font-manrope font-semibold text-sm hover:underline">
                let AI pick →
              </button>
            </div>

            {/* Top Pick Card */}
            <Card className="mb-3 bg-brand-light border border-brand-primary hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-brand-primary to-emerald-700 flex items-center justify-center animate-pulse">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 17 L12 5 L14 13 L19 11.5 Z" />
                  </svg>
                </div>
                <span className="font-sora font-bold text-xs text-neutral-900">✨ copilot picks</span>
              </div>

              <div className="bg-white rounded-xl p-3 flex items-center gap-3 mb-3 shadow-soft">
                <div className="w-12 h-12 rounded-lg bg-brand-light flex items-center justify-center text-xl flex-shrink-0">
                  {topProduct.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-manrope font-semibold text-sm text-neutral-900 line-clamp-1">{topProduct.name}</div>
                  <div className="font-manrope text-xs text-neutral-500">trending in Yaba</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-manrope text-xs text-neutral-500">you earn</div>
                  <div className="font-sora font-black text-base text-earn">₦{topProduct.margin.toLocaleString()}</div>
                </div>
              </div>

              <Button className="w-full" variant="primary">
                list & share this →
              </Button>
            </Card>
        </div>

      {/* More Products */}
      <div>
        <h3 className="font-sora font-black text-lg text-neutral-900 mb-4">more that sells near you</h3>
        <div className="space-y-3">
          {otherProducts.map(product => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              margin={product.margin}
              icon={product.icon}
              onClick={() => console.log('clicked', product.id)}
            />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 pt-4">
        <Card className="text-center py-8 cursor-pointer hover:shadow-md transition-all duration-300 hover:bg-brand-light/30">
          <div className="text-4xl mb-3">📝</div>
          <div className="font-manrope font-semibold text-sm text-neutral-700">list manually</div>
          <div className="font-manrope text-xs text-neutral-500 mt-1">add your own</div>
        </Card>
        <Card className="text-center py-8 cursor-pointer hover:shadow-md transition-all duration-300 hover:bg-brand-light/30">
          <div className="text-4xl mb-3">📊</div>
          <div className="font-manrope font-semibold text-sm text-neutral-700">my listings</div>
          <div className="font-manrope text-xs text-neutral-500 mt-1">12 active</div>
        </Card>
      </div>
    </div>
  )
}
