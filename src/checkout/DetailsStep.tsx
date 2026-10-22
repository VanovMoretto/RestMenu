// src/checkout/DetailsStep.tsx
// Dados do hóspede + forma de pagamento -> RPC create_safe_order.
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabase";
import { useCart, type ActiveOrder } from "../cart/cartStore";
import { formatPrice, localize } from "../lib/menuFormat";
import {
  ONLINE_METHODS,
  PAYMENT_METHODS,
  PAYMENT_SIMULATOR,
  formatCpf,
  isValidCpf,
  isValidPhone,
  loadGuest,
  onlyDigits,
  orderErrorMessage,
  saveGuest,
  type PaymentMethod,
} from "./checkoutUtils";
import { usePaymentSettings } from "./usePaymentSettings";
import styles from "./CheckoutSheet.module.css";

type Field = "room" | "name" | "cpf" | "phone" | "method";

const DetailsStep: React.FC<{ onCreated: (order: ActiveOrder) => void }> = ({ onCreated }) => {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const { lines, subtotal } = useCart();
  const { settings, loading: settingsLoading } = usePaymentSettings();
  const [guest] = useState(loadGuest);
  const [room, setRoom] = useState(guest.room);
  const [name, setName] = useState(guest.name);
  const [phone, setPhone] = useState(guest.phone);
  const [cpf, setCpf] = useState("");
  const [noCpf, setNoCpf] = useState(false);
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  // "Faturar no quarto" só vale se TODOS os itens aceitarem (mesma regra do banco)
  const blockedForRoom = lines.filter((l) => !l.item.allow_room_charge).map((l) => localize(l.item, language).name);

  const isMethodDisabled = (m: PaymentMethod) =>
    !settings[m] || // desligada pelo restaurante (payment_settings)
    (m === "room_charge" && blockedForRoom.length > 0) ||
    (ONLINE_METHODS.includes(m) && !PAYMENT_SIMULATOR);

  // Nenhuma forma disponível: pedidos pelo app estão pausados
  const orderingOff = !settingsLoading && PAYMENT_METHODS.every(isMethodDisabled);

  const methodHint = (m: PaymentMethod) => {
    if (!settings[m]) return t("checkout.method_off");
    if (m === "room_charge" && blockedForRoom.length > 0) {
      return t("checkout.room_charge_blocked", { items: blockedForRoom.join(", ") });
    }
    if (ONLINE_METHODS.includes(m) && !PAYMENT_SIMULATOR) return t("checkout.online_soon");
    return t(`checkout.method_hints.${m}`);
  };

  const validate = () => {
    const e: Partial<Record<Field, string>> = {};
    if (!/^[0-9A-Za-z-]{1,10}$/.test(room.trim())) e.room = t("checkout.errors.room");
    if (name.trim().split(/\s+/).length < 2) e.name = t("checkout.errors.name");
    if (!noCpf && !isValidCpf(cpf)) e.cpf = t("checkout.errors.cpf");
    if (!isValidPhone(phone)) e.phone = t("checkout.errors.phone");
    if (!method || isMethodDisabled(method)) e.method = t("checkout.errors.method");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError(null);
    if (!validate() || !method) return;

    setSending(true);
    const { data, error } = await supabase.rpc("create_safe_order", {
      p_room_number: room.trim(),
      p_guest_name: name.trim().replace(/\s+/g, " "),
      p_payment_method: method,
      // Só ids, quantidades e observações: preço e total são calculados no banco
      p_items: lines.map((l) => ({ menu_item_id: l.item.id, quantity: l.quantity, notes: l.notes || null })),
      p_guest_cpf: noCpf ? null : onlyDigits(cpf),
      p_guest_phone: phone,
      p_notes: notes.trim() || null,
    });
    setSending(false);

    if (error || !data) {
      setSubmitError(orderErrorMessage(error?.message, t));
      return;
    }
    saveGuest({ room: room.trim(), name: name.trim(), phone });
    onCreated({
      order_id: data.order_id,
      order_number: data.order_number,
      total_amount: Number(data.total_amount),
      payment_status: data.payment_status,
      payment_method: method,
      created_at: Date.now(),
    });
  };

  const fieldError = (field: Field) =>
    errors[field] ? <small className={styles.fieldError}>{errors[field]}</small> : null;

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.body}>
        {orderingOff && (
          <p className={styles.orderingOff} role="status">
            {t("checkout.ordering_off")}
          </p>
        )}
        <div className={styles.row}>
          <label className={`${styles.field} ${styles.roomField}`}>
            <span>{t("checkout.room")}</span>
            <input
              value={room}
              inputMode="numeric"
              autoComplete="off"
              maxLength={10}
              onChange={(e) => setRoom(e.target.value)}
              aria-invalid={!!errors.room}
            />
            {fieldError("room")}
          </label>
          <label className={styles.field}>
            <span>{t("checkout.name")}</span>
            <input value={name} autoComplete="name" maxLength={120} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} />
            {fieldError("name")}
          </label>
        </div>

        <label className={styles.field}>
          <span>{t("checkout.phone")}</span>
          <input
            type="tel"
            autoComplete="tel"
            placeholder="(51) 99999-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^\d+()\s-]/g, ""))}
            aria-invalid={!!errors.phone}
          />
          {fieldError("phone")}
        </label>

        <label className={styles.field}>
          <span>{t("checkout.cpf")}</span>
          <input
            inputMode="numeric"
            placeholder="000.000.000-00"
            value={noCpf ? "" : cpf}
            disabled={noCpf}
            onChange={(e) => setCpf(formatCpf(e.target.value))}
            aria-invalid={!!errors.cpf}
          />
          {fieldError("cpf")}
        </label>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={noCpf}
            onChange={(e) => {
              setNoCpf(e.target.checked);
              setErrors((prev) => ({ ...prev, cpf: undefined }));
            }}
          />
          {t("checkout.no_cpf")}
        </label>

        <fieldset className={styles.methods}>
          <legend>{t("checkout.payment")}</legend>
          {PAYMENT_METHODS.map((m) => (
            <label
              key={m}
              className={`${styles.method} ${method === m ? styles.methodSelected : ""} ${
                isMethodDisabled(m) ? styles.methodDisabled : ""
              }`}
            >
              <input
                type="radio"
                name="payment"
                value={m}
                checked={method === m}
                disabled={isMethodDisabled(m)}
                onChange={() => setMethod(m)}
              />
              <span className={styles.methodText}>
                <strong>{t(`checkout.methods.${m}`)}</strong>
                <small>{methodHint(m)}</small>
              </span>
            </label>
          ))}
          {fieldError("method")}
        </fieldset>

        <label className={styles.field}>
          <span>{t("checkout.order_notes")}</span>
          <textarea
            rows={2}
            maxLength={500}
            value={notes}
            placeholder={t("checkout.order_notes_placeholder")}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>

        {submitError && (
          <p className={styles.submitError} role="alert">
            {submitError}
          </p>
        )}
      </div>

      <footer className={styles.footer}>
        <button type="submit" className={styles.primaryButton} disabled={sending || orderingOff || settingsLoading}>
          {sending ? t("checkout.sending") : t("checkout.submit", { total: formatPrice(subtotal) })}
        </button>
      </footer>
    </form>
  );
};

export default DetailsStep;
