// src/components/Tabs/Tabs.tsx
import { useEffect, useRef } from 'react';
import styles from './Tabs.module.css';
import { categories } from '../data/menuData';

interface TabsProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
  const tabsRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const activeElement = tabsRef.current?.querySelector(`.${styles.active}`) as HTMLElement;
    if (activeElement && tabsRef.current) {
      const container = tabsRef.current;
      const scrollLeft = activeElement.offsetLeft - (container.offsetWidth / 2) + (activeElement.offsetWidth / 2);
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [activeTab]);

  return (
    <nav className={styles.tabsContainer} ref={tabsRef}>
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`${styles.tabButton} ${activeTab === cat.id ? styles.active : ''}`}
          onClick={() => onTabChange(cat.id)}
        >
          {cat.label}
        </button>
      ))}
    </nav>
  );
};

export default Tabs;