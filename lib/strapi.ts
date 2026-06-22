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
const CATALOG_CACHE_MS = 5 * 60 * 1000;

// Share fresh results and in-flight requests between Home and Products so
// navigating between tabs does not trigger duplicate catalog downloads.
let productsCache: { data: Product[]; savedAt: number } | null = null;
let productsRequest: Promise<Product[]> | null = null;
let categoriesCache: { data: StrapiCategory[]; savedAt: number } | null = null;
let categoriesRequest: Promise<StrapiCategory[]> | null = null;

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

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchStrapi<T>(path: string): Promise<T[]> {
  // Retry transient network/server failures so a cold Strapi instance does not
  // force the user to press Try Again.
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetchWithTimeout(buildUrl(path));
      const rawPayload = await response.text();
      let payload: any;

      try {
        payload = rawPayload ? JSON.parse(rawPayload) : {};
      } catch {
        const preview = rawPayload.trim().slice(0, 160);
        throw new Error(preview || `Strapi returned a non-JSON response (${response.status})`);
      }

      if (!response.ok) {
        const error = new Error(payload?.error?.message || 'Failed to load data from Strapi');
        if (response.status < 500 && response.status !== 429) {
          throw Object.assign(error, { retryable: false });
        }
        throw error;
      }

      const items = payload?.data ?? [];
      return Array.isArray(items) ? items : [items];
    } catch (error: any) {
      if (error?.retryable === false || attempt === 3) {
        throw error;
      }

      await wait(attempt * 1200);
    }
  }

  return [];
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
  if (categoriesCache && Date.now() - categoriesCache.savedAt < CATALOG_CACHE_MS) {
    return categoriesCache.data;
  }
  if (categoriesRequest) return categoriesRequest;

  // Categories are normalized into a tiny shape because the UI only needs id, name, and slug.
  categoriesRequest = fetchStrapi<{
      id: number;
      name?: string;
      slug?: string;
      attributes?: {
        name?: string;
        slug?: string;
      };
    }>('/api/categories?sort=name:asc')
    .then((categories) =>
      categories
        .map((category) => ({
          id: category.id,
          name: category.name || category.attributes?.name || '',
          slug: category.slug || category.attributes?.slug,
        }))
        .filter((category) => category.name),
    )
    .then((categories) => {
      categoriesCache = { data: categories, savedAt: Date.now() };
      return categories;
    })
    .finally(() => {
      categoriesRequest = null;
    });

  return categoriesRequest;
}

export async function fetchStrapiProducts(): Promise<Product[]> {
  if (productsCache && Date.now() - productsCache.savedAt < CATALOG_CACHE_MS) {
    return productsCache.data;
  }
  if (productsRequest) return productsRequest;

  // Products are transformed once here so every screen can consume the same app-ready model.
  productsRequest = fetchStrapi<StrapiProductRecord>(
      '/api/products?fields[0]=name&fields[1]=description&fields[2]=price&fields[3]=badge&fields[4]=stock&fields[5]=isFeatured&populate[category][fields][0]=name&populate[category][fields][1]=slug&populate[image]=true',
    )
    .then((products) =>
      products.map((product) => {
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
      }),
    )
    .then((products) => {
      productsCache = { data: products, savedAt: Date.now() };
      return products;
    })
    .finally(() => {
      productsRequest = null;
    });

  return productsRequest;
}

export async function prefetchStrapiCatalog() {
  // Warm both public endpoints during app startup. Home and Products reuse the
  // same in-flight promises, so this does not create duplicate requests.
  await Promise.allSettled([
    fetchStrapiProducts(),
    fetchStrapiCategories(),
  ]);
}

export { STRAPI_URL };
