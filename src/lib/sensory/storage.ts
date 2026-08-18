import { DEFAULT_SENSORY_PREFS, SENSORY_STORAGE_KEY, type SensoryPrefs } from "./types";

export function loadSensoryPrefs(): SensoryPrefs {
  if (typeof window === "undefined") return DEFAULT_SENSORY_PREFS;
  try {
    const raw = window.localStorage.getItem(SENSORY_STORAGE_KEY);
    if (!raw) return DEFAULT_SENSORY_PREFS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SENSORY_PREFS, ...parsed };
  } catch {
    return DEFAULT_SENSORY_PREFS;
  }
}

export function saveSensoryPrefs(prefs: SensoryPrefs): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SENSORY_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // localStorage indisponível (modo privado, quota excedida) — preferências
    // seguem válidas apenas para a sessão atual em memória.
  }
}

/**
 * Script inline injetado no <head> para aplicar tema e modo de baixo estímulo
 * antes da hidratação do React, evitando flash de conteúdo com tema errado.
 * Mantido minimalista de propósito: só o essencial para o primeiro paint.
 */
export const SENSORY_BOOTSTRAP_SCRIPT = `
(function() {
  try {
    var raw = window.localStorage.getItem(${JSON.stringify(SENSORY_STORAGE_KEY)});
    var prefs = raw ? JSON.parse(raw) : {};
    var theme = prefs.theme || "system";
    var resolved = theme === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : theme;
    var root = document.documentElement;
    root.setAttribute("data-theme", resolved);
    if (prefs.lowStimulus) root.setAttribute("data-stimulus", "low");
    if (prefs.motion) root.setAttribute("data-motion", prefs.motion);
    if (typeof prefs.fontSizeScale === "number") {
      root.style.setProperty("--nr-font-scale", String(prefs.fontSizeScale));
    }
  } catch (e) {}
})();
`;
