"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";
import { getPersonalPlan, savePersonalPlan, listTrustedContacts } from "@/lib/services/plan";
import type { PersonalPlan } from "@/lib/schemas/plan";

const SECTIONS: { key: keyof PersonalPlan; label: string }[] = [
  { key: "comoPercebendoSobrecarga", label: "Como percebo o início da sobrecarga" },
  { key: "estimulosQueAfetam", label: "Estímulos que costumam me afetar" },
  { key: "oQueCostumaAjudar", label: "O que costuma ajudar" },
  { key: "oQueNaoDeveSerFeito", label: "O que não deve ser feito comigo" },
  { key: "comoPreferoComunicar", label: "Como prefiro me comunicar" },
  { key: "quemPodeSerAvisado", label: "Quem pode ser avisado" },
  { key: "ondeConsigoMeRegular", label: "Onde consigo me regular" },
  { key: "comoApoiarEmCriseMeltdownShutdown", label: "Como me apoiar durante meltdown ou shutdown" },
  { key: "oQuePrecisoDepois", label: "O que preciso depois da sobrecarga" },
  { key: "quandoProcurarAjudaProfissional", label: "Quando procurar ajuda profissional" },
];

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-[var(--nr-text)]">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="mt-1 w-full rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface)] px-3 py-2 text-sm text-[var(--nr-text)]"
      />
    </div>
  );
}

export default function PlanoPessoalPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center sm:px-6">
        <p className="text-[var(--nr-text)]">Entre para acessar seu Plano Pessoal.</p>
        <Link href="/entrar" className="mt-4 inline-block text-[var(--nr-accent-primary)] hover:underline">
          Entrar
        </Link>
      </div>
    );
  }

  return <PlanoPessoalForm userId={user.id} />;
}

function PlanoPessoalForm({ userId }: { userId: string }) {
  const [plan, setPlan] = useState<PersonalPlan>(() => getPersonalPlan(userId));
  const [cardMode, setCardMode] = useState(false);
  const [saved, setSaved] = useState(false);
  const contacts = listTrustedContacts(userId);

  function setField(key: keyof PersonalPlan, value: string) {
    setPlan((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const updated = savePersonalPlan(userId, plan);
    setPlan(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function toggleShare(contactName: string) {
    const shared = plan.compartilhadoCom.includes(contactName)
      ? plan.compartilhadoCom.filter((c) => c !== contactName)
      : [...plan.compartilhadoCom, contactName];
    const updated = savePersonalPlan(userId, { compartilhadoCom: shared });
    setPlan(updated);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 print:max-w-full">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <h1 className="text-2xl font-bold text-[var(--nr-text)]">Plano Pessoal de Autorregulação</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setCardMode((v) => !v)}
            className="rounded-lg border border-[var(--nr-border)] px-3 py-2 text-sm font-medium text-[var(--nr-text)] hover:bg-[var(--nr-surface-alt)]"
          >
            {cardMode ? "Ver plano completo" : "Ver cartão resumido"}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg border border-[var(--nr-border)] px-3 py-2 text-sm font-medium text-[var(--nr-text)] hover:bg-[var(--nr-surface-alt)]"
          >
            Imprimir / exportar em PDF
          </button>
        </div>
      </div>

      {cardMode ? (
        <div className="mt-6 rounded-2xl border-2 border-[var(--nr-accent-primary)] bg-[var(--nr-surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--nr-text)]">Cartão resumido — para celular</h2>
          <dl className="mt-4 flex flex-col gap-3 text-sm">
            <div>
              <dt className="font-medium text-[var(--nr-text)]">O que costuma ajudar</dt>
              <dd className="text-[var(--nr-text-muted)]">{plan.oQueCostumaAjudar || "Não preenchido."}</dd>
            </div>
            <div>
              <dt className="font-medium text-[var(--nr-text)]">O que não deve ser feito comigo</dt>
              <dd className="text-[var(--nr-text-muted)]">{plan.oQueNaoDeveSerFeito || "Não preenchido."}</dd>
            </div>
            <div>
              <dt className="font-medium text-[var(--nr-text)]">Como me apoiar em crise</dt>
              <dd className="text-[var(--nr-text-muted)]">{plan.comoApoiarEmCriseMeltdownShutdown || "Não preenchido."}</dd>
            </div>
            <div>
              <dt className="font-medium text-[var(--nr-text)]">Quem pode ser avisado</dt>
              <dd className="text-[var(--nr-text-muted)]">{plan.quemPodeSerAvisado || "Não preenchido."}</dd>
            </div>
          </dl>
        </div>
      ) : (
        <form onSubmit={handleSave} className="mt-6 flex flex-col gap-4 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6 print:border-none">
          {SECTIONS.map((s) => (
            <TextArea
              key={s.key}
              label={s.label}
              value={plan[s.key] as string}
              onChange={(v) => setField(s.key, v)}
            />
          ))}
          <div className="flex items-center gap-3 print:hidden">
            <button
              type="submit"
              className="rounded-lg bg-[var(--nr-accent-primary)] px-4 py-2.5 text-base font-semibold text-[var(--nr-text-on-accent)] hover:bg-[var(--nr-accent-primary-hover)]"
            >
              Salvar plano
            </button>
            {saved && (
              <span role="status" className="text-sm text-[var(--nr-success)]">
                Salvo.
              </span>
            )}
          </div>
        </form>
      )}

      <div className="mt-6 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6 print:hidden">
        <h2 className="text-lg font-semibold text-[var(--nr-text)]">Compartilhamento seletivo</h2>
        <p className="mt-1 text-sm text-[var(--nr-text-muted)]">
          Marque quais contatos de confiança podem ver este plano. Você pode revogar a qualquer
          momento. Em modo demonstrativo, isto registra sua preferência localmente — a entrega real
          a outra conta depende de um backend conectado (ver <code>.env.example</code>).
        </p>
        {contacts.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--nr-text-muted)]">
            Você ainda não cadastrou contatos de confiança.{" "}
            <Link href="/meu-espaco/contatos-de-confianca" className="text-[var(--nr-accent-primary)] hover:underline">
              Cadastrar agora
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {contacts.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-2 text-sm text-[var(--nr-text)]">
                <span>{c.nome}</span>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={plan.compartilhadoCom.includes(c.nome)}
                    onChange={() => toggleShare(c.nome)}
                    className="h-4 w-4 accent-[var(--nr-accent-primary)]"
                  />
                  Compartilhar
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link href="/meu-espaco" className="mt-6 inline-block text-sm text-[var(--nr-accent-primary)] hover:underline print:hidden">
        Voltar para Meu Espaço
      </Link>
    </div>
  );
}
