"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";
import { addFullCheckIn, synthesizeCheckIn } from "@/lib/services/checkins";

const FIELDS: { key: string; label: string }[] = [
  { key: "humor", label: "Humor" },
  { key: "energia", label: "Energia" },
  { key: "ansiedade", label: "Ansiedade" },
  { key: "irritabilidade", label: "Irritabilidade" },
  { key: "sensibilidadeLuz", label: "Sensibilidade à luz" },
  { key: "sensibilidadeSom", label: "Sensibilidade a sons" },
  { key: "sensibilidadeToque", label: "Sensibilidade ao toque" },
  { key: "sensibilidadeCheiro", label: "Sensibilidade a cheiros" },
  { key: "dor", label: "Dor" },
  { key: "fome", label: "Fome" },
  { key: "sede", label: "Sede" },
  { key: "sono", label: "Qualidade do sono" },
  { key: "necessidadeIsolamento", label: "Necessidade de isolamento" },
  { key: "capacidadeFalarInteragir", label: "Capacidade de falar e interagir" },
  { key: "necessidadeStimming", label: "Necessidade de stimming" },
  { key: "esforcoMasking", label: "Esforço de masking" },
  { key: "sobrecargaPercebida", label: "Sobrecarga percebida" },
];

function ScaleRow({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const id = useId();
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <label htmlFor={id} className="font-medium text-[var(--nr-text)]">
          {label}
        </label>
        <span className="text-[var(--nr-text-muted)]">{value}</span>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={`${value} de 5`}
        className="mt-1 w-full accent-[var(--nr-accent-primary)]"
      />
    </div>
  );
}

export default function CheckInCompletoPage() {
  const { user } = useAuth();
  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(FIELDS.map((f) => [f.key, 2])),
  );
  const [temperaturaConfortavel, setTemperaturaConfortavel] = useState(true);
  const [acontecimentos, setAcontecimentos] = useState("");
  const [estrategiasUtilizadas, setEstrategiasUtilizadas] = useState("");
  const [synthesis, setSynthesis] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center sm:px-6">
        <p className="text-[var(--nr-text)]">Entre para registrar seu check-in completo.</p>
        <Link href="/entrar" className="mt-4 inline-block text-[var(--nr-accent-primary)] underline">
          Entrar
        </Link>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const checkIn = addFullCheckIn(user.id, {
      humor: values.humor,
      energia: values.energia,
      ansiedade: values.ansiedade,
      irritabilidade: values.irritabilidade,
      sensibilidadeLuz: values.sensibilidadeLuz,
      sensibilidadeSom: values.sensibilidadeSom,
      sensibilidadeToque: values.sensibilidadeToque,
      sensibilidadeCheiro: values.sensibilidadeCheiro,
      dor: values.dor,
      fome: values.fome,
      sede: values.sede,
      sono: values.sono,
      temperaturaConfortavel,
      necessidadeIsolamento: values.necessidadeIsolamento,
      capacidadeFalarInteragir: values.capacidadeFalarInteragir,
      necessidadeStimming: values.necessidadeStimming,
      esforcoMasking: values.esforcoMasking,
      sobrecargaPercebida: values.sobrecargaPercebida,
      acontecimentos: acontecimentos || undefined,
      estrategiasUtilizadas: estrategiasUtilizadas || undefined,
    });
    setSynthesis(synthesizeCheckIn(checkIn));
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-[var(--nr-text)]">Check-in completo</h1>
      <p className="mt-2 text-sm text-[var(--nr-text-muted)]">
        Todas as escalas vão de 0 (nada/muito baixo) a 5 (muito/muito alto). Responda apenas o que
        fizer sentido agora.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6">
        {FIELDS.map((f) => (
          <ScaleRow
            key={f.key}
            label={f.label}
            value={values[f.key]}
            onChange={(v) => setValues((prev) => ({ ...prev, [f.key]: v }))}
          />
        ))}

        <label className="flex items-center gap-2 text-sm text-[var(--nr-text)]">
          <input
            type="checkbox"
            checked={temperaturaConfortavel}
            onChange={(e) => setTemperaturaConfortavel(e.target.checked)}
            className="h-4 w-4 accent-[var(--nr-accent-primary)]"
          />
          A temperatura ao meu redor está confortável
        </label>

        <div>
          <label htmlFor="acontecimentos" className="text-sm font-medium text-[var(--nr-text)]">
            Acontecimentos relevantes (opcional)
          </label>
          <textarea
            id="acontecimentos"
            value={acontecimentos}
            onChange={(e) => setAcontecimentos(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface)] px-3 py-2 text-sm text-[var(--nr-text)]"
          />
        </div>

        <div>
          <label htmlFor="estrategias" className="text-sm font-medium text-[var(--nr-text)]">
            Estratégias que você usou hoje (opcional)
          </label>
          <textarea
            id="estrategias"
            value={estrategiasUtilizadas}
            onChange={(e) => setEstrategiasUtilizadas(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface)] px-3 py-2 text-sm text-[var(--nr-text)]"
          />
        </div>

        <button
          type="submit"
          className="self-start rounded-lg bg-[var(--nr-accent-primary)] px-4 py-2.5 text-base font-semibold text-[var(--nr-text-on-accent)] hover:bg-[var(--nr-accent-primary-hover)]"
        >
          Registrar check-in completo
        </button>
      </form>

      {synthesis && (
        <p role="status" className="mt-4 rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface-alt)] p-4 text-[var(--nr-text)]">
          {synthesis}
        </p>
      )}

      <Link href="/meu-espaco" className="mt-6 inline-block text-sm text-[var(--nr-accent-primary)] underline">
        Voltar para Meu Espaço
      </Link>
    </div>
  );
}
