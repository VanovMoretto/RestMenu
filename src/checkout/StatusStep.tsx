// src/checkout/StatusStep.tsx
// Acompanhamento do pedido. O hóspede não tem acesso à tabela orders (RLS),
// então consulta get_order_status com o UUID do pedido a cada poucos segundos.
import { useEffect, useState } from "react";
import { CheckCircle2, ChefHat, Clock, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabase";
import type { ActiveOrder } from "../cart/cartStore";
import { formatPrice } from "../lib/menuFormat";
import styles from "./CheckoutSheet.module.css";

const POLL_MS = 8000;

interface OrderStatus {
  payment_status: string;
  print_status: string;
}

const StatusStep: React.FC<{ order: ActiveOrder; onNewOrder: () => void }> = ({ order, onNewOrder }) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<OrderStatus>({ payment_status: order.payment_status, print_status: "pending" });

  useEffect(() => {
    let ignore = false;
    const check = async () => {
      const { data } = await supabase.rpc("get_order_status", { p_order_id: order.order_id });
      const row = Array.isArray(data) ? data[0] : null;
      if (!ignore && row) setStatus({ payment_status: row.payment_status, print_status: row.print_status });
    };
    check();
    const timer = setInterval(check, POLL_MS);
    return () => {
      ignore = true;
      clearInterval(timer);
    };
  }, [order.order_id]);

  const inKitchen = status.payment_status === "paid" || status.payment_status === "approved";
  const cancelled = status.payment_status === "cancelled";
  const waitingReception = status.payment_status === "awaiting_approval";

  const headline = cancelled
    ? t("status.cancelled")
    : inKitchen
      ? status.print_status === "printed"
        ? t("status.preparing")
        : t("status.in_kitchen")
      : waitingReception
        ? t("status.awaiting_approval")
        : t("status.pending");

  const Icon = cancelled ? XCircle : inKitchen ? (status.print_status === "printed" ? ChefHat : CheckCircle2) : Clock;

  return (
    <>
      <div className={`${styles.body} ${styles.statusBody}`}>
        <Icon size={56} strokeWidth={1.3} className={cancelled ? styles.statusIconError : styles.statusIcon} />
        <p className={styles.statusHeadline}>{headline}</p>
        {waitingReception && <p className={styles.paymentHint}>{t("status.reception_hint")}</p>}
        {order.payment_method === "cash_on_delivery" && !cancelled && (
          <p className={styles.paymentHint}>{t("status.cash_hint", { total: formatPrice(order.total_amount) })}</p>
        )}

        <ol className={styles.timeline}>
          <li className={styles.timelineDone}>{t("status.step_received")}</li>
          <li className={inKitchen ? styles.timelineDone : ""}>{t("status.step_kitchen")}</li>
          <li className={status.print_status === "printed" && inKitchen ? styles.timelineDone : ""}>
            {t("status.step_preparing")}
          </li>
        </ol>

        <p className={styles.autoUpdate}>{t("status.auto_update")}</p>
      </div>
      <footer className={styles.footer}>
        <div className={styles.totalRow}>
          <span>{t("payment.total")}</span>
          <strong>{formatPrice(order.total_amount)}</strong>
        </div>
        <button type="button" className={styles.secondaryButton} onClick={onNewOrder}>
          {t("status.new_order")}
        </button>
      </footer>
    </>
  );
};

export default StatusStep;
