# E-commerce Admin 

SPA административная панель для e-commerce системы на React + TypeScript, Redux Toolkit, RTK Query, React Router и i18n. Backend API: [DummyJSON](https://dummyjson.com).

## Запуск

```bash
npm install --legacy-peer-deps
npm start
```

Приложение откроется на [http://localhost:3000](http://localhost:3000).

В режиме разработки запросы к API идут через прокси (см. `proxy` в `package.json`), чтобы избежать CORS. **После изменения `package.json` перезапустите dev-сервер** (остановите и снова выполните `npm start`).

**Тестовые данные для входа (DummyJSON):**
- Логин: `emilys`
- Пароль: `emilyspass`

## Сборка

```bash
npm run build
```

## Архитектура (Feature Sliced Design)

Слои не импортируют из вышележащих (shared ← entities ← features ← widgets ← pages ← app).

```
src/
├── app/                    # Инициализация приложения
│   ├── api/                # RTK Query: baseApi, authApi, productsApi
│   ├── store/              # Redux store, auth/settings слайсы, селекторы
│   ├── router/             # React Router, маршруты, lazy loading
│   └── init/               # AuthInit (getMe при загрузке), ThemeAndLanguageSync
├── pages/                  # Страницы (ленивая загрузка)
│   ├── login, register     # Публичные
│   ├── dashboard, products, profile, settings, logout, not-found  # Приватные / 404
├── widgets/                # Композитные блоки
│   └── layout/             # Header, Sidebar, MainLayout
├── features/               # Действия пользователя
│   ├── auth/               # LoginForm, ProtectedRoute
│   └── settings/           # LanguageSelect, ThemeToggle, PageSizeSelect
├── entities/               # Бизнес-сущности (типы)
│   ├── product/
│   └── user/
└── shared/                 # Переиспользуемое
    ├── config/             # Константы, локали (ru/en)
    ├── lib/                # i18n, redux hooks (useAppDispatch, useAppSelector)
    └── ui/                 # Button, Input, ErrorBoundary
```

### Основные решения

- **Аутентификация:** RTK Query (`authApi`: `login`, `getMe`). Токен и пользователь в Redux (auth slice). При перезагрузке — `AuthInit` вызывает `getMe` по сохранённому токену и выставляет `isInitialized`.
- **Маршруты:** Публичные `/login`, `/register`. Приватные под `ProtectedRoute` с общим `MainLayout` (Header + Sidebar + Outlet). Lazy loading страниц. Редиректы: неавторизован → `/login`, авторизован на `/login` → `/`.
- **Продукты:** RTK Query (`productsApi`: `getProducts`, `getProduct`). Список с поиском (`q`) и пагинацией (`limit`/`skip` из настроек). Состояния: loading, error, empty.
- **Настройки:** Redux (settings slice) + redux-persist (localStorage). Язык (ru/en), тема (light/dark), размер страницы каталога. Связь с i18n через `ThemeAndLanguageSync` и `changeLanguage`.
- **Ошибки:** Error Boundary в корне приложения.

