'use client'

import { BalanceCard } from '@/components/BalanceCard'
import { ProductCard } from '@/components/ProductCard'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

const mockProducts = [
  { id: '1', name: 'oraimo freepods 4', price: 15900, margin: 3400, icon: '🎧', isTop: true },
  { id: '2', name: 'anker 20,000mAh power bank', price: 19500, margin: 3100, icon: '🔋' },
  { id: '3', name: 'itel p55 5g · 128gb', price: 92000, margin: 4800, icon: '📱' },
  { id: '4', name: 'hisense 43" smart tv', price: 268000, margin: 9500, icon: '📺' },
  { id: '5', name: 'oraimo watch 5', price: 21000, margin: 1800, icon: '⌚' },
]

export default function SellFeed() {
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
        {mockProducts.filter(p => p.isTop).map(product => (
          <Card key={product.id} className="mb-3 bg-brand-light border border-brand-primary">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-brand-primary to-emerald-700 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 17 L12 5 L14 13 L19 11.5 Z" />
                </svg>
              </div>
              <span className="font-sora font-bold text-xs text-neutral-900">copilot picks</span>
            </div>

            <div className="bg-white rounded-xl p-2 flex items-center gap-2 mb-2">
              <div className="w-11 h-11 rounded-lg bg-brand-light flex items-center justify-center text-brand-primary">
                {product.icon}
              </div>
              <div className="flex-1">
                <div className="font-manrope font-semibold text-xs text-neutral-900">{product.name}</div>
                <div className="font-manrope text-xs text-neutral-500">trending in Yaba</div>
              </div>
              <div className="text-right">
                <div className="font-manrope text-xs text-neutral-500">you earn</div>
                <div className="font-sora font-black text-sm text-earn">₦{product.margin.toLocaleString()}</div>
              </div>
            </div>

            <Button className="w-full" variant="primary">
              list & share this →
            </Button>
          </Card>
        ))}
      </div>

      {/* More Products */}
      <div>
        <div className="flex items-center justify-between mb-3 px-2">
          <span className="font-sora font-black text-sm text-neutral-900">more that sells near you</span>
          <span className="font-manrope text-xs text-neutral-500">tap to list</span>
        </div>

        <div className="space-y-2">
          {mockProducts.filter(p => !p.isTop).map(product => (
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
      <div className="grid grid-cols-2 gap-3 pt-2">
        <Card className="text-center py-6 cursor-pointer hover:bg-neutral-50">
          <div className="text-3xl mb-2">📝</div>
          <div className="font-manrope font-semibold text-xs text-neutral-700">list manually</div>
        </Card>
        <Card className="text-center py-6 cursor-pointer hover:bg-neutral-50">
          <div className="text-3xl mb-2">🔗</div>
          <div className="font-manrope font-semibold text-xs text-neutral-700">my listings</div>
        </Card>
      </div>
    </div>
  )
}
