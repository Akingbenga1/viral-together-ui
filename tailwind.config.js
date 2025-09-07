/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
        // Dark form colors matching the uploaded image
        'form-bg': {
          DEFAULT: '#1e293b', // slate-800
          dark: '#0f172a',    // slate-900
        },
        'form-surface': {
          DEFAULT: '#334155', // slate-700
          dark: '#1e293b',    // slate-800
        },
        'form-input': {
          DEFAULT: '#475569', // slate-600
          dark: '#334155',    // slate-700
          focus: '#64748b',   // slate-500
        },
        'form-text': {
          DEFAULT: '#f1f5f9', // slate-100
          muted: '#cbd5e1',   // slate-300
          placeholder: '#94a3b8', // slate-400
        },
        'form-border': {
          DEFAULT: '#64748b', // slate-500
          focus: '#06b6d4',   // cyan-500
          error: '#ef4444',   // red-500
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      resize: {
        'none': 'none',
        'both': 'both',
        'horizontal': 'horizontal',
        'vertical': 'vertical',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // Note: Install @tailwindcss/forms for enhanced form styling
    // require('@tailwindcss/forms'),
  ],
} 