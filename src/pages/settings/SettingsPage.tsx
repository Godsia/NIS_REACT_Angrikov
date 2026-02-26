import React from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSelect } from '../../features/settings/LanguageSelect';
import { ThemeToggle } from '../../features/settings/ThemeToggle';
import { PageSizeSelect } from '../../features/settings/PageSizeSelect';
import styles from './SettingsPage.module.css';

export function SettingsPage() {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{t('settings.title')}</h1>
      <div className={styles.card}>
        <div className={styles.row}>
          <LanguageSelect />
        </div>
        <div className={styles.row}>
          <ThemeToggle />
        </div>
        <div className={styles.row}>
          <PageSizeSelect />
        </div>
      </div>
    </div>
  );
}
