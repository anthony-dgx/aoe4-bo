/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/renderer/**/*.{html,tsx,ts}'
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#c8a84b',
          light: '#e8c96b',
          dark: '#8a6e28'
        }
      }
    }
  },
  plugins: []
}
