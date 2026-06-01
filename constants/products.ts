export interface Product {
  id: number;
  image: string;
  name: string;
  description: string;
  price: string;
  priceValue: number;
  category: string;
  badge?: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    image: require('../assets/images/samsung.jpg'),
    name: 'Samsung Galaxy S23',
    description: 'Latest Samsung flagship with 200MP camera, Snapdragon 8 Gen 2, and all-day battery life.',
    price: '₦450,000',
    priceValue: 450000,
    category: 'Phones',
    badge: 'Hot',
  },
  {
    id: 2,
    image: require('../assets/images/laptop.jpg'),
    name: 'Dell XPS 13 Laptop',
    description: 'Ultrabook with 11th Gen Intel Core i7, 16GB RAM, and stunning InfinityEdge display.',
    price: '₦750,000',
    priceValue: 750000,
    category: 'Laptops',
  },
  {
    id: 3,
    image: require('../assets/images/headphone.jpg'),
    name: 'Sony WH-1000XM4',
    description: 'Industry-leading noise cancellation, 30-hour battery, and premium audio quality.',
    price: '₦180,000',
    priceValue: 180000,
    category: 'Audio',
    badge: 'New',
  },
  {
    id: 4,
    image: require('../assets/images/footwear.jpg'),
    name: 'Nike Air Max 270',
    description: 'Maximum Air cushioning with breathable mesh upper for all-day comfort.',
    price: '₦65,000',
    priceValue: 65000,
    category: 'Footwear',
  },
  {
    id: 5,
    image: require('../assets/images/watch.jpg'),
    name: 'Apple Watch Series 9',
    description: 'Advanced health sensors, crash detection, and a brighter always-on display.',
    price: '₦250,000',
    priceValue: 250000,
    category: 'Wearables',
    badge: 'New',
  },
  {
    id: 6,
    image: require('../assets/images/camera.jpg'),
    name: 'Canon EOS R6 Mark II',
    description: 'Full-frame mirrorless camera with 40fps burst, 4K60p video, and IBIS.',
    price: '₦350,000',
    priceValue: 350000,
    category: 'Cameras',
  },
  {
    id: 7,
    image: require('../assets/images/pad.jpg'),
    name: 'PlayStation 5',
    description: 'Next-gen gaming with ultra-high-speed SSD, haptic feedback, and 4K gaming.',
    price: '₦420,000',
    priceValue: 420000,
    category: 'Gaming',
    badge: 'Hot',
  },
  {
    id: 8,
    image: require('../assets/images/TV.jpg'),
    name: 'LG OLED 55" C3',
    description: 'Perfect blacks, infinite contrast, and NVIDIA G-Sync for stunning visuals.',
    price: '₦950,000',
    priceValue: 950000,
    category: 'TVs',
  },
  {
    id: 9,
    image: require('../assets/images/cloth2.jpg'),
    name: 'Gray Crop Top',
    description: 'A very fancy crop top',
    price: '₦20,000',
    priceValue: 20000,
    category: 'Wearables',
    badge: 'Hot',
  },
  {
    id: 10,
    image: require('../assets/images/clothes1.jpg'),
    name: 'A Brown Hoodie',
    description: 'A very cozy brown hoodie',
    price: '₦30,000',
    priceValue: 30000,
    category: 'Wearables',
    
  },
];

export const CATEGORIES = ['All', ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];

export const formatPrice = (value: number): string =>
  '₦' + value.toLocaleString('en-NG');
