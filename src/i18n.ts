// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ptJSON from './locales/pt.json';
import enJSON from './locales/en.json';
import esJSON from './locales/es.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['pt', 'en', 'es'], 
    
    resources: {
      pt: { translation: ptJSON },
      en: { translation: enJSON },
      es: { translation: esJSON}
    },
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false,
    },
    debug: true, 
  });

export default i18n;