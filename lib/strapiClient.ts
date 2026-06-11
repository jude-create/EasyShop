import { STRAPI_URL } from './strapi';
import { getFirebaseIdToken } from './firebaseIdToken';

export function buildStrapiUrl(path: string) {
  return `${STRAPI_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export async function requestStrapiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getFirebaseIdToken();
  const response = await fetch(buildStrapiUrl(path), {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
    ...init,
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error?.message || 'Strapi request failed');
  }

  return payload;
}
