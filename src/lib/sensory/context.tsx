"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DEFAULT_SENSORY_PREFS, type SensoryPrefs } from "./types";
import { loadSensoryPrefs, saveSensoryPrefs } from "./storage";

interface SensoryContextValue {
  prefs: SensoryPrefs;
  setPrefs: (update: Partial<SensoryPrefs>) => void;
  resetPrefs: () => void;
  calmMode: boolean;
  activateCalmMode: () => void;
  deactivateCalmMode: () => void;
}

const SensoryContext = createContext<SensoryContextValue | null>(null);

const LINE_HEIGHT_SCALE: Record<SensoryPrefs["lineHeight"], number> = {
  normal: 1,
  relaxed: 1.15,
  loose: 1.32,
};

const LETTER_SPACING: Record<SensoryPrefs["letterSpacing"], string> = {
  normal: "normal",
  wide: "0.03em",
  wider: "0.07em",
};

const FONT_WEIGHT: Record<SensoryPrefs["fontWeight"], string> = {
  normal: "400",
  medium: "500",
  bold: "600",
};

function applyPrefsToDocument(prefs: SensoryPrefs) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  const resolvedTheme =
    prefs.theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : prefs.theme;
  root.setAttribute("data-theme", resolvedTheme);
  root.setAttribute("data-stimulus", prefs.lowStimulus ? "low" : "normal");
  root.setAttribute("data-motion", prefs.motion);
  root.setAttribute("data-density", prefs.density);
  root.setAttribute("data-simplified", String(prefs.simplifiedInterface));
  root.setAttribute("data-hide-decorative", String(prefs.hideDecorativeImages));

  root.style.setProperty("--nr-font-scale", String(prefs.fontSizeScale));
  root.style.setProperty("--nr-line-height-scale", String(LINE_HEIGHT_SCALE[prefs.lineHeight]));
  root.style.setProperty("--nr-letter-spacing", LETTER_SPACING[prefs.letterSpacing]);
  root.style.setProperty("--nr-font-weight-body", FONT_WEIGHT[prefs.fontWeight]);
  root.style.setProperty("--nr-saturation", String(prefs.saturation / 100));
  root.style.setProperty("--nr-brightness", String(prefs.brightness / 100));
  root.style.setProperty("--nr-contrast", prefs.highContrast ? "1.18" : "1");
}

export function SensoryProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefsState] = useState<SensoryPrefs>(() =>
    typeof window === "undefined" ? DEFAULT_SENSORY_PREFS : loadSensoryPrefs(),
  );
  const [calmMode, setCalmMode] = useState(false);

  useEffect(() => {
    applyPrefsToDocument(prefs);
  }, [prefs]);

  useEffect(() => {
    if (prefs.theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => applyPrefsToDocument(prefs);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [prefs]);

  const setPrefs = useCallback((update: Partial<SensoryPrefs>) => {
    setPrefsState((prev) => {
      const next = { ...prev, ...update };
      saveSensoryPrefs(next);
      return next;
    });
  }, []);

  const resetPrefs = useCallback(() => {
    setPrefsState(DEFAULT_SENSORY_PREFS);
    saveSensoryPrefs(DEFAULT_SENSORY_PREFS);
  }, []);

  const activateCalmMode = useCallback(() => setCalmMode(true), []);
  const deactivateCalmMode = useCallback(() => setCalmMode(false), []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-calm", String(calmMode));
  }, [calmMode]);

  const value = useMemo<SensoryContextValue>(
    () => ({
      prefs,
      setPrefs,
      resetPrefs,
      calmMode,
      activateCalmMode,
      deactivateCalmMode,
    }),
    [prefs, setPrefs, resetPrefs, calmMode, activateCalmMode, deactivateCalmMode],
  );

  return (
    <SensoryContext.Provider value={value}>
      {children}
    </SensoryContext.Provider>
  );
}

export function useSensory(): SensoryContextValue {
  const ctx = useContext(SensoryContext);
  if (!ctx) throw new Error("useSensory deve ser usado dentro de SensoryProvider");
  return ctx;
}
