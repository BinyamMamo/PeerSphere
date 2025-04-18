// tailwind.config.js
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
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#b9e6fe',
          300: '#7dd1fd',
          400: '#39b7fa',
          500: '#0e9deb',
          600: '#017dc9',
          700: '#0264a3',
          800: '#065586',
          900: '#0b4970',
          950: '#082d49',
        },
        accent: {
          50: '#fffaeb',
          100: '#fff0c7',
          200: '#ffdc8a',
          300: '#ffc34a',
          400: '#ffa91f',
          500: '#ff8b00',
          600: '#e06000',
          700: '#bc4308',
          800: '#983410',
          900: '#7c2d0f',
          950: '#471504',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
  safelist: [
    // Add commonly used color classes to prevent purging
    {
      pattern: /bg-(primary|secondary|accent|green|red|blue|yellow|gray)-(50|100|200|300|400|500|600|700|800|900|950)/,
    },
    {
      pattern: /text-(primary|secondary|accent|green|red|blue|yellow|gray)-(50|100|200|300|400|500|600|700|800|900|950)/,
    },
    {
      pattern: /border-(primary|secondary|accent|green|red|blue|yellow|gray)-(50|100|200|300|400|500|600|700|800|900|950)/,
    },
  ],
}
