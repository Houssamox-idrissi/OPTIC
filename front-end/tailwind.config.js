/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // Enable dark mode using class-based strategy
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      display: ['print'],
    },
  },
  plugins: [],
};
