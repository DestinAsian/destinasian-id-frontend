/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './wp-templates/**/*.{js,ts,jsx,tsx,mdx}',
    // './node_modules/flowbite-react/lib/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        'green': 'rgba(188, 228, 226, 0.6)',
      },
      screens: {
        xm: '320px',
      },
      height: {
        'almost-screen': 'calc(-16rem + 100vh)',
        'slider-screen': 'calc(-10rem + 100vh)',
        '225px': '14.063rem',
        '338px': '21.125rem',
      },
      width: {
        '400px': '25rem',
        '600px': '37.5rem',
      },
      minHeight: {
        'almost-screen': 'calc(-16rem + 100vh)',
        '42px': '2.625rem',
      },
      margin: {
        '5px': '5px',
      },
      left: {
        '45%': '45%',
      },
      maxWidth: {
        custom: 'calc(1400px + 2rem)',
      },
    },
  },
  variants: {},
  plugins: [
    // require('flowbite/plugin')
  ],
}
