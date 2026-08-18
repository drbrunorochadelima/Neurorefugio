"use client";

import { useState } from "react";
import Link from "next/link";
import { ResourceFeedbackWidget } from "@/components/ResourceFeedback";

const ITEMS = [
  "Sinto dor em alguma parte do corpo?",
  "Estou com fome?",
  "Estou com sede?",
  "Preciso ir ao banheiro?",
  "A temperatura está confortável para mim?",
  "Estou cansado(a) ou com sono?",
  "Estou em uma posição confortável?",
  "Preciso me movimentar?",
];

export default function ChecklistCorporalPage() {
  const [checked, setChecked] = useState<boolean[]>(() => new Array(ITEMS.length).fill(false));

  function toggle(i: number) {
    setChecked((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-[var(--nr-text)]">Checklist corporal</h1>
      <p className="mt-2 text-sm text-[var(--nr-text-muted)]">
        Uma checagem rápida. Marque o que quiser lembrar de resolver — nada aqui é registrado
        automaticamente em outro lugar.
      </p>

      <ul className="mt-6 flex flex-col gap-2 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6">
        {ITEMS.map((item, i) => (
          <li key={item}>
            <label className="flex items-center gap-3 text-[var(--nr-text)]">
              <input
                type="checkbox"
                checked={checked[i]}
                onChange={() => toggle(i)}
                className="h-4 w-4 accent-[var(--nr-accent-primary)]"
              />
              {item}
            </label>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-sm text-[var(--nr-text-muted)]">
        Quer registrar isto no seu histórico?{" "}
        <Link href="/meu-espaco/check-in" className="text-[var(--nr-accent-primary)] hover:underline">
          Fazer um check-in completo
        </Link>
        .
      </p>

      <ResourceFeedbackWidget resourceId="checklist-corporal" />

      <Link href="/quero-me-regular" className="mt-6 inline-block text-sm text-[var(--nr-accent-primary)] hover:underline">
        Voltar para Quero me regular
      </Link>
    </div>
  );
}
