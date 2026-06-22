import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'KodaPilot — Earn from your phone',
  description: 'AI-native trust-commerce network. Resell with confidence. The copilot does the work.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <meta name="theme-color" content="#0FAB9C" />
      </head>
      <body className="bg-white text-neutral-800">
        {children}
      </body>
    </html>
  )
}
