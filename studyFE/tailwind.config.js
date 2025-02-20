/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        green: {
          300:"#038478",
          500: "#135355",
          800: "#22454e"
        }
      }
    },
  },
  plugins: [],
}