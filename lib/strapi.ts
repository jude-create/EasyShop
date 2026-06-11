import type { ImageSourcePropType } from 'react-native';
import { Platform } from 'react-native';
import { formatPrice, type Product } from '../constants/products';

const DEFAULT_STRAPI_URL = Platform.select({
  android: 'http://10.0.2.2:1337',
  ios: 'http://localhost:1337',
  default: 'http://localhost:1337',
});

const STRAPI_URL = (process.env.EXPO_PUBLIC_STRAPI_URL || DEFAULT_STRAPI_URL || 'http://localhost:1337')
  .trim()
  .replace(/^['"]|['"]$/g, '')
  .replace(/\/$/, '');
const FALLBACK_IMAGE = require('../assets/images/icon.png');

export interface StrapiCategory {
  id: number;
  name: string;
  slug?: string;
}

type StrapiMedia = {
  url?: string;
  data?: {
    attributes?: {
      url?: string;
    };
  };
};

type StrapiRelation = {
  data?: {
    id?: number;
    attributes?: {
      name?: string;
      slug?: string;
    };
    name?: string;
    slug?: string;
  };
  id?: number;
  name?: string;
  slug?: string;
};

type StrapiProductRecord = {
  id: number;
  name?: string;
  description?: string;
  price?: number | string;
  badge?: string;
  stock?: string;
  isFeatured?: boolean | null;
  category?: StrapiRelation;
  image?: StrapiMedia | StrapiMedia[] | string;
};

function buildUrl(path: string) {
  // Centralize URL building so every Strapi request respects the same base URL and slash handling.
  return `${STRAPI_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

async function fetchWithTimeout(url: string, timeoutMs = 12000) {
  // Abort long-running requests so the UI can show a useful error instead of spinning forever.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchStrapi<T>(path: string): Promise<T[]> {
  // The helper normalizes Strapi list responses into a simple array for the rest of the app.
  const response = await fetchWithTimeout(buildUrl(path));
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error?.message || 'Failed to load data from Strapi');
  }

  const items = payload?.data ?? [];
  return Array.isArray(items) ? items : [items];
}

function getCategoryName(category: StrapiRelation | undefined): string {
  // Strapi can nest relation data at different depths, so read the common shapes defensively.
  return (
     category?.name ||
    category?.data?.attributes?.name ||
    category?.data?.name ||
    'Uncategorized'
  );
}

function getMediaSource(image: StrapiProductRecord['image']): ImageSourcePropType {
  // Media can arrive as a direct URL, a nested relation, or an already-local fallback.
  if (!image) return FALLBACK_IMAGE;

  const media = Array.isArray(image) ? image[0] : image;

  if (typeof media === 'string') {
    return media.startsWith('http') ? { uri: media } : { uri: buildUrl(media) };
  }

  const url = media?.url || media?.data?.attributes?.url;
  if (!url) return FALLBACK_IMAGE;

  return url.startsWith('http') ? { uri: url } : { uri: buildUrl(url) };
}

export async function fetchStrapiCategories(): Promise<StrapiCategory[]> {
  // Categories are normalized into a tiny shape because the UI only needs id, name, and slug.
  const categories = await fetchStrapi<{
    id: number;
    name?: string;
    slug?: string;
    attributes?: {
      name?: string;
      slug?: string;
    };
  }>('/api/categories?sort=name:asc');

  return categories
    .map((category) => ({
      id: category.id,
      name: category.name || category.attributes?.name || '',
      slug: category.slug || category.attributes?.slug,
    }))
    .filter((category) => category.name);
}

export async function fetchStrapiProducts(): Promise<Product[]> {
  // Products are transformed once here so every screen can consume the same app-ready model.
  const products = await fetchStrapi<StrapiProductRecord>(
    '/api/products?fields[0]=name&fields[1]=description&fields[2]=price&fields[3]=badge&fields[4]=stock&fields[5]=isFeatured&populate[category][fields][0]=name&populate[category][fields][1]=slug&populate[image]=true',
  );

  return products.map((product) => {
    const priceValue = Number(product.price ?? 0);

    return {
      id: product.id,
      image: getMediaSource(product.image),
      name: product.name ?? 'Untitled Product',
      description: product.description ?? '',
      price: formatPrice(priceValue),
      priceValue,
      category: getCategoryName(product.category),
      badge: product.badge,
      stock: product.stock,
      isFeatured: Boolean(product.isFeatured),
    };
  });
}

export { STRAPI_URL };
