"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSensory } from "@/lib/sensory/context";
import { onSilenceRequest } from "@/lib/sensory/silence-bus";
import { NoiseEngine, type NoiseType } from "@/lib/audio/noise-engine";
import { ResourceFeedbackWidget } from "@/components/ResourceFeedback";

const SOUNDS: { type: NoiseType; label: string }[] = [
  { type: "chuva", label: "Chuva" },
  { type: "ondas", label: "Ondas" },
  { type: "ventilador", label: "Ventilador" },
  { type: "ruido_marrom", label: "Ruído marrom" },
];

export default function SonsPage() {
  const { prefs } = useSensory();
  const engineRef = useRef<NoiseEngine | null>(null);
  const [playing, setPlaying] = useState<NoiseType | null>(null);
  const [volume, setVolume] = useState(35);

  useEffect(() => {
    engineRef.current = new NoiseEngine();
    return () => engineRef.current?.stop();
  }, []);

  useEffect(() => onSilenceRequest(() => stop()), []);

  function stop() {
    engineRef.current?.stop();
    setPlaying(null);
  }

  function play(type: NoiseType) {
    engineRef.current?.start(type, volume / 100);
    setPlaying(type);
  }

  useEffect(() => {
    if (playing) engineRef.current?.setVolume(volume / 100);
  }, [volume, playing]);

  if (!prefs.soundEffects) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-[var(--nr-text)]">Sons contínuos</h1>
        <p className="mt-3 text-[var(--nr-text-muted)]">
          Sons opcionais estão desativados nas suas preferências. Você pode ativá-los em Meu
          Ambiente, se quiser.
        </p>
        <Link href="/configuracoes" className="mt-4 inline-block text-[var(--nr-accent-primary)] underline">
          Abrir Meu Ambiente
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-[var(--nr-text)]">Sons contínuos</h1>
      <p className="mt-2 text-sm text-[var(--nr-text-muted)]">
        Gerados no navegador, sem arquivos externos. Nada toca automaticamente — escolha e pare
        quando quiser.
      </p>

      <div className="mt-6 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6">
        <div className="grid grid-cols-2 gap-3">
          {SOUNDS.map((s) => (
            <button
              key={s.type}
              type="button"
              onClick={() => (playing === s.type ? stop() : play(s.type))}
              aria-pressed={playing === s.type}
              className={`rounded-xl border px-4 py-4 text-sm font-medium ${
                playing === s.type
                  ? "border-[var(--nr-accent-primary)] bg-[var(--nr-surface-alt)] text-[var(--nr-accent-primary)]"
                  : "border-[var(--nr-border)] text-[var(--nr-text)]"
              }`}
            >
              {playing === s.type ? `Parar ${s.label.toLowerCase()}` : s.label}
            </button>
          ))}
        </div>

        <div className="mt-5">
          <label htmlFor="volume" className="text-sm font-medium text-[var(--nr-text)]">
            Volume
          </label>
          <input
            id="volume"
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="mt-1 w-full accent-[var(--nr-accent-primary)]"
          />
        </div>
      </div>

      <ResourceFeedbackWidget resourceId="sons" />

      <Link href="/quero-me-regular" className="mt-6 inline-block text-sm text-[var(--nr-accent-primary)] underline">
        Voltar para Quero me regular
      </Link>
    </div>
  );
}
