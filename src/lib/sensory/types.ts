/**
 * Passaporte Sensorial — preferências de acessibilidade e conforto sensorial.
 * Aplicável ao site inteiro e, quando o game suportar, também aos games.
 * As preferências nunca são alteradas silenciosamente pelo sistema.
 */
export interface SensoryPrefs {
  theme: "light" | "dark" | "system";
  lowStimulus: boolean;
  highContrast: boolean;
  brightness: number; // 70–130 (%)
  saturation: number; // 0–150 (%)
  fontSizeScale: number; // 0.85–1.6
  fontWeight: "normal" | "medium" | "bold";
  letterSpacing: "normal" | "wide" | "wider";
  lineHeight: "normal" | "relaxed" | "loose";
  motion: "full" | "reduced" | "none";
  density: "normal" | "low";
  hideDecorativeImages: boolean;
  simplifiedInterface: boolean;
  languageDepth: "summary" | "detailed";
  soundMusic: boolean;
  soundEffects: boolean;
  vibration: boolean;
  blockHighPitchSounds: boolean;
}

export const DEFAULT_SENSORY_PREFS: SensoryPrefs = {
  theme: "system",
  lowStimulus: false,
  highContrast: false,
  brightness: 100,
  saturation: 100,
  fontSizeScale: 1,
  fontWeight: "normal",
  letterSpacing: "normal",
  lineHeight: "normal",
  motion: "full",
  density: "normal",
  hideDecorativeImages: false,
  simplifiedInterface: false,
  languageDepth: "detailed",
  soundMusic: false,
  soundEffects: false,
  vibration: false,
  blockHighPitchSounds: true,
};

export const SENSORY_STORAGE_KEY = "neurorefugio.passaporteSensorial.v1";
