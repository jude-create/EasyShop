import type { CheckoutAddress, CheckoutCartItem } from './persistence';
import { normalizeImageSource, sortOrdersByDateDesc } from './persistence';
import { requestStrapiJson } from './strapiClient';
import type { Order, OrderStatus } from '../types/order';

type OrderItemRecord = {
  image: string;
  name: string;
  qty: number;
  price: number;
};

type StrapiOrderItem = {
  id: number;
  firebaseUid?: string;
  orderNumber?: string;
  status?: OrderStatus;
  items?: OrderItemRecord[];
  subtotal?: number;
  delivery?: number;
  paymentMethod?: string;
  address?: string;
  createdAt?: string;
  attributes?: {
    firebaseUid?: string;
    orderNumber?: string;
    status?: OrderStatus;
    items?: OrderItemRecord[];
    subtotal?: number;
    delivery?: number;
    paymentMethod?: string;
    address?: string;
    createdAt?: string;
  };
};

function formatDisplayDate(value?: string) {
  // Keep date formatting consistent across order cards and modals.
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function normalizeOrder(item: StrapiOrderItem): Order {
  // Flatten Strapi's order payload into the app's simpler local order model.
  const orderNumber = item.orderNumber || item.attributes?.orderNumber || `CWR-${item.id}`;
  const items = item.items || item.attributes?.items || [];
  const createdAt = item.createdAt || item.attributes?.createdAt;

  return {
    id: orderNumber,
    recordId: item.id,
    date: formatDisplayDate(createdAt),
    status: item.status || item.attributes?.status || 'Processing',
    items: items.map((entry) => ({
      image: normalizeImageSource(entry.image),
      name: entry.name,
      qty: entry.qty,
      price: entry.price,
    })),
    subtotal: item.subtotal ?? item.attributes?.subtotal ?? 0,
    delivery: item.delivery ?? item.attributes?.delivery ?? 0,
    paymentMethod: item.paymentMethod || item.attributes?.paymentMethod || '',
    address: item.address || item.attributes?.address || '',
  };
}

export async function fetchOrdersByUid(firebaseUid: string): Promise<Order[]> {
  // Read only the logged-in user's orders so the history stays account-scoped.
  const payload = await requestStrapiJson<{ data: StrapiOrderItem[] }>(
    `/api/orders?filters[firebaseUid][$eq]=${encodeURIComponent(firebaseUid)}&pagination[pageSize]=100&sort=createdAt:desc`,
  );

  return sortOrdersByDateDesc((payload.data || []).map(normalizeOrder));
}

export async function createOrderRecord(
  firebaseUid: string,
  order: Order,
): Promise<Order> {
  // Persist a newly placed order so it shows up again after logout/login or on another device.
  const payload = await requestStrapiJson<{ data: StrapiOrderItem }>(`/api/orders`, {
    method: 'POST',
    body: JSON.stringify({
      data: {
        firebaseUid,
        orderNumber: order.id,
        status: order.status,
        items: order.items,
        subtotal: order.subtotal,
        delivery: order.delivery,
        paymentMethod: order.paymentMethod,
        address: order.address,
      },
    }),
  });

  return normalizeOrder(payload.data);
}

export async function updateOrderStatusRecord(id: string | number, status: OrderStatus): Promise<Order> {
  // Update the status centrally in Strapi so the source of truth stays in the backend.
  const payload = await requestStrapiJson<{ data: StrapiOrderItem }>(`/api/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      data: { status },
    }),
  });

  return normalizeOrder(payload.data);
}

export async function deleteOrderRecord(id: string | number): Promise<void> {
  // Remove one persisted order entry from Strapi.
  await requestStrapiJson(`/api/orders/${id}`, {
    method: 'DELETE',
  });
}

export async function deleteOrdersByUid(firebaseUid: string): Promise<void> {
  // Clear every persisted order for one user, typically from a local reset action.
  const orders = await fetchOrdersByUid(firebaseUid);
  await Promise.all(orders.filter((order) => order.recordId).map((order) => deleteOrderRecord(order.recordId!)));
}

export function createCheckoutOrder({
  cart,
  delivery,
  paymentMethod,
  address,
}: {
  cart: CheckoutCartItem[];
  delivery: number;
  paymentMethod: string;
  address: CheckoutAddress;
}): Order {
  // Convert the checkout snapshot into the order shape used by order history.
  const items = cart.map((item) => ({
    image: normalizeImageSource(item.image),
    name: item.name,
    qty: item.quantity,
    price: item.priceValue,
  }));

  const subtotal = cart.reduce((sum, item) => sum + item.priceValue * item.quantity, 0);
  const createdAt = new Date();

  return {
    id: `CWR-${createdAt.getTime()}`,
    recordId: undefined,
    date: createdAt.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    status: 'Processing',
    items,
    subtotal,
    delivery,
    paymentMethod,
    address: `${address.street}, ${address.city}, ${address.state}`,
  };
}
