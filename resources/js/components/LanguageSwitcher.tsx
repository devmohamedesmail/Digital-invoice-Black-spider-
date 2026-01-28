import i18n from 'i18next';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n: i18next } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18next.language === 'en' ? 'ar' : 'en';
    i18next.changeLanguage(newLang);
  };

  return (
    <button onClick={toggleLanguage} className='btn btn-neutral w-full mx-2'>
      {i18next.language === 'en' ? 'العربية' : 'English'}
    </button>
  );
};

export default LanguageSwitcher;