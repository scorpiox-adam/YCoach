import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        muted: "oklch(var(--muted))",
        "muted-foreground": "oklch(var(--muted-foreground))",
        surface: "oklch(var(--surface))",
        "surface-2": "oklch(var(--surface-2))",
        accent: "oklch(var(--accent))",
        "accent-strong": "oklch(var(--accent-strong))",
        success: "oklch(var(--success))",
        warning: "oklch(var(--warning))",
        danger: "oklch(var(--danger))",
        border: "oklch(var(--border))",
        ring: "oklch(var(--ring))"
      },
      boxShadow: {
        soft: "0 16px 48px color-mix(in oklab, oklch(var(--shadow)) 18%, transparent)",
        float: "0 24px 64px color-mix(in oklab, oklch(var(--shadow)) 22%, transparent)"
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"]
      },
      borderRadius: {
        panel: "1.5rem"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1)"
      }
    }
  },
  plugins: []
};

export default config;

