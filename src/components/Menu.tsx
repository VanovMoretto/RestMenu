// src/components/Menu.tsx
import { useState } from "react";
import styles from "./Menu.module.css";
import Tabs from "./Tabs";
import MenuItem from "./MenuItem";
import { menuItems } from "../data/menuData";
import { useTranslation } from "react-i18next";

interface MenuProps {
  onSelectItem: (item: any) => void;
}

const Menu: React.FC<MenuProps> = ({ onSelectItem }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("entrada");

  const currentItems = menuItems[activeTab as keyof typeof menuItems] || [];

  const categoriesWithModal = ["entrada", "principal", "sobremesa"];

  const isClickable = categoriesWithModal.includes(activeTab);

  return (
    <main className={styles.menuWrapper}>
      <div className={styles.menuContainer}>
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

        <section className={styles.contentArea}>
          {currentItems.length > 0 ? (
            currentItems.map((item: any, index) => {
              if (item.section) {
                return (
                  <h2 key={`sec-${index}`} className={styles.sectionTitle}>
                    {t(item.section)}
                  </h2>
                );
              }
              if (item.subsection) {
                return (
                  <h3 key={`sub-${index}`} className={styles.subSectionTitle}>
                    {t(item.subsection)}
                  </h3>
                );
              }

              return (
                <MenuItem
                  key={item.id}
                  name={t(item.name)}
                  price={item.price}
                  description={
                    item.description ? t(item.description) : undefined
                  }
                  servingType={item.servingType}
                  onClick={isClickable ? () => onSelectItem(item) : undefined}
                />
              );
            })
          ) : (
            <p className={styles.placeholder}>
              Nenhum item disponível nesta categoria.
            </p>
          )}
        </section>
      </div>
    </main>
  );
};

export default Menu;
