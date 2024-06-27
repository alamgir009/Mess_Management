/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sarina: ["Sarina", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        saira: ["Saira Stencil One", "sans-serif"],
      },
    },
  },
  plugins: [],
};
