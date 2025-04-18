/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#181818",     // Main dark background
        card: "#212121",           // Card and surface areas
        text: {
          primary: "#F7F7F7",      // Primary text
        },
        accent: {
          orange: "#FF5722",       // Accent 1
          purple: "#673AB7",       // Accent 2
          hover: "#FFEB3B",        // Hover effect
        },
        input: "#2C2C2C",          // Input fields
        border: "#444",            // Borders
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

