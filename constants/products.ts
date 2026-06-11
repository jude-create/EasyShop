import type { ImageSourcePropType } from 'react-native';

export interface Product {
  id: number;
  image: ImageSourcePropType | string;
  name: string;
  description: string;
  price: string;
  priceValue: number;
  category: string;
  badge?: string;
  isFeatured?: boolean;
  stock?: string;
}

export const PRODUCTS: Product[] = [
 
];

export const CATEGORIES = ['All', ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];

export const formatPrice = (value: number): string =>
  '₦' + value.toLocaleString('en-NG');
