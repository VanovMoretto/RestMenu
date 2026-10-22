// src/components/UnavailableTag.tsx
import { useTranslation } from "react-i18next";
import styles from "./UnavailableTag.module.css";

const UnavailableTag: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { t } = useTranslation();
  return <span className={`${styles.tag} ${className}`}>{t("menu.unavailable")}</span>;
};

export default UnavailableTag;
