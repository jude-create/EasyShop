import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useProfile } from './ProfileContext';
import {
  createCheckoutOrder,
  createOrderRecord,
  deleteOrdersByUid,
  fetchOrdersByUid,
  updateOrderStatusRecord,
} from '../lib/orderHistoryApi';
import type { CheckoutAddress, CheckoutCartItem } from '../lib/persistence';
import type { Order, OrderStatus } from '../types/order';

interface OrderHistoryContextValue {
  orders: Order[];
  loading: boolean;
  recordOrder: (args: {
    cart: CheckoutCartItem[];
    delivery: number;
    paymentMethod: string;
    address: CheckoutAddress;
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  clearOrderHistory: () => Promise<void>;
}

const OrderHistoryContext = createContext<OrderHistoryContextValue>({
  orders: [],
  loading: true,
  recordOrder: async () => ({
    id: '',
    date: '',
    status: 'Processing',
    items: [],
    subtotal: 0,
    delivery: 0,
    paymentMethod: '',
    address: '',
  }),
  updateOrderStatus: async () => {},
  clearOrderHistory: async () => {},
});

function getOrderStorageKey(firebaseUid: string) {
  return `easyshop_order_history_${firebaseUid}`;
}

export function OrderHistoryProvider({ children }: { children: React.ReactNode }) {
  const { profile, authLoading, profileLoading } = useProfile();
  const firebaseUid = profile?.firebaseUid;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadOrders = async () => {
      if (authLoading || profileLoading) {
        setLoading(true);
        return;
      }

      if (!firebaseUid) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const storageKey = getOrderStorageKey(firebaseUid);

      try {
        // Load the last known data first so the screen stays useful even if the network is slow.
        const cached = await AsyncStorage.getItem(storageKey);
        if (mounted && cached) {
          try {
            const parsed = JSON.parse(cached) as Order[];
            if (Array.isArray(parsed) && parsed.length > 0) {
              setOrders(parsed);
            }
          } catch {
            // Ignore stale cache parse errors and continue to the remote fetch.
          }
        }

        const remoteOrders = await fetchOrdersByUid(firebaseUid);
        if (mounted) {
          setOrders(remoteOrders);
          AsyncStorage.setItem(storageKey, JSON.stringify(remoteOrders)).catch(() => {});
        }
      } catch {
        // Keep the cached orders already loaded above.
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      mounted = false;
    };
  }, [authLoading, firebaseUid, profileLoading]);

  const recordOrder = useCallback(
    async ({
      cart,
      delivery,
      paymentMethod,
      address,
    }: {
      cart: CheckoutCartItem[];
      delivery: number;
      paymentMethod: string;
      address: CheckoutAddress;
    }) => {
      const localOrder = createCheckoutOrder({
        cart,
        delivery,
        paymentMethod,
        address,
      });

      // Optimistically add the order locally, then persist it remotely if Strapi is reachable.
      setOrders((prev) => [localOrder, ...prev]);
      if (firebaseUid) {
        AsyncStorage.setItem(getOrderStorageKey(firebaseUid), JSON.stringify([localOrder, ...orders])).catch(() => {});
      }

      if (!firebaseUid) {
        return localOrder;
      }

      try {
        const savedOrder = await createOrderRecord(firebaseUid, localOrder);
        setOrders((prev) => {
          const next = prev.map((order) => (order.id === localOrder.id ? savedOrder : order));
          AsyncStorage.setItem(getOrderStorageKey(firebaseUid), JSON.stringify(next)).catch(() => {});
          return next;
        });
        return savedOrder;
      } catch {
        return localOrder;
      }
    },
    [firebaseUid, orders],
  );

  const updateOrderStatus = useCallback(
    async (orderId: string, status: OrderStatus) => {
      const current = orders.find((order) => order.id === orderId || String(order.recordId) === orderId);
      if (!current) return;

      try {
        if (firebaseUid && current.recordId) {
          const saved = await updateOrderStatusRecord(current.recordId, status);
          setOrders((prev) => {
            const next = prev.map((order) => (order.id === saved.id ? saved : order));
            AsyncStorage.setItem(getOrderStorageKey(firebaseUid), JSON.stringify(next)).catch(() => {});
            return next;
          });
          return;
        }
      } catch {
        // Fall back to local update below.
      }

      setOrders((prev) => {
        const next = prev.map((order) => (order.id === orderId || String(order.recordId) === orderId ? { ...order, status } : order));
        if (firebaseUid) {
          AsyncStorage.setItem(getOrderStorageKey(firebaseUid), JSON.stringify(next)).catch(() => {});
        }
        return next;
      });
    },
    [firebaseUid, orders],
  );

  const clearOrderHistory = useCallback(async () => {
    if (firebaseUid) {
      try {
        await deleteOrdersByUid(firebaseUid);
      } catch {
        // Keep clearing local state even if the backend is temporarily unreachable.
      }
    }

    setOrders([]);
    if (firebaseUid) {
      AsyncStorage.removeItem(getOrderStorageKey(firebaseUid)).catch(() => {});
    }
  }, [firebaseUid]);

  const value = useMemo(
    () => ({ orders, loading, recordOrder, updateOrderStatus, clearOrderHistory }),
    [clearOrderHistory, loading, orders, recordOrder, updateOrderStatus],
  );

  return <OrderHistoryContext.Provider value={value}>{children}</OrderHistoryContext.Provider>;
}

export const useOrderHistory = () => useContext(OrderHistoryContext);
