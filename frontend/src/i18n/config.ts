import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import viTranslations from './locales/vi.json';
import enTranslations from './locales/en.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      vi: {
        translation: viTranslations,
      },
      en: {
        translation: enTranslations,
      },
    },
    lng: localStorage.getItem('language') || 'vi', // Default language
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;

