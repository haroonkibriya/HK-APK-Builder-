/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#2563EB',
          cyan: '#06B6D4',
          dark: '#0B1220',
          surface: '#131D31',
          surfaceVariant: '#1E293B',
          border: '#334155'
        }
      }
    },
  },
  plugins: [],
}
