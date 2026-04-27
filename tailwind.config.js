/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./client/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kiwi: {
          DEFAULT: '#379147',
          dark: '#2c3e50',
          light: '#f0fff4',
        },
        price: '#e74c3c',
        background: '#f4f7f6',
      },
      boxShadow: {
        'kiwi': '0 4px 12px rgba(55, 145, 71, 0.1)',
      }
    },
  },
  plugins: [],
}
