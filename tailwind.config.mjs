/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'pink-soft': '#FFB5C5',
        'lavender': '#E6E6FA',
        'mint': '#B5EAD7',
        'peach': '#FFDAB9',
        'cream': '#FFF8E7',
        'text-dark': '#5D4037',
      },
      fontFamily: {
        display: ['Italiana', 'serif'],
        body: ['Raleway', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-heart': 'pulse-heart 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-heart': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
      },
    },
  },
  plugins: [],
};
