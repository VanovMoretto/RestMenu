// src/admin/ItemFormModal.tsx
// Modal "Novo item / Editar item". A foto sobe para o Storage assim que é
// escolhida; a URL só vai para o banco quando a pessoa clica em Salvar.
import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, X } from "lucide-react";
import type { MenuItemData, Translations } from "../hooks/useMenu";
import { resolveImageUrl } from "../lib/menuFormat";
import {
  nextSortOrder,
  parsePrice,
  priceToInput,
  removeMenuImages,
  uploadMenuImage,
  type CategoryOption,
} from "./adminUtils";
import type { AdminCategory, ItemChanges } from "./useAdminMenu";
import ToggleSwitch from "./ToggleSwitch";
import styles from "./ItemFormModal.module.css";

interface ItemFormModalProps {
  item: MenuItemData | null; // null = novo item
  categoryOptions: CategoryOption[];
  categories: AdminCategory[];
  items: MenuItemData[];
  onClose: () => void;
  onSave: (id: number | null, changes: ItemChanges) => Promise<void>;
}

type FieldErrors = Partial<Record<"name" | "price" | "categoryId", string>>;

const ItemFormModal: React.FC<ItemFormModalProps> = ({
  item,
  categoryOptions,
  categories,
  items,
  onClose,
  onSave,
}) => {
  const isNew = item === null;
  const [form, setForm] = useState(() => ({
    name: item?.name ?? "",
    description: item?.description ?? "",
    categoryId: item ? String(item.category_id) : "",
    price: item ? priceToInput(item.price) : "",
    isAvailable: item?.is_available ?? true,
    allowRoomCharge: item?.allow_room_charge ?? false,
    servingType: (item?.serving_type ?? "") as "" | "glass" | "bottle",
    enName: item?.translations?.en?.name ?? "",
    enDescription: item?.translations?.en?.description ?? "",
    esName: item?.translations?.es?.name ?? "",
    esDescription: item?.translations?.es?.description ?? "",
  }));
  const [imageUrl, setImageUrl] = useState<string | null>(item?.image_url ?? null);
  const [photoChanged, setPhotoChanged] = useState(false);
  const [failedPreview, setFailedPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const uploadedPaths = useRef<string[]>([]); // fotos enviadas nesta edição
  const fileInput = useRef<HTMLInputElement>(null);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // o aviso de erro some assim que a pessoa mexe no campo
    if (key in fieldErrors) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key as keyof FieldErrors];
        return next;
      });
    }
  };

  const previewSrc = resolveImageUrl(imageUrl);
  const previewBroken = previewSrc !== undefined && failedPreview === previewSrc;
  const selectedCategory = categoryOptions.find((o) => String(o.category.id) === form.categoryId);
  const busy = uploading || saving;

  const close = () => {
    if (busy) return;
    removeMenuImages(uploadedPaths.current); // nada foi salvo: limpa o bucket
    onClose();
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const { path, publicUrl } = await uploadMenuImage(file);
      uploadedPaths.current.push(path);
      setImageUrl(publicUrl);
      setPhotoChanged(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao enviar a foto.");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const removePhoto = () => {
    setImageUrl(null);
    setPhotoChanged(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    const price = parsePrice(form.price);
    const categoryId = Number(form.categoryId);
    const errors: FieldErrors = {};
    if (!name) errors.name = "Informe o nome do item.";
    if (price === null) errors.price = "Preço inválido. Exemplo: 68,50";
    if (!categoryId) errors.categoryId = "Escolha onde o item aparece no cardápio.";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0 || price === null) return;

    const changes: ItemChanges = {
      name,
      description: form.description.trim() || null,
      category_id: categoryId,
      price,
      is_available: form.isAvailable,
      allow_room_charge: form.allowRoomCharge,
      serving_type: form.servingType === "" ? null : form.servingType,
      translations: buildTranslations(form),
    };
    if (photoChanged) {
      changes.image_url = imageUrl;
      changes.show_picture_icon = imageUrl !== null; // ícone de câmera no cardápio
    }
    // Item novo, ou que mudou de categoria, vai para o fim da categoria
    if (isNew || categoryId !== item.category_id) {
      changes.sort_order = nextSortOrder(categoryId, items, categories);
    }

    setSaving(true);
    setError(null);
    try {
      await onSave(item?.id ?? null, changes);
      // Fotos enviadas e depois trocadas/removidas nesta edição não são usadas
      removeMenuImages(uploadedPaths.current.filter((path) => !imageUrl?.endsWith(path)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar.");
      setSaving(false);
    }
  };

  return (
    <div
      className={styles.overlay}
      onMouseDown={(e) => e.target === e.currentTarget && close()}
      onKeyDown={(e) => e.key === "Escape" && close()}
    >
      <form className={styles.modal} onSubmit={handleSubmit} role="dialog" aria-modal="true" aria-labelledby="item-modal-title" noValidate>
        <header className={styles.header}>
          <h2 id="item-modal-title">{isNew ? "Novo item" : "Editar item"}</h2>
          <button type="button" className={styles.closeButton} onClick={close} aria-label="Fechar" disabled={busy}>
            <X size={20} />
          </button>
        </header>

        <div className={styles.body}>
          {/* --- Foto --- */}
          <div
            className={`${styles.photo} ${dragOver ? styles.photoDragOver : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFile(e.dataTransfer.files[0]);
            }}
          >
            {uploading ? (
              <div className={styles.photoPlaceholder}>
                <Loader2 size={28} className={styles.spin} />
                <span>Enviando foto…</span>
              </div>
            ) : previewSrc && !previewBroken ? (
              <>
                <img src={previewSrc} alt="Foto do item" onError={() => setFailedPreview(previewSrc)} />
                <div className={styles.photoActions}>
                  <button type="button" onClick={() => fileInput.current?.click()}>
                    <ImagePlus size={16} /> Trocar foto
                  </button>
                  <button type="button" onClick={removePhoto}>
                    <Trash2 size={16} /> Remover
                  </button>
                </div>
              </>
            ) : (
              <button type="button" className={styles.photoPlaceholder} onClick={() => fileInput.current?.click()}>
                <ImagePlus size={30} />
                <strong>Adicionar foto</strong>
                <span>
                  {previewBroken ? "A foto atual não foi encontrada. " : ""}
                  Clique ou arraste uma imagem (JPG, PNG ou WebP)
                </span>
              </button>
            )}
            <input
              ref={fileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              hidden
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>

          {/* --- Dados principais --- */}
          <label className={styles.field}>
            <span>Nome</span>
            <input
              autoFocus
              value={form.name}
              maxLength={120}
              onChange={(e) => set("name", e.target.value)}
              aria-invalid={!!fieldErrors.name}
            />
            {fieldErrors.name && <small className={styles.fieldError}>{fieldErrors.name}</small>}
          </label>

          <label className={styles.field}>
            <span>Descrição <em>(opcional)</em></span>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Ex.: Grelhado na manteiga. Com massa, legumes e purê de baroa."
            />
          </label>

          <div className={styles.twoColumns}>
            <label className={styles.field}>
              <span>Categoria</span>
              <select
                value={form.categoryId}
                onChange={(e) => set("categoryId", e.target.value)}
                aria-invalid={!!fieldErrors.categoryId}
              >
                <option value="" disabled>
                  Selecione…
                </option>
                {categoryOptions.map((option) => (
                  <option key={option.category.id} value={option.category.id}>
                    {"   ".repeat(option.depth)}
                    {option.category.name}
                    {option.hidden ? " (oculta)" : ""}
                  </option>
                ))}
              </select>
              {fieldErrors.categoryId ? (
                <small className={styles.fieldError}>{fieldErrors.categoryId}</small>
              ) : (
                selectedCategory && <small className={styles.hint}>Aparece em: {selectedCategory.path}</small>
              )}
            </label>

            <label className={styles.field}>
              <span>Preço</span>
              <div className={styles.priceInput}>
                <span>R$</span>
                <input
                  inputMode="decimal"
                  placeholder="0,00"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  aria-invalid={!!fieldErrors.price}
                />
              </div>
              {fieldErrors.price && <small className={styles.fieldError}>{fieldErrors.price}</small>}
            </label>
          </div>

          {/* --- Chaves --- */}
          <div className={styles.switchRow}>
            <div>
              <strong>Disponível</strong>
              <p>Desligado, o item aparece como “Indisponível no momento” e não pode ser pedido.</p>
            </div>
            <ToggleSwitch
              checked={form.isAvailable}
              onChange={() => set("isAvailable", !form.isAvailable)}
              label="Disponível"
            />
          </div>

          <div className={styles.switchRow}>
            <div>
              <strong>Aceita cobrança no quarto</strong>
              <p>Hóspedes podem pedir e pagar no check-out, sem pagamento antecipado.</p>
            </div>
            <ToggleSwitch
              checked={form.allowRoomCharge}
              onChange={() => set("allowRoomCharge", !form.allowRoomCharge)}
              label="Aceita cobrança no quarto"
            />
          </div>

          {/* --- Opções extras (fechadas por padrão) --- */}
          <details className={styles.more}>
            <summary>Traduções (inglês / espanhol) e mais opções</summary>

            <p className={styles.hint}>
              Se ficar em branco, o cardápio mostra o texto em português.
            </p>
            <div className={styles.twoColumns}>
              <label className={styles.field}>
                <span>Nome em inglês</span>
                <input value={form.enName} onChange={(e) => set("enName", e.target.value)} />
              </label>
              <label className={styles.field}>
                <span>Nome em espanhol</span>
                <input value={form.esName} onChange={(e) => set("esName", e.target.value)} />
              </label>
              <label className={styles.field}>
                <span>Descrição em inglês</span>
                <textarea rows={2} value={form.enDescription} onChange={(e) => set("enDescription", e.target.value)} />
              </label>
              <label className={styles.field}>
                <span>Descrição em espanhol</span>
                <textarea rows={2} value={form.esDescription} onChange={(e) => set("esDescription", e.target.value)} />
              </label>
            </div>

            <label className={styles.field}>
              <span>Tipo de serviço (vinhos)</span>
              <select
                value={form.servingType}
                onChange={(e) => set("servingType", e.target.value as typeof form.servingType)}
              >
                <option value="">Não se aplica</option>
                <option value="glass">Taça (mostra o ícone de taça)</option>
                <option value="bottle">Garrafa</option>
              </select>
            </label>
          </details>

          {error && (
            <p className={styles.formError} role="alert">
              {error}
            </p>
          )}
        </div>

        <footer className={styles.footer}>
          <button type="button" className={styles.cancelButton} onClick={close} disabled={busy}>
            Cancelar
          </button>
          <button type="submit" className={styles.saveButton} disabled={busy}>
            {saving ? "Salvando…" : isNew ? "Criar item" : "Salvar alterações"}
          </button>
        </footer>
      </form>
    </div>
  );
};

function buildTranslations(form: {
  enName: string;
  enDescription: string;
  esName: string;
  esDescription: string;
}): Translations {
  const pick = (name: string, description: string) => {
    const entry: { name?: string; description?: string } = {};
    if (name.trim()) entry.name = name.trim();
    if (description.trim()) entry.description = description.trim();
    return Object.keys(entry).length ? entry : undefined;
  };
  const translations: Translations = {};
  const en = pick(form.enName, form.enDescription);
  const es = pick(form.esName, form.esDescription);
  if (en) translations.en = en;
  if (es) translations.es = es;
  return translations;
}

export default ItemFormModal;
