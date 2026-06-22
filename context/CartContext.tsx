import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../constants/products';

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  hydrated: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  hydrated: false,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalPrice: 0,
});

const CART_STORAGE_KEY = 'easyshop_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadCart = async () => {
      try {
        // Restore the saved cart once on mount so items survive app restarts.
        const stored = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (!mounted || !stored) return;
        const parsed = JSON.parse(stored) as CartItem[];
        setCart(Array.isArray(parsed) ? parsed : []);
      } catch {
        if (mounted) {
          setCart([]);
        }
      } finally {
        if (mounted) {
          setHydrated(true);
        }
      }
    };

    loadCart();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    // Persist cart changes only after hydration so we do not overwrite the stored state with an empty array on startup.
    if (!hydrated) return;
    AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart)).catch(() => {});
  }, [cart, hydrated]);

  const addToCart = (product: Product) => {
    // Update quantities in place instead of duplicating the same product entry.
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    // Remove a single product completely from the cart.
    setCart((prev) => prev.filter((i) => i.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    // Treat zero or negative quantities as a delete so the UI stays simple.
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.id === productId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = useMemo(
    // Derived totals keep the UI clean and avoid recomputing these sums in multiple screens.
    () => cart.reduce((sum, i) => sum + i.quantity, 0),
    [cart],
  );

  const totalPrice = useMemo(
    // Keep money math in one place so checkout, cart, and badges stay in sync.
    () => cart.reduce((sum, i) => sum + i.priceValue * i.quantity, 0),
    [cart],
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        hydrated,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
