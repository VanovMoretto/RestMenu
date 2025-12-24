// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ptJSON from './locales/pt.json';
import enJSON from './locales/en.json';

i18n
  .use(LanguageDetector) // Detecta o idioma do navegador
  .use(initReactI18next)
  .init({
    resources: {
      pt: { translation: ptJSON },
      en: { translation: enJSON },
    },
    fallbackLng: 'pt', // Se não achar inglês, usa português
    interpolation: {
      escapeValue: false, // React já protege contra XSS
    },
  });

export default i18n;