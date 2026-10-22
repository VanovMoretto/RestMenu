// src/checkout/CheckoutSheet.tsx
// Fluxo do hóspede: carrinho -> dados/pagamento -> (PIX/cartão) -> acompanhamento.
import { useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCart, type ActiveOrder } from "../cart/cartStore";
import CartStep from "./CartStep";
import DetailsStep from "./DetailsStep";
import PaymentStep from "./PaymentStep";
import StatusStep from "./StatusStep";
import { ONLINE_METHODS } from "./checkoutUtils";
import styles from "./CheckoutSheet.module.css";

type Step = "cart" | "details" | "payment" | "status";

// Ao abrir: com itens no carrinho começa nele; senão volta ao último pedido
function initialStep(count: number, order: ActiveOrder | null): Step {
  if (count > 0 || !order) return "cart";
  const waitingPayment = order.payment_status === "pending" && ONLINE_METHODS.includes(order.payment_method);
  return waitingPayment ? "payment" : "status";
}

const CheckoutSheet: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useTranslation();
  const { count, activeOrder, setActiveOrder, clear } = useCart();
  const [step, setStep] = useState<Step>(() => initialStep(count, activeOrder));

  const titles: Record<Step, string> = {
    cart: t("cart.title"),
    details: t("checkout.title"),
    payment: t("payment.title"),
    status: t("status.title", { number: activeOrder?.order_number }),
  };

  const handleCreated = (order: ActiveOrder) => {
    setActiveOrder(order);
    clear();
    setStep(order.payment_status === "pending" ? "payment" : "status");
  };

  const finish = () => {
    setActiveOrder(null);
    onClose();
  };

  return (
    <div className={styles.overlay} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.sheet} role="dialog" aria-modal="true" aria-labelledby="checkout-title">
        <header className={styles.header}>
          {step === "details" ? (
            <button type="button" className={styles.iconButton} onClick={() => setStep("cart")} aria-label={t("cart.back")}>
              <ArrowLeft size={20} />
            </button>
          ) : (
            <span className={styles.iconSpacer} />
          )}
          <h2 id="checkout-title">{titles[step]}</h2>
          <button type="button" className={styles.iconButton} onClick={onClose} aria-label={t("cart.close")}>
            <X size={20} />
          </button>
        </header>

        {step === "cart" && <CartStep onContinue={() => setStep("details")} onBrowse={onClose} />}
        {step === "details" && <DetailsStep onCreated={handleCreated} />}
        {step === "payment" && activeOrder && (
          <PaymentStep
            order={activeOrder}
            onPaid={() => {
              setActiveOrder({ ...activeOrder, payment_status: "paid" });
              setStep("status");
            }}
          />
        )}
        {step === "status" && activeOrder && <StatusStep order={activeOrder} onNewOrder={finish} />}
      </div>
    </div>
  );
};

export default CheckoutSheet;
