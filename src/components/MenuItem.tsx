// src/components/MenuItem.tsx
import { Wine, Camera } from 'lucide-react';
import styles from './MenuItem.module.css';

interface MenuItemProps {
  name: string;
  price: string;
  description?: string;
  image?: string;
  picture?: boolean;
  servingType?: 'bottle' | 'glass'; 
  onClick?: () => void; 
}

const MenuItem: React.FC<MenuItemProps> = ({ name, price, description, picture, servingType, onClick }) => {
  return (
    <div 
      className={`${styles.card} ${onClick ? styles.clickable : ''}`} 
      onClick={onClick}
    > 
      <div className={styles.header}>
        <div className={styles.titleRow}>
           {servingType === 'glass' && <Wine size={18} className={styles.icon} />}
           
           <h3 className={styles.name}>{name}</h3>

           {/* --- NOVO: Ícone de Câmera Inline --- */}
           {picture && (
             <Camera 
               size={14} 
               strokeWidth={2}
               className={styles.cameraIcon} 
             />
           )}
           
        </div>
        <span className={styles.price}>{price}</span>
      </div>
      
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
};

export default MenuItem;