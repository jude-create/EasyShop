import type { ImageSourcePropType } from 'react-native';

export type ReviewFilterType = 'All' | '5' | '4' | '3' | '2' | '1';

export interface ReviewableProduct {
  productId: number;
  productName: string;
  productImage: ImageSourcePropType;
  orderId: string;
}
