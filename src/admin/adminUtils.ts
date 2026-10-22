// src/admin/adminUtils.ts
import { supabase } from "../lib/supabase";
import type { MenuItemData } from "../hooks/useMenu";
import type { AdminCategory } from "./useAdminMenu";

// ---------------------------------------------------------------------------
// Preço
// ---------------------------------------------------------------------------

// Aceita o jeito que a pessoa digitar: "68", "68,5", "68,50", "R$ 1.234,56", "68.50"
export function parsePrice(raw: string): number | null {
  let s = raw.replace(/R\$|\s/g, "");
  if (!s) return null;
  if (s.includes(",")) s = s.replace(/\./g, "").replace(",", ".");
  if (!/^\d{1,8}(\.\d{1,2})?$/.test(s)) return null;
  return Math.round(Number(s) * 100) / 100;
}

// 68 -> "68,00" (para preencher o campo de edição)
export function priceToInput(price: number | string) {
  return Number(price).toFixed(2).replace(".", ",");
}

// ---------------------------------------------------------------------------
// Categorias
// ---------------------------------------------------------------------------

export interface CategoryOption {
  category: AdminCategory;
  depth: number;
  rootId: number; // aba (categoria de nível 0) à qual ela pertence
  path: string; // "Vinhos › Vinhos Tintos › Malbec"
  hidden: boolean; // ela ou algum "pai" está desativado
}

// Lista as categorias na mesma ordem do cardápio (aba > seção > subseção)
export function flattenCategories(categories: AdminCategory[]): CategoryOption[] {
  const out: CategoryOption[] = [];
  const walk = (parentId: number | null, depth: number, path: string[], hidden: boolean, rootId: number | null) => {
    categories
      .filter((c) => c.parent_id === parentId)
      .sort((a, b) => a.sort_order - b.sort_order)
      .forEach((category) => {
        const nextPath = [...path, category.name];
        const isHidden = hidden || !category.is_active;
        const root = rootId ?? category.id;
        out.push({ category, depth, rootId: root, path: nextPath.join(" › "), hidden: isHidden });
        walk(category.id, depth + 1, nextPath, isHidden, root);
      });
  };
  walk(null, 0, [], false, null);
  return out;
}

// sort_order para um item novo: depois de tudo que já existe naquela categoria
export function nextSortOrder(categoryId: number, items: MenuItemData[], categories: AdminCategory[]) {
  const siblings = [
    ...items.filter((i) => i.category_id === categoryId).map((i) => i.sort_order),
    ...categories.filter((c) => c.parent_id === categoryId).map((c) => c.sort_order),
  ];
  return (siblings.length ? Math.max(...siblings) : 0) + 10;
}

// Busca sem ligar para acentos/maiúsculas: "parmegiana" acha "Parmegiana"
export function normalizeText(text: string) {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// ---------------------------------------------------------------------------
// Fotos (bucket menu-images)
// ---------------------------------------------------------------------------

export const MENU_IMAGES_BUCKET = "menu-images";
const MAX_BYTES = 5 * 1024 * 1024; // mesmo limite do bucket
const MAX_SIDE = 1600; // px — mais que suficiente para o modal do cardápio
const ALLOWED_TYPES = ["image/webp", "image/jpeg", "image/png", "image/avif"];

function canvasToBlob(canvas: HTMLCanvasElement, type: string) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.85));
}

// Foto de celular costuma ter 4–10 MB. Reduz para no máx. 1600px e converte para
// WebP (ou JPEG, se o navegador não gerar WebP) antes de subir.
async function optimizeImage(file: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const webp = await canvasToBlob(canvas, "image/webp");
    if (webp?.type === "image/webp") return webp;
    const jpeg = await canvasToBlob(canvas, "image/jpeg");
    if (jpeg) return jpeg;
  } catch {
    // Formato que o navegador não abre: tenta subir o original
  }
  return file;
}

export async function uploadMenuImage(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Escolha um arquivo de imagem (JPG, PNG ou WebP).");
  }
  const blob = await optimizeImage(file);
  if (!ALLOWED_TYPES.includes(blob.type)) {
    throw new Error("Formato de imagem não suportado. Use JPG, PNG ou WebP.");
  }
  if (blob.size > MAX_BYTES) {
    throw new Error("A foto ficou maior que 5 MB. Tente uma imagem menor.");
  }

  const extension = blob.type === "image/jpeg" ? "jpg" : blob.type.split("/")[1];
  const path = `items/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(MENU_IMAGES_BUCKET).upload(path, blob, {
    contentType: blob.type,
    cacheControl: "31536000", // nome é único, então o navegador pode guardar por 1 ano
    upsert: false,
  });
  if (error) throw new Error(`Falha no envio da foto: ${error.message}`);

  const { data } = supabase.storage.from(MENU_IMAGES_BUCKET).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

// Apaga fotos enviadas que acabaram não sendo usadas (ex.: modal cancelado)
export async function removeMenuImages(paths: string[]) {
  if (paths.length === 0) return;
  const { error } = await supabase.storage.from(MENU_IMAGES_BUCKET).remove(paths);
  if (error) console.warn("Não foi possível apagar fotos não usadas:", error.message);
}
