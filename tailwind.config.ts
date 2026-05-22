/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'rgba(0, 240, 255, 0.2)',
        input: 'rgba(0, 240, 255, 0.2)',
        ring: '#00f0ff',
        background: '#0a0a0a',
        foreground: '#ffffff',
        primary: {
          DEFAULT: '#00f0ff',
          foreground: '#0a0a0a',
        },
        card: {
          DEFAULT: '#111111',
          foreground: '#ffffff',
        },
        success: '#00ff88',
        cyan: '#00f0ff',
        purple: '#a855f7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
