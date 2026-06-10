/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14213d",
        paper: "#f8fafc",
        cueb: {
          red: "#b42318",
          navy: "#183153",
          gold: "#c9942f",
          mist: "#eef4f8"
        }
      },
      boxShadow: {
        soft: "0 24px 70px rgba(20, 33, 61, 0.12)",
        line: "0 1px 0 rgba(24, 49, 83, 0.08)"
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "Segoe UI",
          "Microsoft YaHei",
          "sans-serif"
        ]
      }
    }
  },
  plugins: []
};
