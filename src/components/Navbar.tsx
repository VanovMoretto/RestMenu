import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Navbar.module.css";
import LanguageSwitcher from "./LanguageSwitcher";
import logoImg from "../assets/irius-logo.svg";

const Navbar = () => {
  const { t } = useTranslation(); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileLogo, setShowMobileLogo] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 180) {
        setShowMobileLogo(true);
      } else {
        setShowMobileLogo(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 85;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const navItems = [
    {
      label: t("nav.menu"),
      action: () => window.scrollTo({ top: 0, behavior: "smooth" }),
    },
    { label: t("nav.hours"), action: () => scrollToSection("hours-section") },
    {
      label: t("nav.directions"),
      action: () => scrollToSection("location-section"),
    },
    { label: t("nav.phone"), action: () => scrollToSection("contact-section") },
  ];
  return (
    <nav className={styles.navbar}>
      <div className={styles.leftSection}>
        <button
          className={`${styles.hamburgerBtn} ${
            isMobileMenuOpen ? styles.isOpen : ""
          }`}
          onClick={toggleMenu}
          aria-label="Abrir menu"
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>
        <div className={styles.desktopLogoContainer}>
          <img src={logoImg} alt="Irius" className={styles.logoImage} />
        </div>
      </div>
      <div className={styles.centerSection}>
        <div className={styles.navLinks}>
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className={styles.navButton}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div
          className={`${styles.mobileLogoContainer} ${
            isMobileMenuOpen || showMobileLogo ? styles.visible : ""
          }`}
        >
          <img src={logoImg} alt="Irius" className={styles.logoImage} />
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
