import React, { useEffect, useState } from 'react';
import styles from './StatusBadge.module.css';

interface StatusBadgeProps {
  type: 'restaurant' | 'roomService';
  label: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ type, label }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      const day = now.getDay();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      if (type === 'restaurant') {
        const isWeekday = day >= 1 && day <= 5;
        const lunch = currentTime >= 690 && currentTime <= 840;
        const dinner = currentTime >= 1140 && currentTime <= 1380;
        setIsOpen(isWeekday && (lunch || dinner));
      } else {
        setIsOpen(currentTime >= 660 && currentTime <= 1380);
      }
    };

    checkStatus();
    const timer = setInterval(checkStatus, 60000);
    return () => clearInterval(timer);
  }, [type]);

  return (
    <div className={styles.badgeContainer}>
      <span className={styles.label}>{label}</span>
      <div className={styles.statusWrapper}>
        <span className={`${styles.dot} ${isOpen ? styles.open : styles.closed}`} />
        <span className={styles.statusText}>{isOpen ? 'Aberto' : 'Fechado'}</span>
      </div>
    </div>
  );
};

export default StatusBadge;