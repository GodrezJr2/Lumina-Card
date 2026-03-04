import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand primary (sky/teal — used in admin & invitation UI)
        primary: "#13c8ec",
        "primary-dark": "#0ea6c4",
        // Public site — navy + gold
        navy:           "#0A2540",
        "navy-light":   "#183B61",
        "navy-900":     "#0d191b",
        gold:           "#C5A059",
        "gold-hover":   "#B08D48",
        "gold-light":   "#F9F5E6",
        // Utility
        "background-light": "#F8F9FC",
        "background-dark":  "#050C16",
        "text-main":        "#0A2540",
        "text-secondary":   "#475569",
      },
      fontFamily: {
        display: ["Manrope", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
};

export default config;
