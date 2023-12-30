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
        navy: '#0D0D1F',
        gray: {
          light: '#949494',
          DEFAULT: '#323232',
          dark: '#232323',
        },
      },
      screens: {
        'xs': '576px',
        // => @media (min-width: 576px) { ... }

        'sm': '640px',
        // => @media (min-width: 640px) { ... }

        'md': '768px',
        // => @media (min-width: 768px) { ... }

        'lg': '1024px',
        // => @media (min-width: 1024px) { ... }

        'xl': '1280px',
        // => @media (min-width: 1280px) { ... }

        '2xl': '1536px',
        // => @media (min-width: 1536px) { ... }
      },
      dropShadow: {
        'neon': '-2px -2px 8px rgba(235, 50, 150, 0.25)',
        'neon-blue': '-2px -2px 8px #3EAEFF',
      },
      boxShadow: {
        'neon': '-2px -4px 8px 0px rgba(200, 35, 124, 0.32)',
        'neon-blue-sm': '-1px -2px 8px 0px rgba(62, 174, 255, 0.25)',
      },
      fontFamily: {
        sans: '"IranSans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(168deg, #601B69 -24.53%, #061624 119.47%)',
      },
      aspectRatio: {
        'custom': '46 / 65',
        '2/1': '2 / 1',
        '4/3': '4 / 3',
      },
      height: {
        'custom-screen': 'calc(100vh - 180px)'
      }
    },
  },
  plugins: [],
}