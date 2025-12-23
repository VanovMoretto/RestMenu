import { Wine } from 'lucide-react'; 
import styles from './MenuItem.module.css';

interface MenuItemProps {
  name: string;
  price: string;
  description?: string;
  image?: string;
  servingType?: 'bottle' | 'glass'; 
  onClick?: () => void; 
}

const MenuItem: React.FC<MenuItemProps> = ({ name, price, description, servingType, onClick }) => {
  return (
    <div 
      className={`${styles.card} ${onClick ? styles.clickable : ''}`} 
      onClick={onClick}
    > 
      <div className={styles.header}>
        <div className={styles.titleRow}>
           {servingType === 'glass' && <Wine size={18} className={styles.icon} />}
           <h3 className={styles.name}>{name}</h3>
        </div>
        <span className={styles.price}>{price}</span>
      </div>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
};

export default MenuItem;