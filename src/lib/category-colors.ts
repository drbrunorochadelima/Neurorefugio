/**
 * Cores rotativas para emblemas de categoria (comunidade, biblioteca, hiperfocos).
 * Usa os tokens de cor vívidos já definidos em globals.css — cada entrada tem um
 * par fundo claro / texto escuro que passa no contraste mínimo de 4.5:1.
 */
const PALETTE = [
  { bg: "var(--nr-blue-100)", text: "var(--nr-blue-700)" },
  { bg: "var(--nr-emerald-100)", text: "var(--nr-emerald-700)" },
  { bg: "var(--nr-violet-100)", text: "var(--nr-violet-700)" },
  { bg: "var(--nr-amber-100)", text: "var(--nr-amber-700)" },
  { bg: "var(--nr-rose-100)", text: "var(--nr-rose-700)" },
];

export function categoryColor(key: string): { bg: string; text: string } {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}
