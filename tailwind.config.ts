import type { Config } from 'tailwindcss';

export default {
  content: [],
  theme: {
    extend: {},
    screens: {
      mobile: '767px',
      tablet: '1024px',
      desktop: '1025px',
      sm: '767px',
      md: '1024px',
      lg: '1025px',
    },
  },
  plugins: [],
} satisfies Config;
