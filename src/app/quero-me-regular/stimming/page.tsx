"use client";

import { useState } from "react";
import Link from "next/link";
import { useSensory } from "@/lib/sensory/context";
import { ResourceFeedbackWidget } from "@/components/ResourceFeedback";

const GRID_SIZE = 48;

function BubbleGrid() {
  const [popped, setPopped] = useState<boolean[]>(() => new Array(GRID_SIZE).fill(false));

  function toggle(index: number) {
    setPopped((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  }

  function reset() {
    setPopped(new Array(GRID_SIZE).fill(false));
  }

  return (
    <div>
      <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
        {popped.map((isPopped, i) => (
          <button
            key={i}
            type="button"
            onClick={() => toggle(i)}
            aria-label={isPopped ? "Bolha estourada, toque para reencher" : "Bolha cheia, toque para estourar"}
            aria-pressed={isPopped}
            className={`aspect-square rounded-full border transition-transform ${
              isPopped
                ? "scale-90 border-[var(--nr-border)] bg-[var(--nr-surface-alt)]"
                : "border-[var(--nr-accent-secondary)] bg-[var(--nr-accent-tertiary)]"
            }`}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded-lg border border-[var(--nr-border)] px-4 py-2 text-sm font-medium text-[var(--nr-text)]"
      >
        Reencher todas
      </button>
    </div>
  );
}

function SlideFidget() {
  const [value, setValue] = useState(50);
  return (
    <div>
      <label htmlFor="slide-fidget" className="text-sm text-[var(--nr-text-muted)]">
        Deslize para frente e para trás no seu ritmo.
      </label>
      <input
        id="slide-fidget"
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="mt-2 w-full accent-[var(--nr-accent-primary)]"
      />
    </div>
  );
}

export default function StimmingPage() {
  const { prefs } = useSensory();
  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-[var(--nr-text)]">Stimming digital</h1>
      <p className="mt-2 text-sm text-[var(--nr-text-muted)]">
        Um espaço tátil e visual para se movimentar, sem certo ou errado.
        {prefs.motion !== "full" && " As transições estão reduzidas conforme sua preferência."}
      </p>

      <div className="mt-6 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6">
        <BubbleGrid />
      </div>

      <div className="mt-4 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6">
        <SlideFidget />
      </div>

      <ResourceFeedbackWidget resourceId="stimming" />

      <Link href="/quero-me-regular" className="mt-6 inline-block text-sm text-[var(--nr-accent-primary)] hover:underline">
        Voltar para Quero me regular
      </Link>
    </div>
  );
}
