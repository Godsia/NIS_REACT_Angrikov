import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '../../../shared/lib/redux';
import { selectLanguage } from '../../../app/store/selectors';
import { setLanguage } from '../../../app/store/settingsSlice';
import { changeLanguage } from '../../../shared/lib/i18n';
import type { Language } from '../../../shared/config/constants';
import { LANGUAGES } from '../../../shared/config/constants';

const labels: Record<Language, string> = { en: 'English', ru: 'Русский' };

export function LanguageSelect() {
  const { t } = useTranslation();
  const language = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value as Language;
      dispatch(setLanguage(value));
      changeLanguage(value);
    },
    [dispatch]
  );

  return (
    <div>
      <label htmlFor="lang-select">{t('settings.language')}</label>
      <select
        id="lang-select"
        value={language}
        onChange={handleChange}
        style={{ marginLeft: 8, padding: '4px 8px' }}
      >
        {LANGUAGES.map((lang) => (
          <option key={lang} value={lang}>
            {labels[lang]}
          </option>
        ))}
      </select>
    </div>
  );
}
