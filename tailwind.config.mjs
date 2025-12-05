import flowbiteReact from "flowbite-react/plugin/tailwindcss";

/** @type {import('tailwindcss').Config} */

export default {
  content: ['./src/**/*.{mjs,js,ts,jsx,tsx}', ".flowbite-react\\class-list.json"],
  theme: {
      extend: {
        colors: {
          primary: 'var(--primary-color)',
          secondary: 'var(--secondary-color)',
          background: 'var(--background-color)',
          text: 'var(--text-color)',
        },
      }
  },
  plugins: [flowbiteReact]
}