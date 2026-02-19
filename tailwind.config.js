/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'neon-green': 'var(--neon-green)',
                'burnt-orange': '#d1510a',
                'dark-bg': '#0a0a0a',
                'br-green': '#1a4d2e',
                'text-primary': '#f0f0f0',
                'text-secondary': '#a0a0a0',
            },
            fontFamily: {
                'cinematic': ['"Courier Prime"', 'monospace'],
                'main': ['Outfit', 'sans-serif'],
                'display': ['Metamorphous', 'serif'],
            },
            boxShadow: {
                'neon': '0 0 20px rgba(26, 77, 46, 0.4)',
            }
        },
    },
    plugins: [],
}
