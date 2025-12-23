import React, { useEffect, useState } from 'react';
import styles from './StatusBadge.module.css';

interface StatusBadgeProps {
  type: 'restaurant' | 'roomService';
  label: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ type, label }) => {
  const [status, setStatus] = useState<'open' | 'closed' | 'warning'>('closed');

  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      const day = now.getDay();
      const currentMin = now.getHours() * 60 + now.getMinutes();

      let closingTimes: number[] = [];

      if (type === 'restaurant') {
        if (day >= 1 && day <= 5) {
          closingTimes = [840, 1380];
        }
      } else {
        closingTimes = [1380];
      }

      const isOpen = type === 'restaurant' 
        ? (day >= 1 && day <= 5 && ((currentMin >= 690 && currentMin <= 840) || (currentMin >= 1140 && currentMin <= 1380)))
        : (currentMin >= 660 && currentMin <= 1380);

      if (!isOpen) {
        setStatus('closed');
        return;
      }
      const isClosingSoon = closingTimes.some(close => close - currentMin <= 15 && close - currentMin > 0);
      setStatus(isClosingSoon ? 'warning' : 'open');
    };

    checkStatus();
    const timer = setInterval(checkStatus, 60000);
    return () => clearInterval(timer);
  }, [type]);

  const getStatusText = () => {
    if (status === 'open') return 'Aberto';
    if (status === 'warning') return 'Fecha em breve';
    return 'Fechado';
  };

  return (
    <div className={styles.badgeContainer}>
      <span className={styles.label}>{label}</span>
      <div className={styles.statusWrapper}>
        <span className={`${styles.dot} ${styles[status]}`} />
        <span className={styles.statusText}>{getStatusText()}</span>
      </div>
    </div>
  );
};

export default StatusBadge;