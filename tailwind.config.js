/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6592E3",
        secondary: "#6592E3",
        black: {
          DEFAULT: "#1C1C1C",
          100: "#1E1E2D",
          200: "#232533",
        },
        gray: {
          DEFAULT: '#EEEEEE'
        },
        red: {
          DEFAULT: '#DF4E37'
        }
      },
      fontFamily: {
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],
        cygrebold: ["Cygre-Bold", "sans-serif"],
        cygreregular: ["Cygre-Regular", "sans-serif"],
        cygresemibold: ["Cygre-SemiBold", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        robotoblack: ["Roboto-Black", "sans-serif"]
      },
    },
  },
  plugins: [],
}

