'use client'

import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-primary to-emerald-700 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
              <path d="M5 17 L12 4 L14.4 13 L20 11 Z" fill="currentColor" />
            </svg>
          </div>
          <span className="text-2xl font-sora font-black text-neutral-800 tracking-tight">
            koda<span className="text-brand-primary">pilot</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 font-manrope font-semibold text-neutral-600">
          <a href="#how" className="hover:text-neutral-800 transition">how it works</a>
          <a href="#find" className="hover:text-neutral-800 transition">find-it-for-me</a>
          <a href="#trust" className="hover:text-neutral-800 transition">for vendors</a>
          <a href="#leaderboard" className="hover:text-neutral-800 transition">leaderboard</a>
        </div>

        <div className="flex items-center gap-3">
          <a href="/app" className="text-neutral-800 font-sora font-bold text-sm">sign in</a>
          <Link href="/app" className="btn-primary text-sm px-5 py-2">start earning</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="grid grid-cols-2 gap-12 items-center px-8 py-20 bg-gradient-to-br from-brand-secondary via-purple-900 to-purple-950 text-white max-w-8xl mx-auto">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-2 bg-brand-light/20 border border-brand-primary/40 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-primary"></span>
            <span className="font-manrope text-sm font-semibold text-brand-light">your AI copilot for reselling</span>
          </div>

          <h1 className="font-sora font-black text-6xl leading-tight mb-6 tracking-tight">
            earn from your phone.<br />the copilot does the work.
          </h1>

          <p className="font-manrope text-lg text-purple-200 mb-8 max-w-xl">
            kodapilot finds what sells near you, writes the post, sets a fair price, and keeps every payment safe with escrow. you just share — and the money lands in your wallet.
          </p>

          <div className="flex items-center gap-4 mb-10">
            <button className="btn-primary flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="2" y="6" width="20" height="13" rx="2.5" strokeWidth="2" />
                <path d="M2 10h20" strokeWidth="2" />
              </svg>
              connect wallet — it&apos;s free
            </button>
            <button className="flex items-center gap-2 text-white font-sora font-bold text-base bg-white/10 border border-white/20 px-6 py-4 rounded-full hover:bg-white/15 transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="m6 3 14 9-14 9z" />
              </svg>
              watch 90-sec demo
            </button>
          </div>

          <div className="flex items-center gap-8">
            <div>
              <div className="font-sora font-black text-3xl text-brand-primary">3 taps</div>
              <div className="font-manrope text-sm text-purple-300">to a live listing</div>
            </div>
            <div className="w-px h-10 bg-white/15"></div>
            <div>
              <div className="font-sora font-black text-3xl text-earn">₦0</div>
              <div className="font-manrope text-sm text-purple-300">to start selling</div>
            </div>
            <div className="w-px h-10 bg-white/15"></div>
            <div>
              <div className="font-sora font-black text-3xl text-info">100%</div>
              <div className="font-manrope text-sm text-purple-300">escrow-protected</div>
            </div>
          </div>
        </div>

        {/* Phone Mockup */}
        <div className="flex justify-center">
          <div className="relative w-72 h-96 bg-gradient-to-b from-neutral-800 to-black rounded-3xl p-2 shadow-2xl animate-float">
            <div className="w-full h-full bg-neutral-100 rounded-2xl overflow-hidden p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-sora font-black text-sm text-neutral-900">good afternoon</span>
                <span className="bg-brand-secondary text-white font-sora font-black text-xs px-3 py-1 rounded-full">₦48,200</span>
              </div>

              <div className="bg-brand-light border border-brand-primary rounded-2xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-brand-primary to-emerald-700 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5 17 L12 5 L14 13 L19 11.5 Z" />
                    </svg>
                  </div>
                  <span className="font-sora font-bold text-xs text-neutral-900">copilot picks</span>
                </div>
                <div className="bg-white rounded-xl p-2 flex items-center gap-2 mb-2">
                  <div className="w-11 h-11 rounded-lg bg-brand-light flex items-center justify-center text-brand-primary">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.9">
                      <path d="M6 4a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V8" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M18 4a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-manrope font-semibold text-xs text-neutral-900">oraimo freepods 4</div>
                    <div className="font-manrope text-xs text-neutral-500">trending in Yaba</div>
                  </div>
                  <div className="text-right">
                    <div className="font-manrope text-xs text-neutral-500">you earn</div>
                    <div className="font-sora font-black text-sm text-earn">₦3,400</div>
                  </div>
                </div>
                <div className="bg-brand-primary text-white text-center font-sora font-bold text-xs py-2 rounded-full">
                  list &amp; share this →
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white border border-neutral-200 rounded-lg p-2">
                <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.9">
                    <rect x="2" y="7" width="16" height="10" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M22 11v2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-manrope font-semibold text-xs text-neutral-900">anker 20,000mAh</div>
                  <div className="font-manrope text-xs text-neutral-500">sells at ₦19,500</div>
                </div>
                <span className="font-sora font-black text-xs text-earn">₦3,100</span>
              </div>

              <div className="flex items-center gap-2 bg-blue-50 rounded-lg p-2">
                <svg className="w-5 h-5 text-info flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.1">
                  <rect x="4" y="10" width="16" height="11" rx="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="font-manrope text-xs font-semibold text-info">money locked safe until delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="px-8 py-20 max-w-8xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="eyebrow text-brand-primary mb-3">how earning works</div>
          <h2 className="font-sora font-black text-5xl text-neutral-900 mb-4">three taps. real money.</h2>
          <p className="font-manrope text-lg text-neutral-600">
            no inventory, no upfront cost, no bank account needed. the copilot handles the hard parts.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              num: '01',
              title: 'copilot picks what sells',
              desc: 'it reads what\'s moving around you this week and hands you the best products to resell, with the exact margin you\'ll earn.',
              icon: 'M5 17 L12 4 L14.4 13 L20 11 Z',
            },
            {
              num: '02',
              title: 'it writes your post',
              desc: 'a ready-to-send caption, a fair price, and a clean flyer — in your voice, in English or Pidgin. edit anything, then share to WhatsApp.',
              icon: 'M4 4h16v12H5.2L4 18zM8 9h8M8 12h5',
            },
            {
              num: '03',
              title: 'money lands in your wallet',
              desc: 'when a buyer pays, funds are held safe in escrow. they confirm delivery, you get paid instantly — withdraw anytime.',
              icon: 'M2 6h20v13H2z M2 10h20',
              color: 'bg-earn/10',
              iconColor: 'text-earn',
            },
          ].map((item, i) => (
            <div key={i} className="card">
              <div className={`w-12 h-12 rounded-xl ${item.color || 'bg-brand-light'} flex items-center justify-center ${item.iconColor || 'text-brand-primary'} mb-4`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="font-sora font-bold text-sm text-brand-primary mb-2">{item.num}</div>
              <h3 className="font-sora font-black text-2xl text-neutral-900 mb-2">{item.title}</h3>
              <p className="font-manrope text-neutral-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-8 py-20 max-w-8xl mx-auto">
        <div className="bg-gradient-to-r from-brand-primary to-emerald-600 rounded-4xl p-16 text-center text-white">
          <h2 className="font-sora font-black text-5xl mb-6">start earning today. it&apos;s free.</h2>
          <Link href="/app" className="inline-flex items-center justify-center px-8 py-4 font-sora font-bold text-lg text-brand-secondary bg-white rounded-full hover:bg-neutral-50 transition">
            connect wallet →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white px-8 py-12 border-t border-neutral-800">
        <div className="max-w-8xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-emerald-700 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 17 L12 4 L14.4 13 L20 11 Z" />
                </svg>
              </div>
              <span className="font-sora font-black">kodapilot</span>
            </div>
            <span className="font-manrope text-neutral-400">© 2026 KodaPilot. on 0G.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
