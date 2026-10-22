// src/admin/useAdminMenu.ts
// Dados do painel: diferente do useMenu público, traz TODAS as categorias
// (inclusive desativadas) e permite editar. O RLS só deixa isso para admins.
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  CATEGORY_COLUMNS,
  ITEM_COLUMNS,
  type Category,
  type MenuItemData,
} from "../hooks/useMenu";

export interface AdminCategory extends Category {
  is_active: boolean;
}

// Campos que o painel envia ao salvar (id e slug nunca são alterados aqui)
export type ItemChanges = Partial<Omit<MenuItemData, "id" | "slug">>;

export function useAdminMenu() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [items, setItems] = useState<MenuItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    Promise.all([
      supabase
        .from("categories")
        .select(`${CATEGORY_COLUMNS}, is_active`)
        .order("sort_order")
        .returns<AdminCategory[]>(),
      supabase
        .from("menu_items")
        .select(ITEM_COLUMNS)
        .order("sort_order")
        .returns<MenuItemData[]>(),
    ]).then(([categoriesRes, itemsRes]) => {
      if (ignore) return;
      const failure = categoriesRes.error ?? itemsRes.error;
      if (failure) {
        setError(failure.message);
      } else {
        setCategories(categoriesRes.data ?? []);
        setItems(itemsRes.data ?? []);
      }
      setLoading(false);
    });
    return () => {
      ignore = true;
    };
  }, []);

  const patchLocal = (id: number, changes: ItemChanges) =>
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...changes } : item)));

  const saveItem = useCallback(async (id: number | null, changes: ItemChanges) => {
    const query =
      id === null
        ? supabase.from("menu_items").insert(changes)
        : supabase.from("menu_items").update(changes).eq("id", id);
    // .single() também detecta quando o RLS bloqueia em silêncio (0 linhas)
    const { data, error } = await query.select(ITEM_COLUMNS).single().returns<MenuItemData>();
    if (error || !data) throw new Error(error?.message ?? "Não foi possível salvar.");

    setItems((prev) =>
      id === null ? [...prev, data] : prev.map((item) => (item.id === id ? data : item))
    );
    return data;
  }, []);

  // Muda na tela na hora e desfaz se o banco recusar
  const updateQuick = useCallback(
    async (item: MenuItemData, changes: ItemChanges) => {
      const previous = Object.fromEntries(
        Object.keys(changes).map((key) => [key, item[key as keyof MenuItemData]])
      ) as ItemChanges;
      patchLocal(item.id, changes);
      try {
        await saveItem(item.id, changes);
      } catch (err) {
        patchLocal(item.id, previous);
        throw err;
      }
    },
    [saveItem]
  );

  return { categories, items, loading, error, saveItem, updateQuick };
}
