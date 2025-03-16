/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily: {
      'outfit': ['Outfit', 'sans-serif'],
      'monoton': ['Monoton', 'serif'],
    }
  },
  plugins: [
    require('daisyui')
  ],
  daisyui: {
    themes: ["cupcake", "dark"],
  }
}
