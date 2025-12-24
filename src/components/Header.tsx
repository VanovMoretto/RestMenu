import styles from './Header.module.css';
import logo from '../assets/irius-logo.svg'; 

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <img 
          src={logo} 
          alt="Irius Gastronomia" 
          className={styles.logoImage} 
        />
      </div>
    </header>
  );
};

export default Header;