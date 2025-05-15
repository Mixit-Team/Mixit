import { Category } from '@/types/Home.type';

export const CategoryList: {
  label: string;
  value: Category;
  logo: string;
}[] = [
  { label: '카페', value: 'CAFE', logo: '/images/cafe.png' },
  { label: '식당', value: 'RESTAURANT', logo: '/images/restaurant.png' },
  { label: '편의점', value: 'CONVENIENCE', logo: '/images/convenience.png' },
  { label: '기타', value: 'OTHER', logo: '/images/other.png' },
];
