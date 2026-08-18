"use client";

import { useState } from "react";
import { BodyMap } from "@/components/BodyMap";
import {
  BODY_SENSATIONS,
  EXTERNAL_STIMULI,
  type BodyMark,
  type BodyRegion,
  type BodySensation,
  type ExternalStimulus,
} from "@/lib/schemas/body-monitor";
import { BODY_SENSATION_LABELS, EXTERNAL_STIMULUS_LABELS } from "@/lib/schemas/body-monitor-labels";
import { addBodyMonitorEntry } from "@/lib/services/body-monitor";

export function NewEntryForm({ userId, onSaved }: { userId: string; onSaved: () => void }) {
  const [marks, setMarks] = useState<BodyMark[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<BodyRegion | null>(null);
  const [pendingSensations, setPendingSensations] = useState<BodySensation[]>([]);
  const [pendingIntensity, setPendingIntensity] = useState(3);
  const [ambiente, setAmbiente] = useState("");
  const [externalStimuli, setExternalStimuli] = useState<ExternalStimulus[]>([]);
  const [necessidadeMovimento, setNecessidadeMovimento] = useState(false);
  const [pesoCorporalPercebido, setPesoCorporalPercebido] = useState<"leve" | "normal" | "pesado">("normal");
  const [notas, setNotas] = useState("");

  function selectRegion(region: BodyRegion) {
    setSelectedRegion(region);
    const existing = marks.find((m) => m.region === region);
    setPendingSensations(existing?.sensations ?? []);
    setPendingIntensity(existing?.intensity ?? 3);
  }

  function toggleSensation(sensation: BodySensation) {
    setPendingSensations((prev) =>
      prev.includes(sensation) ? prev.filter((s) => s !== sensation) : [...prev, sensation],
    );
  }

  function saveRegionMark() {
    if (!selectedRegion) return;
    if (pendingSensations.length === 0) {
      setMarks((prev) => prev.filter((m) => m.region !== selectedRegion));
    } else {
      const mark: BodyMark = { region: selectedRegion, sensations: pendingSensations, intensity: pendingIntensity };
      setMarks((prev) => [...prev.filter((m) => m.region !== selectedRegion), mark]);
    }
    setSelectedRegion(null);
  }

  function toggleStimulus(stimulus: ExternalStimulus) {
    setExternalStimuli((prev) =>
      prev.includes(stimulus) ? prev.filter((s) => s !== stimulus) : [...prev, stimulus],
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addBodyMonitorEntry(userId, {
      ambiente: ambiente || undefined,
      marks,
      externalStimuli,
      necessidadeMovimento,
      pesoCorporalPercebido,
      notas: notas || undefined,
    });
    setMarks([]);
    setAmbiente("");
    setExternalStimuli([]);
    setNecessidadeMovimento(false);
    setPesoCorporalPercebido("normal");
    setNotas("");
    onSaved();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6">
      <h2 className="text-lg font-semibold text-[var(--nr-text)]">Novo registro</h2>
      <p className="mt-1 text-sm text-[var(--nr-text-muted)]">
        Toque em uma região do corpo para registrar o que sente nela agora.
      </p>

      <div className="mt-4">
        <BodyMap marks={marks} selectedRegion={selectedRegion} onSelectRegion={selectRegion} />
      </div>

      {selectedRegion && (
        <div className="mt-4 rounded-xl border border-[var(--nr-border)] bg-[var(--nr-surface-alt)] p-4">
          <p className="text-sm font-medium text-[var(--nr-text)]">O que você sente nesta região?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {BODY_SENSATIONS.map((s) => (
              <label
                key={s}
                className={`cursor-pointer rounded-lg border px-3 py-1.5 text-sm ${
                  pendingSensations.includes(s)
                    ? "border-[var(--nr-accent-primary)] bg-[var(--nr-surface)] font-semibold text-[var(--nr-accent-primary)]"
                    : "border-[var(--nr-border)] text-[var(--nr-text)]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={pendingSensations.includes(s)}
                  onChange={() => toggleSensation(s)}
                  className="sr-only"
                />
                {BODY_SENSATION_LABELS[s]}
              </label>
            ))}
          </div>
          <div className="mt-3">
            <label htmlFor="intensidade" className="text-sm font-medium text-[var(--nr-text)]">
              Intensidade: {pendingIntensity}
            </label>
            <input
              id="intensidade"
              type="range"
              min={1}
              max={5}
              value={pendingIntensity}
              onChange={(e) => setPendingIntensity(Number(e.target.value))}
              className="mt-1 w-full accent-[var(--nr-accent-primary)]"
            />
          </div>
          <button
            type="button"
            onClick={saveRegionMark}
            className="mt-3 rounded-lg bg-[var(--nr-accent-primary)] px-3 py-1.5 text-sm font-semibold text-[var(--nr-text-on-accent)]"
          >
            Salvar região
          </button>
        </div>
      )}

      <div className="mt-6">
        <label htmlFor="ambiente" className="text-sm font-medium text-[var(--nr-text)]">
          Ambiente (opcional)
        </label>
        <input
          id="ambiente"
          value={ambiente}
          onChange={(e) => setAmbiente(e.target.value)}
          placeholder="Ex.: plantão noturno, sala de espera, casa"
          className="mt-1 w-full rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface)] px-3 py-2 text-sm text-[var(--nr-text)]"
        />
      </div>

      <fieldset className="mt-4">
        <legend className="text-sm font-medium text-[var(--nr-text)]">
          Estímulos externos associados (sem indicar causa)
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {EXTERNAL_STIMULI.map((s) => (
            <label
              key={s}
              className={`cursor-pointer rounded-lg border px-3 py-1.5 text-sm ${
                externalStimuli.includes(s)
                  ? "border-[var(--nr-accent-primary)] font-semibold text-[var(--nr-accent-primary)]"
                  : "border-[var(--nr-border)] text-[var(--nr-text)]"
              }`}
            >
              <input
                type="checkbox"
                checked={externalStimuli.includes(s)}
                onChange={() => toggleStimulus(s)}
                className="sr-only"
              />
              {EXTERNAL_STIMULUS_LABELS[s]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-4 flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-[var(--nr-text)]">
          <input
            type="checkbox"
            checked={necessidadeMovimento}
            onChange={(e) => setNecessidadeMovimento(e.target.checked)}
            className="h-4 w-4 accent-[var(--nr-accent-primary)]"
          />
          Sinto necessidade de me movimentar
        </label>

        <div>
          <span className="text-sm font-medium text-[var(--nr-text)]">Peso corporal percebido</span>
          <div className="mt-1 flex gap-2">
            {(["leve", "normal", "pesado"] as const).map((opt) => (
              <label
                key={opt}
                className={`cursor-pointer rounded-lg border px-3 py-1 text-sm capitalize ${
                  pesoCorporalPercebido === opt
                    ? "border-[var(--nr-accent-primary)] font-semibold text-[var(--nr-accent-primary)]"
                    : "border-[var(--nr-border)] text-[var(--nr-text)]"
                }`}
              >
                <input
                  type="radio"
                  name="peso-corporal"
                  checked={pesoCorporalPercebido === opt}
                  onChange={() => setPesoCorporalPercebido(opt)}
                  className="sr-only"
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="notas" className="text-sm font-medium text-[var(--nr-text)]">
          Notas (opcional)
        </label>
        <textarea
          id="notas"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface)] px-3 py-2 text-sm text-[var(--nr-text)]"
        />
      </div>

      <button
        type="submit"
        className="mt-5 rounded-lg bg-[var(--nr-accent-primary)] px-4 py-2.5 text-base font-semibold text-[var(--nr-text-on-accent)] hover:bg-[var(--nr-accent-primary-hover)]"
      >
        Salvar registro
      </button>
    </form>
  );
}
