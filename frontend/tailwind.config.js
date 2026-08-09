/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // "ink" is inverted on purpose: -50 is the deepest background layer,
        // -900 is the brightest foreground text. Every existing utility
        // (bg-ink-50, text-ink-900, border-ink-200…) now resolves to a
        // dark-glass palette without needing to rename call sites.
        ink: {
          50: '#0a0917',
          100: '#121125',
          150: '#181733',
          200: 'rgba(148,152,214,0.16)',
          300: 'rgba(168,172,224,0.28)',
          400: '#8c8fb5',
          500: '#a6a9cc',
          600: '#bfc2de',
          700: '#d6d8ec',
          800: '#eceefa',
          900: '#f8f9ff',
        },
        brand: {
          50: 'rgba(124,92,255,0.10)',
          100: 'rgba(124,92,255,0.16)',
          200: 'rgba(124,92,255,0.30)',
          300: '#a48aff',
          400: '#8f6cff',
          500: '#7c5cff',
          600: '#6a45f5',
          700: '#5934d1',
          800: '#432a9e',
          900: '#302175',
        },
        accent: {
          400: '#3fe8d6',
          500: '#22d3c4',
          600: '#0fb3a6',
        },
        void: {
          950: '#050410',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'ui-sans-serif', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '22px',
      },
      boxShadow: {
        // Layered "glass on glass" 3D system: ambient blur + tight contact
        // shadow + an inset top highlight that reads as a light catching
        // a raised bevel edge.
        card:
          '0 1px 0 0 rgba(255,255,255,0.05) inset, 0 10px 24px -12px rgba(3,2,16,0.55), 0 2px 6px -2px rgba(3,2,16,0.4)',
        'card-md':
          '0 1px 0 0 rgba(255,255,255,0.06) inset, 0 20px 45px -18px rgba(3,2,16,0.65), 0 6px 16px -6px rgba(3,2,16,0.45)',
        'card-lg':
          '0 1px 0 0 rgba(255,255,255,0.07) inset, 0 30px 70px -24px rgba(3,2,16,0.75), 0 10px 24px -8px rgba(3,2,16,0.5)',
        glow: '0 0 0 4px rgba(124,92,255,0.16), 0 0 32px -4px rgba(124,92,255,0.45)',
        'glow-cyan': '0 0 0 4px rgba(34,211,196,0.14), 0 0 28px -6px rgba(34,211,196,0.4)',
        'glow-sm': '0 0 16px -4px rgba(124,92,255,0.55)',
        button:
          '0 1px 0 0 rgba(255,255,255,0.18) inset, 0 -2px 0 0 rgba(0,0,0,0.18) inset, 0 14px 28px -10px rgba(124,92,255,0.55)',
      },
      backgroundImage: {
        'mesh-1':
          'radial-gradient(60% 50% at 15% 0%, rgba(124,92,255,0.28) 0%, rgba(124,92,255,0) 60%), radial-gradient(50% 45% at 100% 15%, rgba(34,211,196,0.20) 0%, rgba(34,211,196,0) 60%), radial-gradient(60% 60% at 50% 100%, rgba(124,92,255,0.14) 0%, rgba(124,92,255,0) 60%)',
        'grid-dot':
          'radial-gradient(rgba(168,172,224,0.16) 1px, transparent 1px)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-fast': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'spin-slow': {
          '100%': { transform: 'rotate(360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-10px,0)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.08)' },
        },
        travel: {
          '0%': { offsetDistance: '0%', opacity: '0' },
          '8%': { opacity: '1' },
          '92%': { opacity: '1' },
          '100%': { offsetDistance: '100%', opacity: '0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out both',
        'fade-in-fast': 'fade-in-fast 0.3s ease-out both',
        'scale-in': 'scale-in 0.35s ease-out both',
        shimmer: 'shimmer 1.6s infinite',
        'pulse-soft': 'pulse-soft 1.4s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'spin-slow': 'spin-slow 1.1s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
