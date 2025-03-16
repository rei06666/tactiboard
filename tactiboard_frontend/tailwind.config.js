/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
      },
    },
    fontFamily: {
      'outfit': ['Outfit', 'sans-serif'],
      'monoton': ['Monoton', 'serif'],
    }
  },
  plugins: [
    require('daisyui')
  ],
  daisyui: {
    themes: [
      {
        cupcake: {
          "base-100": "oklch(97.788% 0.004 56.375)",
          "base-200": "oklch(93.982% 0.007 61.449)",
          "base-300": "oklch(91.586% 0.006 53.44)",
          "base-content": "oklch(23.574% 0.066 313.189)",
          "primary": "oklch(85% 0.138 181.071)",
          "primary-content": "oklch(43% 0.078 188.216)",
          "secondary": "oklch(89% 0.061 343.231)",
          "secondary-content": "oklch(45% 0.187 3.815)",
          "accent": "oklch(90% 0.076 70.697)",
          "accent-content": "oklch(47% 0.157 37.304)",
          "neutral": "oklch(27% 0.006 286.033)",
          "neutral-content": "oklch(92% 0.004 286.32)",
          "info": "oklch(68% 0.169 237.323)",
          "info-content": "oklch(29% 0.066 243.157)",
          "success": "oklch(69% 0.17 162.48)",
          "success-content": "oklch(26% 0.051 172.552)",
          "warning": "oklch(79% 0.184 86.047)",
          "warning-content": "oklch(28% 0.066 53.813)",
          "error": "oklch(64% 0.246 16.439)",
          "error-content": "oklch(27% 0.105 12.094)",
          "radius-selector": "1rem",
          "radius-field": "2rem",
          "radius-box": "1rem",
          "size-selector": "0.25rem",
          "size-field": "0.25rem",
          "border": "2px",
          "depth": "1",
          "noise": "0",
        }
      },
      "dark"
    ],
  }
}