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
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
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
