// src/cart/cartStore.ts
// Tipos + contexto do carrinho. O componente CartProvider fica em outro
// arquivo para o Fast Refresh do Vite continuar funcionando.
import { createContext, useContext } from "react";
import type { MenuItemData } from "../hooks/useMenu";

export interface CartLine {
  lineId: string;
  item: MenuItemData; // "foto" do item ao adicionar; o preço final vem do banco
  quantity: number;
  notes: string;
}

// Último pedido enviado deste aparelho, para o hóspede voltar à tela de
// pagamento/acompanhamento mesmo se fechar o carrinho
export interface ActiveOrder {
  order_id: string;
  order_number: number;
  total_amount: number;
  payment_method: "pix" | "credit_card" | "room_charge" | "cash_on_delivery";
  payment_status: string;
  created_at: number; // Date.now()
}

export interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  addItem: (item: MenuItemData, quantity?: number, notes?: string) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  setNotes: (lineId: string, notes: string) => void;
  quantityOf: (itemId: number) => number;
  clear: () => void;
  activeOrder: ActiveOrder | null;
  setActiveOrder: (order: ActiveOrder | null) => void;
}

// Mesmos limites do create_safe_order no banco
export const MAX_QUANTITY = 20;
export const MAX_LINES = 30;

export const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart precisa estar dentro de <CartProvider>");
  return ctx;
}
