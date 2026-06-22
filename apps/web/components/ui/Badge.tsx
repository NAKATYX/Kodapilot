import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'teal' | 'earn' | 'info' | 'neutral'
  icon?: React.ReactNode
}

export function Badge({ children, variant = 'teal', icon }: BadgeProps) {
  const variants = {
    teal: 'bg-brand-light text-brand-primary',
    earn: 'bg-earn-soft text-earn',
    info: 'bg-info-soft text-info',
    neutral: 'bg-neutral-200 text-neutral-600',
  }

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 font-manrope text-xs font-semibold rounded-full ${variants[variant]}`}>
      {icon}
      {children}
    </span>
  )
}
