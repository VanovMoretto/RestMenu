// src/admin/ToggleSwitch.tsx
import styles from "./ToggleSwitch.module.css";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  label: string; // lido por leitores de tela, ex.: "Disponível: Costela 12h"
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label, disabled }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onClick={onChange}
    className={`${styles.switch} ${checked ? styles.on : ""}`}
  >
    <span className={styles.thumb} />
  </button>
);

export default ToggleSwitch;
