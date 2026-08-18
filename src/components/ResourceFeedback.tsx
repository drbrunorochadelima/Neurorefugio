"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { recordResourceFeedback } from "@/lib/services/plan";
import type { ResourceFeedback } from "@/lib/schemas/plan";

const OPTIONS: { value: ResourceFeedback["avaliacao"]; label: string }[] = [
  { value: "ajudou", label: "Ajudou" },
  { value: "ajudou_parcialmente", label: "Ajudou parcialmente" },
  { value: "nao_ajudou", label: "Não ajudou" },
  { value: "piorou", label: "Piorou" },
  { value: "nao_avaliar", label: "Não desejo avaliar" },
];

export function ResourceFeedbackWidget({ resourceId }: { resourceId: string }) {
  const { user } = useAuth();
  const [selected, setSelected] = useState<ResourceFeedback["avaliacao"] | null>(null);

  if (!user) return null;

  function handleSelect(value: ResourceFeedback["avaliacao"]) {
    if (!user) return;
    recordResourceFeedback(user.id, { recursoId: resourceId, avaliacao: value });
    setSelected(value);
  }

  return (
    <div className="mt-6 rounded-xl border border-[var(--nr-border)] bg-[var(--nr-surface-alt)] p-4">
      <p className="text-sm font-medium text-[var(--nr-text)]">Este recurso ajudou você agora?</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleSelect(opt.value)}
            aria-pressed={selected === opt.value}
            className={`rounded-lg border px-3 py-1.5 text-sm ${
              selected === opt.value
                ? "border-[var(--nr-accent-primary)] bg-[var(--nr-surface)] font-semibold text-[var(--nr-accent-primary)]"
                : "border-[var(--nr-border)] text-[var(--nr-text)]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {selected && (
        <p role="status" className="mt-2 text-sm text-[var(--nr-success)]">
          Obrigado por avaliar.
        </p>
      )}
    </div>
  );
}
