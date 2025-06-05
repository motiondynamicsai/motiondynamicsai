/** @type {import('tailwindcss').Config} */
export const content = ["./index.html", "./src/**/*.{js,jsx}"];
export const mode = "jit";
export const theme = {
  extend: {
    colors: {
      primary: "#0f172a",
      secondary: "#7c3aed",
      accent: "#10b981",
      dark: "#1e293b",
      dimBlue: "#334155",
      dimWhite: "#e2e8f0",
      white: "#f8fafc",
      success: "#22c55e",
      warning: "#f59e0b"
    },
    fontFamily: {
      poppins: ["Poppins", "sans-serif"],
      inter: ["Inter", "sans-serif"],
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