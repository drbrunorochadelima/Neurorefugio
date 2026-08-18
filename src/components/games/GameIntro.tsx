"use client";

import Link from "next/link";

interface GameIntroProps {
  title: string;
  objective: string;
  duration: string;
  difficulty: string;
  sounds: string;
  movement: string;
  stimuli: string;
  controls: string;
  exit: string;
  onStart: () => void;
}

export function GameIntro({
  title,
  objective,
  duration,
  difficulty,
  sounds,
  movement,
  stimuli,
  controls,
  exit,
  onStart,
}: GameIntroProps) {
  const rows: { label: string; value: string }[] = [
    { label: "Objetivo", value: objective },
    { label: "Duração aproximada", value: duration },
    { label: "Dificuldade", value: difficulty },
    { label: "Sons", value: sounds },
    { label: "Movimentos", value: movement },
    { label: "Possíveis estímulos", value: stimuli },
    { label: "Controles", value: controls },
    { label: "Como sair", value: exit },
  ];

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-[var(--nr-text)]">{title}</h1>

      <dl className="mt-6 flex flex-col gap-3 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-3 gap-3 text-sm">
            <dt className="font-medium text-[var(--nr-text)]">{row.label}</dt>
            <dd className="col-span-2 text-[var(--nr-text-muted)]">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onStart}
          className="rounded-lg bg-[var(--nr-accent-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--nr-text-on-accent)] hover:bg-[var(--nr-accent-primary-hover)]"
        >
          Começar
        </button>
        <Link
          href="/games"
          className="rounded-lg border border-[var(--nr-border)] px-5 py-2.5 text-sm font-medium text-[var(--nr-text)] hover:bg-[var(--nr-surface-alt)]"
        >
          Voltar aos games
        </Link>
      </div>
    </div>
  );
}

export function GameExitBar({ title }: { title: string }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-[var(--nr-text)]">{title}</h1>
      <Link
        href="/games"
        className="rounded-lg border border-[var(--nr-border)] px-3 py-1.5 text-sm font-medium text-[var(--nr-text)] hover:bg-[var(--nr-surface-alt)]"
      >
        Sair do jogo
      </Link>
    </div>
  );
}
