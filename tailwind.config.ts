import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50:  "#FFF8E7",
          100: "#FEEFC4",
          200: "#FDD98A",
          300: "#FCC04F",
          400: "#F9A825",
          500: "#E8920A",
          600: "#C8780A",
          700: "#A05E08",
          800: "#7A4606",
          900: "#5A3204",
        },
        jade: {
          50: "#f2f8f5",
          100: "#e2efe8",
          200: "#c6dfd2",
          300: "#9ec5b2",
          400: "#609d7e",
          500: "#2d6a4f",
          600: "#24553f",
          700: "#1b4332",
          800: "#143326",
          900: "#0d2219",
        },
        lotus: {
          50: "#fdf5f6",
          100: "#fce8eb",
          200: "#f8cfd5",
          300: "#f1aab5",
          400: "#d98894",
          500: "#c86d7a",
          600: "#b05562",
          700: "#9e4a57",
          800: "#7f3a45",
          900: "#69333c",
        },
        ivory: {
          50:  "#FFFDF5",
          100: "#FFF8E8",
          200: "#FAEFD5",
          300: "#F0DFB8",
          400: "#DEC99A",
          500: "#C8AD7A",
          600: "#A88C58",
          700: "#846D3E",
          800: "#5A4A29",
          900: "#362C18",
        },
        charcoal: {
          50: "#f6f5f4",
          100: "#ece6de",
          200: "#d7cec2",
          300: "#b9aca0",
          400: "#8f8174",
          500: "#685b50",
          600: "#493f36",
          700: "#2c2824",
          800: "#1f1c18",
          900: "#151311",
          950: "#0b0a09",
        },
      },
      fontFamily: {
        heading: ["Lora", "serif"],
        serif: ["Lora", "serif"],
        sans: ["Be Vietnam Pro", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      maxWidth: {
        reading: "760px",
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.8', filter: 'drop-shadow(0 0 10px rgba(197, 137, 47, 0.25))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 22px rgba(197, 137, 47, 0.5))' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.85' },
          '50%': { transform: 'scale(1.08)', opacity: '1' },
        },
        breatheRing: {
          '0%, 100%': { transform: 'scale(0.95)', opacity: '0.3' },
          '50%': { transform: 'scale(1.15)', opacity: '0.7' },
        },
        wave: {
          '0%, 100%': { height: '6px' },
          '50%': { height: '20px' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        petalFall: {
          '0%':   { opacity: '0', transform: 'translateY(0px) translateX(0px) rotate(0deg) scale(0.8)' },
          '10%':  { opacity: '0.8' },
          '25%':  { transform: 'translateY(120px) translateX(10px) rotate(90deg) scale(1)' },
          '50%':  { transform: 'translateY(280px) translateX(-8px) rotate(200deg) scale(0.95)' },
          '75%':  { transform: 'translateY(450px) translateX(12px) rotate(290deg) scale(1.05)', opacity: '0.4' },
          '100%': { opacity: '0', transform: 'translateY(650px) translateX(-5px) rotate(400deg) scale(0.9)' },
        },
        modalShimmer: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-down': 'fadeInDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float': 'float 5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3.5s ease-in-out infinite',
        'breathe': 'breathe 6s ease-in-out infinite',
        'breathe-ring': 'breatheRing 6s ease-in-out infinite',
        'wave': 'wave 1.2s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'petal-fall': 'petalFall var(--petal-duration, 4s) var(--petal-delay, 0s) ease-in infinite',
        'modal-shimmer': 'modalShimmer 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
