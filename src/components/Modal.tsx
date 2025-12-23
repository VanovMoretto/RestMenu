import styles from './Modal.module.css';
import notFoundImg from '../assets/notFound.png';

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
  const displayImage = item.image || notFoundImg;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        
        <div className={styles.imageWrapper}>
          <img src={displayImage} alt={item.name} className={styles.image} />
        </div>
        
        <div className={styles.details}>
          <div className={styles.textContent}>
            <h2 className={styles.title}>{item.name}</h2>
            <p className={styles.description}>{item.description}</p>
          </div>
          
          <div className={styles.footer}>
            <span className={styles.price}>{item.price}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;