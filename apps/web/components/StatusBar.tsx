export function StatusBar() {
  return (
    <div className="h-12 bg-white border-b border-neutral-200 flex items-end justify-between px-6 pb-1 pointer-events-none">
      <span className="font-sora font-bold text-sm text-neutral-800">9:41</span>

      <div className="flex items-center gap-2 text-neutral-800">
        <svg className="w-4 h-4" viewBox="0 0 18 12" fill="currentColor">
          <rect x="0" y="7" width="3" height="5" rx="1" />
          <rect x="5" y="4" width="3" height="8" rx="1" />
          <rect x="10" y="2" width="3" height="10" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>

        <svg className="w-4 h-3" viewBox="0 0 17 12" fill="currentColor">
          <path d="M8.5 2.5c2.3 0 4.4.9 6 2.4l1.3-1.4A11 11 0 0 0 8.5.5 11 11 0 0 0 1.2 3.5L2.5 4.9A8.6 8.6 0 0 1 8.5 2.5z" />
          <path d="M8.5 6.2c1.3 0 2.5.5 3.4 1.4l1.3-1.4a7 7 0 0 0-9.4 0l1.3 1.4A4.7 4.7 0 0 1 8.5 6.2z" />
          <circle cx="8.5" cy="10" r="1.6" />
        </svg>

        <div className="flex items-center gap-1">
          <div className="w-6 h-3 border border-neutral-800 rounded-sm p-0.5">
            <div className="w-5 h-full bg-neutral-800 rounded-px"></div>
          </div>
          <div className="w-0.5 h-1 bg-neutral-800 rounded-px opacity-60"></div>
        </div>
      </div>
    </div>
  )
}
