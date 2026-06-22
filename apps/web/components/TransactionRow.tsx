import React from 'react'
import { Card } from './ui/Card'

interface TransactionRowProps {
  type: 'credit' | 'debit'
  amount: number
  description: string
  timestamp: string
}

export function TransactionRow({ type, amount, description, timestamp }: TransactionRowProps) {
  const formatNaira = (n: number) => '₦' + n.toLocaleString('en-NG')
  const isCredit = type === 'credit'

  return (
    <Card className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
            isCredit ? 'bg-earn-soft text-earn' : 'bg-neutral-200 text-neutral-600'
          }`}
        >
          {isCredit ? '↓' : '↑'}
        </div>
        <div>
          <div className="font-manrope font-semibold text-neutral-900 text-sm">{description}</div>
          <div className="font-manrope text-xs text-neutral-500">{timestamp}</div>
        </div>
      </div>

      <div
        className={`font-sora font-black text-sm ${isCredit ? 'text-earn' : 'text-neutral-600'}`}
      >
        {isCredit ? '+' : '-'}
        {formatNaira(Math.abs(amount))}
      </div>
    </Card>
  )
}
