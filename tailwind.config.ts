import { COLOR_ATOMIC_ORANGE_80, COLOR_SEMANTIC_PRIMARY_NORMAL } from '@/config/color.config';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/app/**/*.{ts,tsx,js,jsx}', './src/components/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        semantic: {
          'atomic-orange-80': COLOR_ATOMIC_ORANGE_80,
          primary: COLOR_SEMANTIC_PRIMARY_NORMAL,
        },
      },
    },
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
};

export default config;
