import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '../../shared/ui/Button';
import styles from './RegisterPage.module.css';

export function RegisterPage() {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>{t('register.title')}</h1>
        <p className={styles.stub}>{t('register.stub')}</p>
        <Link to="/login">
          <Button>{t('auth.login')}</Button>
        </Link>
      </div>
    </div>
  );
}
