"use client";

import { useState } from "react";
import Link from "next/link";
import { addQuickCheckIn, listCheckIns, synthesizeCheckIn } from "@/lib/services/checkins";
import { listBodyMonitorEntries } from "@/lib/services/body-monitor";
import { getPersonalPlan, listCommunicationCards, listTrustedContacts } from "@/lib/services/plan";
import { listHyperfocuses } from "@/lib/services/hyperfocus";
import { listGameProgress } from "@/lib/services/game-progress";
import { listJournalEntries, addJournalEntry, listRoutineItems, addRoutineItem, toggleRoutineItem } from "@/lib/services/journal";
import { AccessibleLineChart } from "@/components/charts/AccessibleLineChart";

const scaleLabels = ["0", "1", "2", "3", "4", "5"];

function ScaleField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <label className="font-medium text-[var(--nr-text)]">{label}</label>
        <span className="text-[var(--nr-text-muted)]">{scaleLabels[value]}</span>
      </div>
      <input
        type="range"
        min={0}
        max={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={`${scaleLabels[value]} de 5`}
        className="mt-1 w-full accent-[var(--nr-accent-primary)]"
      />
    </div>
  );
}

export function CheckInBlock({ userId }: { userId: string }) {
  const [humor, setHumor] = useState(3);
  const [energia, setEnergia] = useState(3);
  const [ansiedade, setAnsiedade] = useState(2);
  const [sobrecarga, setSobrecarga] = useState(2);
  const [capacidadeComunicacao, setCapacidadeComunicacao] = useState(3);
  const [precisaPausa, setPrecisaPausa] = useState(false);
  const [synthesis, setSynthesis] = useState<string | null>(null);
  const entries = listCheckIns(userId);
  const today = new Date().toDateString();
  const todayCount = entries.filter((e) => new Date(e.createdAt).toDateString() === today).length;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const checkIn = addQuickCheckIn(userId, {
      humor,
      energia,
      ansiedade,
      sobrecarga,
      capacidadeComunicacao,
      precisaPausa,
    });
    setSynthesis(synthesizeCheckIn(checkIn));
  }

  return (
    <div>
      <p className="text-sm text-[var(--nr-text-muted)]">
        {todayCount > 0 ? `${todayCount} check-in(s) hoje.` : "Nenhum check-in registrado hoje ainda."}
      </p>
      <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3">
        <ScaleField label="Humor" value={humor} onChange={setHumor} />
        <ScaleField label="Energia" value={energia} onChange={setEnergia} />
        <ScaleField label="Ansiedade" value={ansiedade} onChange={setAnsiedade} />
        <ScaleField label="Sobrecarga" value={sobrecarga} onChange={setSobrecarga} />
        <ScaleField label="Capacidade de comunicação" value={capacidadeComunicacao} onChange={setCapacidadeComunicacao} />
        <label className="flex items-center gap-2 text-sm text-[var(--nr-text)]">
          <input
            type="checkbox"
            checked={precisaPausa}
            onChange={(e) => setPrecisaPausa(e.target.checked)}
            className="h-4 w-4 accent-[var(--nr-accent-primary)]"
          />
          Sinto que preciso de uma pausa agora
        </label>
        <button
          type="submit"
          className="self-start rounded-lg bg-[var(--nr-accent-primary)] px-4 py-2 text-sm font-semibold text-[var(--nr-text-on-accent)] hover:bg-[var(--nr-accent-primary-hover)]"
        >
          Registrar check-in rápido
        </button>
      </form>
      {synthesis && (
        <p role="status" className="mt-3 rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface-alt)] p-3 text-sm text-[var(--nr-text)]">
          {synthesis}
        </p>
      )}
      <Link href="/meu-espaco/check-in" className="mt-3 inline-block text-sm text-[var(--nr-accent-primary)] underline">
        Fazer check-in completo
      </Link>
    </div>
  );
}

export function CorpoMonitorBlock({ userId }: { userId: string }) {
  const entries = listBodyMonitorEntries(userId);
  const last = entries[0];
  return (
    <div>
      {last ? (
        <p className="text-sm text-[var(--nr-text)]">
          Último registro em {new Date(last.createdAt).toLocaleString("pt-BR")}: {last.marks.length}{" "}
          região(ões) marcada(s), {last.externalStimuli.length} estímulo(s) externo(s) associado(s).
        </p>
      ) : (
        <p className="text-sm text-[var(--nr-text-muted)]">Você ainda não tem registros no Corpo-Monitor.</p>
      )}
      <Link href="/corpo-monitor" className="mt-3 inline-block text-sm text-[var(--nr-accent-primary)] underline">
        Abrir Corpo-Monitor
      </Link>
    </div>
  );
}

