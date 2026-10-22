// src/components/MenuItem.tsx
import { Wine, Camera, Plus } from 'lucide-react';
import styles from './MenuItem.module.css';
import UnavailableTag from './UnavailableTag';

interface MenuItemProps {
  name: string;
  price: string;
  description?: string;
  picture?: boolean;
  servingType?: 'bottle' | 'glass';
  isAvailable?: boolean;
  onClick?: () => void;
  onAdd?: () => void;
  addLabel?: string;     // texto do botão para leitores de tela
  cartQuantity?: number; // quantas unidades já estão no pedido
}

const MenuItem: React.FC<MenuItemProps> = ({
  name, price, description, picture, servingType, isAvailable = true, onClick, onAdd, addLabel, cartQuantity = 0,
}) => {
  return (
    <div
      className={`${styles.card} ${onClick ? styles.clickable : ''} ${isAvailable ? '' : styles.unavailable}`}
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
        <div className={styles.priceArea}>
          <span className={styles.price}>{price}</span>
          {onAdd && (
            <button
              type="button"
              className={`${styles.addButton} ${cartQuantity > 0 ? styles.addButtonActive : ''}`}
              onClick={(e) => {
                e.stopPropagation(); // não abre o modal da foto
                onAdd();
              }}
              disabled={!isAvailable}
              aria-label={addLabel}
            >
              {cartQuantity > 0 ? cartQuantity : <Plus size={15} strokeWidth={2.2} />}
            </button>
          )}
        </div>
      </div>

      {description && <p className={styles.description}>{description}</p>}

      {!isAvailable && <UnavailableTag className={styles.tag} />}
    </div>
  );
};

export default MenuItem;
