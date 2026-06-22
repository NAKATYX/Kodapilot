'use client'

import { BalanceCard } from '@/components/BalanceCard'
import { TransactionRow } from '@/components/TransactionRow'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

const mockTransactions = [
  {
    type: 'credit' as const,
    amount: 8500,
    description: 'resale: oneplus nord ce 3',
    timestamp: '2 hours ago',
  },
  {
    type: 'credit' as const,
    amount: 1200,
    description: 'referral: segun sold headphones',
    timestamp: '5 hours ago',
  },
  {
    type: 'debit' as const,
    amount: 5000,
    description: 'withdrawal to bank',
    timestamp: 'yesterday',
  },
  {
    type: 'credit' as const,
    amount: 4100,
    description: 'resale: samsung airbuds',
    timestamp: '2 days ago',
  },
]

export default function WalletPage() {
  return (
    <div className="space-y-6">
      <BalanceCard balance={48200} resale={30100} referral={18100} />

      <Button variant="primary" className="w-full" size="lg">
        withdraw to bank
      </Button>

      <div>
        <h3 className="font-sora font-black text-xl text-neutral-900 mb-4">recent activity</h3>
        <div className="space-y-3">
          {mockTransactions.map((tx, i) => (
            <TransactionRow
              key={i}
              type={tx.type}
              amount={tx.amount}
              description={tx.description}
              timestamp={tx.timestamp}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
