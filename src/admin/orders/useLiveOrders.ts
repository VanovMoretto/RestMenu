// src/admin/orders/useLiveOrders.ts
// Pedidos das últimas 24h em tempo real (Supabase Realtime) + consulta de
// reserva a cada 30s, caso a conexão do Realtime caia (Wi-Fi da cozinha…).
import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";
import { ORDER_SELECT, type AdminOrder, type PaymentStatus } from "./orderTypes";

const VISIBLE: PaymentStatus[] = ["awaiting_approval", "approved", "paid"];
const WINDOW_MS = 24 * 60 * 60 * 1000;
const POLL_MS = 30_000;

export type AlertKind = "reception" | "kitchen";
export type LiveState = "connecting" | "live" | "offline";

const byNewest = (a: AdminOrder, b: AdminOrder) => b.created_at.localeCompare(a.created_at);

export function useLiveOrders(onAlert: (kind: AlertKind) => void) {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [live, setLive] = useState<LiveState>("connecting");
  // último status conhecido de cada pedido (inclusive os "pending" que não aparecem)
  const known = useRef(new Map<string, PaymentStatus>());
  const onAlertRef = useRef(onAlert);

  useEffect(() => {
    onAlertRef.current = onAlert;
  }, [onAlert]);

  // Decide se toca o alerta: pedido novo para a recepção conferir,
  // ou pedido que acabou de ser pago (vai direto para a cozinha)
  const detectAlerts = useCallback((rows: AdminOrder[]) => {
    let alert: AlertKind | null = null;
    for (const row of rows) {
      const previous = known.current.get(row.id);
      if (previous !== row.payment_status) {
        if (row.payment_status === "awaiting_approval" && previous === undefined) alert = "reception";
        else if (row.payment_status === "paid" && (previous === undefined || previous === "pending")) {
          alert ??= "kitchen";
        }
      }
      known.current.set(row.id, row.payment_status);
    }
    if (alert) onAlertRef.current(alert);
  }, []);

  const loadAll = useCallback(
    async (withAlerts: boolean) => {
      const since = new Date(Date.now() - WINDOW_MS).toISOString();
      const { data, error: fetchError } = await supabase
        .from("orders")
        .select(ORDER_SELECT)
        .in("payment_status", VISIBLE)
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .returns<AdminOrder[]>();
      if (fetchError) {
        setError(fetchError.message);
        return;
      }
      const rows = data ?? [];
      if (withAlerts) detectAlerts(rows);
      else rows.forEach((r) => known.current.set(r.id, r.payment_status));
      setError(null);
      setOrders(rows);
      setLoading(false);
    },
    [detectAlerts]
  );

  const refreshOne = useCallback(
    async (id: string) => {
      const { data } = await supabase
        .from("orders")
        .select(ORDER_SELECT)
        .eq("id", id)
        .maybeSingle()
        .returns<AdminOrder | null>();
      if (!data) return;
      detectAlerts([data]);
      setOrders((prev) => {
        const rest = prev.filter((o) => o.id !== id);
        return VISIBLE.includes(data.payment_status) ? [...rest, data].sort(byNewest) : rest;
      });
    },
    [detectAlerts]
  );

  // Carga inicial + reserva periódica
  useEffect(() => {
    let first = true;
    const run = () => {
      loadAll(!first);
      first = false;
    };
    run();
    const timer = setInterval(run, POLL_MS);
    return () => clearInterval(timer);
  }, [loadAll]);

  // Realtime: qualquer INSERT/UPDATE em orders -> busca aquele pedido completo
  // (o evento não traz os itens). O RLS garante que só admin recebe.
  useEffect(() => {
    const channel = supabase
      .channel("admin-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, (payload) => {
        const id = (payload.new as { id?: string })?.id ?? (payload.old as { id?: string })?.id;
        if (id) refreshOne(id);
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") setLive("live");
        else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") setLive("offline");
      });
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshOne]);

  // Ações do painel. O filtro pelo status atual evita que dois aparelhos
  // aprovem/recusem o mesmo pedido ao mesmo tempo.
  const changeStatus = useCallback(
    async (order: AdminOrder, to: PaymentStatus) => {
      const { data, error: updateError } = await supabase
        .from("orders")
        .update({ payment_status: to })
        .eq("id", order.id)
        .eq("payment_status", order.payment_status)
        .select("id");
      await refreshOne(order.id);
      if (updateError) throw new Error(updateError.message);
      if (!data?.length) throw new Error("Este pedido já foi atualizado em outro aparelho.");
    },
    [refreshOne]
  );

  const markPrinted = useCallback(
    async (order: AdminOrder) => {
      const { error: updateError } = await supabase.from("orders").update({ print_status: "printed" }).eq("id", order.id);
      await refreshOne(order.id);
      if (updateError) throw new Error(updateError.message);
    },
    [refreshOne]
  );

  return { orders, loading, error, live, changeStatus, markPrinted };
}

export type LiveOrders = ReturnType<typeof useLiveOrders>;
