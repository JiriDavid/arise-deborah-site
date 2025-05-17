/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FFC94A", // Warm Yellow
          light: "#FFD66E",
          dark: "#E6B53D",
        },
        secondary: {
          DEFAULT: "#C08B5C", // Warm Brown
          light: "#D4A77C",
          dark: "#A66F3D",
        },
        accent: {
          DEFAULT: "#795458", // Muted Red
          light: "#8B6B6E",
          dark: "#674346",
        },
        tertiary: {
          DEFAULT: "#453F78", // Deep Purple
          light: "#5A5489",
          dark: "#36305F",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
