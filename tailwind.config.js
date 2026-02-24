/** @type {import('tailwindcss').Config} */

const primaryBlue = '#1E3A8A'; // Dark blue
const secondaryBlue = '#2563EB'; // Medium blue
const lightBlue = '#DBEAFE'; // Light blue
const white = '#FFFFFF';
const darkBlue = '#0F172A'; // Very dark blue for text
const grayText = '#64748B';
const lightGray = '#F1F5F9';

module.exports = {
  content: [
    "./App.tsx",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: primaryBlue,
        secondary: secondaryBlue,
        lightBlue: lightBlue,
        white: white,
        dark: darkBlue,
        grayText: grayText,
        lightGray: lightGray,
      },
    },
  },
  plugins: [],
};