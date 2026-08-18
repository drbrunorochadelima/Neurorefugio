"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSensory } from "@/lib/sensory/context";
import { onSilenceRequest } from "@/lib/sensory/silence-bus";
import { ResourceFeedbackWidget } from "@/components/ResourceFeedback";

const DURATIONS = [1, 3, 5, 10, 20];

type Format = "texto" | "voz" | "imagem" | "silencio";

const FORMAT_LABELS: Record<Format, string> = {
  texto: "Texto",
  voz: "Narração opcional",
  imagem: "Imagem",
  silencio: "Silêncio",
};

const SCRIPT = [
  "Você não precisa fazer nada de especial agora. Só estar aqui pelo tempo que escolheu.",
  "Se quiser, note o apoio do seu corpo na superfície em que está — a cadeira, o chão, a cama.",
  "Sua respiração pode continuar no ritmo que já está, sem precisar ser ajustada.",
  "Se pensamentos aparecerem, eles podem simplesmente estar aqui também. Não é preciso afastá-los.",
  "Quando o tempo acabar, você pode voltar às suas atividades no seu ritmo.",
];

export default function MeditacoesPage() {
  const { prefs } = useSensory();
  const [duration, setDuration] = useState(3);
  const [format, setFormat] = useState<Format>("texto");
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(duration * 60);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => onSilenceRequest(() => stopSession()), []);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setRunning(false);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  function startSession() {
    setRemaining(duration * 60);
    setRunning(true);
    if (format === "voz" && prefs.soundEffects && typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(SCRIPT.join(" "));
      utterance.lang = "pt-BR";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  }

  function stopSession() {
    setRunning(false);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-[var(--nr-text)]">Meditações</h1>
      <p className="mt-2 text-sm text-[var(--nr-text-muted)]">
        Escolha a duração e o formato. Você pode encerrar a qualquer momento.
      </p>

      {!running ? (
        <div className="mt-6 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6">
          <p className="text-sm font-medium text-[var(--nr-text)]">Duração</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {DURATIONS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setDuration(m)}
                aria-pressed={duration === m}
                className={`rounded-lg border px-3 py-1.5 text-sm ${duration === m ? "border-[var(--nr-accent-primary)] font-semibold text-[var(--nr-accent-primary)]" : "border-[var(--nr-border)] text-[var(--nr-text)]"}`}
              >
                {m} min
              </button>
            ))}
          </div>

          <p className="mt-4 text-sm font-medium text-[var(--nr-text)]">Formato</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(Object.keys(FORMAT_LABELS) as Format[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFormat(f)}
                aria-pressed={format === f}
                disabled={f === "voz" && !prefs.soundEffects}
                className={`rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40 ${format === f ? "border-[var(--nr-accent-primary)] font-semibold text-[var(--nr-accent-primary)]" : "border-[var(--nr-border)] text-[var(--nr-text)]"}`}
              >
                {FORMAT_LABELS[f]}
              </button>
            ))}
          </div>
          {format === "voz" && !prefs.soundEffects && (
            <p className="mt-1 text-xs text-[var(--nr-text-muted)]">
              Ative sons opcionais em Meu Ambiente para usar a narração.
            </p>
          )}

          <button
            type="button"
            onClick={startSession}
            className="mt-5 rounded-lg bg-[var(--nr-accent-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--nr-text-on-accent)]"
          >
            Começar
          </button>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-8 text-center">
          <p className="text-3xl font-bold tabular-nums text-[var(--nr-text)]" aria-live="polite">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </p>

          {format === "texto" || format === "voz" ? (
            <div className="mx-auto mt-6 flex max-w-md flex-col gap-3 text-left text-[var(--nr-text)]">
              {SCRIPT.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          ) : format === "imagem" ? (
            <div className="mx-auto mt-6 h-40 w-40 rounded-full bg-[var(--nr-accent-tertiary)]" aria-hidden="true" />
          ) : (
            <p className="mt-6 text-sm text-[var(--nr-text-muted)]">Silêncio.</p>
          )}

          <button
            type="button"
            onClick={stopSession}
            className="mt-6 rounded-lg border border-[var(--nr-border)] px-5 py-2.5 text-sm font-medium text-[var(--nr-text)]"
          >
            Encerrar
          </button>
        </div>
      )}

      {remaining === 0 && !running && (
        <p role="status" className="mt-4 text-[var(--nr-success)]">
          Sessão concluída.
        </p>
      )}

      <ResourceFeedbackWidget resourceId="meditacoes" />

      <Link href="/quero-me-regular" className="mt-6 inline-block text-sm text-[var(--nr-accent-primary)] hover:underline">
        Voltar para Quero me regular
      </Link>
    </div>
  );
}
