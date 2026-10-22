// src/admin/orders/alertSound.ts
// Alerta sonoro gerado no navegador (Web Audio), sem arquivo de áudio.
// O navegador só libera som depois de um clique na página: por isso o
// painel chama unlockAudio() no botão "Ativar som" / primeiro clique.

let ctx: AudioContext | null = null;

export function unlockAudio() {
  ctx ??= new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx.state !== "closed";
}

export const audioUnlocked = () => ctx?.state === "running";

// recepção: "ding-dong" duplo | cozinha: arpejo de 3 notas (soam diferentes)
const PATTERNS = {
  reception: [784, 1046.5, 784, 1046.5],
  kitchen: [659.25, 880, 1318.5],
};

export function playAlert(kind: keyof typeof PATTERNS) {
  if (!ctx || ctx.state !== "running") return false;
  const start = ctx.currentTime + 0.02;
  PATTERNS[kind].forEach((freq, i) => {
    const t = start + i * 0.24;
    const osc = ctx!.createOscillator();
    const gain = ctx!.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.5, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
    osc.connect(gain).connect(ctx!.destination);
    osc.start(t);
    osc.stop(t + 1);
  });
  return true;
}