export function PlanoBlock({ userId }: { userId: string }) {
  const plan = getPersonalPlan(userId);
  const filledFields = [
    plan.comoPercebendoSobrecarga,
    plan.estimulosQueAfetam,
    plan.oQueCostumaAjudar,
    plan.comoPreferoComunicar,
  ].filter((v) => v.trim().length > 0).length;
  return (
    <div>
      <p className="text-sm text-[var(--nr-text-muted)]">
        {filledFields > 0 ? `${filledFields} de 4 seções principais preenchidas.` : "Seu plano ainda está vazio."}
      </p>
      <Link href="/meu-espaco/plano-pessoal" className="mt-3 inline-block text-sm text-[var(--nr-accent-primary)] underline">
        Abrir Plano Pessoal
      </Link>
    </div>
  );
}

export function GamesBlock({ userId }: { userId: string }) {
  const progress = listGameProgress(userId);
  return (
    <div>
      {progress.length > 0 ? (
        <ul className="flex flex-col gap-1 text-sm text-[var(--nr-text)]">
          {progress.map((p) => (
            <li key={p.id}>
              {p.gameId}: {p.jornada.estrelas} estrela(s), {p.jornada.folhas} folha(s)
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[var(--nr-text-muted)]">Você ainda não jogou nenhum game.</p>
      )}
      <Link href="/games" className="mt-3 inline-block text-sm text-[var(--nr-accent-primary)] underline">
        Ir para o Laboratório de Games
      </Link>
    </div>
  );
}

export function HiperfocosBlock({ userId }: { userId: string }) {
  const list = listHyperfocuses(userId);
  return (
    <div>
      <p className="text-sm text-[var(--nr-text-muted)]">
        {list.length > 0 ? `${list.length} hiperfoco(s) cadastrado(s).` : "Nenhum hiperfoco cadastrado ainda."}
      </p>
      <Link href="/hiperfocos" className="mt-3 inline-block text-sm text-[var(--nr-accent-primary)] underline">
        Ver meus hiperfocos
      </Link>
    </div>
  );
}

export function ComunidadesBlock() {
  return (
    <div>
      <p className="text-sm text-[var(--nr-text-muted)]">
        A comunidade está em piloto fechado: publicações passam por revisão antes de ficarem
        visíveis a outras pessoas.
      </p>
      <Link href="/comunidade" className="mt-3 inline-block text-sm text-[var(--nr-accent-primary)] underline">
        Ir para a Comunidade
      </Link>
    </div>
  );
}

export function ConteudosSalvosBlock() {
  return (
    <div>
      <p className="text-sm text-[var(--nr-text-muted)]">
        Você ainda não salvou nenhum conteúdo da Biblioteca científica.
      </p>
      <Link href="/biblioteca" className="mt-3 inline-block text-sm text-[var(--nr-accent-primary)] underline">
        Explorar a Biblioteca
      </Link>
    </div>
  );
}

export function DiarioBlock({ userId }: { userId: string }) {
  const [texto, setTexto] = useState("");
  const [entries, setEntries] = useState(() => listJournalEntries(userId).slice(0, 3));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!texto.trim()) return;
    addJournalEntry(userId, texto.trim());
    setTexto("");
    setEntries(listJournalEntries(userId).slice(0, 3));
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <label htmlFor="diario-texto" className="text-sm font-medium text-[var(--nr-text)]">
          Escrever uma nova entrada
        </label>
        <textarea
          id="diario-texto"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface)] px-3 py-2 text-sm text-[var(--nr-text)]"
        />
        <button
          type="submit"
          className="self-start rounded-lg border border-[var(--nr-border)] px-3 py-1.5 text-sm font-medium text-[var(--nr-text)] hover:bg-[var(--nr-surface-alt)]"
        >
          Salvar entrada
        </button>
      </form>
      {entries.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2">
          {entries.map((entry) => (
            <li key={entry.id} className="rounded-lg border border-[var(--nr-border)] p-2 text-sm text-[var(--nr-text)]">
              <p className="text-xs text-[var(--nr-text-muted)]">{new Date(entry.createdAt).toLocaleString("pt-BR")}</p>
              <p className="mt-1 whitespace-pre-wrap">{entry.texto}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function RotinaBlock({ userId }: { userId: string }) {
  const [titulo, setTitulo] = useState("");
  const [items, setItems] = useState(() => listRoutineItems(userId));

  function refresh() {
    setItems(listRoutineItems(userId));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo.trim()) return;
    addRoutineItem(userId, titulo.trim());
    setTitulo("");
    refresh();
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <label htmlFor="rotina-titulo" className="sr-only">
          Novo item da rotina
        </label>
        <input
          id="rotina-titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ex.: tomar café da manhã"
          className="flex-1 rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface)] px-3 py-2 text-sm text-[var(--nr-text)]"
        />
        <button
          type="submit"
          className="rounded-lg border border-[var(--nr-border)] px-3 py-2 text-sm font-medium text-[var(--nr-text)] hover:bg-[var(--nr-surface-alt)]"
        >
          Adicionar
        </button>
      </form>
      {items.length > 0 ? (
        <ul className="mt-3 flex flex-col gap-1">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-2 text-sm text-[var(--nr-text)]">
              <input
                type="checkbox"
                checked={!!item.concluidoEm}
                onChange={(e) => {
                  toggleRoutineItem(item.id, e.target.checked);
                  refresh();
                }}
                className="h-4 w-4 accent-[var(--nr-accent-primary)]"
              />
              <span className={item.concluidoEm ? "text-[var(--nr-text-muted)] line-through" : undefined}>
                {item.titulo}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-[var(--nr-text-muted)]">Nenhum item na rotina de hoje.</p>
      )}
    </div>
  );
}

export function CartoesBlock({ userId }: { userId: string }) {
  const cards = listCommunicationCards(userId);
  return (
    <div>
      <p className="text-sm text-[var(--nr-text-muted)]">
        {cards.length > 0 ? `${cards.length} cartão(ões) salvo(s).` : "Nenhum cartão de comunicação salvo ainda."}
      </p>
      <Link href="/quero-me-regular/cartoes-de-comunicacao" className="mt-3 inline-block text-sm text-[var(--nr-accent-primary)] underline">
        Gerenciar cartões
      </Link>
    </div>
  );
}

export function ContatosBlock({ userId }: { userId: string }) {
  const contacts = listTrustedContacts(userId);
  return (
    <div>
      <p className="text-sm text-[var(--nr-text-muted)]">
        {contacts.length > 0 ? `${contacts.length} contato(s) de confiança.` : "Nenhum contato de confiança cadastrado."}
      </p>
      <Link href="/meu-espaco/contatos-de-confianca" className="mt-3 inline-block text-sm text-[var(--nr-accent-primary)] underline">
        Gerenciar contatos
      </Link>
    </div>
  );
}

export function HistoricoBlock({ userId }: { userId: string }) {
  const entries = listCheckIns(userId).slice(0, 14).reverse();
  if (entries.length === 0) {
    return <p className="text-sm text-[var(--nr-text-muted)]">Ainda não há check-ins suficientes para o histórico.</p>;
  }
  const points = entries.map((e) => ({
    label: new Date(e.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    humor: e.humor,
    energia: e.energia,
    sobrecarga: e.type === "rapido" ? e.sobrecarga : e.sobrecargaPercebida,
  }));
  return (
    <AccessibleLineChart
      title="Histórico de humor, energia e sobrecarga"
      description="Linha do tempo dos últimos check-ins registrados, em escala de 0 a 5."
      series={[
        { name: "Humor", color: "var(--nr-accent-primary)", points: points.map((p) => ({ label: p.label, value: p.humor })) },
        { name: "Energia", color: "var(--nr-accent-secondary)", points: points.map((p) => ({ label: p.label, value: p.energia })) },
        { name: "Sobrecarga", color: "var(--nr-accent-tertiary)", points: points.map((p) => ({ label: p.label, value: p.sobrecarga })) },
      ]}
    />
  );
}

export function ConfiguracoesSensoriaisBlock() {
  return (
    <div>
      <p className="text-sm text-[var(--nr-text-muted)]">Ajuste tema, estímulo, texto, movimento e som.</p>
      <Link href="/configuracoes" className="mt-3 inline-block text-sm text-[var(--nr-accent-primary)] underline">
        Abrir Meu Ambiente
      </Link>
    </div>
  );
}

