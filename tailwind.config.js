/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // modo oscuro con clase 'dark'
  theme: {
    extend: {
      fontFamily: {
        outfit: ['var(--font-outfit)'],
        inter: ['var(--font-inter)'],
      },
      
    },
  },
  plugins: [],
}



