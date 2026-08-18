import { describe, expect, it, beforeEach } from "vitest";
import { addQuickCheckIn, addFullCheckIn, listCheckIns, synthesizeCheckIn } from "./checkins";

describe("checkins service", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("persists and lists quick check-ins for the correct user, most recent first", () => {
    const userId = "user-1";
    addQuickCheckIn(userId, {
      humor: 3,
      energia: 3,
      ansiedade: 1,
      sobrecarga: 1,
      capacidadeComunicacao: 4,
      precisaPausa: false,
    });
    addQuickCheckIn(userId, {
      humor: 2,
      energia: 1,
      ansiedade: 4,
      sobrecarga: 4,
      capacidadeComunicacao: 1,
      precisaPausa: true,
    });
    addQuickCheckIn("other-user", {
      humor: 5,
      energia: 5,
      ansiedade: 0,
      sobrecarga: 0,
      capacidadeComunicacao: 5,
      precisaPausa: false,
    });

    const entries = listCheckIns(userId);
    expect(entries).toHaveLength(2);
    expect(entries.every((e) => e.userId === userId)).toBe(true);
  });

  it("produces a welcoming, non-diagnostic synthesis for a quick check-in with high overload", () => {
    const checkIn = addQuickCheckIn("user-2", {
      humor: 2,
      energia: 1,
      ansiedade: 5,
      sobrecarga: 5,
      capacidadeComunicacao: 0,
      precisaPausa: true,
    });

    const text = synthesizeCheckIn(checkIn);

    expect(text).toContain("Este é um registro pessoal, não um diagnóstico");
    expect(text.toLowerCase()).toContain("sobrecarga elevada");
    expect(text).not.toMatch(/diagnóstico de|voc[êe] tem transtorno/i);
  });

  it("returns a neutral acknowledgement when nothing stands out", () => {
    const checkIn = addQuickCheckIn("user-3", {
      humor: 3,
      energia: 3,
      ansiedade: 2,
      sobrecarga: 1,
      capacidadeComunicacao: 3,
      precisaPausa: false,
    });

    expect(synthesizeCheckIn(checkIn)).toBe(
      "Registro guardado. Obrigado por reservar este momento para se observar.",
    );
  });

  it("uses sobrecargaPercebida (not sobrecarga) to evaluate overload on full check-ins", () => {
    const checkIn = addFullCheckIn("user-4", {
      humor: 3,
      energia: 3,
      ansiedade: 1,
      irritabilidade: 1,
      sensibilidadeLuz: 1,
      sensibilidadeSom: 1,
      sensibilidadeToque: 1,
      sensibilidadeCheiro: 1,
      dor: 0,
      fome: 1,
      sede: 1,
      sono: 3,
      temperaturaConfortavel: true,
      necessidadeIsolamento: 1,
      capacidadeFalarInteragir: 3,
      necessidadeStimming: 1,
      esforcoMasking: 1,
      sobrecargaPercebida: 5,
    });

    expect(synthesizeCheckIn(checkIn).toLowerCase()).toContain("sobrecarga elevada");
  });
});
