import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { MainLayout } from '../../widgets/layout/MainLayout';
import { ProtectedRoute } from '../../features/auth/ProtectedRoute';
import { useAppSelector } from '../../shared/lib/redux';
import { selectIsAuthenticated } from '../../app/store/selectors';

const LoginPage = lazy(() => import('../../pages/login').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('../../pages/register').then((m) => ({ default: m.RegisterPage })));
const DashboardPage = lazy(() => import('../../pages/dashboard').then((m) => ({ default: m.DashboardPage })));
const ProductListPage = lazy(() => import('../../pages/products').then((m) => ({ default: m.ProductListPage })));
const ProductDetailPage = lazy(() => import('../../pages/products').then((m) => ({ default: m.ProductDetailPage })));
const ProfilePage = lazy(() => import('../../pages/profile').then((m) => ({ default: m.ProfilePage })));
const SettingsPage = lazy(() => import('../../pages/settings').then((m) => ({ default: m.SettingsPage })));
const LogoutPage = lazy(() => import('../../pages/logout').then((m) => ({ default: m.LogoutPage })));
const NotFoundPage = lazy(() => import('../../pages/not-found').then((m) => ({ default: m.NotFoundPage })));

const Fallback = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    Loading...
  </div>
);

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Suspense fallback={<Fallback />}>
          <LoginPage />
        </Suspense>
      </PublicRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <Suspense fallback={<Fallback />}>
          <RegisterPage />
        </Suspense>
      </PublicRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Suspense fallback={<Fallback />}><DashboardPage /></Suspense> },
      { path: 'products', element: <Suspense fallback={<Fallback />}><ProductListPage /></Suspense> },
      { path: 'products/:id', element: <Suspense fallback={<Fallback />}><ProductDetailPage /></Suspense> },
      { path: 'profile', element: <Suspense fallback={<Fallback />}><ProfilePage /></Suspense> },
      { path: 'settings', element: <Suspense fallback={<Fallback />}><SettingsPage /></Suspense> },
      { path: 'logout', element: <Suspense fallback={<Fallback />}><LogoutPage /></Suspense> },
    ],
  },
  { path: '*', element: <Suspense fallback={<Fallback />}><NotFoundPage /></Suspense> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
