// src/admin/orders/orderTypes.ts

export type PaymentMethod = "pix" | "credit_card" | "room_charge" | "cash_on_delivery";
export type PaymentStatus = "pending" | "awaiting_approval" | "approved" | "paid" | "cancelled";

export interface AdminOrderItem {
  id: number;
  item_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  notes: string | null;
}

export interface AdminOrder {
  id: string;
  order_number: number;
  room_number: string;
  guest_name: string;
  guest_cpf: string | null;
  guest_phone: string | null;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  print_status: "pending" | "printed" | "error";
  total_amount: number;
  notes: string | null;
  created_at: string;
  order_items: AdminOrderItem[];
}

export const ORDER_SELECT =
  "id, order_number, room_number, guest_name, guest_cpf, guest_phone, payment_method, " +
  "payment_status, print_status, total_amount, notes, created_at, " +
  "order_items(id, item_name, quantity, unit_price, line_total, notes)";

export const METHOD_LABELS: Record<PaymentMethod, string> = {
  pix: "PIX",
  credit_card: "Cartão de crédito",
  room_charge: "Faturar no quarto",
  cash_on_delivery: "Dinheiro na entrega",
};

// Pago de verdade (gateway) x liberado pela recepção mas ainda a receber
export const isPrepaid = (order: AdminOrder) => order.payment_status === "paid" && (order.payment_method === "pix" || order.payment_method === "credit_card");

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// No papel o CPF sai mascarado (LGPD): ***.456.789-**
export function maskCpf(cpf: string | null) {
  if (!cpf || cpf.length !== 11) return null;
  return `***.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-**`;
}

export function formatPhone(phone: string | null) {
  if (!phone) return null;
  const local = phone.length === 13 && phone.startsWith("55") ? phone.slice(2) : phone;
  if (local.length === 11) return `(${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7)}`;
  if (local.length === 10) return `(${local.slice(0, 2)}) ${local.slice(2, 6)}-${local.slice(6)}`;
  return `+${phone}`;
}
