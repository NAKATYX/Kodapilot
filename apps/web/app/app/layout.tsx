'use client'

import { StatusBar } from '@/components/StatusBar'
import { BottomNav } from '@/components/BottomNav'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-neutral-50 overflow-hidden">
      <StatusBar />

      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-6 pb-24">
          {children}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
