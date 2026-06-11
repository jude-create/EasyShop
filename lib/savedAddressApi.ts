import type { Address } from '../components/flow/FlowAddressCard';
import { buildStrapiUrl, requestStrapiJson } from './strapiClient';

type StrapiAddressItem = {
  id: number;
  firebaseUid?: string;
  label?: string;
  name?: string;
  street?: string;
  city?: string;
  state?: string;
  phone?: string;
  isDefault?: boolean;
  attributes?: {
    firebaseUid?: string;
    label?: string;
    name?: string;
    street?: string;
    city?: string;
    state?: string;
    phone?: string;
    isDefault?: boolean;
  };
};

function normalizeAddress(item: StrapiAddressItem): Address {
  // Convert the Strapi response into the app's address shape.
  return {
    id: String(item.id),
    label: item.label || item.attributes?.label || 'Home',
    name: item.name || item.attributes?.name || '',
    street: item.street || item.attributes?.street || '',
    city: item.city || item.attributes?.city || '',
    state: item.state || item.attributes?.state || '',
    phone: item.phone || item.attributes?.phone || '',
    isDefault: Boolean(item.isDefault ?? item.attributes?.isDefault),
  };
}

function sortAddresses(addresses: Address[]) {
  // Default addresses should stay at the top of the list for checkout convenience.
  return [...addresses].sort((a, b) => Number(b.isDefault) - Number(a.isDefault) || Number(a.id) - Number(b.id));
}

export async function fetchSavedAddresses(firebaseUid: string): Promise<Address[]> {
  // Pull only the current user's saved addresses from Strapi.
  const payload = await requestStrapiJson<{ data: StrapiAddressItem[] }>(
    `/api/saved-addresses?filters[firebaseUid][$eq]=${encodeURIComponent(firebaseUid)}&pagination[pageSize]=100`,
  );

  const addresses = (payload.data || []).map(normalizeAddress);
  return sortAddresses(addresses);
}

export async function createSavedAddress(firebaseUid: string, address: Address): Promise<Address> {
  // Save a new address under the user's Firebase uid so it can sync between devices.
  const payload = await requestStrapiJson<{ data: StrapiAddressItem }>(`/api/saved-addresses`, {
    method: 'POST',
    body: JSON.stringify({
      data: {
        firebaseUid,
        label: address.label,
        name: address.name,
        street: address.street,
        city: address.city,
        state: address.state,
        phone: address.phone,
        isDefault: address.isDefault,
      },
    }),
  });

  return normalizeAddress(payload.data);
}

export async function updateSavedAddress(firebaseUid: string, address: Address): Promise<Address> {
  // Update an address in Strapi after the user edits the form.
  const payload = await requestStrapiJson<{ data: StrapiAddressItem }>(`/api/saved-addresses/${address.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      data: {
        firebaseUid,
        label: address.label,
        name: address.name,
        street: address.street,
        city: address.city,
        state: address.state,
        phone: address.phone,
        isDefault: address.isDefault,
      },
    }),
  });

  return normalizeAddress(payload.data);
}

export async function deleteSavedAddress(id: string): Promise<void> {
  // Remove one address from the backend store.
  await requestStrapiJson(`/api/saved-addresses/${id}`, {
    method: 'DELETE',
  });
}

export async function setDefaultSavedAddress(firebaseUid: string, defaultId: string, addresses: Address[]): Promise<Address[]> {
  // Toggle the default flag for all addresses in one pass so only one remains primary.
  const nextAddresses = addresses.map((address) => ({ ...address, isDefault: address.id === defaultId }));

  await Promise.all(
    nextAddresses.map((address) => updateSavedAddress(firebaseUid, address)),
  );

  return sortAddresses(nextAddresses);
}

export function buildSavedAddressesUrl(firebaseUid: string) {
  // Keep the URL builder available for debugging and manual API checks.
  return buildStrapiUrl(`/api/saved-addresses?filters[firebaseUid][$eq]=${encodeURIComponent(firebaseUid)}&pagination[pageSize]=100`);
}
