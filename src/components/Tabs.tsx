// src/components/Tabs/Tabs.tsx
import { useEffect, useRef } from "react";
import styles from "./Tabs.module.css";

export interface TabOption {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: TabOption[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  const tabsRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const activeElement = tabsRef.current?.querySelector(
      `.${styles.active}`
    ) as HTMLElement;
    if (activeElement && tabsRef.current) {
      const container = tabsRef.current;
      const scrollLeft =
        activeElement.offsetLeft -
        container.offsetWidth / 2 +
        activeElement.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [activeTab]);

  return (
    <nav className={styles.tabsContainer} ref={tabsRef}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.tabButton} ${
            activeTab === tab.id ? styles.active : ""
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
};

export default Tabs;
