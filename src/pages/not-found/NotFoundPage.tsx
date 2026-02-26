import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '../../shared/ui/Button';
import styles from './NotFoundPage.module.css';

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.description}>{t('notFound.title')}</p>
      <p className={styles.sub}>{t('notFound.description')}</p>
      <Link to="/">
        <Button>{t('notFound.goHome')}</Button>
      </Link>
    </div>
  );
}
