// src/checkout/CartStep.tsx
import { Minus, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { MAX_QUANTITY, useCart } from "../cart/cartStore";
import { formatPrice, localize } from "../lib/menuFormat";
import styles from "./CheckoutSheet.module.css";

interface CartStepProps {
  onContinue: () => void;
  onBrowse: () => void;
}

const CartStep: React.FC<CartStepProps> = ({ onContinue, onBrowse }) => {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const { lines, subtotal, setQuantity, setNotes } = useCart();

  if (lines.length === 0) {
    return (
      <div className={styles.body}>
        <p className={styles.empty}>{t("cart.empty")}</p>
        <button type="button" className={styles.secondaryButton} onClick={onBrowse}>
          {t("cart.browse")}
        </button>
      </div>
    );
  }

  return (
    <>
      <div className={styles.body}>
        <ul className={styles.lines}>
          {lines.map((line) => (
            <li key={line.lineId} className={styles.line}>
              <div className={styles.lineTop}>
                <span className={styles.lineName}>{localize(line.item, language).name}</span>
                <span className={styles.linePrice}>{formatPrice(Number(line.item.price) * line.quantity)}</span>
              </div>
              <input
                className={styles.lineNotes}
                value={line.notes}
                maxLength={200}
                placeholder={t("cart.item_notes_placeholder")}
                aria-label={t("cart.item_notes")}
                onChange={(e) => setNotes(line.lineId, e.target.value)}
              />
              <div className={styles.lineActions}>
                <div className={styles.stepper}>
                  <button
                    type="button"
                    onClick={() => setQuantity(line.lineId, line.quantity - 1)}
                    aria-label={line.quantity === 1 ? t("cart.remove") : t("cart.decrease")}
                  >
                    {line.quantity === 1 ? <Trash2 size={15} /> : <Minus size={15} />}
                  </button>
                  <span>{line.quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(line.lineId, line.quantity + 1)}
                    disabled={line.quantity >= MAX_QUANTITY}
                    aria-label={t("cart.increase")}
                  >
                    <Plus size={15} />
                  </button>
                </div>
                <span className={styles.unitPrice}>
                  {t("cart.each", { price: formatPrice(line.item.price) })}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <footer className={styles.footer}>
        <div className={styles.totalRow}>
          <span>{t("cart.subtotal")}</span>
          <strong>{formatPrice(subtotal)}</strong>
        </div>
        <button type="button" className={styles.primaryButton} onClick={onContinue}>
          {t("cart.continue")}
        </button>
      </footer>
    </>
  );
};

export default CartStep;
