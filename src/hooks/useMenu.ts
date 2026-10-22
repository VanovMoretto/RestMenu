// src/hooks/useMenu.ts
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type TranslationFields = { name?: string; description?: string };
export type Translations = { en?: TranslationFields; es?: TranslationFields };

export interface Category {
  id: number;
  parent_id: number | null;
  slug: string;
  name: string;
  translations: Translations;
  sort_order: number;
}

export interface MenuItemData {
  id: number;
  category_id: number;
  slug: string | null;
  name: string;
  description: string | null;
  translations: Translations;
  price: number;
  image_url: string | null;
  serving_type: "bottle" | "glass" | null;
  show_picture_icon: boolean;
  is_available: boolean;
  allow_room_charge: boolean;
  sort_order: number;
}

// Lista "achatada" que o Menu renderiza na ordem: títulos e itens intercalados,
// do mesmo jeito que era o menuData.ts.
export type MenuEntry =
  | { kind: "section"; category: Category }
  | { kind: "subsection"; category: Category }
  | { kind: "item"; item: MenuItemData };

interface MenuData {
  tabs: Category[];
  entriesByTab: Record<string, MenuEntry[]>;
}

export const CATEGORY_COLUMNS = "id, parent_id, slug, name, translations, sort_order";
export const ITEM_COLUMNS =
  "id, category_id, slug, name, description, translations, price, image_url, " +
  "serving_type, show_picture_icon, is_available, allow_room_charge, sort_order";

async function fetchMenu(): Promise<MenuData> {
  const [categoriesRes, itemsRes] = await Promise.all([
    supabase
      .from("categories")
      .select(CATEGORY_COLUMNS)
      .eq("is_active", true)
      .order("sort_order")
      .returns<Category[]>(),
    supabase
      .from("menu_items")
      .select(ITEM_COLUMNS)
      .order("sort_order")
      .returns<MenuItemData[]>(),
  ]);
  if (categoriesRes.error) throw categoriesRes.error;
  if (itemsRes.error) throw itemsRes.error;

  return buildMenu(categoriesRes.data ?? [], itemsRes.data ?? []);
}

// Monta a árvore aba > seção > subseção. Categorias e itens que são "irmãos"
// dividem o mesmo sort_order, então são intercalados por ele.
// Filhos de uma categoria inativa nunca são alcançados e somem junto.
function buildMenu(categories: Category[], items: MenuItemData[]): MenuData {
  const childCategories = new Map<number | null, Category[]>();
  for (const c of categories) {
    const list = childCategories.get(c.parent_id) ?? [];
    list.push(c);
    childCategories.set(c.parent_id, list);
  }
  const childItems = new Map<number, MenuItemData[]>();
  for (const i of items) {
    const list = childItems.get(i.category_id) ?? [];
    list.push(i);
    childItems.set(i.category_id, list);
  }

  const walk = (parentId: number, depth: number, out: MenuEntry[]) => {
    const children = [
      ...(childItems.get(parentId) ?? []).map((item) => ({ sort: item.sort_order, item })),
      ...(childCategories.get(parentId) ?? []).map((category) => ({ sort: category.sort_order, category })),
    ].sort((a, b) => a.sort - b.sort);

    for (const child of children) {
      if ("item" in child) {
        out.push({ kind: "item", item: child.item });
      } else {
        out.push({ kind: depth === 1 ? "section" : "subsection", category: child.category });
        walk(child.category.id, depth + 1, out);
      }
    }
    return out;
  };

  const tabs = childCategories.get(null) ?? [];
  const entriesByTab: Record<string, MenuEntry[]> = {};
  for (const tab of tabs) entriesByTab[tab.slug] = walk(tab.id, 1, []);
  return { tabs, entriesByTab };
}

export function useMenu() {
  const [data, setData] = useState<MenuData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let ignore = false;
    fetchMenu()
      .then((menu) => {
        if (ignore) return;
        setData(menu);
        setError(null);
      })
      .catch((err: unknown) => {
        if (ignore) return;
        console.error("Erro ao carregar o cardápio:", err);
        // Erros do Supabase são objetos { message, code, hint }, não instâncias de Error
        setError((err as { message?: string })?.message ?? String(err));
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [attempt]);

  const reload = useCallback(() => {
    setLoading(true);
    setAttempt((n) => n + 1);
  }, []);

  return {
    tabs: data?.tabs ?? [],
    entriesByTab: data?.entriesByTab ?? {},
    loading,
    error,
    reload,
  };
}
