/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#2D4F37",
          50: "#E8EFEA",
          100: "#D1DFD5",
          200: "#A3BEAB",
          300: "#759E81",
          400: "#477D57",
          500: "#2D4F37",
          600: "#24402C",
          700: "#1B3022",
          800: "#122017",
          900: "#09100B",
        },
        cream: {
          DEFAULT: "#F5F2E9",
          50: "#FEFEFE",
          100: "#FCFBF8",
          200: "#F9F7F1",
          300: "#F5F2E9",
          400: "#E8E1CB",
          500: "#DBD0AD",
          600: "#CEBF8F",
          700: "#C1AE71",
          800: "#B49D53",
          900: "#968244",
        },
        charcoal: {
          DEFAULT: "#333333",
          50: "#E6E6E6",
          100: "#CCCCCC",
          200: "#999999",
          300: "#666666",
          400: "#333333",
          500: "#1A1A1A",
        },
      },
      fontFamily: {
        sans: ["Cabin"],
        serif: ["Lora"],
      },
    },
  },
  plugins: [],
};
