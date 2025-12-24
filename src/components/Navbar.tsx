import { useState } from 'react';
import styles from './Navbar.module.css';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { label: "Menu", action: () => console.log("Ir para Menu") },
    { label: "Horários", action: () => console.log("Abrir Horários") },
    { label: "Telefone", action: () => console.log("Ver Telefone") },
    { label: "Como chegar", action: () => console.log("Abrir Mapa") },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.leftSection}>
        <button 
          className={`${styles.hamburgerBtn} ${isMobileMenuOpen ? styles.isOpen : ''}`} 
          onClick={toggleMenu}
          aria-label="Abrir menu"
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>
      </div>
      <div className={styles.centerSection}>
        <div className={styles.navLinks}>
          {navItems.map((item) => (
            <button key={item.label} onClick={item.action} className={styles.navButton}>
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.rightSection}>
        <LanguageSwitcher />
      </div>
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileLinksList}>
            {navItems.map((item) => (
              <button 
                key={item.label} 
                onClick={() => {
                  item.action();
                  setIsMobileMenuOpen(false);
                }} 
                className={styles.navButton}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;