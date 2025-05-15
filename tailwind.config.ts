import { COLOR_ATOMIC_ORANGE_80 } from '@/config/color.config';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/app/**/*.{ts,tsx,js,jsx}', './src/components/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        'atomic-orange-80': COLOR_ATOMIC_ORANGE_80,
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
