import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import styles from "./Modal.module.css";
import notFoundImg from "../assets/notFound.png";
import { useTranslation } from "react-i18next";
import type { MenuItemData } from "../hooks/useMenu";
import { formatPrice, localize, resolveImageUrl } from "../lib/menuFormat";
import { MAX_QUANTITY, useCart } from "../cart/cartStore";
import UnavailableTag from "./UnavailableTag";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItemData | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, item }) => {
  const { t, i18n } = useTranslation();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  if (!isOpen || !item) return null;
  const text = localize(item, i18n.resolvedLanguage ?? i18n.language);
  const displayImage = resolveImageUrl(item.image_url) || notFoundImg;

  const handleAdd = () => {
    addItem(item, quantity, notes);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          &times;
        </button>

        <div className={styles.imageWrapper}>
          <img
            src={displayImage}
            alt={text.name}
            className={styles.image}
            // Foto apagada ou caminho errado: mostra a imagem padrão em vez de quebrar
            onError={(e) => {
              if (e.currentTarget.src !== new URL(notFoundImg, window.location.href).href) {
                e.currentTarget.src = notFoundImg;
              }
            }}
          />
        </div>

        <div className={styles.details}>
          <div className={styles.textContent}>
            <h2 className={styles.title}>{text.name}</h2>
            <p className={styles.description}>{text.description ?? ''}</p>
          </div>

          <div className={`${styles.footer} ${item.is_available ? '' : styles.footerUnavailable}`}>
            {!item.is_available && <UnavailableTag />}
            <span className={styles.price}>{formatPrice(item.price)}</span>
          </div>

          {item.is_available ? (
            <div className={styles.orderArea}>
              <label className={styles.notesField}>
                <span>{t("cart.item_notes")}</span>
                <textarea
                  rows={2}
                  maxLength={200}
                  value={notes}
                  placeholder={t("cart.item_notes_placeholder")}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </label>

              <div className={styles.orderRow}>
                <div className={styles.stepper} role="group" aria-label={t("cart.quantity")}>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label={t("cart.decrease")}
                  >
                    <Minus size={16} />
                  </button>
                  <span aria-live="polite">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
                    disabled={quantity >= MAX_QUANTITY}
                    aria-label={t("cart.increase")}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button type="button" className={styles.addButton} onClick={handleAdd}>
                  {t("cart.add_to_order")} · {formatPrice(Number(item.price) * quantity)}
                </button>
              </div>
            </div>
          ) : (
            <button type="button" className={styles.addButton} disabled>
              {t("menu.unavailable")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
