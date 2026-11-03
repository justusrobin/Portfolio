/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#030712",
          dark: "#0b0f19",
          slate: "#1f2937",
          neonGreen: "#10b981", // Emerald-500
          neonBlue: "#06b6d4", // Cyan-500
          neonPink: "#ec4899", // Pink-500
          neonPurple: "#a855f7", // Purple-500
          glowGreen: "rgba(16, 185, 129, 0.4)",
          glowBlue: "rgba(6, 180, 212, 0.4)",
          glowPink: "rgba(236, 72, 153, 0.4)"
        }
      },
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        sans: ["Inter", "sans-serif"]
      },
      animation: {
        'scanline': 'scanline 6s linear infinite',
        'grid-scroll': 'grid-scroll 20s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'hologram': 'hologram 1.5s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' }
        },
        'grid-scroll': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(50px)' }
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
          '50%': { opacity: 0.8, transform: 'scale(1.05)' }
        },
        hologram: {
          '0%': { filter: 'hue-rotate(0deg) saturate(1) contrast(1)', opacity: 0.85 },
          '100%': { filter: 'hue-rotate(15deg) saturate(1.2) contrast(1.1)', opacity: 0.98 }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      boxShadow: {
        'neon-green': '0 0 10px rgba(16, 185, 129, 0.5), 0 0 20px rgba(16, 185, 129, 0.2)',
        'neon-blue': '0 0 10px rgba(6, 182, 212, 0.5), 0 0 20px rgba(6, 182, 212, 0.2)',
        'neon-pink': '0 0 10px rgba(236, 72, 153, 0.5), 0 0 20px rgba(236, 72, 153, 0.2)',
      }
    },
  },
  plugins: [],
}
