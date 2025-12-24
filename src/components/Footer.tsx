import { useTranslation } from "react-i18next";
import styles from "./Footer.module.css";
import { FaInstagram, FaFacebook, FaTripadvisor } from "react-icons/fa";
import logo from "../assets/irius-logo-white.png";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer id="contact-section" className={styles.footer}>
      <div className={styles.container}>
        <img src={logo} alt="Irius Gastronomia" className={styles.logoImage} />
        <div className={styles.contactGrid}>
          <div className={styles.contactItem}>
            <h4>{t("footerSection.for_guests")}</h4>
            <p>
              {t("footerSection.extension")}{" "}
              <span className={styles.highlight}>1100</span>
            </p>
          </div>
          <div className={styles.contactItem}>
            <h4>{t("footerSection.external_call")}</h4>
            <p>
              <a
                href="tel:+555135532222"
                aria-label="Telefone da Unidade (51) 3553-2222"
              >
                (51) 3553-2222
              </a>
              <br />
              <small>{t("footerSection.ask_extension")} 1100</small>
            </p>
          </div>
        </div>
        <div className={styles.socials}>
          <a
            href="https://www.instagram.com/irius_gastronomia/"
            className={styles.socialLink}
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.facebook.com/iriusgastronomia/?locale=pt_BR"
            className={styles.socialLink}
          >
            <FaFacebook />
          </a>
          <a
            href="https://www.tripadvisor.com.br/Restaurant_Review-g303543-d4530150-Reviews-Irius_Gastronomia-Novo_Hamburgo_State_of_Rio_Grande_do_Sul.html"
            className={styles.socialLink}
          >
            <FaTripadvisor />
          </a>
        </div>

        <div className={styles.copy}>
          © {new Date().getFullYear()} Irius Gastronomia.{" "}
          {t("footerSection.rights")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
