export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#0a0a0a',
          900: '#121212',
          800: '#1a1a1a',
          700: '#262626',
          600: '#333333',
        },
        gold: {
          400: '#d4af37',
          500: '#c9a961',
          600: '#b8860b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        gutter: '1rem',
        'gutter-lg': '1.5rem',
      },
    },
  },
  plugins: [],
}
