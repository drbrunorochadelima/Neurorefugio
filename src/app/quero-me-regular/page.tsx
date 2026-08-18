"use client";

import { useState } from "react";
import Link from "next/link";

interface Resource {
  href: string;
  title: string;
  description: string;
  supportTypes: string[];
}

const RESOURCES: Resource[] = [
  {
    href: "/quero-me-regular/pausa",
    title: "Pausa, tela silenciosa e contagem visual",
    description: "Temporizador de pausa, tela escura e silenciosa, contagem visual sem exigir resposta.",
    supportTypes: ["silencio", "escurecer-tela", "organizacao"],
  },
  {
    href: "/quero-me-regular/respiracao",
    title: "Respiração opcional",
    description: "Ritmo visual de respiração, sem retenção obrigatória.",
    supportTypes: ["respiracao"],
  },
  {
    href: "/quero-me-regular/aterramento",
    title: "Aterramento e relaxamento muscular",
    description: "Exercícios adaptáveis de aterramento e relaxamento progressivo.",
    supportTypes: ["movimento", "organizacao"],
  },
  {
    href: "/quero-me-regular/sons",
    title: "Sons contínuos",
    description: "Chuva, ondas, ventilador e ruído marrom — gerados no navegador, sempre opcionais.",
    supportTypes: ["som-continuo"],
  },
  {
    href: "/quero-me-regular/stimming",
    title: "Stimming digital",
    description: "Um espaço tátil e visual para se movimentar sem julgamento.",
    supportTypes: ["movimento", "distracao"],
  },
  {
    href: "/quero-me-regular/desenho-livre",
    title: "Desenho livre",
    description: "Uma tela em branco, sem avaliação.",
    supportTypes: ["distracao"],
  },
  {
    href: "/quero-me-regular/cartoes-de-comunicacao",
    title: "Cartões de comunicação",
    description: "Frases prontas para mostrar quando falar for difícil.",
    supportTypes: ["comunicacao"],
  },
  {
    href: "/quero-me-regular/checklist-corporal",
    title: "Checklist corporal",
    description: "Uma checagem rápida de dor, fome, sede, sono e temperatura.",
    supportTypes: ["organizacao"],
  },
  {
    href: "/quero-me-regular/pos-sobrecarga",
    title: "Orientação pós-sobrecarga",
    description: "O que costuma ajudar depois de um momento difícil.",
    supportTypes: ["organizacao"],
  },
  {
    href: "/quero-me-regular/meditacoes",
    title: "Meditações",
    description: "1, 3, 5, 10 ou 20 minutos — em texto, com narração opcional, imagem ou silêncio.",
    supportTypes: ["silencio", "respiracao", "distracao"],
  },
];

const SUPPORT_TYPES: { value: string; label: string }[] = [
  { value: "silencio", label: "Silêncio" },
  { value: "escurecer-tela", label: "Escurecer tela" },
  { value: "movimento", label: "Movimento" },
  { value: "organizacao", label: "Organização" },
  { value: "respiracao", label: "Respiração" },
  { value: "som-continuo", label: "Som contínuo" },
  { value: "distracao", label: "Distração" },
  { value: "comunicacao", label: "Comunicação" },
];

export default function QueroMeRegularPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const visibleResources = selectedType
    ? RESOURCES.filter((r) => r.supportTypes.includes(selectedType))
    : RESOURCES;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-[var(--nr-text)]">Quero me regular</h1>
      <p className="mt-2 max-w-2xl text-[var(--nr-text-muted)]">
        Nenhum recurso aqui exige fechar os olhos, ficar imóvel, interromper stims seguros, manter
        contato visual, controlar rigidamente a respiração ou continuar em algo desconfortável. Você
        pode sair a qualquer momento.
      </p>

      <h2 className="mt-8 text-lg font-semibold text-[var(--nr-text)]">Que tipo de apoio parece possível agora?</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {SUPPORT_TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setSelectedType((prev) => (prev === t.value ? null : t.value))}
            aria-pressed={selectedType === t.value}
            className={`rounded-lg border px-3 py-1.5 text-sm ${
              selectedType === t.value
                ? "border-[var(--nr-accent-primary)] bg-[var(--nr-surface-alt)] font-semibold text-[var(--nr-accent-primary)]"
                : "border-[var(--nr-border)] text-[var(--nr-text)] hover:bg-[var(--nr-surface-alt)]"
            }`}
          >
            {t.label}
          </button>
        ))}
        <a
          href="#estar-aqui"
          className="rounded-lg border border-[var(--nr-border)] px-3 py-1.5 text-sm text-[var(--nr-text)] hover:bg-[var(--nr-surface-alt)]"
        >
          Não sei
        </a>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {visibleResources.map((r) => (
          <Link
            key={r.href}
            href={r.href}
            className="rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-5 hover:border-[var(--nr-accent-primary)]"
          >
            <h3 className="font-semibold text-[var(--nr-text)]">{r.title}</h3>
            <p className="mt-1 text-sm text-[var(--nr-text-muted)]">{r.description}</p>
          </Link>
        ))}
      </div>

      <section
        id="estar-aqui"
        aria-labelledby="estar-aqui-titulo"
        className="mt-10 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface-alt)] p-8 text-center"
      >
        <h2 id="estar-aqui-titulo" className="text-lg font-semibold text-[var(--nr-text)]">
          Quero apenas ficar aqui
        </h2>
        <p className="mx-auto mt-2 max-w-md text-[var(--nr-text-muted)]">
          Não é preciso escolher nada agora. Esta página pode ficar aberta pelo tempo que for útil,
          sem exigir nenhuma resposta.
        </p>
      </section>
    </div>
  );
}
