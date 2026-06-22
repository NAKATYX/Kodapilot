'use client'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function SharePage() {
  const shareUrl = 'https://kodapilot.app/buy?ref=chiamaka'

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="text-center space-y-3">
        <div className="text-5xl animate-bounce">✅</div>
        <div className="font-sora font-black text-2xl text-neutral-900">listing live!</div>
        <p className="font-manrope text-sm text-neutral-600">your flyer is ready to share</p>
      </div>

      {/* Flyer Preview */}
      <Card className="bg-gradient-to-br from-brand-light to-emerald-50 p-6">
        <div className="text-center space-y-3">
          <div className="text-5xl">🎧</div>
          <div className="font-sora font-black text-xl text-neutral-900">oraimo freepods 4</div>
          <p className="font-manrope text-sm text-neutral-600">🎧 Premium sound, unbeatable price. New condition. Limited stock! Hit me up 👇</p>
          <div className="pt-3 border-t border-neutral-200">
            <div className="font-manrope text-xs text-neutral-500 mb-1">resale price</div>
            <div className="font-sora font-black text-2xl text-brand-primary">₦15,900</div>
          </div>
          <div className="pt-2 font-manrope text-xs text-neutral-500">hit up kodapilot.app to buy</div>
        </div>
      </Card>

      {/* Social Proof */}
      <Card>
        <div className="space-y-3 text-center">
          <div className="font-sora font-bold text-neutral-900">already getting attention 🔥</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-neutral-50 rounded-lg p-3">
              <div className="font-sora font-black text-lg text-brand-primary">47</div>
              <div className="font-manrope text-xs text-neutral-600">people viewed</div>
            </div>
            <div className="bg-neutral-50 rounded-lg p-3">
              <div className="font-sora font-black text-lg text-earn">12</div>
              <div className="font-manrope text-xs text-neutral-600">interested buyers</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Share Options */}
      <div className="space-y-2">
        <Button className="w-full" variant="primary">
          📱 share on WhatsApp
        </Button>
        <Button className="w-full" variant="secondary">
          🔗 copy link
        </Button>
        <Button className="w-full" variant="ghost">
          ⚡ share to story
        </Button>
        <Button className="w-full" variant="ghost">
          📋 copy for telegram
        </Button>
      </div>

      {/* Bonus Tip */}
      <Card className="bg-blue-50 border border-info/30">
        <div className="space-y-2">
          <div className="font-sora font-bold text-neutral-900">💡 pro tip</div>
          <p className="font-manrope text-sm text-neutral-700">
            share to 10+ people & unlock the referral bonus (₦500 per qualified buyer). your link: <span className="font-mono text-xs text-brand-primary font-bold">{shareUrl}</span>
          </p>
        </div>
      </Card>

      {/* Continue */}
      <Button className="w-full" variant="primary" size="lg">
        back to sell feed
      </Button>
    </div>
  )
}
