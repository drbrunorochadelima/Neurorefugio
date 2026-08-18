"use client";

import { useState } from "react";
import Link from "next/link";
import { ResourceFeedbackWidget } from "@/components/ResourceFeedback";

const ATERRAMENTO_STEPS = [
  "Note 5 coisas que você consegue perceber ao redor — o que fizer sentido: visual, som, textura, cheiro.",
  "Note 4 coisas que você consegue tocar ou sentir no seu corpo agora.",
  "Note 3 sons que você consegue perceber, próximos ou distantes.",
  "Note 2 coisas que você consegue cheirar ou lembrar de um cheiro.",
  "Note 1 coisa boa sobre este exato momento, se houver.",
];

const RELAXAMENTO_STEPS = [
  "Ombros — se fizer sentido, tensione levemente por alguns segundos e depois solte.",
  "Mãos — feche e abra as mãos no seu ritmo.",
  "Rosto — franzir e relaxar a testa, se for confortável.",
  "Pernas — pressionar os pés no chão e depois relaxar.",
  "Respiração — perceber, sem precisar mudar nada.",
];

function Stepper({ steps }: { steps: string[] }) {
  const [index, setIndex] = useState(0);
  return (
    <div className="rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6">
      <p className="text-sm text-[var(--nr-text-muted)]">
        Passo {index + 1} de {steps.length}. Pule qualquer etapa que não fizer sentido para você.
      </p>
      <p className="mt-3 text-lg text-[var(--nr-text)]">{steps[index]}</p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="rounded-lg border border-[var(--nr-border)] px-4 py-2 text-sm font-medium text-[var(--nr-text)] disabled:opacity-40"
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={() => setIndex((i) => Math.min(steps.length - 1, i + 1))}
          disabled={index === steps.length - 1}
          className="rounded-lg border border-[var(--nr-border)] px-4 py-2 text-sm font-medium text-[var(--nr-text)] disabled:opacity-40"
        >
          Próximo
        </button>
        <button
          type="button"
          onClick={() => setIndex(0)}
          className="rounded-lg border border-[var(--nr-border)] px-4 py-2 text-sm font-medium text-[var(--nr-text)]"
        >
          Recomeçar
        </button>
      </div>
    </div>
  );
}

export default function AterramentoPage() {
  const [tab, setTab] = useState<"aterramento" | "relaxamento">("aterramento");

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-[var(--nr-text)]">Aterramento e relaxamento muscular</h1>
      <p className="mt-2 text-sm text-[var(--nr-text-muted)]">
        Exercícios adaptáveis, no seu ritmo. Nenhum passo é obrigatório.
      </p>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => setTab("aterramento")}
          aria-pressed={tab === "aterramento"}
          className={`rounded-lg border px-3 py-1.5 text-sm ${tab === "aterramento" ? "border-[var(--nr-accent-primary)] font-semibold text-[var(--nr-accent-primary)]" : "border-[var(--nr-border)] text-[var(--nr-text)]"}`}
        >
          Aterramento
        </button>
        <button
          type="button"
          onClick={() => setTab("relaxamento")}
          aria-pressed={tab === "relaxamento"}
          className={`rounded-lg border px-3 py-1.5 text-sm ${tab === "relaxamento" ? "border-[var(--nr-accent-primary)] font-semibold text-[var(--nr-accent-primary)]" : "border-[var(--nr-border)] text-[var(--nr-text)]"}`}
        >
          Relaxamento muscular
        </button>
      </div>

      <div className="mt-4">
        <Stepper steps={tab === "aterramento" ? ATERRAMENTO_STEPS : RELAXAMENTO_STEPS} />
      </div>

      <ResourceFeedbackWidget resourceId="aterramento" />

      <Link href="/quero-me-regular" className="mt-6 inline-block text-sm text-[var(--nr-accent-primary)] underline">
        Voltar para Quero me regular
      </Link>
    </div>
  );
}
