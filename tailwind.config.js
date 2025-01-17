/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "node_modules/@bitcoin-dev-project/bdp-ui/dist/**/*.{js,mjs,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)"],
        inika: ["var(--font-inika)"],
        "test-signifier": ["Test Signifier"],
        "gt-walsheim": ["Gt Walsheim"],
        "ibm-plex-serif": ["var(--font-ibm-plex-serif)"],
      },
      colors: {
        brand: {
          secondary: "#B06B03",
        },
        orange: {
          "custom-100": "#F7931A",
          "custom-200": "#FEF6EB",
          "custom-300": "#FEF8F0",
        },
        gray: {
          "custom-100": "#FAFAFA",
          "custom-200": "#EDEDED",
          "custom-250": "#E0E0E0",
          "custom-300": "#F8F8F8",
          "custom-400": "#B8B8B8",
          "custom-500": "#8F8F8F",
          "custom-600": "#CCCCCC",
          "custom-700": "#F4F5F7",
          "custom-800": "#969696",
          "custom-900": "#292929",
          "custom-1000": "#F7F7F7",
          "custom-1100": "#808080",
          "custom-1200": "#202020",
          "custom-1300": "#6B7280",
        },
        cream: {
          "custom-100": "#FFFAF0",
        },
        peach: {
          "custom-100": "#F39595",
        },
        blue: {
          "custom-100": "#4A6FF5",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
