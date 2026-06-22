/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors (from prototype CSS variables)
        brand: {
          primary: '#0FAB9C',    // Teal
          primaryDark: '#15C2B0', // Teal (dark mode)
          secondary: '#2B0B5E',  // Dark purple
          light: '#DCF4F1',      // Light teal
          lightSoft: 'rgba(15,171,156,0.16)',
        },
        // Semantic colors
        earn: {
          DEFAULT: '#129257',
          dark: '#2FD183',
          soft: '#E3F5EB',
        },
        info: {
          DEFAULT: '#2F5EFF',
          dark: '#6E94FF',
          soft: '#E6ECFF',
        },
        warning: '#FF9D4B',
        danger: '#E63946',
        // Neutrals (light mode)
        neutral: {
          50: '#F3F2F8',
          100: '#F8F7FC',
          200: '#EAE8F2',
          300: '#E3E0EC',
          400: '#A29DB4',
          500: '#6B6680',
          600: '#46415C',
          700: '#1A1530',
          800: '#1A1A1A',
          900: '#0E0A1E',
        },
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
      },
      fontSize: {
        xs: ['11px', { lineHeight: '16px', fontWeight: '600' }],
        sm: ['12.5px', { lineHeight: '18px' }],
        base: ['13.5px', { lineHeight: '20px' }],
        lg: ['14.5px', { lineHeight: '22px' }],
        xl: ['16px', { lineHeight: '24px' }],
        '2xl': ['18px', { lineHeight: '28px' }],
        '3xl': ['20px', { lineHeight: '28px' }],
        '4xl': ['22px', { lineHeight: '32px' }],
        '5xl': ['26px', { lineHeight: '32px' }],
        '6xl': ['36px', { lineHeight: '44px' }],
      },
      spacing: {
        '4.5': '1.125rem',
        '13': '3.25rem',
        '14': '3.5rem',
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '32': '8rem',
        '36': '9rem',
        '48': '12rem',
        '56': '14rem',
        '64': '16rem',
        '72': '18rem',
        '80': '20rem',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '28px',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(43, 11, 94, 0.08)',
        'md': '0 4px 12px rgba(43, 11, 94, 0.1)',
        'lg': '0 8px 24px rgba(43, 11, 94, 0.12)',
        'xl': '0 18px 40px rgba(43, 11, 94, 0.1)',
        'accent': '0 8px 20px rgba(15, 171, 156, 0.32)',
        'earn': '0 10px 22px rgba(47, 209, 131, 0.3)',
        'escrow': '0 12px 26px rgba(47, 94, 255, 0.32)',
      },
      animation: {
        float: 'kpFloat 6s ease-in-out infinite',
        up: 'kpUp 0.4s ease both',
        pop: 'kpPop 0.5s ease both',
        spin: 'kpSpin 0.7s linear infinite',
        lock: 'kpLock 0.6s ease both, kpGlow 1.4s ease-out 1',
        ring: 'kpRing 1.8s ease-out infinite',
      },
      keyframes: {
        kpFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-7px)' },
        },
        kpUp: {
          'from': { opacity: '0', transform: 'translateY(12px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        kpPop: {
          '0%': { transform: 'scale(0.78)' },
          '62%': { transform: 'scale(1.06)' },
          '100%': { transform: 'scale(1)' },
        },
        kpLock: {
          '0%': { transform: 'scale(1)' },
          '28%': { transform: 'scale(0.88)' },
          '60%': { transform: 'scale(1.04)' },
          '100%': { transform: 'scale(1)' },
        },
        kpGlow: {
          '0%': { boxShadow: '0 0 0 0 rgba(47,94,255,.45)' },
          '100%': { boxShadow: '0 0 0 16px rgba(47,94,255,0)' },
        },
        kpRing: {
          '0%': { boxShadow: '0 0 0 0 rgba(15,171,156,.5)' },
          '100%': { boxShadow: '0 0 0 12px rgba(15,171,156,0)' },
        },
        kpSpin: {
          'to': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}
