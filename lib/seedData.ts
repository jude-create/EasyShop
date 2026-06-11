import { Image } from 'react-native';
import type { Address } from '../components/flow/FlowAddressCard';
import type { Order } from '../types/order';

function assetUri(asset: number): string {
  return Image.resolveAssetSource(asset)?.uri || '';
}

export const DEFAULT_ADDRESSES: Address[] = [
  {
    id: '1',
    label: 'Home',
    name: 'Admin User',
    street: '12 Adeola Odeku Street',
    city: 'Victoria Island',
    state: 'Lagos',
    phone: '+234 800 000 0000',
    isDefault: true,
  },
  {
    id: '2',
    label: 'Office',
    name: 'Admin User',
    street: '5 Broad Street',
    city: 'Lagos Island',
    state: 'Lagos',
    phone: '+234 801 000 0000',
    isDefault: false,
  },
];

export const DEFAULT_ORDERS: Order[] = [
  {
    id: 'CWR-482910',
    date: 'May 24, 2026',
    status: 'Delivered',
    items: [
      { image: assetUri(require('../assets/images/samsung.jpg')), name: 'Samsung Galaxy S23', qty: 1, price: 450000 },
      { image: assetUri(require('../assets/images/headphone.jpg')), name: 'Sony WH-1000XM4', qty: 1, price: 180000 },
    ],
    subtotal: 630000,
    delivery: 0,
    paymentMethod: 'Visa •••• 4242',
    address: '12 Adeola Odeku St, Victoria Island, Lagos',
  },
  {
    id: 'CWR-371845',
    date: 'May 18, 2026',
    status: 'Shipped',
    items: [{ image: assetUri(require('../assets/images/laptop.jpg')), name: 'Dell XPS 13 Laptop', qty: 1, price: 750000 }],
    subtotal: 750000,
    delivery: 0,
    paymentMethod: 'Bank Transfer',
    address: '5 Broad Street, Lagos Island, Lagos',
  },
  {
    id: 'CWR-290374',
    date: 'May 10, 2026',
    status: 'Processing',
    items: [
      { image: assetUri(require('../assets/images/watch.jpg')), name: 'Apple Watch Series 9', qty: 1, price: 250000 },
      { image: assetUri(require('../assets/images/footwear.jpg')), name: 'Nike Air Max 270', qty: 2, price: 65000 },
    ],
    subtotal: 380000,
    delivery: 5000,
    paymentMethod: 'Mastercard •••• 5353',
    address: '12 Adeola Odeku St, Victoria Island, Lagos',
  },
  {
    id: 'CWR-183920',
    date: 'Apr 28, 2026',
    status: 'Delivered',
    items: [{ image: assetUri(require('../assets/images/pad.jpg')), name: 'PlayStation 5', qty: 1, price: 420000 }],
    subtotal: 420000,
    delivery: 0,
    paymentMethod: 'Pay on Delivery',
    address: '12 Adeola Odeku St, Victoria Island, Lagos',
  },
  {
    id: 'CWR-094821',
    date: 'Apr 15, 2026',
    status: 'Cancelled',
    items: [{ image: assetUri(require('../assets/images/TV.jpg')), name: 'LG OLED 55" C3', qty: 1, price: 950000 }],
    subtotal: 950000,
    delivery: 0,
    paymentMethod: 'Visa •••• 4242',
    address: '5 Broad Street, Lagos Island, Lagos',
  },
];
