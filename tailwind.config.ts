import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans TC"', "system-ui", "sans-serif"],
      },
      colors: {
        "lab-bg": "#1a1614",
        "lab-elevated": "#2C1E1E",
        "lab-surface": "#3d2a2a",
        "lab-border": "#4a3838",
        "lab-accent": "#D4AF37",
        "lab-accent-soft": "#c9a227",
        "lab-text-primary": "#F8F9FA",
        "lab-text-muted": "#b8b4b0",
        "lab-danger": "#c94a4a",
        "lab-danger-soft": "#e86a6a",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.28)",
        "btn-hover": "0 4px 20px rgba(212, 175, 55, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
