// src/components/Modal.tsx
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    name: string;
    description?: string;
    price: string;
    image?: string;
  } | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, item }) => {
  if (!isOpen || !item) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        
        {item.image && (
          <div className={styles.imageWrapper}>
            <img src={item.image} alt={item.name} className={styles.image} />
          </div>
        )}
        
        <div className={styles.details}>
          <h2 className={styles.title}>{item.name}</h2>
          <p className={styles.description}>{item.description}</p>
          <div className={styles.footer}>
            <span className={styles.price}>{item.price}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;