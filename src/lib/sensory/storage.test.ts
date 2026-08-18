import { describe, expect, it, beforeEach } from "vitest";
import { loadSensoryPrefs, saveSensoryPrefs } from "./storage";
import { DEFAULT_SENSORY_PREFS } from "./types";

describe("sensory preferences storage", () => {
  beforeEach(() => window.localStorage.clear());

  it("returns defaults when nothing is stored", () => {
    expect(loadSensoryPrefs()).toEqual(DEFAULT_SENSORY_PREFS);
  });

  it("round-trips saved preferences, merged with defaults for missing fields", () => {
    saveSensoryPrefs({ ...DEFAULT_SENSORY_PREFS, lowStimulus: true, fontSizeScale: 1.2 });
    const loaded = loadSensoryPrefs();
    expect(loaded.lowStimulus).toBe(true);
    expect(loaded.fontSizeScale).toBe(1.2);
    expect(loaded.soundEffects).toBe(false);
  });

  it("never enables sound by default (no autoplay policy)", () => {
    expect(DEFAULT_SENSORY_PREFS.soundEffects).toBe(false);
    expect(DEFAULT_SENSORY_PREFS.soundMusic).toBe(false);
  });

  it("falls back to defaults on corrupted storage", () => {
    window.localStorage.setItem("neurorefugio.passaporteSensorial.v1", "{broken");
    expect(loadSensoryPrefs()).toEqual(DEFAULT_SENSORY_PREFS);
  });
});
