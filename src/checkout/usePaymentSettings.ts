// src/checkout/usePaymentSettings.ts
// Lê quais formas de pagamento estão ligadas (tabela payment_settings).
// Na dúvida (carregando ou erro), tudo fica DESLIGADO — o banco também recusa.
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { PaymentMethod } from "./checkoutUtils";

export type PaymentSettings = Record<PaymentMethod, boolean>;

export const ALL_OFF: PaymentSettings = {
  pix: false,
  credit_card: false,
  room_charge: false,
  cash_on_delivery: false,
};

export async function fetchPaymentSettings(): Promise<PaymentSettings> {
  const { data, error } = await supabase
    .from("payment_settings")
    .select("method, enabled")
    .returns<{ method: PaymentMethod; enabled: boolean }[]>();
  if (error || !data) return ALL_OFF;
  return data.reduce((acc, row) => ({ ...acc, [row.method]: row.enabled }), { ...ALL_OFF });
}

export function usePaymentSettings() {
  const [settings, setSettings] = useState<PaymentSettings>(ALL_OFF);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    fetchPaymentSettings().then((result) => {
      if (ignore) return;
      setSettings(result);
      setLoading(false);
    });
    return () => {
      ignore = true;
    };
  }, []);

  return { settings, loading };
}
