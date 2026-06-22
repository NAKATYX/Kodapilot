'use client'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function InvitePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-sora font-black text-2xl text-neutral-900">Invite & Earn</h1>
        <p className="font-manrope text-sm text-neutral-600 mt-2">
          Share your unique link and earn 5% on every sale your invites make
        </p>
      </div>

      {/* Earnings Card */}
      <Card className="bg-gradient-to-br from-brand-primary to-emerald-600 text-white">
        <div className="mb-6">
          <div className="font-manrope text-sm opacity-90">Your 5% Override Earnings</div>
          <div className="font-sora font-black text-4xl mt-2">₦11,280</div>
          <div className="font-manrope text-xs opacity-80 mt-2">From 7 people you invited</div>
        </div>
      </Card>

      {/* Referral Link */}
      <Card>
        <div className="mb-4">
          <div className="font-sora font-bold text-sm text-neutral-900 mb-3">Your Referral Link</div>
          <div className="flex gap-2 items-center bg-neutral-50 border border-neutral-200 rounded-xl p-3">
            <input
              type="text"
              value="kodapilot.ng/c/chiamaka"
              readOnly
              className="flex-1 bg-transparent font-manrope text-sm text-neutral-600 outline-none"
            />
            <Button
              variant="primary"
              size="sm"
              className="!px-3 !py-2"
              onClick={() => navigator.clipboard.writeText('kodapilot.ng/c/chiamaka')}
            >
              Copy
            </Button>
          </div>
        </div>
      </Card>

      {/* Share Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="primary" className="w-full">
          📱 WhatsApp
        </Button>
        <Button variant="secondary" className="w-full">
          📋 Copy Link
        </Button>
      </div>

      {/* How It Works */}
      <Card>
        <div className="mb-4">
          <h3 className="font-sora font-bold text-neutral-900">How It Works</h3>
        </div>
        <div className="space-y-3 font-manrope text-sm">
          <div className="flex gap-3">
            <span className="font-bold text-brand-primary">1</span>
            <p className="text-neutral-700">Share your link with friends</p>
          </div>
          <div className="flex gap-3">
            <span className="font-bold text-brand-primary">2</span>
            <p className="text-neutral-700">They sign up and start selling</p>
          </div>
          <div className="flex gap-3">
            <span className="font-bold text-brand-primary">3</span>
            <p className="text-neutral-700">You earn 5% on their sales for 90 days</p>
          </div>
        </div>
      </Card>

      {/* Invited People */}
      <Card>
        <div className="mb-4">
          <h3 className="font-sora font-bold text-neutral-900">People You Invited</h3>
          <p className="font-manrope text-xs text-neutral-500 mt-1">7 active resellers</p>
        </div>
        <div className="space-y-3">
          {[
            { name: 'Blessing E.', earning: 2400 },
            { name: 'Emeka N.', earning: 1800 },
            { name: 'Seyi A.', earning: 1200 },
          ].map((person) => (
            <div key={person.name} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
              <div className="font-manrope text-sm text-neutral-900 font-semibold">{person.name}</div>
              <div className="font-sora font-bold text-earn text-sm">₦{person.earning.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
