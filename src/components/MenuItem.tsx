import styles from './MenuItem.module.css';

interface MenuItemProps {
  name: string;
  price: string;
  description?: string;
  image?: string;
  servingType?: 'bottle' | 'glass'; 
  onClick: () => void;
}

const Icons = {
  Glass: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 6, color: '#888'}}>
      <path d="M17 2v11h-2v-8h-6v8h-2v-11" />
      <path d="M8 13a6 6 0 1 0 12 0v-5h-12v5" />
      <path d="M12 19v3" />
      <path d="M8 22h8" />
    </svg>
  ),
  Bottle: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 6, color: '#888'}}>
      <path d="M9 2h6v5h-6z" />
      <path d="M9 7v2.4c-2.4 1.2-4 3.7-4 6.6v8h14v-8c0-2.9-1.6-5.4-4-6.6v-2.4" />
      <path d="M8 22h8" />
      <path d="M12 11v-4" />
    </svg>
  )
};

const MenuItem: React.FC<MenuItemProps> = ({ name, price, description, servingType, onClick }) => {
  return (
    <div className={styles.card} onClick={onClick}> 
      <div className={styles.header}>
        <div className={styles.titleRow}>
           {servingType === 'glass' && <Icons.Glass />}
           {servingType === 'bottle' && <Icons.Bottle />}
           <h3 className={styles.name}>{name}</h3>
        </div>
        <span className={styles.price}>{price}</span>
      </div>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
};

export default MenuItem;