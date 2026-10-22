// src/admin/LoginForm.tsx
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "../lib/supabase";
import logo from "../assets/irius-logo.svg";
import styles from "./AdminApp.module.css";

const ERRORS: Record<string, string> = {
  "Invalid login credentials": "E-mail ou senha incorretos.",
  "Email not confirmed": "Este e-mail ainda não foi confirmado.",
};

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    // Em caso de sucesso o AdminApp troca de tela sozinho (onAuthStateChange)
    if (authError) {
      setError(ERRORS[authError.message] ?? "Não foi possível entrar. Tente novamente em instantes.");
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.centered}>
      <form className={styles.loginCard} onSubmit={handleSubmit}>
        <img src={logo} alt="Irius Gastronomia" className={styles.loginLogo} />
        <h1 className={styles.loginTitle}>Painel do Restaurante</h1>

        <label className={styles.field}>
          <span>E-mail</span>
          <input
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span>Senha</span>
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>

        {error && <p className={styles.loginError} role="alert">{error}</p>}

        <button type="submit" className={styles.primaryButton} disabled={submitting}>
          {submitting ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
