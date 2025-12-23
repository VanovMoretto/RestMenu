import styles from './Header.module.css';
import StatusBadge from './StatusBadge';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <h1 className={styles.logoText}>IRIUS</h1>
        <p className={styles.logoSubtext}>gastronomia</p>
      </div>

      <div className={styles.statusRow}>
        <StatusBadge type="restaurant" label="Restaurante" />
        <StatusBadge type="roomService" label="Room Service" />
      </div>
    </header>
  );
};

export default Header;