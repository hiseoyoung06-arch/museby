import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f0ff",
          100: "#e6e1ff",
          200: "#cabdff",
          300: "#ac97ff",
          400: "#8f6bff",
          500: "#7645ff",
          600: "#6229f0",
          700: "#511dcc",
          800: "#3f18a3",
          900: "#2f1480",
        },
      },
    },
  },
  plugins: [],
};

export default config;
