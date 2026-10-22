// src/cart/CartProvider.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import type { MenuItemData } from "../hooks/useMenu";
import { CartContext, MAX_LINES, MAX_QUANTITY, type ActiveOrder, type CartLine } from "./cartStore";

const STORAGE_KEY = "irius:cart";
const ORDER_KEY = "irius:active-order";
const ORDER_TTL = 8 * 60 * 60 * 1000; // depois de 8h o acompanhamento some sozinho

function loadActiveOrder(): ActiveOrder | null {
  try {
    const saved = JSON.parse(localStorage.getItem(ORDER_KEY) ?? "null");
    return saved?.order_id && Date.now() - saved.created_at < ORDER_TTL ? saved : null;
  } catch {
    return null;
  }
}

function loadLines(): CartLine[] {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(saved) ? saved.filter((l) => l?.item?.id && l.quantity > 0) : [];
  } catch {
    return [];
  }
}

const clampQuantity = (q: number) => Math.max(0, Math.min(MAX_QUANTITY, Math.round(q)));

const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lines, setLines] = useState<CartLine[]>(loadLines);
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(loadActiveOrder);

  // Guarda no navegador: recarregar a página não perde o pedido
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // modo anônimo / armazenamento cheio: segue só em memória
    }
  }, [lines]);

  useEffect(() => {
    try {
      if (activeOrder) localStorage.setItem(ORDER_KEY, JSON.stringify(activeOrder));
      else localStorage.removeItem(ORDER_KEY);
    } catch {
      // idem
    }
  }, [activeOrder]);

  // Mesmo prato + mesma observação = mesma linha (soma a quantidade)
  const addItem = useCallback((item: MenuItemData, quantity = 1, notes = "") => {
    const cleanNotes = notes.trim();
    setLines((prev) => {
      const existing = prev.find((l) => l.item.id === item.id && l.notes === cleanNotes);
      if (existing) {
        return prev.map((l) =>
          l === existing ? { ...l, item, quantity: clampQuantity(l.quantity + quantity) } : l
        );
      }
      if (prev.length >= MAX_LINES) return prev;
      return [...prev, { lineId: crypto.randomUUID(), item, quantity: clampQuantity(quantity), notes: cleanNotes }];
    });
  }, []);

  const setQuantity = useCallback((lineId: string, quantity: number) => {
    const q = clampQuantity(quantity);
    setLines((prev) =>
      q === 0 ? prev.filter((l) => l.lineId !== lineId) : prev.map((l) => (l.lineId === lineId ? { ...l, quantity: q } : l))
    );
  }, []);

  const setNotes = useCallback((lineId: string, notes: string) => {
    setLines((prev) => prev.map((l) => (l.lineId === lineId ? { ...l, notes: notes.slice(0, 200) } : l)));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(
    () => ({
      lines,
      count: lines.reduce((sum, l) => sum + l.quantity, 0),
      subtotal: lines.reduce((sum, l) => sum + l.quantity * Number(l.item.price), 0),
      addItem,
      setQuantity,
      setNotes,
      quantityOf: (itemId: number) =>
        lines.filter((l) => l.item.id === itemId).reduce((sum, l) => sum + l.quantity, 0),
      clear,
      activeOrder,
      setActiveOrder,
    }),
    [lines, addItem, setQuantity, setNotes, clear, activeOrder]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartProvider;
