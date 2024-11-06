/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 20s linear infinite', // Adjust the duration as needed
        'pop-up': 'popUp 0.3s ease-out forwards', // Custom pop-up animation
      },
      keyframes: {
        spin: {
          from: {
            transform: 'rotate(0deg)',
          },
          to: {
            transform: 'rotate(360deg)',
          },
        },
        popUp: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.5)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
      },
      colors: {
        primary: '#03346E', // Make sure to use a valid color format
      },
      container: {
        center: true,
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        // Utility for hiding the scrollbar
        '.scrollbar-hide': {
          /* Hide scrollbar for Chrome, Safari, and Opera */
          '-webkit-overflow-scrolling': 'touch',
          'scrollbar-width': 'none', /* Firefox */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        // Add fade-in utility classes
        '.fade-in': {
          opacity: '0', // Start hidden
          transition: 'opacity 1.5s ease-in-out', // Smooth transition
        },
        '.fade-in.visible': {
          opacity: '2', // Become visible
        },
      });
    },
  ],
};
