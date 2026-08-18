"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";
import { listBodyMonitorEntries, removeBodyMonitorEntry } from "@/lib/services/body-monitor";
import {
  BODY_REGION_LABELS,
  BODY_SENSATION_LABELS,
  EXTERNAL_STIMULUS_LABELS,
} from "@/lib/schemas/body-monitor-labels";
import { NewEntryForm } from "./NewEntryForm";

export default function CorpoMonitorPage() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 print:max-w-full">
      <h1 className="text-2xl font-bold text-[var(--nr-text)]">Corpo-Monitor</h1>
      <p className="mt-2 text-sm text-[var(--nr-text-muted)]">
        O corpo-monitor é uma relação de mão dupla: ao mesmo tempo em que você monitora o ambiente
        ao redor, seu corpo é atravessado por ele — luzes, alarmes, ruídos, interrupções — e
        responde com sinais próprios: tensão, fadiga, necessidade de pausa. Sinais corporais são
        dados legítimos da sua experiência, não indicadores de incompetência.
      </p>

      {!user ? (
        <div className="mt-6 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6 text-center">
          <p className="text-[var(--nr-text)]">Entre para registrar e acompanhar seu Corpo-Monitor.</p>
          <Link href="/entrar" className="mt-3 inline-block text-[var(--nr-accent-primary)] hover:underline">
            Entrar
          </Link>
        </div>
      ) : (
        <CorpoMonitorContent userId={user.id} />
      )}
    </div>
  );
}

function CorpoMonitorContent({ userId }: { userId: string }) {
  const [entries, setEntries] = useState(() => listBodyMonitorEntries(userId));

  function refresh() {
    setEntries(listBodyMonitorEntries(userId));
  }

  function handleRemove(id: string) {
    removeBodyMonitorEntry(id);
    refresh();
  }

  const byAmbiente = new Map<string, typeof entries>();
  for (const entry of entries) {
    const key = entry.ambiente?.trim() || "Sem ambiente informado";
    byAmbiente.set(key, [...(byAmbiente.get(key) ?? []), entry]);
  }

  return (
    <div className="mt-6 flex flex-col gap-8">
      <div className="print:hidden">
        <NewEntryForm userId={userId} onSaved={refresh} />
      </div>

      <section aria-labelledby="linha-do-tempo">
        <div className="flex items-center justify-between print:hidden">
          <h2 id="linha-do-tempo" className="text-lg font-semibold text-[var(--nr-text)]">
            Linha do tempo
          </h2>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg border border-[var(--nr-border)] px-3 py-1.5 text-sm font-medium text-[var(--nr-text)] hover:bg-[var(--nr-surface-alt)]"
          >
            Imprimir / exportar relatório
          </button>
        </div>

        {entries.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--nr-text-muted)]">Nenhum registro ainda.</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-3">
            {entries.map((entry) => (
              <li key={entry.id} className="rounded-xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-[var(--nr-text)]">
                      {new Date(entry.createdAt).toLocaleString("pt-BR")}
                      {entry.ambiente && ` · ${entry.ambiente}`}
                    </p>
                    {entry.marks.length > 0 ? (
                      <ul className="mt-1 text-sm text-[var(--nr-text-muted)]">
                        {entry.marks.map((m) => (
                          <li key={m.region}>
                            {BODY_REGION_LABELS[m.region]}:{" "}
                            {m.sensations.map((s) => BODY_SENSATION_LABELS[s]).join(", ")} (intensidade{" "}
                            {m.intensity})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-1 text-sm text-[var(--nr-text-muted)]">Nenhuma região marcada.</p>
                    )}
                    {entry.externalStimuli.length > 0 && (
                      <p className="mt-1 text-sm text-[var(--nr-text-muted)]">
                        Estímulos: {entry.externalStimuli.map((s) => EXTERNAL_STIMULUS_LABELS[s]).join(", ")}
                      </p>
                    )}
                    {entry.notas && <p className="mt-1 text-sm text-[var(--nr-text-muted)]">Notas: {entry.notas}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(entry.id)}
                    className="shrink-0 rounded-lg border border-[var(--nr-border)] px-2 py-1 text-xs text-[var(--nr-danger)] hover:bg-[var(--nr-surface-alt)] print:hidden"
                  >
                    Remover
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {byAmbiente.size > 1 && (
        <section aria-labelledby="comparacao-ambientes" className="print:hidden">
          <h2 id="comparacao-ambientes" className="text-lg font-semibold text-[var(--nr-text)]">
            Comparação entre ambientes
          </h2>
          <p className="mt-1 text-sm text-[var(--nr-text-muted)]">
            Médias descritivas por ambiente informado. Isto não indica causalidade — apenas o que
            você registrou em cada contexto.
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-max border-collapse text-sm">
              <thead>
                <tr>
                  <th scope="col" className="border-b border-[var(--nr-border)] px-2 py-1 text-left">Ambiente</th>
                  <th scope="col" className="border-b border-[var(--nr-border)] px-2 py-1 text-left">Registros</th>
                  <th scope="col" className="border-b border-[var(--nr-border)] px-2 py-1 text-left">Média de regiões marcadas</th>
                  <th scope="col" className="border-b border-[var(--nr-border)] px-2 py-1 text-left">Média de estímulos externos</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(byAmbiente.entries()).map(([ambiente, group]) => (
                  <tr key={ambiente}>
                    <th scope="row" className="px-2 py-1 text-left font-normal text-[var(--nr-text)]">{ambiente}</th>
                    <td className="px-2 py-1">{group.length}</td>
                    <td className="px-2 py-1">
                      {(group.reduce((sum, e) => sum + e.marks.length, 0) / group.length).toFixed(1)}
                    </td>
                    <td className="px-2 py-1">
                      {(group.reduce((sum, e) => sum + e.externalStimuli.length, 0) / group.length).toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <Link href="/meu-espaco" className="text-sm text-[var(--nr-accent-primary)] hover:underline print:hidden">
        Voltar para Meu Espaço
      </Link>
    </div>
  );
}
