import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '../../../shared/lib/redux';
import { selectTheme } from '../../../app/store/selectors';
import { setTheme } from '../../../app/store/settingsSlice';
import type { Theme } from '../../../shared/config/constants';

export function ThemeToggle() {
  const { t } = useTranslation();
  const theme = useAppSelector(selectTheme);
  const dispatch = useAppDispatch();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(setTheme(e.target.value as Theme));
    },
    [dispatch]
  );

  return (
    <div>
      <label htmlFor="theme-select">{t('settings.theme')}</label>
      <select
        id="theme-select"
        value={theme}
        onChange={handleChange}
        style={{ marginLeft: 8, padding: '4px 8px' }}
      >
        <option value="light">{t('settings.themeLight')}</option>
        <option value="dark">{t('settings.themeDark')}</option>
      </select>
    </div>
  );
}
