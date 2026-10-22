// src/admin/MenuManager.tsx
// Aba "Gestão de Cardápio": filtros, lista por categoria e o modal de item.
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, AlertCircle, Plus, Search } from "lucide-react";
import type { MenuItemData } from "../hooks/useMenu";
import { flattenCategories, normalizeText } from "./adminUtils";
import { useAdminMenu, type ItemChanges } from "./useAdminMenu";
import ItemRow from "./ItemRow";
import ItemFormModal from "./ItemFormModal";
import styles from "./MenuManager.module.css";

type Toast = { kind: "success" | "error"; text: string; id: number };

const MenuManager: React.FC = () => {
  const { categories, items, loading, error, saveItem, updateQuick } = useAdminMenu();
  const [search, setSearch] = useState("");
  const [tabFilter, setTabFilter] = useState<number | "all">("all");
  const [onlyPaused, setOnlyPaused] = useState(false);
  const [editing, setEditing] = useState<MenuItemData | "new" | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const notify = (kind: Toast["kind"], text: string) => setToast({ kind, text, id: Date.now() });

  const categoryOptions = useMemo(() => flattenCategories(categories), [categories]);
  const tabs = categoryOptions.filter((option) => option.depth === 0);
  const pausedCount = items.filter((item) => !item.is_available).length;

  // Grupos na ordem do cardápio, só com os itens que passam nos filtros
  const groups = useMemo(() => {
    const query = normalizeText(search.trim());
    return categoryOptions
      .filter((option) => tabFilter === "all" || option.rootId === tabFilter)
      .map((option) => ({
        option,
        items: items
          .filter(
            (item) =>
              item.category_id === option.category.id &&
              (!onlyPaused || !item.is_available) &&
              (!query || normalizeText(item.name).includes(query))
          )
          .sort((a, b) => a.sort_order - b.sort_order),
      }))
      .filter((group) => group.items.length > 0);
  }, [categoryOptions, items, search, tabFilter, onlyPaused]);

  const handleToggle = async (item: MenuItemData) => {
    const next = !item.is_available;
    try {
      await updateQuick(item, { is_available: next });
      notify("success", next ? `“${item.name}” voltou ao cardápio.` : `“${item.name}” foi pausado.`);
    } catch {
      notify("error", `Não foi possível alterar “${item.name}”. Tente de novo.`);
    }
  };

  const handlePriceSave = async (item: MenuItemData, price: number) => {
    try {
      await updateQuick(item, { price });
      notify("success", `Preço de “${item.name}” atualizado.`);
    } catch {
      notify("error", `Não foi possível salvar o preço de “${item.name}”.`);
    }
  };

  const handleModalSave = async (id: number | null, changes: ItemChanges) => {
    const saved = await saveItem(id, changes); // erros são mostrados dentro do modal
    setEditing(null);
    notify("success", id === null ? `“${saved.name}” foi criado.` : `“${saved.name}” foi salvo.`);
  };

  if (error) {
    return (
      <section className={styles.panel}>
        <p className={styles.emptyState}>Não foi possível carregar o cardápio: {error}</p>
      </section>
    );
  }

  return (
    <section className={styles.panel}>
      <div className={styles.toolbar}>
        <label className={styles.searchBox}>
          <Search size={18} />
          <input
            type="search"
            placeholder="Buscar prato ou bebida…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <button type="button" className={styles.newButton} onClick={() => setEditing("new")} disabled={loading}>
          <Plus size={18} />
          Novo item
        </button>
      </div>

      <div className={styles.filters}>
        <button
          type="button"
          className={`${styles.chip} ${tabFilter === "all" ? styles.chipActive : ""}`}
          onClick={() => setTabFilter("all")}
        >
          Todos
        </button>
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.category.id}
            className={`${styles.chip} ${tabFilter === tab.category.id ? styles.chipActive : ""}`}
            onClick={() => setTabFilter(tab.category.id)}
          >
            {tab.category.name}
          </button>
        ))}
        <button
          type="button"
          className={`${styles.chip} ${styles.chipPaused} ${onlyPaused ? styles.chipActive : ""}`}
          onClick={() => setOnlyPaused((v) => !v)}
          aria-pressed={onlyPaused}
        >
          Só pausados ({pausedCount})
        </button>
      </div>

      {!loading && (
        <p className={styles.summary}>
          {items.length} itens no cardápio · {pausedCount} {pausedCount === 1 ? "pausado" : "pausados"}
        </p>
      )}

      {loading ? (
        <ul className={styles.list} aria-busy="true" aria-label="Carregando itens">
          {Array.from({ length: 6 }, (_, i) => (
            <li key={i} className={`${styles.row} ${styles.rowSkeleton}`}>
              <span className={styles.shimmer} />
            </li>
          ))}
        </ul>
      ) : groups.length === 0 ? (
        <p className={styles.emptyState}>
          {onlyPaused ? "Nenhum item pausado. Tudo disponível!" : "Nenhum item encontrado."}
        </p>
      ) : (
        groups.map(({ option, items: groupItems }) => (
          <div key={option.category.id} className={styles.group}>
            <h2 className={styles.groupTitle}>
              {option.path}
              {option.hidden && <span className={styles.hiddenBadge}>Oculta no cardápio</span>}
            </h2>
            <ul className={styles.list}>
              {groupItems.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  onToggle={handleToggle}
                  onPriceSave={handlePriceSave}
                  onEdit={setEditing}
                />
              ))}
            </ul>
          </div>
        ))
      )}

      {editing && (
        <ItemFormModal
          key={editing === "new" ? "new" : editing.id}
          item={editing === "new" ? null : editing}
          categoryOptions={categoryOptions}
          items={items}
          categories={categories}
          onClose={() => setEditing(null)}
          onSave={handleModalSave}
        />
      )}

      {toast && (
        <div key={toast.id} className={`${styles.toast} ${toast.kind === "error" ? styles.toastError : ""}`} role="status">
          {toast.kind === "error" ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          {toast.text}
        </div>
      )}
    </section>
  );
};

export default MenuManager;
