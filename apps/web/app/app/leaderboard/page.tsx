'use client'

import { LeaderboardRow } from '@/components/LeaderboardRow'
import { Card } from '@/components/ui/Card'

const leaderboardData = [
  { rank: 1, name: 'Blessing E.', location: 'Yaba', earnings: 182400, color: '#7c5cff' },
  { rank: 2, name: 'Emeka N.', location: 'Akoka', earnings: 164900, color: '#ff8a5c' },
  { rank: 3, name: 'Chioma D.', location: 'VI', earnings: 158200, color: '#e0609a' },
  { rank: 4, name: 'you (Chiamaka)', location: 'Yaba', earnings: 149640, color: '#0FAB9C', isUser: true },
  { rank: 5, name: 'Tunde K.', location: 'Surulere', earnings: 142300, color: '#5b8cff' },
  { rank: 6, name: 'Ada M.', location: 'Lekki', earnings: 138500, color: '#c9821f' },
]

export default function LeaderboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-primary to-emerald-600 text-white rounded-2xl p-6 shadow-accent">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-manrope text-sm text-white/85">top resellers · Yaba · this week</div>
            <div className="font-sora font-black text-3xl">🏆 leaderboard</div>
          </div>
          <div className="text-right">
            <div className="font-manrope text-xs text-white/80">bonus pool</div>
            <div className="font-sora font-black text-2xl">₦25,000</div>
          </div>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-1">
        {leaderboardData.map((entry) => (
          <LeaderboardRow
            key={entry.rank}
            rank={entry.rank}
            name={entry.name}
            location={entry.location}
            earnings={entry.earnings}
            isUser={entry.isUser}
            avatarColor={entry.color}
          />
        ))}
      </div>

      {/* Info Box */}
      <Card className="bg-blue-50 border-info/30">
        <div className="font-sora font-bold text-neutral-900 mb-2">💡 climb the ranks</div>
        <p className="font-manrope text-sm text-neutral-700">
          earn 5% override on your invites&apos; sales for 90 days. reach top 3 and split the weekly bonus pool.
        </p>
      </Card>
    </div>
  )
}
