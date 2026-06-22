'use client'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useState } from 'react'

export default function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLocked, setIsLocked] = useState(false)

  const product = {
    name: 'oraimo freepods 4',
    price: 15900,
    seller: 'Chiamaka U.',
    sellerRating: 4.8,
    icon: '🎧',
  }

  const handlePay = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise(r => setTimeout(r, 2000))
    setIsLocked(true)
    setIsProcessing(false)
  }

  return (
    <div className="space-y-6">
      {/* Product Card */}
      <Card>
        <div className="flex gap-3 mb-4">
          <div className="w-16 h-16 rounded-lg bg-brand-light flex items-center justify-center text-3xl">
            {product.icon}
          </div>
          <div className="flex-1">
            <div className="font-manrope font-semibold text-sm text-neutral-900">{product.name}</div>
            <div className="font-sora font-black text-lg text-brand-primary">₦{product.price.toLocaleString()}</div>
          </div>
        </div>

        {/* Seller Info */}
        <div className="border-t border-neutral-200 pt-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-manrope text-xs text-neutral-500">sold by</div>
              <div className="font-manrope font-semibold text-sm text-neutral-900">{product.seller}</div>
            </div>
            <Badge variant="earn">⭐ {product.sellerRating}</Badge>
          </div>
        </div>
      </Card>

      {/* Escrow Explanation */}
      <Card className="bg-blue-50 border border-info/30">
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <div className="text-2xl">🔒</div>
            <div>
              <div className="font-sora font-bold text-neutral-900">safe payment with escrow</div>
              <p className="font-manrope text-sm text-neutral-700 mt-1">
                your money is protected on 0G blockchain. it stays locked until you confirm delivery.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-600">1. you pay</span>
              <span className="font-manrope font-semibold text-neutral-900">₦{product.price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-neutral-600">2. money locked (48h max)</span>
              <span className="font-manrope">⏱️</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-neutral-600">3. seller delivers</span>
              <span className="font-manrope">🚚</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-neutral-600">4. you confirm → seller gets paid</span>
              <span className="font-manrope">✅</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Order Summary */}
      <Card>
        <div className="space-y-2">
          <div className="flex justify-between font-manrope text-sm">
            <span className="text-neutral-600">product</span>
            <span className="text-neutral-900 font-semibold">₦{product.price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-manrope text-sm">
            <span className="text-neutral-600">delivery fee</span>
            <span className="text-neutral-900 font-semibold">₦500</span>
          </div>
          <div className="border-t border-neutral-200 pt-2 flex justify-between font-sora font-black text-lg">
            <span>total</span>
            <span className="text-brand-primary">₦{product.price + 500}</span>
          </div>
        </div>
      </Card>

      {/* Payment State */}
      {isLocked ? (
        <Card className="bg-earn-soft border border-earn/50 text-center py-6">
          <div className="text-5xl mb-3 animate-pulse">🔒</div>
          <div className="font-sora font-black text-lg text-neutral-900 mb-2">payment secured</div>
          <p className="font-manrope text-sm text-neutral-700 mb-4">
            ₦{(product.price + 500).toLocaleString()} is locked in escrow on 0G blockchain
          </p>
          <div className="font-manrope text-xs text-neutral-600">
            ⏱️ seller has 48 hours to deliver
          </div>
        </Card>
      ) : null}

      {/* Action */}
      <Button
        className="w-full"
        variant="primary"
        size="lg"
        onClick={handlePay}
        disabled={isProcessing || isLocked}
      >
        {isProcessing ? '⏳ processing...' : isLocked ? '✅ payment locked' : '💳 pay with wallet'}
      </Button>

      {/* Trust Indicators */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="font-manrope text-neutral-600">
          <div className="text-lg mb-1">🛡️</div>
          protected by 0G
        </div>
        <div className="font-manrope text-neutral-600">
          <div className="text-lg mb-1">⚡</div>
          instant settlement
        </div>
        <div className="font-manrope text-neutral-600">
          <div className="text-lg mb-1">✅</div>
          verified seller
        </div>
      </div>
    </div>
  )
}
