import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode (default)
        background: 'var(--background)',
        surface: 'var(--surface)',
        'surface-hover': 'var(--surface-hover)',
        border: 'var(--border)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        accent: 'var(--accent)',
        // Generation colors (muted)
        sahaba: '#6B7280',
        tabiun: '#6B7280',
        'atba-al-tabiin': '#6B7280',
        imams: '#6B7280',
        scholars: '#6B7280',
        // Madhhab colors (muted warm)
        hanafi: '#8B7355',
        maliki: '#8B7355',
        shafii: '#8B7355',
        hanbali: '#8B7355',
        zahiri: '#8B7355',
        other: '#8B7355',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config