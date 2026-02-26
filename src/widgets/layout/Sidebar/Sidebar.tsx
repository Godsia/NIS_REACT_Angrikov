import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../shared/lib/redux';
import { logout } from '../../../app/store/authSlice';
import styles from './Sidebar.module.css';

export function Sidebar() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <NavLink to="/" className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)} end>
          {t('nav.dashboard')}
        </NavLink>
        <NavLink to="/products" className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}>
          {t('nav.products')}
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}>
          {t('nav.profile')}
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}>
          {t('nav.settings')}
        </NavLink>
      </nav>
      <button type="button" className={styles.logout} onClick={handleLogout}>
        {t('nav.logout')}
      </button>
    </aside>
  );
}
