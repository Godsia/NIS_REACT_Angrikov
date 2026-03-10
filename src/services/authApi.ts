const API_BASE = process.env.REACT_APP_API_URL ?? '';

const LOG_AUTH = true;

function getErrorMessage(data: unknown, fallback: string): string {
  if (data && typeof data === 'object') {
    const o = data as Record<string, unknown>;
    const msg = o.message ?? o.error ?? o.detail ?? o.msg;
    if (typeof msg === 'string' && msg.trim()) return msg.trim();
    if (Array.isArray(o.errors) && o.errors[0] && typeof o.errors[0] === 'object') {
      const first = (o.errors[0] as Record<string, unknown>).message ?? (o.errors[0] as Record<string, unknown>).msg;
      if (typeof first === 'string') return first;
    }
  }
  return fallback;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  email: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  userId: number;
}

const ACCESS_TOKEN_KEY = 'accessToken';
const USER_STORAGE_KEY = 'authUser';

export const getAccessToken = (): string | null =>
  localStorage.getItem(ACCESS_TOKEN_KEY);

export const saveUserToStorage = (user: AuthUser): void => {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch {
  }
};

export const getUserFromStorage = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as { id?: number; email?: string };
    if (typeof data?.id === 'number' && typeof data?.email === 'string') {
      return { id: data.id, email: data.email };
    }
    return null;
  } catch {
    return null;
  }
};

export const clearUserFromStorage = (): void => {
  localStorage.removeItem(USER_STORAGE_KEY);
};

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const url = `${API_BASE}/api/auth/login`;
    if (LOG_AUTH) console.log('[Auth] POST', url, { email: credentials.email.trim() });
    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email.trim(),
          password: credentials.password,
        }),
        credentials: 'omit',
      });
    } catch (err) {
      if (LOG_AUTH) console.error('[Auth] login network error', err);
      throw new Error('Ошибка сети. Проверьте подключение к интернету.');
    }

    const data = await response.json().catch((parseErr) => {
      if (LOG_AUTH) console.error('[Auth] login response parse error', parseErr);
      return {};
    }) as AuthResponse & { message?: string };
    if (LOG_AUTH) console.log('[Auth] login response', response.status, data);

    if (!response.ok) {
      const message = getErrorMessage(data, 'Неверный email или пароль');
      if (LOG_AUTH) console.error('[Auth] login failed', response.status, data);
      throw new Error(message);
    }

    return data;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const url = `${API_BASE}/api/auth/register`;
    if (LOG_AUTH) {
      console.log('[Auth] API_BASE =', API_BASE || '(пусто — проверьте .env REACT_APP_API_URL)');
      console.log('[Auth] POST', url, { email: credentials.email.trim() });
    }
    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email.trim(),
          password: credentials.password,
        }),
        credentials: 'omit',
      });
    } catch (err) {
      if (LOG_AUTH) console.error('[Auth] register network error', err);
      throw new Error('Ошибка сети. Проверьте подключение к интернету.');
    }

    let data: (AuthResponse & { message?: string }) | Record<string, unknown>;
    try {
      const raw = await response.text();
      if (LOG_AUTH) console.log('[Auth] register response', response.status, raw.slice(0, 500));
      data = raw ? (JSON.parse(raw) as AuthResponse & { message?: string }) : {};
    } catch (parseErr) {
      if (LOG_AUTH) console.error('[Auth] register response parse error', parseErr);
      data = {};
    }

    if (!response.ok) {
      const message = getErrorMessage(data, 'Не удалось зарегистрироваться');
      if (LOG_AUTH) console.error('[Auth] register failed', response.status, data);
      throw new Error(message);
    }

    return data as AuthResponse;
  },
};
