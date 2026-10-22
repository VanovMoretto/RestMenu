// src/admin/AdminApp.tsx
// Porta de entrada do /admin: sessão do Supabase Auth -> checagem de admin -> painel.
import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { LogOut } from "lucide-react";
import { supabase } from "../lib/supabase";
import logo from "../assets/irius-logo.svg";
import LoginForm from "./LoginForm";
import MenuManager from "./MenuManager";
import OrdersBoard from "./orders/OrdersBoard";
import { useLiveOrders, type AlertKind } from "./orders/useLiveOrders";
import { playAlert, unlockAudio } from "./orders/alertSound";
import styles from "./AdminApp.module.css";

const AdminApp: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.title = "Painel · Irius Gastronomia";
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.appendChild(robots);

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => {
      data.subscription.unsubscribe();
      robots.remove();
    };
  }, []);

  if (!ready) return <FullPageMessage text="Carregando…" />;
  if (!session) return <LoginForm />;
  // key: se trocar de usuário, refaz a checagem de admin do zero
  return <AdminGate key={session.user.id} email={session.user.email ?? ""} />;
};

const AdminGate: React.FC<{ email: string }> = ({ email }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    let ignore = false;
    supabase.rpc("is_admin").then(({ data, error }) => {
      if (!ignore) setIsAdmin(!error && data === true);
    });
    return () => {
      ignore = true;
    };
  }, []);

  if (isAdmin === null) return <FullPageMessage text="Verificando acesso…" />;

  if (!isAdmin) {
    return (
      <FullPageMessage text="Esta conta não tem acesso ao painel do restaurante.">
        <button className={styles.secondaryButton} onClick={() => supabase.auth.signOut()}>
          Entrar com outra conta
        </button>
      </FullPageMessage>
    );
  }

  return <AdminDashboard email={email} />;
};

const SOUND_KEY = "irius:admin-sound";
type Tab = "menu" | "orders";

const AdminDashboard: React.FC<{ email: string }> = ({ email }) => {
  const [tab, setTab] = useState<Tab>("orders");
  const [soundOn, setSoundOn] = useState(() => {
    try {
      return localStorage.getItem(SOUND_KEY) === "1";
    } catch {
      return false;
    }
  });

  const handleAlert = useCallback(
    (kind: AlertKind) => {
      if (soundOn) playAlert(kind);
    },
    [soundOn]
  );
  // Fica ativo nas duas abas: o alerta toca mesmo editando o cardápio
  const live = useLiveOrders(handleAlert);
  const awaitingCount = live.orders.filter((o) => o.payment_status === "awaiting_approval").length;

  const changeSound = (on: boolean) => {
    setSoundOn(on);
    try {
      localStorage.setItem(SOUND_KEY, on ? "1" : "0");
    } catch {
      // sem armazenamento: vale só nesta sessão
    }
  };

  // O navegador só libera áudio após um clique: com o som ligado, o primeiro
  // clique em qualquer lugar do painel já destrava.
  useEffect(() => {
    if (!soundOn) return;
    const unlock = () => unlockAudio();
    window.addEventListener("pointerdown", unlock, { once: true });
    return () => window.removeEventListener("pointerdown", unlock);
  }, [soundOn]);

  // Contador na aba do navegador: "(2) Pedidos" chama atenção de longe
  useEffect(() => {
    document.title = awaitingCount > 0 ? `(${awaitingCount}) Pedidos · Irius` : "Painel · Irius Gastronomia";
  }, [awaitingCount]);

  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <div className={styles.brand}>
          <img src={logo} alt="Irius" className={styles.logo} />
          <span className={styles.brandLabel}>Painel</span>
        </div>
        <div className={styles.userArea}>
          <span className={styles.userEmail}>{email}</span>
          <button className={styles.logoutButton} onClick={() => supabase.auth.signOut()}>
            <LogOut size={16} />
            <span>Sair</span>
          </button>
        </div>
      </header>

      <nav className={styles.tabs} aria-label="Seções do painel">
        <button
          className={`${styles.tab} ${tab === "orders" ? styles.tabActive : ""}`}
          aria-current={tab === "orders" ? "page" : undefined}
          onClick={() => setTab("orders")}
        >
          Pedidos ao Vivo
          {awaitingCount > 0 && <span className={styles.tabBadge}>{awaitingCount}</span>}
        </button>
        <button
          className={`${styles.tab} ${tab === "menu" ? styles.tabActive : ""}`}
          aria-current={tab === "menu" ? "page" : undefined}
          onClick={() => setTab("menu")}
        >
          Gestão de Cardápio
        </button>
      </nav>

      <main className={styles.content}>
        <div hidden={tab !== "orders"}>
          <OrdersBoard live={live} soundOn={soundOn} onSoundChange={changeSound} />
        </div>
        <div hidden={tab !== "menu"}>
          <MenuManager />
        </div>
      </main>
    </div>
  );
};

const FullPageMessage: React.FC<{ text: string; children?: React.ReactNode }> = ({ text, children }) => (
  <div className={styles.centered}>
    <img src={logo} alt="Irius" className={styles.centeredLogo} />
    <p className={styles.centeredText}>{text}</p>
    {children}
  </div>
);

export default AdminApp;
