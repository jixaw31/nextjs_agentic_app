import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
      background: '#000000', // pure black
      surface: '#121826',
      bubble: '#1C2431',
      input: '#1A202C',
      accent: '#38F9D7',
      'secondary-accent': '#3B82F6',
    },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: "0" },
          '100%': { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

