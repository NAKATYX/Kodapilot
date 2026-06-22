import React from 'react'
import { Card } from './ui/Card'

interface LeaderboardRowProps {
  rank: number
  name: string
  location: string
  earnings: number
  isUser?: boolean
  avatarColor?: string
}

export function LeaderboardRow({
  rank,
  name,
  location,
  earnings,
  isUser = false,
  avatarColor = '#7c5cff',
}: LeaderboardRowProps) {
  const formatNaira = (n: number) => '₦' + n.toLocaleString('en-NG')

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return rank.toString()
  }

  return (
    <Card
      className={`flex items-center gap-3 ${
        isUser ? 'bg-brand-light border-brand-primary' : ''
      }`}
    >
      <span className="font-sora font-black text-lg text-neutral-600 w-6">{getMedalEmoji(rank)}</span>

      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-sora font-bold flex-shrink-0"
        style={{ backgroundColor: avatarColor }}
      >
        {name[0]}
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-manrope font-semibold text-neutral-900 text-sm">{name}</div>
        <div className="font-manrope text-xs text-neutral-500">{location}</div>
      </div>

      <div className="text-right flex-shrink-0">
        <div className="font-sora font-black text-neutral-900 text-sm">{formatNaira(earnings)}</div>
      </div>
    </Card>
  )
}
