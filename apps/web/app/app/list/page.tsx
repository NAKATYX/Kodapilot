'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const mockProduct = {
  name: 'oraimo freepods 4',
  basePrice: 15900,
  icon: '🎧',
}

export default function ListPage() {
  const [price, setPrice] = useState(mockProduct.basePrice)
  const [caption, setCaption] = useState('🎧 Oraimo FreePods 4 - Premium sound, unbeatable price. New condition. Limited stock! Hit me up 👇')
  const margin = Math.max(0, price - mockProduct.basePrice)

  return (
    <div className="space-y-6">
      {/* Product Summary */}
      <Card className="bg-brand-light border border-brand-primary">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center text-2xl">
            {mockProduct.icon}
          </div>
          <div className="flex-1">
            <div className="font-manrope font-semibold text-sm text-neutral-900">{mockProduct.name}</div>
            <div className="font-manrope text-xs text-neutral-500">cost: ₦{mockProduct.basePrice.toLocaleString()}</div>
          </div>
        </div>
      </Card>

      {/* Price Adjuster */}
      <div>
        <label className="font-sora font-bold text-neutral-900 mb-3 block">set your price</label>
        <div className="flex items-center gap-3 bg-white border border-neutral-200 rounded-xl p-4">
          <button
            onClick={() => setPrice(Math.max(mockProduct.basePrice, price - 1000))}
            className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center font-sora font-bold text-neutral-700 hover:bg-neutral-200"
          >
            −
          </button>
          <div className="flex-1 text-center">
            <div className="font-sora font-black text-2xl text-neutral-900">₦{price.toLocaleString()}</div>
          </div>
          <button
            onClick={() => setPrice(price + 1000)}
            className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center font-sora font-bold text-neutral-700 hover:bg-neutral-200"
          >
            +
          </button>
        </div>
      </div>

      {/* Earnings Display */}
      <Card className="bg-earn-soft border border-earn/30">
        <div className="flex items-baseline justify-between">
          <span className="font-manrope text-sm text-neutral-600">you earn per sale</span>
          <span className="font-sora font-black text-2xl text-earn">₦{margin.toLocaleString()}</span>
        </div>
      </Card>

      {/* Caption Editor */}
      <div>
        <label className="font-sora font-bold text-neutral-900 mb-2 block">selling message</label>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full px-4 py-3 border border-neutral-200 rounded-xl font-manrope text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
          rows={4}
        />
        <div className="text-xs text-neutral-500 mt-1">{caption.length} / 280 characters</div>
      </div>

      {/* Flyer Preview */}
      <div>
        <div className="font-sora font-bold text-neutral-900 mb-3">flyer preview</div>
        <Card className="bg-gradient-to-br from-brand-light to-emerald-50 p-4">
          <div className="text-center space-y-3">
            <div className="text-4xl">{mockProduct.icon}</div>
            <div className="font-sora font-black text-xl text-neutral-900">{mockProduct.name}</div>
            <div className="font-manrope text-sm text-neutral-600 line-clamp-2">{caption}</div>
            <div className="pt-3 border-t border-neutral-200">
              <div className="font-manrope text-xs text-neutral-500 mb-1">resale price</div>
              <div className="font-sora font-black text-2xl text-brand-primary">₦{price.toLocaleString()}</div>
            </div>
            <div className="pt-2 font-manrope text-xs text-neutral-500">hit up kodapilot.app to buy</div>
          </div>
        </Card>
      </div>

      {/* CTA */}
      <Button className="w-full" variant="primary" size="lg">
        create & share on WhatsApp →
      </Button>
    </div>
  )
}
