// src/components/MenuItem.tsx
import styles from './MenuItem.module.css';

interface MenuItemProps {
  name: string;
  price: string;
  description?: string;
  image?: string; // Adicionado para passar ao modal depois
  onClick: () => void; // Nova prop para lidar com o clique
}

const MenuItem: React.FC<MenuItemProps> = ({ name, price, description, onClick }) => {
  return (
    <div className={styles.card} onClick={onClick}> 
      <div className={styles.header}>
        <h3 className={styles.name}>{name}</h3>
        <span className={styles.price}>{price}</span>
      </div>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
};

export default MenuItem;