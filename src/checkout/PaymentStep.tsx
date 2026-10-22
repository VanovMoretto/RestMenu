// src/checkout/PaymentStep.tsx
// Tela de pagamento online. Sem gateway real ainda: mostra um QR Code
// simulado e o botão de teste que aprova o pagamento (só com o simulador ligado).
import { useMemo, useState } from "react";
import { CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabase";
import type { ActiveOrder } from "../cart/cartStore";
import { formatPrice } from "../lib/menuFormat";
import { PAYMENT_SIMULATOR } from "./checkoutUtils";
import styles from "./CheckoutSheet.module.css";

interface PaymentStepProps {
  order: ActiveOrder;
  onPaid: () => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({ order, onPaid }) => {
  const { t } = useTranslation();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isPix = order.payment_method === "pix";

  const simulateApproval = async () => {
    setConfirming(true);
    setError(null);
    const { error: rpcError } = await supabase.rpc("dev_simulate_payment", { p_order_id: order.order_id });
    setConfirming(false);
    // "não está aguardando pagamento" = já foi pago (ex.: clique duplo); segue em frente
    if (rpcError && !/não está aguardando/.test(rpcError.message)) {
      setError(rpcError.message);
      return;
    }
    onPaid();
  };

  return (
    <>
      <div className={`${styles.body} ${styles.paymentBody}`}>
        <p className={styles.orderTag}>{t("payment.order_label", { number: order.order_number })}</p>
        <p className={styles.paymentTotal}>{formatPrice(order.total_amount)}</p>

        {isPix ? (
          <>
            <FakeQrCode seed={order.order_id} />
            <p className={styles.paymentHint}>{t("payment.qr_hint")}</p>
          </>
        ) : (
          <>
            <div className={styles.cardVisual}>
              <CreditCard size={44} strokeWidth={1.4} />
            </div>
            <p className={styles.paymentHint}>{t("payment.card_hint")}</p>
          </>
        )}

        {PAYMENT_SIMULATOR ? (
          <div className={styles.devBox}>
            <p>{t("payment.simulated")}</p>
            <button type="button" className={styles.devButton} onClick={simulateApproval} disabled={confirming}>
              {confirming ? t("payment.confirming") : "🛠️ DEV: Simular Pagamento Aprovado"}
            </button>
            {error && <p className={styles.submitError}>{error}</p>}
          </div>
        ) : (
          <p className={styles.paymentHint}>{t("checkout.online_soon")}</p>
        )}
      </div>
    </>
  );
};

// QR Code de mentira, mas com cara de QR: os 3 quadrados de canto + módulos
// "aleatórios" sempre iguais para o mesmo pedido (sem biblioteca extra).
const QR_SIZE = 29;

const FakeQrCode: React.FC<{ seed: string }> = ({ seed }) => {
  const modules = useMemo(() => {
    let h = 2166136261;
    for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
    const next = () => {
      h ^= h << 13;
      h ^= h >>> 17;
      h ^= h << 5;
      return (h >>> 0) / 4294967296;
    };
    const finderOrigins = [[0, 0], [QR_SIZE - 7, 0], [0, QR_SIZE - 7]];
    const inFinderArea = (x: number, y: number) =>
      finderOrigins.some(([fx, fy]) => x >= fx - 1 && x <= fx + 7 && y >= fy - 1 && y <= fy + 7);
    const finderDark = (x: number, y: number) =>
      finderOrigins.some(([fx, fy]) => {
        const dx = x - fx;
        const dy = y - fy;
        if (dx < 0 || dy < 0 || dx > 6 || dy > 6) return false;
        const ring = Math.min(dx, dy, 6 - dx, 6 - dy);
        return ring !== 1; // borda escura, anel claro, miolo escuro
      });

    const cells: [number, number][] = [];
    for (let y = 0; y < QR_SIZE; y++) {
      for (let x = 0; x < QR_SIZE; x++) {
        if (inFinderArea(x, y) ? finderDark(x, y) : next() < 0.48) cells.push([x, y]);
      }
    }
    return cells;
  }, [seed]);

  return (
    <svg className={styles.qr} viewBox={`-2 -2 ${QR_SIZE + 4} ${QR_SIZE + 4}`} role="img" aria-label="QR Code PIX (simulado)">
      <rect x={-2} y={-2} width={QR_SIZE + 4} height={QR_SIZE + 4} fill="#fff" />
      {modules.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill="#111" />
      ))}
    </svg>
  );
};

export default PaymentStep;
