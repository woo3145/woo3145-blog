/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      textColor: {
        primary: 'var(--color-text-primary)',
        secondary: 'var(--color-text-secondary)',
        inverse: 'var(--color-text-inverse)',
      },
      backgroundColor: {
        primary: 'var(--color-bg-primary)',
        secondary: 'var(--color-bg-secondary)',
        inverse: 'var(--color-bg-inverse)',
      },
      ringColor: {
        purple: 'var(--color-ring-primary)',
      },
      ringOffsetColor: {
        DEFAULT: 'var(--color-bg-primary)',
      },
      borderColor: {
        DEFAULT: 'var(--color-border-primary)',
      },
      fill: {
        primary: 'var(--color-text-primary)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
  darkMode: 'class',
};
