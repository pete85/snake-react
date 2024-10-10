/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false
  },
  prefix: 'tw-',
  content: [
    "./src/**/*.{html,ts, tsx, js, jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

