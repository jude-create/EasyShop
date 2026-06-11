import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useProfile } from './ProfileContext';
import {
  createSavedAddress,
  deleteSavedAddress,
  fetchSavedAddresses,
  setDefaultSavedAddress,
  updateSavedAddress,
} from '../lib/savedAddressApi';
import type { Address } from '../components/flow/FlowAddressCard';
import { parseStoredArray } from '../lib/persistence';

interface SavedAddressesContextValue {
  addresses: Address[];
  loading: boolean;
  saveAddress: (address: Address) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
  clearAddresses: () => Promise<void>;
}

const SavedAddressesContext = createContext<SavedAddressesContextValue>({
  addresses: [],
  loading: true,
  saveAddress: async () => {},
  deleteAddress: async () => {},
  setDefaultAddress: async () => {},
  clearAddresses: async () => {},
});

function sortByDefault(addresses: Address[]) {
  return [...addresses].sort((a, b) => Number(b.isDefault) - Number(a.isDefault) || Number(a.id) - Number(b.id));
}

function getAddressStorageKey(firebaseUid: string) {
  return `easyshop_saved_addresses_${firebaseUid}`;
}

export function SavedAddressesProvider({ children }: { children: React.ReactNode }) {
  const { profile, authLoading, profileLoading } = useProfile();
  const firebaseUid = profile?.firebaseUid;
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadAddresses = async () => {
      if (authLoading || profileLoading) {
        setLoading(true);
        return;
      }

      if (!firebaseUid) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const storageKey = getAddressStorageKey(firebaseUid);

      try {
        const cached = parseStoredArray<Address>(await AsyncStorage.getItem(storageKey), []);
        if (mounted && cached.length > 0) {
          setAddresses(sortByDefault(cached));
        }

        const remoteAddresses = await fetchSavedAddresses(firebaseUid);
        if (mounted) {
          const next = sortByDefault(remoteAddresses);
          setAddresses(next);
          AsyncStorage.setItem(storageKey, JSON.stringify(next)).catch(() => {});
        }
      } catch {
        // Keep the cached addresses already loaded above.
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadAddresses();

    return () => {
      mounted = false;
    };
  }, [authLoading, firebaseUid, profileLoading]);

  const saveAddress = useCallback(
    async (address: Address) => {
      const existing = addresses.find((item) => item.id === address.id);

      if (!firebaseUid) {
        setAddresses((prev) => {
          if (existing) {
            return prev.map((item) => (item.id === address.id ? address : item));
          }
          return sortByDefault([...prev, address]);
        });
        return;
      }

      try {
        const saved = existing
          ? await updateSavedAddress(firebaseUid, address)
          : await createSavedAddress(firebaseUid, address);

        setAddresses((prev) => {
          const next = existing
            ? sortByDefault(prev.map((item) => (item.id === address.id ? saved : item)))
            : sortByDefault([saved, ...prev]);
          AsyncStorage.setItem(getAddressStorageKey(firebaseUid), JSON.stringify(next)).catch(() => {});
          return next;
        });
      } catch {
        setAddresses((prev) => {
          const next = existing
            ? sortByDefault(prev.map((item) => (item.id === address.id ? address : item)))
            : sortByDefault([address, ...prev]);
          AsyncStorage.setItem(getAddressStorageKey(firebaseUid), JSON.stringify(next)).catch(() => {});
          return next;
        });
      }
    },
    [addresses, firebaseUid],
  );

  const deleteAddress = useCallback(
    async (id: string) => {
      if (firebaseUid) {
        try {
          await deleteSavedAddress(id);
        } catch {
          // Keep the UI responsive even if the backend request fails.
        }
      }

      setAddresses((prev) => {
        const next = prev.filter((address) => address.id !== id);
        if (firebaseUid) {
          AsyncStorage.setItem(getAddressStorageKey(firebaseUid), JSON.stringify(next)).catch(() => {});
        }
        return next;
      });
    },
    [firebaseUid],
  );

  const setDefaultAddress = useCallback(
    async (id: string) => {
      if (firebaseUid) {
        try {
          const next = await setDefaultSavedAddress(firebaseUid, id, addresses);
          setAddresses(next);
          AsyncStorage.setItem(getAddressStorageKey(firebaseUid), JSON.stringify(next)).catch(() => {});
          return;
        } catch {
          // Fall back to local state below.
        }
      }

      setAddresses((prev) => {
        const next = prev.map((address) => ({ ...address, isDefault: address.id === id }));
        if (firebaseUid) {
          AsyncStorage.setItem(getAddressStorageKey(firebaseUid), JSON.stringify(next)).catch(() => {});
        }
        return next;
      });
    },
    [addresses, firebaseUid],
  );

  const clearAddresses = useCallback(async () => {
    setAddresses([]);
  }, []);

  const value = useMemo(
    () => ({ addresses, loading, saveAddress, deleteAddress, setDefaultAddress, clearAddresses }),
    [addresses, clearAddresses, deleteAddress, loading, saveAddress, setDefaultAddress],
  );

  return <SavedAddressesContext.Provider value={value}>{children}</SavedAddressesContext.Provider>;
}

export const useSavedAddresses = () => useContext(SavedAddressesContext);
