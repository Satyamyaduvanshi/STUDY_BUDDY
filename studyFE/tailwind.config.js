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
        },
        brown:{
          500:"#8a2210",
        },
        red:{
          500:"#93374e"
        }
      },
      animation: {
        'border-spin': 'rotateGradient 3s linear infinite',
      },
      keyframes: {
        rotateGradient: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}