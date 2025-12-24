import styles from './Hours.module.css';

const Hours = () => {
  return (
    <section id="hours-section" className={styles.section}>
      <h2 className={styles.title}>Horários de Funcionamento</h2>
      
      <div className={styles.container}>
        <div className={styles.singleCard}>
          
          {/* Lado Esquerdo: Restaurante */}
          <div className={styles.serviceBlock}>
            <h3 className={styles.serviceTitle}>Restaurante</h3>
            
            <div className={styles.infoBlock}>
              <span className={styles.days}>Segunda a Sexta</span>
              <span className={styles.time}>11:30 às 14:00</span>
              <span className={styles.time}>18:30 às 23:00</span>
            </div>

            <div className={styles.note}>
              Fechado aos Sábados, Domingos e Feriados
            </div>
          </div>

          {/* A Linha Divisória (Vertical no PC / Horizontal no Mobile) */}
          <div className={styles.divider}></div>

          {/* Lado Direito: Room Service */}
          <div className={styles.serviceBlock}>
            <h3 className={styles.serviceTitle}>Room Service</h3>
            
            <div className={styles.infoBlock}>
              <span className={styles.days}>Todos os dias</span>
              <span className={styles.time}>11:00 às 23:00</span>
            </div>
            
            <div style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--status-open)' }}>
              Atendimento Diário
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hours;