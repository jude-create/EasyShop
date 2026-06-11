import type { ReviewableProduct } from './reviewTypes';

export const REVIEWABLE_PRODUCTS: ReviewableProduct[] = [
  { productId: 1, productName: 'Samsung Galaxy S23', productImage: require('../../assets/images/samsung.jpg'), orderId: 'CWR-482910' },
  { productId: 3, productName: 'Sony WH-1000XM4', productImage: require('../../assets/images/headphone.jpg'), orderId: 'CWR-482910' },
  { productId: 2, productName: 'Dell XPS 13 Laptop', productImage: require('../../assets/images/laptop.jpg'), orderId: 'CWR-371845' },
  { productId: 7, productName: 'PlayStation 5', productImage: require('../../assets/images/pad.jpg'), orderId: 'CWR-183920' },
];
