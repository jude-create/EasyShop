import type { ImageSourcePropType } from 'react-native';
import type { Order, OrderItem, OrderStatus } from '../types/order';

export interface CheckoutAddress {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
}

export interface CheckoutCartItem {
  id: number;
  image: ImageSourcePropType | string;
  name: string;
  quantity: number;
  priceValue: number;
}

export function parseStoredArray<T>(raw: string | null, fallback: T[]): T[] {
  if (!raw) return fallback;

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

export function normalizeImageSource(source: ImageSourcePropType | string | undefined, fallback = ''): string {
  if (!source) return fallback;
  if (typeof source === 'string') return source;

  const maybeUri = (source as { uri?: string }).uri;
  return typeof maybeUri === 'string' ? maybeUri : fallback;
}

export function createOrderFromCheckout({
  cart,
  delivery,
  paymentMethod,
  address,
  createdAt = new Date(),
}: {
  cart: CheckoutCartItem[];
  delivery: number;
  paymentMethod: string;
  address: CheckoutAddress;
  createdAt?: Date;
}): Order {
  const items: OrderItem[] = cart.map((item) => ({
    image: normalizeImageSource(item.image),
    name: item.name,
    qty: item.quantity,
    price: item.priceValue,
  }));

  const subtotal = cart.reduce((sum, item) => sum + item.priceValue * item.quantity, 0);
  const total = subtotal + delivery;

  return {
    id: `CWR-${createdAt.getTime()}`,
    date: createdAt.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    status: 'Processing' as OrderStatus,
    items,
    subtotal: total - delivery,
    delivery,
    paymentMethod,
    address: `${address.street}, ${address.city}, ${address.state}`,
  };
}

export function sortOrdersByDateDesc(orders: Order[]): Order[] {
  return [...orders].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();

    if (!Number.isNaN(dateA) && !Number.isNaN(dateB)) {
      return dateB - dateA;
    }

    return b.date.localeCompare(a.date);
  });
}
