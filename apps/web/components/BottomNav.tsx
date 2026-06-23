import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  label: string
  href: string
  path: string
  icon: (active: boolean) => React.ReactNode
}

const navItems: NavItem[] = [
  {
    label: 'Sell',
    href: '/app',
    path: '/app',
    icon: (_active) => (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l3-8H6.4M9 21h6M9 21a2 2 0 01-2-2V9M15 21a2 2 0 001-2V9M7 13L5.5 5M17 13l1.5-8" />
      </svg>
    ),
  },
  {
    label: 'Wallet',
    href: '/app/wallet',
    path: '/app/wallet',
    icon: (_active) => (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h10m4-5h2a2 2 0 012 2v9a2 2 0 01-2 2H3a2 2 0 01-2-2v-9a2 2 0 012-2h2m14 0V7a2 2 0 00-2-2H7a2 2 0 00-2 2v3" />
      </svg>
    ),
  },
  {
    label: 'Invite',
    href: '/app/invite',
    path: '/app/invite',
    icon: (_active) => (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292m0 0H8.646a4 4 0 010-5.292m3.354 0V2m0 16a4 4 0 110-5.292m0 0H8.646a4 4 0 010 5.292m3.354 0v2.292M9 20H5a2 2 0 01-2-2v-1m4-4H3a2 2 0 00-2 2v1m16 0h4a2 2 0 002-2v-1m-4-4h4a2 2 0 012 2v1" />
      </svg>
    ),
  },
  {
    label: 'Ranks',
    href: '/app/leaderboard',
    path: '/app/leaderboard',
    icon: (_active) => (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    label: 'Me',
    href: '/app/profile',
    path: '/app/profile',
    icon: (_active) => (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
]

export function BottomNav() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/app') return pathname === '/app'
    return pathname.startsWith(path)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-neutral-200 flex items-center justify-around py-3 z-40">
      {navItems.map((item) => {
        const active = isActive(item.path)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-2 py-1 px-3 transition-colors ${
              active
                ? 'text-brand-primary'
                : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            {item.icon(active)}
            <span className="font-manrope text-xs font-semibold">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
