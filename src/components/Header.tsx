import styles from "./Header.module.css";
import StatusBadge from "./StatusBadge";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <h1 className={styles.logoText}>IRIUS</h1>
        <p className={styles.logoSubtext}>gastronomia</p>
      </div>
      <div className={styles.langSwitch}>
        <button
          onClick={() => changeLanguage("pt")}
          className={i18n.language.includes("pt") ? styles.activeLang : ""}
        >
          🇧🇷
        </button>
        <button
          onClick={() => changeLanguage("en")}
          className={i18n.language.includes("en") ? styles.activeLang : ""}
        >
          🇺🇸
        </button>
      </div>
      <div className={styles.statusRow}>
        <StatusBadge type="restaurant" label="Restaurante" />
        <StatusBadge type="roomService" label="Room Service" />
      </div>
    </header>
  );
};

export default Header;
