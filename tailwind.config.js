/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#5b6cff', 600: '#4b57d4', 700: '#3b44aa' }
      }
    }
  },
  plugins: [],
}