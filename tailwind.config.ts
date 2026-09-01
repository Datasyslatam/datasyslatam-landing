import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        heading: ['"Space Grotesk"', "system-ui", "sans-serif"],
        body:    ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        border:      "hsl(var(--border))",
        input:       "hsl(var(--input))",
        ring:        "hsl(var(--ring))",
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        /* ── Hero / Dark sections ── */
        hero: {
          DEFAULT:    "hsl(var(--hero-bg))",
          surface:    "hsl(var(--hero-surface))",
          border:     "hsl(var(--hero-border))",
          foreground: "hsl(var(--hero-foreground))",
          muted:      "hsl(var(--hero-muted))",
        },
        /* ── Colores corporativos explícitos ── */
        navy: {
          950: "#050d1a",
          900: "#0b1220",
          800: "#111e32",
          700: "#1a2d4a",
          600: "#234068",
        },
        steel: {
          500: "#4a6080",
          400: "#6b82a0",
          300: "#8fa3be",
          200: "#b8c8da",
          100: "#dde6f0",
        },
        electric: {
          600: "#1a63c8",
          500: "#2176e8",
          400: "#4a95f5",
          300: "#7db8ff",
        },
      },
      borderRadius: {
        lg:  "var(--radius)",
        md:  "calc(var(--radius) - 2px)",
        sm:  "calc(var(--radius) - 4px)",
        xs:  "calc(var(--radius) - 6px)",
      },
      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",
        "gradient-hero":    "var(--gradient-hero)",
        "gradient-card":    "var(--gradient-card)",
      },
      boxShadow: {
        "sm-corp":   "var(--shadow-sm)",
        "card":      "var(--shadow-card)",
        "card-hover":"var(--shadow-hover)",
        "glow":      "var(--shadow-glow)",
      },
      animation: {
        "fade-in":      "fadeIn 0.6s ease-out both",
        "slide-up":     "slideUp 0.6s ease-out both",
        "border-pulse": "borderPulse 3s ease-in-out infinite",
        "marquee":      "marquee 30s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        borderPulse: {
          "0%, 100%": { borderColor: "hsl(var(--primary) / 0.3)" },
          "50%":      { borderColor: "hsl(var(--primary) / 0.7)" },
        },
        marquee: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
