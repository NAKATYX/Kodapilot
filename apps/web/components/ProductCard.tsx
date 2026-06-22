import React from 'react'
import { Card } from './ui/Card'

interface ProductCardProps {
  id: string
  name: string
  price: number
  margin: number
  icon: string
  onClick?: () => void
}

export function ProductCard({ id, name, price, margin, icon, onClick }: ProductCardProps) {
  const formatNaira = (n: number) => '₦' + n.toLocaleString('en-NG')

  return (
    <Card onClick={onClick} className="flex gap-4">
      <div className="w-16 h-16 rounded-lg bg-brand-light flex items-center justify-center flex-shrink-0 text-3xl">
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-manrope font-semibold text-neutral-900 mb-1 line-clamp-2">{name}</h3>
        <p className="text-xs text-neutral-500 mb-3">trending in Yaba</p>

        <div className="flex items-center justify-between">
          <span className="text-xs font-manrope text-neutral-600">cost: {formatNaira(Math.floor(price * 0.8))}</span>
          <div className="text-right">
            <div className="text-xs text-neutral-500">you earn</div>
            <div className="font-sora font-black text-earn text-sm">{formatNaira(margin)}</div>
          </div>
        </div>
      </div>
    </Card>
  )
}
