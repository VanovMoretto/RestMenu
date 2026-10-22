// src/checkout/CartBar.tsx
// Barra fixa no rodapé: "Ver pedido" quando há itens, ou "Acompanhar pedido #N".
import { useEffect } from "react";
import { ShoppingBag, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCart } from "../cart/cartStore";
import { formatPrice } from "../lib/menuFormat";
import styles from "./CheckoutSheet.module.css";

const CartBar: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const { t } = useTranslation();
  const { count, subtotal, activeOrder } = useCart();
  const visible = count > 0 || activeOrder !== null;

  // Abre espaço para o botão "voltar ao topo" não ficar por baixo da barra
  useEffect(() => {
    document.documentElement.style.setProperty("--cart-bar-space", visible ? "76px" : "0px");
    return () => document.documentElement.style.setProperty("--cart-bar-space", "0px");
  }, [visible]);

  if (!visible) return null;

  return (
    <button type="button" className={styles.cartBar} onClick={onOpen}>
      {count > 0 ? (
        <>
          <span className={styles.cartBarIcon}>
            <ShoppingBag size={18} />
            <span className={styles.cartBarBadge}>{count}</span>
          </span>
          <span className={styles.cartBarLabel}>{t("cart.view_order")}</span>
          <span className={styles.cartBarTotal}>{formatPrice(subtotal)}</span>
        </>
      ) : (
        <>
          <Clock size={18} />
          <span className={styles.cartBarLabel}>
            {t("status.track", { number: activeOrder?.order_number })}
          </span>
        </>
      )}
    </button>
  );
};

export default CartBar;
