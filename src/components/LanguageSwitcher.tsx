import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import styles from "./LanguageSwitcher.module.css";

// Tipagem do objeto de mapeamento
const langToCountryCode: Record<string, string> = {
  pt: "br",
  en: "us",
  es: "es", 
};

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  // Tipagem do Ref
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = i18n.language ? i18n.language.split("-")[0] : "pt";
  
  // CORREÇÃO: Removemos "&& lng !== false"
  // O TypeScript já garante que é uma string, então essa checagem era redundante.
  const supportedLanguages = (i18n.options.supportedLngs || [])
    .filter((lng) => lng !== "cimode") as string[];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  useEffect(() => {
    // Tipagem do evento
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  // Fallback seguro caso o idioma não esteja mapeado
  const currentCountryCode = langToCountryCode[currentLang] || "br";

  return (
    <div className={styles.switcherWrapper} ref={dropdownRef}>
      <button
        className={styles.currentLangButton}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span className={`fi fi-${currentCountryCode} ${styles.flagIcon}`} />
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          {supportedLanguages
            .filter((lng) => lng !== currentLang)
            .map((lng) => {
              const countryCode = langToCountryCode[lng];
              return (
                <button
                  key={lng}
                  className={styles.dropdownItem}
                  onClick={() => changeLanguage(lng)}
                  type="button"
                >
                  <span className={`fi fi-${countryCode} ${styles.flagIcon}`} />
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;