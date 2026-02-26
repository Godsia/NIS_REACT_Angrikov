import React, { useEffect } from 'react';
import { useAppSelector } from '../../shared/lib/redux';
import { selectTheme, selectLanguage } from '../store/selectors';
import { changeLanguage } from '../../shared/lib/i18n';

export function ThemeAndLanguageSync({ children }: { children: React.ReactNode }) {
  const theme = useAppSelector(selectTheme);
  const language = useAppSelector(selectLanguage);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    changeLanguage(language);
  }, [language]);

  return <>{children}</>;
}
