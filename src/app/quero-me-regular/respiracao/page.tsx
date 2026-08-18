"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSensory } from "@/lib/sensory/context";
import { onSilenceRequest } from "@/lib/sensory/silence-bus";
import { ResourceFeedbackWidget } from "@/components/ResourceFeedback";

type Phase = "inspire" | "pausa" | "expire";

const PHASE_LABEL: Record<Phase, string> = {
  inspire: "Inspire",
  pausa: "Pausa (opcional — solte quando quiser)",
  expire: "Expire",
};

export default function RespiracaoPage() {
  const { prefs } = useSensory();
  const reducedMotion = prefs.motion !== "full";
  const [includePause, setIncludePause] = useState(false);
  const [inspireSeconds, setInspireSeconds] = useState(4);
  const [expireSeconds, setExpireSeconds] = useState(6);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>("inspire");
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(inspireSeconds);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => onSilenceRequest(() => setRunning(false)), []);

  useEffect(() => {
    if (!running) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }
    timeoutRef.current = setTimeout(() => {
      if (phaseSecondsLeft <= 1) {
        const sequence: Phase[] = includePause ? ["inspire", "pausa", "expire"] : ["inspire", "expire"];
        const nextIndex = (sequence.indexOf(phase) + 1) % sequence.length;
        const nextPhase = sequence[nextIndex];
        setPhase(nextPhase);
        setPhaseSecondsLeft(nextPhase === "inspire" ? inspireSeconds : nextPhase === "expire" ? expireSeconds : 4);
      } else {
        setPhaseSecondsLeft((s) => s - 1);
      }
    }, 1000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [running, phaseSecondsLeft, phase, includePause, inspireSeconds, expireSeconds]);

  function start() {
    setPhase("inspire");
    setPhaseSecondsLeft(inspireSeconds);
    setRunning(true);
  }

  function stop() {
    setRunning(false);
  }

  const scale = phase === "inspire" ? 1.3 : phase === "expire" ? 0.8 : 1.1;

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-[var(--nr-text)]">Respiração opcional</h1>
      <p className="mt-2 text-sm text-[var(--nr-text-muted)]">
        Um ritmo visual de referência — você não precisa segui-lo exatamente, nem prender a
        respiração. Pare quando quiser.
      </p>

      <div className="mt-6 flex flex-col items-center gap-6 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-8">
        <div
          aria-hidden="true"
          className="h-40 w-40 rounded-full bg-[var(--nr-accent-tertiary)]"
          style={
            reducedMotion
              ? undefined
              : { transform: `scale(${scale})`, transition: "transform 1s ease-in-out" }
          }
        />
        <p role="status" aria-live="polite" className="text-xl font-semibold text-[var(--nr-text)]">
          {running ? `${PHASE_LABEL[phase]} — ${phaseSecondsLeft}s` : "Pronto para começar quando você quiser"}
        </p>

        {!running ? (
          <div className="flex flex-col items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-[var(--nr-text)]">
              <input
                type="checkbox"
                checked={includePause}
                onChange={(e) => setIncludePause(e.target.checked)}
                className="h-4 w-4 accent-[var(--nr-accent-primary)]"
              />
              Incluir uma pausa opcional entre inspirar e expirar
            </label>
            <div className="flex items-center gap-4 text-sm text-[var(--nr-text)]">
              <label className="flex items-center gap-2">
                Inspirar (s)
                <input
                  type="number"
                  min={2}
                  max={10}
                  value={inspireSeconds}
                  onChange={(e) => setInspireSeconds(Number(e.target.value))}
                  className="w-16 rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface)] px-2 py-1"
                />
              </label>
              <label className="flex items-center gap-2">
                Expirar (s)
                <input
                  type="number"
                  min={2}
                  max={12}
                  value={expireSeconds}
                  onChange={(e) => setExpireSeconds(Number(e.target.value))}
                  className="w-16 rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface)] px-2 py-1"
                />
              </label>
            </div>
            <button
              type="button"
              onClick={start}
              className="rounded-lg bg-[var(--nr-accent-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--nr-text-on-accent)]"
            >
              Começar
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={stop}
            className="rounded-lg border border-[var(--nr-border)] px-5 py-2.5 text-sm font-medium text-[var(--nr-text)]"
          >
            Parar
          </button>
        )}
      </div>

      <ResourceFeedbackWidget resourceId="respiracao" />

      <Link href="/quero-me-regular" className="mt-6 inline-block text-sm text-[var(--nr-accent-primary)] underline">
        Voltar para Quero me regular
      </Link>
    </div>
  );
}
