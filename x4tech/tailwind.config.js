/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      colors: {
        x4: {
          black: '#040408',
          dark: '#08080F',
          card: '#0D0D1A',
          border: '#1A1A2E',
          blue: '#0066FF',
          cyan: '#00D4FF',
          purple: '#7B00FF',
          accent: '#FF003C',
          text: '#E8E8F0',
          muted: '#6B6B8A',
        }
      }
    }
  },
  plugins: []
}
