import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "rgba(0, 240, 255, 0.2)",
        input: "rgba(0, 240, 255, 0.2)",
        ring: "#00f0ff",
        background: "#0a0a0a",
        foreground: "#ffffff",
        primary: {
          DEFAULT: "#00f0ff",
          foreground: "#0a0a0a",
        },
        secondary: {
          DEFAULT: "#a855f7",
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#ff3366",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#1a1a1a",
          foreground: "#9ca3af",
        },
        accent: {
          DEFAULT: "#00f0ff",
          foreground: "#0a0a0a",
        },
        card: {
          DEFAULT: "#111111",
          foreground: "#ffffff",
        },
        success: "#00ff88",
        cyan: "#00f0ff",
        purple: "#a855f7",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      boxShadow: {
        "neon-cyan": "0 0 20px rgba(0, 240, 255, 0.5)",
        "neon-green": "0 0 20px rgba(0, 255, 136, 0.5)",
        "neon-purple": "0 0 20px rgba(168, 85, 247, 0.5)",
      },
    },
  },
  plugins: [],
};

export default config;
