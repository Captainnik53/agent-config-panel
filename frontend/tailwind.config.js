/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        app: {
          bg:      '#080d1a',
          sidebar: '#0b1120',
          panel:   '#0e1428',
          card:    '#111c35',
          border:  '#1e2d4d',
          border2: '#243047',
          accent:  '#6366f1',
          accent2: '#8b5cf6',
          teal:    '#06b6d4',
          green:   '#10b981',
          amber:   '#f59e0b',
          red:     '#ef4444',
          text:    '#e2e8f0',
          muted:   '#64748b',
          soft:    '#94a3b8',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['SF Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
