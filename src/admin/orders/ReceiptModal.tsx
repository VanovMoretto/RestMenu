// src/admin/orders/ReceiptModal.tsx
// Cupom no formato da Epson TM-T20X-II (papel 80mm, área útil ~72mm, fonte
// monoespaçada). Fica num portal fora do #root: na impressão, o resto do
// painel some e só o cupom vai para o papel.
import { createPortal } from "react-dom";
import { Printer, X } from "lucide-react";
import { formatPrice } from "../../lib/menuFormat";
import { METHOD_LABELS, formatDateTime, formatPhone, isPrepaid, maskCpf, type AdminOrder } from "./orderTypes";
import styles from "./Receipt.module.css";

interface ReceiptModalProps {
  order: AdminOrder;
  onClose: () => void;
  onPrinted: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, onClose, onPrinted }) => {
  const handlePrint = () => {
    window.print(); // bloqueia até o diálogo de impressão fechar
    onPrinted();
  };

  return createPortal(
    <div className={styles.overlay} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.dialog} role="dialog" aria-modal="true" aria-label={`Cupom do pedido ${order.order_number}`}>
        <div className={styles.toolbar}>
          <span>Pré-visualização · papel 80mm</span>
          <button type="button" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <div className={styles.paperScroll}>
          <Receipt order={order} />
        </div>

        <div className={styles.toolbarBottom}>
          <button type="button" className={styles.printButton} onClick={handlePrint}>
            <Printer size={18} /> Imprimir (window.print)
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const Receipt: React.FC<{ order: AdminOrder }> = ({ order }) => {
  const prepaid = isPrepaid(order);
  const roomCharge = order.payment_method === "room_charge";
  const cash = order.payment_method === "cash_on_delivery";

  return (
    <div className={styles.paper}>
      <div className={styles.center}>
        <div className={styles.brand}>IRIUS GASTRONOMIA</div>
        <div>ROOM SERVICE</div>
      </div>
      <hr className={styles.dashed} />

      <div className={styles.spread}>
        <span className={styles.bold}>PEDIDO #{order.order_number}</span>
        <span>{formatDateTime(order.created_at)}</span>
      </div>

      <div className={styles.roomBox}>
        <div className={styles.roomLabel}>QUARTO</div>
        <div className={styles.roomNumber}>{order.room_number}</div>
      </div>

      <div>HÓSPEDE: {order.guest_name.toUpperCase()}</div>
      {formatPhone(order.guest_phone) && <div>TEL: {formatPhone(order.guest_phone)}</div>}
      {maskCpf(order.guest_cpf) && <div>CPF: {maskCpf(order.guest_cpf)}</div>}
      <hr className={styles.dashed} />

      {order.order_items.map((item) => (
        <div key={item.id} className={styles.item}>
          <div className={styles.spread}>
            <span className={styles.itemName}>
              <span className={styles.bold}>{item.quantity}x</span> {item.item_name}
            </span>
            <span>{formatPrice(item.line_total)}</span>
          </div>
          {item.notes && <div className={styles.itemNote}>&gt;&gt; {item.notes.toUpperCase()}</div>}
        </div>
      ))}
      <hr className={styles.dashed} />

      <div className={`${styles.spread} ${styles.total}`}>
        <span>TOTAL</span>
        <span>{formatPrice(order.total_amount)}</span>
      </div>
      <div>PAGAMENTO: {METHOD_LABELS[order.payment_method].toUpperCase()}</div>

      {prepaid && <div className={styles.invertedBox}>*** PAGO ONLINE ***</div>}

      {roomCharge && (
        <div className={styles.alertBox}>
          <div className={styles.invertedBox}>FATURAR NO QUARTO</div>
          <div className={styles.bold}>!! COLHER ASSINATURA DO HÓSPEDE !!</div>
          <div className={styles.signature}>
            <div className={styles.signatureLine} />
            <div>Assinatura do hóspede — Quarto {order.room_number}</div>
          </div>
        </div>
      )}

      {cash && (
        <div className={styles.alertBox}>
          <div className={styles.invertedBox}>COBRAR NA ENTREGA</div>
          <div className={styles.bold}>RECEBER {formatPrice(order.total_amount)} EM DINHEIRO</div>
          <div>Levar troco.</div>
        </div>
      )}

      {order.notes && (
        <>
          <hr className={styles.dashed} />
          <div className={styles.bold}>OBS. DO PEDIDO:</div>
          <div>{order.notes.toUpperCase()}</div>
        </>
      )}

      <hr className={styles.dashed} />
      <div className={styles.center}>ID {order.id.slice(0, 8)}</div>
    </div>
  );
};

export default ReceiptModal;
