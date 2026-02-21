/** @type {import('tailwindcss').Config} */
export const content = ["./index.html", "./src/**/*.{js,jsx}"];
export const mode = "jit";
export const theme = {
  extend: {
    colors: {
      primary: "rgb(var(--md-primary) / <alpha-value>)",
      dark: "rgb(var(--md-dark) / <alpha-value>)",
      dimBlue: "rgb(var(--md-surface) / <alpha-value>)",
      secondary: "rgb(var(--md-secondary) / <alpha-value>)",
      accent: "rgb(var(--md-accent) / <alpha-value>)",
      highlight: "rgb(var(--md-highlight) / <alpha-value>)",
      dimWhite: "rgb(var(--md-dimWhite) / <alpha-value>)",
      white: "rgb(var(--md-white) / <alpha-value>)",
      success: "#22c55e",
      warning: "#f59e0b"
    },
    fontFamily: {
      poppins: ["Sora", "Poppins", "sans-serif"],
      inter: ["Inter", "system-ui", "sans-serif"],
    },
  },
  screens: {
    xs: "480px",
    ss: "620px",
    sm: "768px",
    md: "1060px",
    lg: "1200px",
    xl: "1700px",
  },
};
export const plugins = [];
