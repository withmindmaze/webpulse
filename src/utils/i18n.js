// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importing translation files directly
import translationEN from '../../public/locales/en/common.json';
import translationAR from '../../public/locales/ar/common.json';

const resources = {
    en: {
        translation: translationEN
    },
    ar: {
        translation: translationAR
    }
};

i18n
    .use(initReactI18next) // Passes i18n down to react-i18next
    .init({
        resources,
        fallbackLng: 'en',
        lng: "en", // If you want to initialize with a specific language
        interpolation: {
            escapeValue: false, // Not necessary for React as it escapes by default
        }
    });

export default i18n;
