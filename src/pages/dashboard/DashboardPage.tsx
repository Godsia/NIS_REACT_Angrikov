import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{t('dashboard.title')}</h1>
      <p className={styles.welcome}>{t('dashboard.welcome')}</p>
    </div>
  );
}
