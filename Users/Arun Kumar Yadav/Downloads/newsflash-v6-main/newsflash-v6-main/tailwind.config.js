/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand
        brand: {
          red:    '#C62828',
          dark:   '#B71C1C',
          light:  '#FFEBEE',
        },
        // Premium navy accent
        navy: {
          DEFAULT: '#0D1B2A',
          light:   '#1B2B3A',
          muted:   '#2C3E50',
        },
        // Gold accent
        gold: {
          DEFAULT: '#D4A017',
          light:   '#F5D76E',
          dark:    '#B8860B',
        },
        // Neutrals
        charcoal: '#1A1A1A',
        ink:      '#2D2D2D',
        smoke:    '#6B6B6B',
        paper:    '#FAFAF8',
        border:   '#E0DDD5',
        // Cricket
        cricket: {
          green:  '#1B5E20',
          pitch:  '#4CAF50',
          sky:    '#0288D1',
        },
        // Sarkari
        sarkari: {
          orange: '#E65100',
          saffron:'#FF6F00',
          green:  '#1B5E20',
        },
      },
      fontFamily: {
        serif:  ['Playfair Display', 'Georgia', 'serif'],
        sans:   ['Inter', 'system-ui', 'sans-serif'],
        mono:   ['JetBrains Mono', 'monospace'],
      },
      animation: {
        ticker:   'ticker 40s linear infinite',
        fadeIn:   'fadeIn 0.3s ease-in-out',
        slideUp:  'slideUp 0.4s ease-out',
        pulse:    'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer:  'shimmer 1.5s infinite',
      },
      keyframes: {
        ticker:  { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
}
