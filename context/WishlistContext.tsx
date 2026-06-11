import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../constants/products';
import { useProfile } from './ProfileContext';
import { parseStoredArray } from '../lib/persistence';

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  toggleWishlist: (product: Product) => void;
  isWishlisted: (productId: number) => boolean;
  totalWishlistItems: number;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  toggleWishlist: () => {},
  isWishlisted: () => false,
  totalWishlistItems: 0,
});

function getWishlistStorageKey(firebaseUid: string) {
  return `easyshop_wishlist_${firebaseUid}`;
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { profile, authLoading, profileLoading } = useProfile();
  const firebaseUid = profile?.firebaseUid;
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadWishlist = async () => {
      if (authLoading || profileLoading) {
        setHydrated(false);
        return;
      }

      if (!firebaseUid) {
        setWishlist([]);
        setHydrated(true);
        return;
      }

      const storageKey = getWishlistStorageKey(firebaseUid);

      try {
        // Scope wishlist persistence to the signed-in user so accounts do not leak into each other.
        const stored = await AsyncStorage.getItem(storageKey);
        if (!mounted) return;
        const parsed = parseStoredArray<Product>(stored, []);
        setWishlist(parsed);
      } catch {
        if (mounted) {
          setWishlist([]);
        }
      } finally {
        if (mounted) {
          setHydrated(true);
        }
      }
    };

    loadWishlist();

    return () => {
      mounted = false;
    };
  }, [authLoading, firebaseUid, profileLoading]);

  useEffect(() => {
    if (!hydrated || !firebaseUid) return;
    AsyncStorage.setItem(getWishlistStorageKey(firebaseUid), JSON.stringify(wishlist)).catch(() => {});
  }, [firebaseUid, hydrated, wishlist]);

  const addToWishlist = (product: Product) => {
    setWishlist((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId: number) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      if (prev.find((p) => p.id === product.id)) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isWishlisted = (productId: number) =>
    !!wishlist.find((p) => p.id === productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isWishlisted,
        totalWishlistItems: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
