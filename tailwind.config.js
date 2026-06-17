/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0B0F1A',
          raised: '#131929',
          overlay: '#1A2236',
          border: '#243050',
        },
        brand: {
          purple: '#6C63FF',
          cyan: '#00D4FF',
          'purple-dim': '#4B44CC',
          'cyan-dim': '#0096B3',
        },
        ink: {
          DEFAULT: '#F0F4FF',
          muted: '#8892B0',
          faint: '#4A5578',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'rank-up': 'rankUp 0.5s ease-out',
        'rank-down': 'rankDown 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        rankUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0.5' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        rankDown: {
          '0%': { transform: 'translateY(-8px)', opacity: '0.5' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
