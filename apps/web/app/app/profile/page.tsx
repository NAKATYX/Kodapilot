'use client'

export default function Profile() {
  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      {/* Profile Card */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 mb-6 text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-primary to-emerald-600 flex items-center justify-center text-white font-sora font-black text-2xl mx-auto mb-4">
          C
        </div>
        <div className="font-sora font-black text-2xl text-neutral-900 mb-1">Chiamaka U.</div>
        <div className="font-manrope text-neutral-600 text-sm mb-4">Yaba, Lagos</div>
        <div className="flex items-center justify-center gap-2 text-sm font-manrope">
          <span className="text-earn font-bold">★ 4.8</span>
          <span className="text-neutral-500">· 23 sales</span>
        </div>
      </div>

      {/* Reputation */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 mb-6">
        <h3 className="font-sora font-black text-lg text-neutral-900 mb-4">your reputation</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-manrope text-sm text-neutral-600">verified genuine</span>
              <span className="font-sora font-bold text-brand-primary">92%</span>
            </div>
            <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
              <div className="h-full bg-earn" style={{ width: '92%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-manrope text-sm text-neutral-600">on-time delivery</span>
              <span className="font-sora font-bold text-brand-primary">100%</span>
            </div>
            <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
              <div className="h-full bg-earn" style={{ width: '100%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-manrope text-sm text-neutral-600">buyer satisfaction</span>
              <span className="font-sora font-bold text-brand-primary">96%</span>
            </div>
            <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
              <div className="h-full bg-earn" style={{ width: '96%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white border border-neutral-200 rounded-xl p-4 text-center">
          <div className="font-sora font-black text-2xl text-earn">23</div>
          <div className="font-manrope text-xs text-neutral-600">completed sales</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-4 text-center">
          <div className="font-sora font-black text-2xl text-brand-primary">₦1,240</div>
          <div className="font-manrope text-xs text-neutral-600">avg per sale</div>
        </div>
      </div>

      {/* Menu */}
      <div className="space-y-2">
        {[
          { icon: '🔗', label: 'invite friends', value: 'earn 5% override' },
          { icon: '📋', label: 'my listings', value: '12 active' },
          { icon: '📱', label: 'vendor console', value: 'go live' },
          { icon: '⚙️', label: 'settings', value: '' },
          { icon: '❓', label: 'help & support', value: '' },
          { icon: '👋', label: 'sign out', value: '' },
        ].map((item, i) => (
          <button
            key={i}
            className="w-full bg-white border border-neutral-200 rounded-xl p-4 flex items-center justify-between hover:border-neutral-300 transition text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{item.icon}</span>
              <span className="font-manrope font-semibold text-neutral-900">{item.label}</span>
            </div>
            {item.value && <span className="text-xs font-manrope text-neutral-500">{item.value}</span>}
          </button>
        ))}
      </div>
    </div>
  )
}
