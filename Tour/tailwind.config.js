/** @type {import('tailwindcss').Config} */
module.exports = {
  // Updated to include all app and component files for Nativewind classes
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}