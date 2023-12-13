/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C8237C',
          light: '#EB3296',
          dark: '#601B69'
        },
        secondary: '#3EAEFF',
        dark: '#061624',
        gray: {
          light: '#949494',
          DEFAULT: '#323232',
          dark: '#232323',
        },
      },
      dropShadow:{
        'neon':'-2px -2px 8px rgba(235, 50, 150, 0.25)'
      },
      fontFamily: {
        sans: '"IranSans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(168deg, #601B69 -24.53%, #061624 119.47%)',
      }
    },
  },
  plugins: [],
}