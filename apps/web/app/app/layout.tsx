'use client'

import { StatusBar } from '@/components/StatusBar'
import { BottomNav } from '@/components/BottomNav'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* MOBILE VIEW: Phone mockup (< md breakpoint) */}
      <div className="md:hidden flex flex-col h-screen w-full bg-neutral-50 overflow-hidden">
        <StatusBar />
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-6 pb-24">
            {children}
          </div>
        </div>
        <BottomNav />
      </div>

      {/* DESKTOP VIEW: Full-width layout (>= md breakpoint) */}
      <div className="hidden md:flex flex-col min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100">
        {/* Desktop header/nav */}
        <div className="border-b border-neutral-200 bg-white sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-primary to-emerald-700 flex items-center justify-center">
                <span className="text-white font-sora font-bold text-lg">π</span>
              </div>
              <div className="font-sora font-black text-xl text-neutral-900">
                koda<span className="text-brand-primary">pilot</span>
              </div>
            </div>
            <div className="text-sm text-neutral-600">Reseller Dashboard</div>
          </div>
        </div>

        {/* Desktop main content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-8">
            {children}
          </div>
        </div>

        {/* Desktop footer */}
        <div className="border-t border-neutral-200 bg-white py-4">
          <div className="max-w-6xl mx-auto px-6 text-center text-xs text-neutral-500">
            KodaPilot &mdash; AI-native trust-commerce network Β· 2026
          </div>
        </div>
      </div>
    </>
  )
}
