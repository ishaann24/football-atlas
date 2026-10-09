import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        fifa: {
          green: "#3CAC3B",
          blue: "#2A398D",
          red: "#E61D25",
          grey: "#474A4A",
        },
      },
    },
  },
  plugins: [],
};
export default config;
