import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  label: string
  href: string
  icon: string
  path: string
}

const navItems: NavItem[] = [
  { label: 'Sell', href: '/app', icon: '🎯', path: '/app' },
  { label: 'Products', href: '/app/products', icon: '📦', path: '/app/products' },
  { label: 'Wallet', href: '/app/wallet', icon: '💳', path: '/app/wallet' },
  { label: 'Leaderboard', href: '/app/leaderboard', icon: '🏆', path: '/app/leaderboard' },
  { label: 'Profile', href: '/app/profile', icon: '👤', path: '/app/profile' },
]

export function BottomNav() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/app') return pathname === '/app'
    return pathname.startsWith(path)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-neutral-200 flex items-center justify-around py-2 z-40">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition text-center ${
            isActive(item.path)
              ? 'text-brand-primary'
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <span className="text-2xl leading-none">{item.icon}</span>
          <span className="font-manrope text-xs font-semibold">{item.label}</span>
        </Link>
      ))}
    </nav>
  )
}
