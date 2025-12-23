// src/components/Menu.tsx
import { useState } from "react";
import styles from "./Menu.module.css";
import Tabs from "./Tabs";
import MenuItem from "./MenuItem";
import Modal from "./Modal";
import { menuItems } from "../data/menuData";

const Menu = () => {
  const [activeTab, setActiveTab] = useState("entrada");
  
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const currentItems = menuItems[activeTab as keyof typeof menuItems] || [];

  return (
    <main className={styles.menuWrapper}>
      <div className={styles.menuContainer}>
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

        <section className={styles.contentArea}>
          {currentItems.length > 0 ? (
            currentItems.map((item) => (
              <MenuItem
                key={item.id}
                name={item.name}
                price={item.price}
                description={item.description}
                onClick={() => setSelectedItem(item)}
              />
            ))
          ) : (
            <p className={styles.placeholder}>
              Nenhum item disponível nesta categoria.
            </p>
          )}
        </section>
      </div>
      <Modal 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
        item={selectedItem} 
      />
    </main>
  );
};

export default Menu;