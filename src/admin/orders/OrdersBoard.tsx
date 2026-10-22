// src/admin/orders/OrdersBoard.tsx
// Aba "Pedidos ao Vivo & Backup de Impressão".
import { useEffect, useState } from "react";
import { Bell, BellOff, Printer, Check, X } from "lucide-react";
import { formatPrice } from "../../lib/menuFormat";
import { METHOD_LABELS, formatPhone, formatTime, isPrepaid, maskCpf, type AdminOrder } from "./orderTypes";
import type { LiveOrders } from "./useLiveOrders";
import { unlockAudio, playAlert } from "./alertSound";
import ReceiptModal from "./ReceiptModal";
import styles from "./OrdersBoard.module.css";

interface OrdersBoardProps {
  live: LiveOrders;
  soundOn: boolean;
  onSoundChange: (on: boolean) => void;
}

const OrdersBoard: React.FC<OrdersBoardProps> = ({ live, soundOn, onSoundChange }) => {
  const { orders, loading, error, live: connection, changeStatus, markPrinted } = live;
  const [receipt, setReceipt] = useState<AdminOrder | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 5000);
    return () => clearTimeout(timer);
  }, [message]);

  const awaiting = orders.filter((o) => o.payment_status === "awaiting_approval");
  const kitchen = orders.filter((o) => o.payment_status === "paid" || o.payment_status === "approved");

  const toggleSound = () => {
    if (soundOn) {
      onSoundChange(false);
      return;
    }
    unlockAudio();
    onSoundChange(true);
    setTimeout(() => playAlert("kitchen"), 150); // toque de teste
  };

  const run = async (order: AdminOrder, action: () => Promise<void>) => {
    setBusyId(order.id);
    try {
      await action();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Não foi possível atualizar o pedido.");
    } finally {
      setBusyId(null);
    }
  };

  const reject = (order: AdminOrder) => {
    if (!window.confirm(`Recusar o pedido #${order.order_number} do quarto ${order.room_number}?`)) return;
    run(order, () => changeStatus(order, "cancelled"));
  };

  return (
    <section className={styles.board}>
      <div className={styles.topRow}>
        <span className={`${styles.liveDot} ${styles[connection]}`}>
          {connection === "live" ? "Ao vivo" : connection === "connecting" ? "Conectando…" : "Reconectando — atualizando a cada 30s"}
        </span>
        <button type="button" className={`${styles.soundButton} ${soundOn ? styles.soundOn : ""}`} onClick={toggleSound}>
          {soundOn ? <Bell size={16} /> : <BellOff size={16} />}
          {soundOn ? "Som ligado" : "Ativar som de alerta"}
        </button>
      </div>

      {message && (
        <p className={styles.message} role="alert">
          {message}
        </p>
      )}
      {error && <p className={styles.message}>Erro ao carregar pedidos: {error}</p>}

      <div className={styles.columns}>
        <div className={styles.column}>
          <h2 className={styles.columnTitle}>
            Aguardando conferência <small>VHF / Recepção</small>
            <span className={styles.count}>{awaiting.length}</span>
          </h2>
          {loading ? (
            <p className={styles.empty}>Carregando…</p>
          ) : awaiting.length === 0 ? (
            <p className={styles.empty}>Nenhum pedido aguardando conferência.</p>
          ) : (
            awaiting.map((order) => (
              <OrderCard key={order.id} order={order} highlight>
                <button
                  type="button"
                  className={styles.approveButton}
                  disabled={busyId === order.id}
                  onClick={() => run(order, () => changeStatus(order, "approved"))}
                >
                  <Check size={18} /> Confirmar Quarto e Enviar p/ Cozinha
                </button>
                <button type="button" className={styles.rejectButton} disabled={busyId === order.id} onClick={() => reject(order)}>
                  <X size={16} /> Recusar
                </button>
              </OrderCard>
            ))
          )}
        </div>

        <div className={styles.column}>
          <h2 className={styles.columnTitle}>
            Na cozinha <small>Impressora</small>
            <span className={styles.count}>{kitchen.length}</span>
          </h2>
          {loading ? (
            <p className={styles.empty}>Carregando…</p>
          ) : kitchen.length === 0 ? (
            <p className={styles.empty}>Nenhum pedido na cozinha nas últimas 24h.</p>
          ) : (
            kitchen.map((order) => (
              <OrderCard key={order.id} order={order} highlight={order.print_status !== "printed"}>
                <button type="button" className={styles.printButton} onClick={() => setReceipt(order)}>
                  <Printer size={17} /> 🖨️ Visualizar / Reimprimir Cupom 80mm
                </button>
              </OrderCard>
            ))
          )}
        </div>
      </div>

      {receipt && (
        <ReceiptModal
          order={receipt}
          onClose={() => setReceipt(null)}
          onPrinted={() => run(receipt, () => markPrinted(receipt))}
        />
      )}
    </section>
  );
};

const OrderCard: React.FC<{ order: AdminOrder; highlight?: boolean; children: React.ReactNode }> = ({
  order,
  highlight,
  children,
}) => {
  const inKitchen = order.payment_status !== "awaiting_approval";
  const paymentBadge = isPrepaid(order)
    ? { text: `Pago · ${METHOD_LABELS[order.payment_method]}`, className: styles.badgePaid }
    : { text: METHOD_LABELS[order.payment_method], className: styles.badgeCollect };

  return (
    <article className={`${styles.card} ${highlight ? styles.cardHighlight : ""}`}>
      <header className={styles.cardHeader}>
        <span className={styles.orderNumber}>
          #{order.order_number} · {formatTime(order.created_at)}
        </span>
        <span className={`${styles.badge} ${paymentBadge.className}`}>{paymentBadge.text}</span>
      </header>

      <div className={styles.roomLine}>
        <span className={styles.roomLabel}>Quarto</span>
        <span className={styles.roomNumber}>{order.room_number}</span>
        {inKitchen && (
          <span className={`${styles.badge} ${order.print_status === "printed" ? styles.badgePrinted : styles.badgeNotPrinted}`}>
            {order.print_status === "printed" ? "Impresso" : "Não impresso"}
          </span>
        )}
      </div>

      <p className={styles.guest}>
        {order.guest_name}
        {formatPhone(order.guest_phone) && <> · {formatPhone(order.guest_phone)}</>}
        {maskCpf(order.guest_cpf) && <> · CPF {maskCpf(order.guest_cpf)}</>}
      </p>

      <ul className={styles.items}>
        {order.order_items.map((item) => (
          <li key={item.id}>
            <strong>{item.quantity}×</strong> {item.item_name}
            {item.notes && <em> — {item.notes}</em>}
          </li>
        ))}
      </ul>
      {order.notes && <p className={styles.orderNotes}>Obs.: {order.notes}</p>}

      <div className={styles.cardFooter}>
        <span className={styles.total}>{formatPrice(order.total_amount)}</span>
      </div>
      <div className={styles.actions}>{children}</div>
    </article>
  );
};

export default OrdersBoard;
