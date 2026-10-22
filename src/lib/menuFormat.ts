// src/lib/menuFormat.ts
import type { Translations } from "../hooks/useMenu";

interface Translatable {
  name: string;
  description?: string | null;
  translations: Translations;
}

// O banco guarda o PT em name/description e as outras línguas em `translations`.
// Se faltar a tradução, cai no PT (mesmo comportamento do fallbackLng do i18n).
export function localize(entity: Translatable, language: string | undefined) {
  const lang = (language ?? "pt").slice(0, 2);
  const t = lang === "en" || lang === "es" ? entity.translations?.[lang] : undefined;
  return {
    name: t?.name || entity.name,
    description: t?.description || entity.description || undefined,
  };
}

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatPrice(price: number | string) {
  return brl.format(Number(price));
}

// Caminhos antigos ("lanches/x.webp") são relativos à pasta public/ do site;
// fotos enviadas pelo painel já vêm com a URL completa do Storage.
export function resolveImageUrl(url: string | null | undefined) {
  if (!url) return undefined;
  if (/^https?:\/\//.test(url)) return url;
  return import.meta.env.BASE_URL + url.replace(/^\//, "");
}
