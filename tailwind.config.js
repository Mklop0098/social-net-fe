/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '425px',
      'sm': '640px',
      'md': '768px',
      'lg': '900px',
      'xl': '1100px',
      '2xl': '1536px',
    },
  },
  plugins: [],
}

