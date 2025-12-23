// src/components/Menu.tsx
import { useState } from "react";
import styles from "./Menu.module.css";
import Tabs from "./Tabs";
import MenuItem from "./MenuItem";
import { menuItems } from "../data/menuData";

interface MenuProps {
  onSelectItem: (item: any) => void;
}

const Menu: React.FC<MenuProps> = ({ onSelectItem }) => {
  const [activeTab, setActiveTab] = useState("entrada");

  const currentItems = menuItems[activeTab as keyof typeof menuItems] || [];

  return (
    <main className={styles.menuWrapper}>
      <div className={styles.menuContainer}>
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

        <section className={styles.contentArea}>
          {currentItems.length > 0 ? (
            currentItems.map((item: any, index) => {
 
              if (item.section) {
                return (
                  <h2 key={`section-${index}`} className={styles.sectionTitle}>
                    {item.section}
                  </h2>
                );
              }

              if (item.subsection) {
                return (
                  <h3 key={`sub-${index}`} className={styles.subSectionTitle}>
                    {item.subsection}
                  </h3>
                );
              }

              return (
                <MenuItem
                  key={item.id}
                  name={item.name}
                  price={item.price}
                  description={item.description}
                  servingType={item.servingType}
                  onClick={() => onSelectItem(item)}
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