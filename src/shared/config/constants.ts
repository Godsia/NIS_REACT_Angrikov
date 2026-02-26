export const API_BASE_URL =
  process.env.NODE_ENV === 'development' ? '' : 'https://dummyjson.com';

export const AUTH_TOKEN_KEY = 'auth_token';

export const PERSIST_KEY = 'e_commerce_admin';

export const LANGUAGES = ['ru', 'en'] as const;
export type Language = (typeof LANGUAGES)[number];

export const THEMES = ['light', 'dark'] as const;
export type Theme = (typeof THEMES)[number];

export const PAGE_SIZES = [10, 20, 30] as const;
export type PageSize = (typeof PAGE_SIZES)[number];

export const DEFAULT_PAGE_SIZE: PageSize = 10;
export const DEFAULT_LANGUAGE: Language = 'en';
export const DEFAULT_THEME: Theme = 'light';
