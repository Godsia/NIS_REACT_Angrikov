import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../../features/auth/login-form';
import styles from './LoginPage.module.css';

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>{t('auth.loginTitle')}</h1>
        <LoginForm onSuccess={() => navigate('/', { replace: true })} />
      </div>
    </div>
  );
}
