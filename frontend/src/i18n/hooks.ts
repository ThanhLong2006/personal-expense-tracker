import { useTranslation } from 'react-i18next';

/**
 * Custom hook để sử dụng i18n trong components
 * 
 * Usage:
 * const { t, changeLanguage, currentLanguage } = useI18n();
 * 
 * // Sử dụng translation
 * <button>{t('common.save')}</button>
 * 
 * // Đổi ngôn ngữ
 * changeLanguage('en');
 */
export const useI18n = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang: 'vi' | 'en') => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const currentLanguage = i18n.language as 'vi' | 'en';

  return {
    t,
    changeLanguage,
    currentLanguage,
  };
};

