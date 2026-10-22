// src/admin/orders/PaymentSettingsPanel.tsx
// Liga/desliga cada forma de pagamento (tabela payment_settings).
// Desligada: o hóspede vê a opção apagada e o banco recusa o pedido.
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { PAYMENT_METHODS, type PaymentMethod } from "../../checkout/checkoutUtils";
import { ALL_OFF, fetchPaymentSettings, type PaymentSettings } from "../../checkout/usePaymentSettings";
import ToggleSwitch from "../ToggleSwitch";
import { METHOD_LABELS } from "./orderTypes";
import styles from "./OrdersBoard.module.css";

const PaymentSettingsPanel: React.FC<{ onError: (message: string) => void }> = ({ onError }) => {
  const [settings, setSettings] = useState<PaymentSettings>(ALL_OFF);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<PaymentMethod | null>(null);

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

  const toggle = async (method: PaymentMethod) => {
    const next = !settings[method];
    setBusy(method);
    setSettings((prev) => ({ ...prev, [method]: next })); // muda na hora…
    const { data, error } = await supabase
      .from("payment_settings")
      .update({ enabled: next })
      .eq("method", method)
      .select("method");
    if (error || !data?.length) {
      setSettings((prev) => ({ ...prev, [method]: !next })); // …e desfaz se o banco recusar
      onError(`Não foi possível alterar "${METHOD_LABELS[method]}".`);
    }
    setBusy(null);
  };

  const anyOn = PAYMENT_METHODS.some((m) => settings[m]);

  return (
    <div className={styles.paymentPanel}>
      <div className={styles.paymentPanelHeader}>
        <strong>Formas de pagamento no app</strong>
        <span className={anyOn ? styles.statusOpen : styles.statusPaused}>
          {loading ? "Carregando…" : anyOn ? "Pedidos abertos" : "Pedidos pausados"}
        </span>
      </div>
      <div className={styles.paymentToggles}>
        {PAYMENT_METHODS.map((method) => (
          <label key={method} className={styles.paymentToggle}>
            <ToggleSwitch
              checked={settings[method]}
              onChange={() => toggle(method)}
              disabled={loading || busy === method}
              label={`Aceitar ${METHOD_LABELS[method]}`}
            />
            <span className={settings[method] ? "" : styles.paymentOff}>{METHOD_LABELS[method]}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PaymentSettingsPanel;
