export type OrderStatus =
  | 'Delivered'
  | 'Processing'
  | 'Shipped'
  | 'Cancelled';

export interface OrderItem {
  emoji: string;
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  delivery: number;
  paymentMethod: string;
  address: string;
}