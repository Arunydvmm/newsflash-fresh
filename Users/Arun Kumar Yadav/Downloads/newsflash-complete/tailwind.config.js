/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        red:      { news: '#C62828', dark: '#B71C1C', light: '#FFEBEE' },
        charcoal: '#1A1A1A',
        ink:      '#2D2D2D',
        smoke:    '#6B6B6B',
        paper:    '#FAFAF8',
        border:   '#E0DDD5',
      },
    },
  },
  plugins: [],
}
