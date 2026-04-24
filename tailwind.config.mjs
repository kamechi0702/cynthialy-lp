/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'deep-green': '#0d2623',
        'deep-green-90': '#0e2623',
        'accent-gold': '#e8de9f',
        'accent-gold-light': '#f9f9ba',
        'accent-gold-dark': '#e6dfa2',
        'text-primary': '#030807',
        'text-secondary': '#384946',
        'border-default': '#dbdbdb',
        'surface-bg': '#f1f1f1',
        'surface-lightgreen': 'rgba(237, 242, 231, 0.8)',
        'link': '#4584ae',
        'error': '#ae4546',
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', '"Hiragino Kaku Gothic ProN"', 'sans-serif'],
        en: ['Inter', 'Montserrat', 'Lato', 'sans-serif'],
        serif: ['"Tsukushi Mincho"', '"A1明朝"', 'serif'],
        script: ['"Bad Script"', 'cursive'],
      },
      fontSize: {
        hero: ['72px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
      },
      maxWidth: {
        container: '1280px',
      },
      screens: {
        'mini': '320px',
        'mobile': '540px',
        'tablet': '840px',
        'small': '1140px',
      },
    },
  },
  plugins: [],
};
