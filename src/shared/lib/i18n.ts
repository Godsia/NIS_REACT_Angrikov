import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import type { Language } from '../config/constants';
import en from '../config/locales/en.json';
import ru from '../config/locales/ru.json';

const resources = {
  en: { translation: en },
  ru: { translation: ru },
};

export const initI18n = (lng: Language) => {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      lng,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    });
};

export const changeLanguage = (lng: Language) => {
  i18n.changeLanguage(lng);
};

export default i18n;
