"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ResourceFeedbackWidget } from "@/components/ResourceFeedback";
import { onSilenceRequest } from "@/lib/sensory/silence-bus";

const DURATIONS = [1, 3, 5, 10, 15];

function PauseTimer() {
  const [totalSeconds, setTotalSeconds] = useState(5 * 60);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return onSilenceRequest(() => setRunning(false));
  }, []);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const displaySeconds = remaining ?? totalSeconds;
  const minutes = Math.floor(displaySeconds / 60);
  const seconds = displaySeconds % 60;

  return (
    <div className="rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6 text-center">
      <p className="text-5xl font-bold tabular-nums text-[var(--nr-text)]" aria-live="polite">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </p>

      {!running && remaining === null && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {DURATIONS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setTotalSeconds(m * 60)}
              aria-pressed={totalSeconds === m * 60}
              className={`rounded-lg border px-3 py-1.5 text-sm ${
                totalSeconds === m * 60
                  ? "border-[var(--nr-accent-primary)] font-semibold text-[var(--nr-accent-primary)]"
                  : "border-[var(--nr-border)] text-[var(--nr-text)]"
              }`}
            >
              {m} min
            </button>
          ))}
        </div>
      )}

      <div className="mt-5 flex justify-center gap-3">
        {!running ? (
          <button
            type="button"
            onClick={() => {
              if (remaining === null) setRemaining(totalSeconds);
              setRunning(true);
            }}
            className="rounded-lg bg-[var(--nr-accent-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--nr-text-on-accent)]"
          >
            {remaining === null ? "Iniciar pausa" : "Continuar"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setRunning(false)}
            className="rounded-lg border border-[var(--nr-border)] px-5 py-2.5 text-sm font-medium text-[var(--nr-text)]"
          >
            Pausar temporizador
          </button>
        )}
        {remaining !== null && (
          <button
            type="button"
            onClick={() => {
              setRunning(false);
              setRemaining(null);
            }}
            className="rounded-lg border border-[var(--nr-border)] px-5 py-2.5 text-sm font-medium text-[var(--nr-text)]"
          >
            Reiniciar
          </button>
        )}
      </div>

      {remaining === 0 && (
        <p role="status" className="mt-4 text-[var(--nr-success)]">
          Pausa concluída. Continue pelo tempo que precisar.
        </p>
      )}
    </div>
  );
}

function ContagemVisual() {
  const [active, setActive] = useState(false);
  const [count, setCount] = useState(1);

  useEffect(() => onSilenceRequest(() => setActive(false)), []);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setCount((c) => (c >= 10 ? 1 : c + 1)), 1500);
    return () => clearInterval(id);
  }, [active]);

  return (
    <div className="rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6 text-center">
      <p className="text-sm text-[var(--nr-text-muted)]">
        Uma contagem lenta e previsível, de 1 a 10, sem exigir nenhuma resposta.
      </p>
      {active ? (
        <>
          <p className="mt-4 text-6xl font-bold text-[var(--nr-accent-primary)]" aria-live="polite">
            {count}
          </p>
          <button
            type="button"
            onClick={() => setActive(false)}
            className="mt-4 rounded-lg border border-[var(--nr-border)] px-4 py-2 text-sm font-medium text-[var(--nr-text)]"
          >
            Parar
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => {
            setCount(1);
            setActive(true);
          }}
          className="mt-4 rounded-lg bg-[var(--nr-accent-primary)] px-4 py-2 text-sm font-semibold text-[var(--nr-text-on-accent)]"
        >
          Iniciar contagem visual
        </button>
      )}
    </div>
  );
}

function TelaSilenciosa() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    return onSilenceRequest(() => setActive(false));
  }, []);

  if (active) {
    return (
      <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black">
        <button
          type="button"
          onClick={() => setActive(false)}
          className="rounded-lg border border-white/30 px-5 py-2.5 text-sm font-medium text-white/70 hover:text-white"
        >
          Sair da tela silenciosa
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6 text-center">
      <p className="text-sm text-[var(--nr-text-muted)]">
        Escurece a tela inteira, sem sons ou textos. Toque no botão para sair quando quiser.
      </p>
      <button
        type="button"
        onClick={() => setActive(true)}
        className="mt-4 rounded-lg bg-[var(--nr-accent-primary)] px-4 py-2 text-sm font-semibold text-[var(--nr-text-on-accent)]"
      >
        Escurecer tela
      </button>
    </div>
  );
}

export default function PausaPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-[var(--nr-text)]">Pausa, tela silenciosa e contagem visual</h1>
      <p className="mt-2 text-sm text-[var(--nr-text-muted)]">
        Escolha o que parecer mais possível agora. Você pode sair a qualquer momento.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        <PauseTimer />
        <TelaSilenciosa />
        <ContagemVisual />
      </div>

      <ResourceFeedbackWidget resourceId="pausa" />

      <Link href="/quero-me-regular" className="mt-6 inline-block text-sm text-[var(--nr-accent-primary)] hover:underline">
        Voltar para Quero me regular
      </Link>
    </div>
  );
}
