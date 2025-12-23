// src/components/Menu/Menu.tsx
import { useState } from 'react';
import styles from './Menu.module.css';
import Tabs from './Tabs';

const Menu = () => {
  const [activeTab, setActiveTab] = useState('entrada');

  return (
    <main className={styles.menuWrapper}>
      <div className={styles.menuContainer}>
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        <section className={styles.contentArea}>
          <p className={styles.placeholder}>
            Mostrando itens de: <strong>{activeTab}</strong>
          </p>
        </section>
      </div>
    </main>
  );
};

export default Menu;