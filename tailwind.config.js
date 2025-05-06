/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        blue: {
          400: '#4F8AF7',
          500: '#3B72DE',
          600: '#0F52BA',
          700: '#0A3D8F',
        },
        teal: {
          400: '#40C9BB',
          500: '#2FB6A8',
          600: '#20B2AA',
          700: '#188F88',
        },
        amber: {
          400: '#FFD65C',
          500: '#FFC725',
          600: '#FFD700',
          700: '#D4B000',
        },
        gray: {
          750: '#2D3748',
        },
      },
      boxShadow: {
        'inner-lg': 'inset 0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.800'),
            a: {
              color: theme('colors.blue.600'),
              '&:hover': {
                color: theme('colors.blue.800'),
              },
            },
            'h1, h2, h3, h4': {
              color: theme('colors.gray.900'),
              fontWeight: theme('fontWeight.bold'),
            },
          },
        },
        invert: {
          css: {
            color: theme('colors.gray.300'),
            a: {
              color: theme('colors.blue.400'),
              '&:hover': {
                color: theme('colors.blue.300'),
              },
            },
            'h1, h2, h3, h4': {
              color: theme('colors.white'),
              fontWeight: theme('fontWeight.bold'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.transition-height': {
          'transition-property': 'max-height',
          'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
          'transition-duration': '300ms',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};