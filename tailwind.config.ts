import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FAF6E8',
          100: '#F5EDD1',
          200: '#EBDAA4',
          300: '#E1C776',
          400: '#D7B449',
          500: '#D4AF37', // primary gold accent
          600: '#B89426',
          700: '#8C6F1B',
          800: '#614B11',
          900: '#382B08',
        },
        champagne: {
          50: '#FDFBF7',
          100: '#FAF5ED',
          200: '#F4ECE0',
          300: '#ECE0D0',
          400: '#E2D1BD',
          500: '#D6C0A6',
        },
        sage: {
          50: '#F4F7F5',
          100: '#E4EBE6',
          500: '#4A5D4E',
          600: '#3A4B3D',
          700: '#2A392C',
          900: '#151F17',
        },
        luxury: {
          dark: '#121212',
          card: 'rgba(255, 255, 255, 0.75)',
          darkcard: 'rgba(25, 25, 25, 0.75)',
        }
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Cormorant Garamond', 'serif'],
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%)',
        'subtle-gold': 'linear-gradient(135deg, #D4AF37 0%, #F5EDD1 50%, #B89426 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
