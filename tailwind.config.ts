import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dalva: {
          bg: '#0B0F1A',
          surface: '#111827',
          card: '#1A2035',
          border: 'rgba(148, 163, 184, 0.12)',
          'border-hover': 'rgba(148, 163, 184, 0.25)',
          gold: '#C9A84C',
          'gold-soft': '#D4B968',
          'gold-muted': 'rgba(201, 168, 76, 0.15)',
          'gold-glow': 'rgba(201, 168, 76, 0.08)',
          blue: '#3B82F6',
          'blue-soft': '#60A5FA',
          'blue-muted': 'rgba(59, 130, 246, 0.15)',
          purple: '#8B5CF6',
          'purple-muted': 'rgba(139, 92, 246, 0.15)',
          green: '#22C55E',
          'green-muted': 'rgba(34, 197, 94, 0.15)',
          amber: '#F59E0B',
          'amber-muted': 'rgba(245, 158, 11, 0.15)',
          red: '#EF4444',
          'red-muted': 'rgba(239, 68, 68, 0.15)',
          cyan: '#06B6D4',
          'cyan-muted': 'rgba(6, 182, 212, 0.15)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'glass-sm': '0 4px 16px rgba(0, 0, 0, 0.2)',
        'gold': '0 0 20px rgba(201, 168, 76, 0.15)',
        'glow': '0 0 30px rgba(59, 130, 246, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh': 'linear-gradient(135deg, rgba(201, 168, 76, 0.03) 0%, transparent 50%, rgba(59, 130, 246, 0.03) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
