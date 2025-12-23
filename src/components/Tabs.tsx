// src/components/Tabs/Tabs.tsx
import styles from './Tabs.module.css';
import { categories } from '../data/menuData'

interface TabsProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className={styles.tabsContainer}>
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