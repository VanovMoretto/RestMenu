import styles from "./Location.module.css";

const Location = () => {
  return (
    <section id="location-section" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.infoArea}>
          <h2 className={styles.title}>Como Chegar</h2>
          <p className={styles.address}>
            Av. Mauricio Cardoso, 303
            <br />
            Hamburgo Velho, Novo Hamburgo - RS
            <br />
            Andar térreo do <strong>Swan Hotel</strong>
          </p>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.buttonOutline}
          >
            Abrir no GPS
          </a>
        </div>
        <div className={styles.mapArea}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3466.507762974537!2d-51.11563202446043!3d-29.67605507511117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95194309ae8b544b%3A0xc0221f66f1073052!2sIRIUS%20BUFFET!5e0!3m2!1spt-BR!2sbr!4v1766600321962!5m2!1spt-BR!2sbr"
            className={styles.iframe}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa de Localização"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Location;
