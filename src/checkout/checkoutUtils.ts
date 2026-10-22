// src/checkout/checkoutUtils.ts
import type { TFunction } from "i18next";

export type PaymentMethod = "pix" | "credit_card" | "room_charge" | "cash_on_delivery";
export const PAYMENT_METHODS: PaymentMethod[] = ["pix", "credit_card", "room_charge", "cash_on_delivery"];
export const ONLINE_METHODS: PaymentMethod[] = ["pix", "credit_card"];

// Sem gateway real ainda: PIX/cartão só funcionam com o simulador, que só existe
// no "npm run dev" (import.meta.env.DEV). Um build publicado nunca mostra o botão.
export const PAYMENT_SIMULATOR = import.meta.env.DEV && import.meta.env.VITE_PAYMENT_SIMULATOR === "true";

// ---------------------------------------------------------------------------
// CPF e telefone
// ---------------------------------------------------------------------------

export const onlyDigits = (value: string) => value.replace(/\D/g, "");

// Confere os dois dígitos verificadores (pega erro de digitação)
export function isValidCpf(value: string) {
  const d = onlyDigits(value);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const digit = (length: number) => {
    let sum = 0;
    for (let i = 0; i < length; i++) sum += Number(d[i]) * (length + 1 - i);
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };
  return digit(9) === Number(d[9]) && digit(10) === Number(d[10]);
}

// "12345678909" -> "123.456.789-09" (vai formatando enquanto digita)
export function formatCpf(value: string) {
  const d = onlyDigits(value).slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");
}

// Aceita número brasileiro com DDD ou internacional (+1, +54…)
export const isValidPhone = (value: string) => {
  const digits = onlyDigits(value).length;
  return digits >= 10 && digits <= 15;
};

// ---------------------------------------------------------------------------
// Dados do hóspede lembrados no aparelho (sem CPF, por privacidade)
// ---------------------------------------------------------------------------

const GUEST_KEY = "irius:guest";
export interface GuestInfo {
  room: string;
  name: string;
  phone: string;
}

export function loadGuest(): GuestInfo {
  try {
    const saved = JSON.parse(localStorage.getItem(GUEST_KEY) ?? "{}");
    return { room: saved.room ?? "", name: saved.name ?? "", phone: saved.phone ?? "" };
  } catch {
    return { room: "", name: "", phone: "" };
  }
}

export function saveGuest(info: GuestInfo) {
  try {
    localStorage.setItem(GUEST_KEY, JSON.stringify(info));
  } catch {
    // sem armazenamento: o hóspede só digita de novo na próxima vez
  }
}

// ---------------------------------------------------------------------------
// Erros do banco (vêm em PT) -> mensagem no idioma do hóspede
// ---------------------------------------------------------------------------

export function orderErrorMessage(message: string | undefined, t: TFunction) {
  if (!message) return t("checkout.errors.generic");
  if (/não estão disponíveis|cardápio mudou/i.test(message)) return t("checkout.errors.unavailable");
  if (/cobrança no quarto/i.test(message)) return t("checkout.errors.room_charge");
  if (/Failed to fetch|NetworkError|network/i.test(message)) return t("checkout.errors.network");
  return t("checkout.errors.generic");
}
