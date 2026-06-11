import { STRAPI_URL } from './strapi';
import { getFirebaseIdToken } from './firebaseIdToken';

export interface UserProfile {
  id?: number;
  firebaseUid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  avatarUrl: string | null;
  expoPushToken?: string | null;
}

type StrapiProfileItem = {
  id: number;
  firebaseUid?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  dob?: string;
  avatarUrl?: string | null;
  expoPushToken?: string | null;
  attributes?: {
    firebaseUid?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    dob?: string;
    avatarUrl?: string | null;
    expoPushToken?: string | null;
  };
};

function buildUrl(path: string) {
  // Keep all profile requests pointed at the same base server URL.
  return `${STRAPI_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

async function requestJson<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  // Attach the Firebase token to profile requests so Strapi can verify the signed-in user.
  const token = await getFirebaseIdToken();
  const response = await fetch(buildUrl(path), {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
    ...init,
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error?.message || 'Failed to save profile');
  }

  return payload;
}

function normalizeProfile(item: StrapiProfileItem): UserProfile {
  // Strapi may return flat data or nested attributes depending on the response shape.
  return {
    id: item.id,
    firebaseUid: item.firebaseUid || item.attributes?.firebaseUid || '',
    firstName: item.firstName || item.attributes?.firstName || '',
    lastName: item.lastName || item.attributes?.lastName || '',
    email: item.email || item.attributes?.email || '',
    phone: item.phone || item.attributes?.phone || '',
    address: item.address || item.attributes?.address || '',
    dob: item.dob || item.attributes?.dob || '',
    avatarUrl: item.avatarUrl ?? item.attributes?.avatarUrl ?? null,
    expoPushToken: item.expoPushToken ?? item.attributes?.expoPushToken ?? null,
  };
}

function isLocalFileUri(value: string) {
  // Detect local files so avatar uploads only happen when the user selected a fresh image.
  return value.startsWith('file://') || value.startsWith('content://') || value.startsWith('/');
}

export async function uploadProfileAvatar(uri: string): Promise<string> {
  // Upload the local image to Strapi and return a permanent remote URL for reuse.
  const extensionMatch = uri.match(/\.([a-zA-Z0-9]+)(?:\?.*)?$/);
  const extension = extensionMatch?.[1]?.toLowerCase() || 'jpg';
  const mimeType = extension === 'png' ? 'image/png' : 'image/jpeg';
  const formData = new FormData();
  formData.append('files', {
    uri,
    name: `avatar-${Date.now()}.${extension}`,
    type: mimeType,
  } as any);
  const token = await getFirebaseIdToken();

  const response = await fetch(buildUrl('/api/upload'), {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error?.message || 'Failed to upload avatar');
  }

  const file = Array.isArray(payload) ? payload[0] : payload;
  const url = file?.url;

  if (!url) {
    throw new Error('Avatar upload did not return a URL');
  }

  return url.startsWith('http') ? url : buildUrl(url);
}

export function isAvatarLocalUri(value: string | null | undefined) {
  return !!value && isLocalFileUri(value);
}

export async function fetchProfileByUid(firebaseUid: string): Promise<UserProfile | null> {
  // Fetch a single profile by Firebase uid so each account resolves to its own record.
  const payload = await requestJson<{ data: StrapiProfileItem[] }>(
    `/api/profiles?filters[firebaseUid][$eq]=${encodeURIComponent(firebaseUid)}&pagination[pageSize]=1`,
  );

  const item = payload.data?.[0];
  return item ? normalizeProfile(item) : null;
}

export async function createProfile(profile: UserProfile): Promise<UserProfile> {
  // Create the profile record the first time the user signs in or signs up.
  const payload = await requestJson<{ data: StrapiProfileItem }>(`/api/profiles`, {
    method: 'POST',
    body: JSON.stringify({
      data: {
        firebaseUid: profile.firebaseUid,
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        dob: profile.dob,
        avatarUrl: profile.avatarUrl,
        expoPushToken: profile.expoPushToken,
      },
    }),
  });

  return normalizeProfile(payload.data);
}

export async function updateProfile(profile: UserProfile): Promise<UserProfile> {
  // Update an existing profile record after the user edits their details.
  if (!profile.id) {
    return createProfile(profile);
  }

  const payload = await requestJson<{ data: StrapiProfileItem }>(`/api/profiles/${profile.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      data: {
        firebaseUid: profile.firebaseUid,
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        dob: profile.dob,
        avatarUrl: profile.avatarUrl,
        expoPushToken: profile.expoPushToken,
      },
    }),
  });

  return normalizeProfile(payload.data);
}

export function getDisplayName(profile?: UserProfile | null) {
  // Prefer the person's name, then email, then a generic fallback.
  if (!profile) return 'Guest';
  const fullName = `${profile.firstName} ${profile.lastName}`.trim();
  return fullName || profile.email || 'Guest';
}
