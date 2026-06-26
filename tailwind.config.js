/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#A68B67',
        },
      },
      fontFamily: {
        condensed: ['"Open Sans Condensed"', 'sans-serif'],
        sans: ['"Open Sans"', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        modalIn: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in':  'fadeIn 0.25s ease',
        'slide-up': 'slideUp 0.35s ease',
        'modal-in': 'modalIn 0.25s ease',
      },
    },
  },
  plugins: [],
}
