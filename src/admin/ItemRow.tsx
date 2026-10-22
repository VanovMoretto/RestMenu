// src/admin/ItemRow.tsx
import { useState } from "react";
import { BedDouble, ImageOff, Pencil } from "lucide-react";
import type { MenuItemData } from "../hooks/useMenu";
import { formatPrice, resolveImageUrl } from "../lib/menuFormat";
import { parsePrice, priceToInput } from "./adminUtils";
import ToggleSwitch from "./ToggleSwitch";
import styles from "./MenuManager.module.css";

interface ItemRowProps {
  item: MenuItemData;
  onToggle: (item: MenuItemData) => Promise<void>;
  onPriceSave: (item: MenuItemData, price: number) => Promise<void>;
  onEdit: (item: MenuItemData) => void;
}

const ItemRow: React.FC<ItemRowProps> = ({ item, onToggle, onPriceSave, onEdit }) => {
  const [editingPrice, setEditingPrice] = useState(false);
  const [draft, setDraft] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const imageSrc = resolveImageUrl(item.image_url);
  const showImage = imageSrc && failedSrc !== imageSrc;

  const startPriceEdit = () => {
    setDraft(priceToInput(item.price));
    setInvalid(false);
    setEditingPrice(true);
  };

  // fromBlur: clicar fora com valor inválido só desiste, sem prender a pessoa no campo
  const commitPrice = async (fromBlur: boolean) => {
    const value = parsePrice(draft);
    if (value === null) {
      if (fromBlur) setEditingPrice(false);
      else setInvalid(true);
      return;
    }
    setEditingPrice(false);
    if (value === Number(item.price)) return;
    setBusy(true);
    try {
      await onPriceSave(item, value);
    } finally {
      setBusy(false);
    }
  };

  const handleToggle = async () => {
    setBusy(true);
    try {
      await onToggle(item);
    } finally {
      setBusy(false);
    }
  };

  return (
    <li className={`${styles.row} ${item.is_available ? "" : styles.rowPaused}`}>
      <div className={styles.thumb}>
        {showImage ? (
          <img src={imageSrc} alt="" onError={() => setFailedSrc(imageSrc)} />
        ) : (
          <ImageOff size={18} aria-label="Sem foto" />
        )}
      </div>

      <div className={styles.info}>
        <span className={styles.itemName}>{item.name}</span>
        {item.description && <span className={styles.itemDesc}>{item.description}</span>}
        {item.allow_room_charge && (
          <span className={styles.badge} title="Aceita cobrança no quarto">
            <BedDouble size={13} /> Quarto
          </span>
        )}
      </div>

      <div className={styles.priceCell}>
        {editingPrice ? (
          <div className={styles.priceEditor}>
            <span>R$</span>
            <input
              autoFocus
              inputMode="decimal"
              aria-label={`Novo preço de ${item.name}`}
              aria-invalid={invalid}
              className={invalid ? styles.inputInvalid : ""}
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                setInvalid(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitPrice(false);
                if (e.key === "Escape") setEditingPrice(false);
              }}
              onBlur={() => commitPrice(true)}
            />
          </div>
        ) : (
          <button
            type="button"
            className={styles.priceButton}
            onClick={startPriceEdit}
            disabled={busy}
            title="Clique para alterar o preço"
          >
            {formatPrice(item.price)}
            <Pencil size={13} className={styles.priceIcon} />
          </button>
        )}
        {invalid && <span className={styles.priceHint}>Ex.: 68,50</span>}
      </div>

      <div className={styles.availability}>
        <ToggleSwitch
          checked={item.is_available}
          onChange={handleToggle}
          disabled={busy}
          label={`Disponível: ${item.name}`}
        />
        <span className={item.is_available ? styles.statusOn : styles.statusOff}>
          {item.is_available ? "Disponível" : "Pausado"}
        </span>
      </div>

      <button type="button" className={styles.editButton} onClick={() => onEdit(item)} aria-label={`Editar ${item.name}`}>
        <Pencil size={15} />
        <span>Editar</span>
      </button>
    </li>
  );
};

export default ItemRow;
