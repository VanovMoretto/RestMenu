import styles from './Footer.module.css';
import { FaInstagram, FaFacebook, FaTripadvisor } from 'react-icons/fa';
import logo from '../assets/irius-logo-white.png'

const Footer = () => {
  return (
    <footer id="contact-section" className={styles.footer}>
      <div className={styles.container}>
        <img 
          src={logo} 
          alt="Irius Gastronomia" 
          className={styles.logoImage} 
        />
        <div className={styles.contactGrid}>
          <div className={styles.contactItem}>
            <h4>Para Hóspedes</h4>
            <p>Ramal <span className={styles.highlight}>1100</span></p>
          </div>
          
          <div className={styles.contactItem}>
            <h4>Ligação Externa</h4>
            <p>(51) 3553-2222 <br/>
            <small>Solicite o ramal 1100</small></p>
          </div>
        </div>

        {/* Redes Sociais */}
        <div className={styles.socials}>
          <a href="https://www.instagram.com/irius_gastronomia/" className={styles.socialLink}><FaInstagram/></a>
          <a href="https://www.facebook.com/iriusgastronomia/?locale=pt_BR" className={styles.socialLink}><FaFacebook/></a>
          <a href="https://www.tripadvisor.com.br/Restaurant_Review-g303543-d4530150-Reviews-Irius_Gastronomia-Novo_Hamburgo_State_of_Rio_Grande_do_Sul.html" className={styles.socialLink}><FaTripadvisor/></a>
        </div>

        <div className={styles.copy}>
          © {new Date().getFullYear()} Irius Gastronomia. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;