"use client";

import { useEffect, useState } from "react";
import { SENSORY_MAP_AREAS, STIMULUS_NECESSITY_LABELS } from "@/lib/institutional/sensory-map-data";
import {
  CHECKLIST_TOPICS,
  CHECKLIST_TOPIC_LABELS,
  type ChecklistItem,
  type ChecklistTopic,
} from "@/lib/schemas/institutional";
import { addChecklistItem, listChecklistItems, removeChecklistItem } from "@/lib/services/institutional";

function SensoryMapSection() {
  const [selectedId, setSelectedId] = useState(SENSORY_MAP_AREAS[0].id);
  const area = SENSORY_MAP_AREAS.find((a) => a.id === selectedId)!;

  return (
    <section aria-labelledby="mapa-sensorial" className="print:hidden">
      <h2 id="mapa-sensorial" className="text-lg font-semibold text-[var(--nr-text)]">
        Mapa sensorial da UTI
      </h2>
      <p className="mt-1 text-sm text-[var(--nr-text-muted)]">
        Selecione uma área para ver estímulos, barreiras, impactos possíveis e adaptações.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {SENSORY_MAP_AREAS.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setSelectedId(a.id)}
            aria-pressed={selectedId === a.id}
            className={`rounded-lg border px-3 py-1.5 text-sm ${selectedId === a.id ? "border-[var(--nr-accent-primary)] font-semibold text-[var(--nr-accent-primary)]" : "border-[var(--nr-border)] text-[var(--nr-text)]"}`}
          >
            {a.titulo}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6">
        <h3 className="font-semibold text-[var(--nr-text)]">{area.titulo}</h3>

        <p className="mt-3 text-sm font-medium text-[var(--nr-text)]">Estímulos</p>
        <ul className="mt-1 flex flex-col gap-1 text-sm text-[var(--nr-text-muted)]">
          {area.estimulos.map((e) => (
            <li key={e.descricao}>
              {e.descricao} —{" "}
              <span className="text-[var(--nr-text)]">{STIMULUS_NECESSITY_LABELS[e.necessidade]}</span>
            </li>
          ))}
        </ul>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-[var(--nr-text)]">Barreiras</p>
            <ul className="mt-1 list-inside list-disc text-sm text-[var(--nr-text-muted)]">
              {area.barreiras.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--nr-text)]">Demandas cognitivas</p>
            <ul className="mt-1 list-inside list-disc text-sm text-[var(--nr-text-muted)]">
              {area.demandasCognitivas.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--nr-text)]">Impactos possíveis</p>
            <ul className="mt-1 list-inside list-disc text-sm text-[var(--nr-text-muted)]">
              {area.impactosPossiveis.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--nr-text)]">Estratégias de redução de danos</p>
            <ul className="mt-1 list-inside list-disc text-sm text-[var(--nr-text-muted)]">
              {area.estrategiasReducaoDanos.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-3 text-sm font-medium text-[var(--nr-text)]">Adaptações institucionais possíveis</p>
        <ul className="mt-1 list-inside list-disc text-sm text-[var(--nr-text-muted)]">
          {area.adaptacoesInstitucionais.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ChecklistSection() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [unidade, setUnidade] = useState("");
  const [topico, setTopico] = useState<ChecklistTopic>("iluminacao");
  const [status, setStatus] = useState<ChecklistItem["status"]>("parcial");
  const [prioridade, setPrioridade] = useState<ChecklistItem["prioridade"]>("media");
  const [barreira, setBarreira] = useState("");
  const [recomendacao, setRecomendacao] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [prazo, setPrazo] = useState("");
  const [acompanhamento, setAcompanhamento] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => setItems(listChecklistItems()), 0);
    return () => clearTimeout(timeout);
  }, []);

  function refresh() {
    setItems(listChecklistItems());
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!unidade.trim()) return;
    addChecklistItem({ unidade: unidade.trim(), topico, status, prioridade, barreira, recomendacao, responsavel, prazo, acompanhamento });
    setBarreira("");
    setRecomendacao("");
    setResponsavel("");
    setPrazo("");
    setAcompanhamento("");
    refresh();
  }

  function handleRemove(id: string) {
    removeChecklistItem(id);
    refresh();
  }

  return (
    <section aria-labelledby="checklist-institucional" className="mt-10">
      <div className="flex items-center justify-between print:hidden">
        <h2 id="checklist-institucional" className="text-lg font-semibold text-[var(--nr-text)]">
          Checklist institucional
        </h2>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-lg border border-[var(--nr-border)] px-3 py-1.5 text-sm font-medium text-[var(--nr-text)] hover:bg-[var(--nr-surface-alt)]"
        >
          Imprimir / exportar relatório
        </button>
      </div>
      <p className="mt-1 text-sm text-[var(--nr-text-muted)] print:hidden">
        Este checklist avalia o ambiente e a instituição — nunca o desempenho da pessoa autista.
      </p>

      <form onSubmit={handleAdd} className="mt-4 flex flex-col gap-3 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6 print:hidden">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="unidade" className="text-sm font-medium text-[var(--nr-text)]">
              Unidade / setor
            </label>
            <input id="unidade" value={unidade} onChange={(e) => setUnidade(e.target.value)} className="mt-1 w-full rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface)] px-3 py-2 text-sm text-[var(--nr-text)]" />
          </div>
          <div>
            <label htmlFor="topico" className="text-sm font-medium text-[var(--nr-text)]">
              Tópico
            </label>
            <select id="topico" value={topico} onChange={(e) => setTopico(e.target.value as ChecklistTopic)} className="mt-1 w-full rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface)] px-3 py-2 text-sm text-[var(--nr-text)]">
              {CHECKLIST_TOPICS.map((t) => (
                <option key={t} value={t}>
                  {CHECKLIST_TOPIC_LABELS[t]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="status" className="text-sm font-medium text-[var(--nr-text)]">
              Situação atual
            </label>
            <select id="status" value={status} onChange={(e) => setStatus(e.target.value as ChecklistItem["status"])} className="mt-1 w-full rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface)] px-3 py-2 text-sm text-[var(--nr-text)]">
              <option value="atende">Atende</option>
              <option value="parcial">Atende parcialmente</option>
              <option value="nao_atende">Não atende</option>
            </select>
          </div>
          <div>
            <label htmlFor="prioridade" className="text-sm font-medium text-[var(--nr-text)]">
              Prioridade
            </label>
            <select id="prioridade" value={prioridade} onChange={(e) => setPrioridade(e.target.value as ChecklistItem["prioridade"])} className="mt-1 w-full rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface)] px-3 py-2 text-sm text-[var(--nr-text)]">
              <option value="alta">Alta</option>
              <option value="media">Média</option>
              <option value="baixa">Baixa</option>
            </select>
          </div>
        </div>

        <label htmlFor="barreira" className="text-sm font-medium text-[var(--nr-text)]">
          Barreira identificada
        </label>
        <textarea id="barreira" value={barreira} onChange={(e) => setBarreira(e.target.value)} rows={2} className="w-full rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface)] px-3 py-2 text-sm text-[var(--nr-text)]" />

        <label htmlFor="recomendacao" className="text-sm font-medium text-[var(--nr-text)]">
          Recomendação
        </label>
        <textarea id="recomendacao" value={recomendacao} onChange={(e) => setRecomendacao(e.target.value)} rows={2} className="w-full rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface)] px-3 py-2 text-sm text-[var(--nr-text)]" />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label htmlFor="responsavel" className="text-sm font-medium text-[var(--nr-text)]">
              Responsável
            </label>
            <input id="responsavel" value={responsavel} onChange={(e) => setResponsavel(e.target.value)} className="mt-1 w-full rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface)] px-3 py-2 text-sm text-[var(--nr-text)]" />
          </div>
          <div>
            <label htmlFor="prazo" className="text-sm font-medium text-[var(--nr-text)]">
              Prazo
            </label>
            <input id="prazo" type="date" value={prazo} onChange={(e) => setPrazo(e.target.value)} className="mt-1 w-full rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface)] px-3 py-2 text-sm text-[var(--nr-text)]" />
          </div>
          <div>
            <label htmlFor="acompanhamento" className="text-sm font-medium text-[var(--nr-text)]">
              Acompanhamento
            </label>
            <input id="acompanhamento" value={acompanhamento} onChange={(e) => setAcompanhamento(e.target.value)} className="mt-1 w-full rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface)] px-3 py-2 text-sm text-[var(--nr-text)]" />
          </div>
        </div>

        <button type="submit" className="self-start rounded-lg bg-[var(--nr-accent-primary)] px-4 py-2 text-sm font-semibold text-[var(--nr-text-on-accent)]">
          Adicionar item
        </button>
      </form>

      {items.length > 0 ? (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-max border-collapse text-sm">
            <thead>
              <tr>
                {["Unidade", "Tópico", "Situação", "Prioridade", "Recomendação", "Responsável", "Prazo", ""].map((h) => (
                  <th key={h} scope="col" className="border-b border-[var(--nr-border)] px-2 py-1 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-2 py-1">{item.unidade}</td>
                  <td className="px-2 py-1">{CHECKLIST_TOPIC_LABELS[item.topico]}</td>
                  <td className="px-2 py-1">{item.status === "atende" ? "Atende" : item.status === "parcial" ? "Parcial" : "Não atende"}</td>
                  <td className="px-2 py-1 capitalize">{item.prioridade}</td>
                  <td className="px-2 py-1">{item.recomendacao}</td>
                  <td className="px-2 py-1">{item.responsavel}</td>
                  <td className="px-2 py-1">{item.prazo}</td>
                  <td className="px-2 py-1 print:hidden">
                    <button type="button" onClick={() => handleRemove(item.id)} className="text-xs text-[var(--nr-danger)]">
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-4 text-sm text-[var(--nr-text-muted)]">Nenhum item registrado ainda.</p>
      )}
    </section>
  );
}

export default function InstituicoesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 print:max-w-full">
      <h1 className="text-2xl font-bold text-[var(--nr-text)]">Área institucional</h1>
      <p className="mt-2 max-w-2xl text-[var(--nr-text-muted)] print:hidden">
        Recursos para gestores e equipes avaliarem barreiras sensoriais, comunicacionais e
        organizacionais em unidades de terapia intensiva.
      </p>

      <div className="mt-6">
        <SensoryMapSection />
      </div>
      <ChecklistSection />
    </div>
  );
}
