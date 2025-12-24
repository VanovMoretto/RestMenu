import { useTranslation } from "react-i18next";
import styles from './Hours.module.css';

const Hours = () => {
  const { t } = useTranslation();

  return (
    <section id="hours-section" className={styles.section}>
      <h2 className={styles.title}>{t("hoursSection.title")}</h2>
      <div className={styles.container}>
        <div className={styles.singleCard}>
          <div className={styles.serviceBlock}>
            <h3 className={styles.serviceTitle}>{t("hoursSection.restaurant")}</h3>
            <div className={styles.infoBlock}>
              <span className={styles.days}>{t("hoursSection.days_rest")}</span>
              <span className={styles.time}>11:30 - 14:00</span>
              <span className={styles.time}>18:30 - 23:00</span>
            </div>
            <div className={styles.note}>
              {t("hoursSection.closed_rest")}
            </div>
          </div>
          <div className={styles.divider}></div>
          <div className={styles.serviceBlock}>
            <h3 className={styles.serviceTitle}>{t("hoursSection.room_service")}</h3>
            <div className={styles.infoBlock}>
              <span className={styles.days}>{t("hoursSection.days_room")}</span>
              <span className={styles.time}>11:00 - 23:00</span>
            </div>
            <div style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--status-open)' }}>
              {t("hoursSection.daily_service")}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hours;