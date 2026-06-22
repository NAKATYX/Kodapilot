import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-neutral-700 mb-2">{label}</label>}
      <input
        className={`w-full px-4 py-3 font-manrope text-base border rounded-lg bg-white transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent ${
          error ? 'border-red-500' : 'border-neutral-200'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
