import React from 'react'

interface BalanceCardProps {
  balance: number
  resale: number
  referral: number
}

export function BalanceCard({ balance, resale, referral }: BalanceCardProps) {
  const formatNaira = (n: number) => '₦' + n.toLocaleString('en-NG')

  return (
    <div className="bg-gradient-to-br from-brand-primary to-emerald-600 text-white rounded-2xl p-6 shadow-accent">
      <div className="font-manrope text-sm opacity-90">your balance</div>
      <div className="font-sora font-black text-4xl mt-2 font-variant-numeric">{formatNaira(balance)}</div>

      <div className="flex gap-4 mt-6 text-xs font-manrope">
        <div>
          <div className="opacity-75">resale</div>
          <div className="font-bold">{formatNaira(resale)}</div>
        </div>
        <div>
          <div className="opacity-75">referral</div>
          <div className="font-bold">{formatNaira(referral)}</div>
        </div>
      </div>
    </div>
  )
}
