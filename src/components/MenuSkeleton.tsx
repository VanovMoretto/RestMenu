// src/components/MenuSkeleton.tsx
// Esqueleto do cardápio enquanto os dados chegam do Supabase.
// Reaproveita as mesmas classes do Menu e das Tabs, então ocupa exatamente
// o mesmo espaço e a página não "pula" quando o conteúdo aparece.
import { useTranslation } from "react-i18next";
import menuStyles from "./Menu.module.css";
import tabStyles from "./Tabs.module.css";
import styles from "./MenuSkeleton.module.css";

const TAB_WIDTHS = [92, 104, 84, 112, 88, 76];
const ROWS = [
  { name: 62, desc: 88 },
  { name: 48, desc: 70 },
  { name: 70, desc: 92 },
  { name: 54, desc: 64 },
  { name: 66, desc: 80 },
];

const MenuSkeleton: React.FC = () => {
  const { t } = useTranslation();

  return (
    <main className={menuStyles.menuWrapper} aria-busy="true">
      <span className={styles.srOnly} role="status">{t("menu.loading")}</span>

      <div className={menuStyles.menuContainer} aria-hidden="true">
        <div className={tabStyles.tabsContainer}>
          {TAB_WIDTHS.map((width, i) => (
            <div
              key={i}
              className={`${tabStyles.tabButton} ${i === 0 ? tabStyles.active : ""} ${styles.tab}`}
              style={{ width }}
            >
              <span className={styles.shimmer} />
            </div>
          ))}
        </div>

        <section className={menuStyles.contentArea}>
          <div className={styles.sectionTitle}>
            <span className={`${styles.shimmer} ${styles.sectionText}`} />
          </div>

          {ROWS.map((row, i) => (
            <div key={i} className={styles.row} style={{ animationDelay: `${i * 80}ms` }}>
              <div className={styles.rowHeader}>
                <span className={styles.shimmer} style={{ width: `${row.name}%` }} />
                <span className={`${styles.shimmer} ${styles.price}`} />
              </div>
              <span className={`${styles.shimmer} ${styles.desc}`} style={{ width: `${row.desc}%` }} />
            </div>
          ))}
        </section>
      </div>
    </main>
  );
};

export default MenuSkeleton;
