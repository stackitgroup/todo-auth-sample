/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'light-grey': '#f2f2f2',
        'standard-gray': '#d9d9d9',
        'dark-gray': '#757575',
        'brand-blue': '#312C76',
        'light-blue': '#426DB5',
        green: '#48A84F',
        'light-green': '#53C17F',
        purple: '#8640E3',
        yellow: '#ECB328',
        black: '#181818',
        white: '#ffffff',
        red: '#E74C3C'
      },
      screens: {
        '-print': { raw: 'print' }
      }
    }
  },

  plugins: []
}
