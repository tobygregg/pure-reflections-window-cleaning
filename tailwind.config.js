/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './assets/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        // Deep navy – the darkest blue in the Facebook banner (#082448), nudged slightly lighter for text
        ink: { DEFAULT: '#0B2545', soft: '#3A5570', faint: '#6B8299' },
        // Logo "P" – the stronger cyan in the PR monogram
        aqua: { DEFAULT: '#19B5DC', deep: '#0A7FB5', dark: '#0C5F8A' },
        // Logo "R" – the lighter glass-cyan in the PR monogram
        glass: { DEFAULT: '#52DDE9', light: '#BDF0F6' },
        // Sky blue from the banner photo (#87d7f6 / #d8e9f6), used for tints and backgrounds
        sky: { DEFAULT: '#87D7F6', 100: '#EAF7FC', 50: '#F5FBFE', 200: '#D3EEF9' },
      },
      fontFamily: {
        display: ['Gloock', 'Georgia', 'serif'],
        sans: ['Outfit', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      maxWidth: { site: '76rem' },
      boxShadow: {
        card: '0 1px 2px rgba(11,37,69,.06), 0 12px 32px -12px rgba(11,37,69,.18)',
        lift: '0 2px 4px rgba(11,37,69,.06), 0 24px 48px -16px rgba(11,37,69,.28)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(18px)' }, '100%': { opacity: '1', transform: 'none' } },
      },
      animation: {
        'fade-up': 'fade-up .8s cubic-bezier(.2,.7,.2,1) both',
      },
    },
  },
  plugins: [],
};
