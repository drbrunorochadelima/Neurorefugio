"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";
import {
  addCommunicationCard,
  listCommunicationCards,
  removeCommunicationCard,
  updateCommunicationCard,
} from "@/lib/services/plan";
import type { CommunicationCard } from "@/lib/schemas/plan";

const CATEGORY_LABELS: Record<CommunicationCard["categoria"], string> = {
  pausa: "Pausa",
  sobrecarga: "Sobrecarga",
  instrucao: "Instrução",
  recusa: "Recusa",
  esclarecimento: "Esclarecimento",
  outro: "Outro",
};

const DEFAULT_CARDS: { texto: string; categoria: CommunicationCard["categoria"] }[] = [
  { texto: "Preciso de uma pausa agora.", categoria: "pausa" },
  { texto: "Estou com sobrecarga sensorial.", categoria: "sobrecarga" },
  { texto: "Prefiro receber isso por escrito.", categoria: "instrucao" },
  { texto: "Agora não consigo conversar.", categoria: "recusa" },
  { texto: "Pode repetir de outra forma?", categoria: "esclarecimento" },
];

export default function CartoesDeComunicacaoPage() {
  const { user } = useAuth();
  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center sm:px-6">
        <p className="text-[var(--nr-text)]">Entre para usar seus cartões de comunicação.</p>
        <Link href="/entrar" className="mt-4 inline-block text-[var(--nr-accent-primary)] hover:underline">
          Entrar
        </Link>
      </div>
    );
  }
  return <CardsManager userId={user.id} />;
}

function CardsManager({ userId }: { userId: string }) {
  const [cards, setCards] = useState(() => listCommunicationCards(userId));
  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState<CommunicationCard["categoria"]>("pausa");
  const [presenting, setPresenting] = useState<string | null>(null);

  function refresh() {
    setCards(listCommunicationCards(userId));
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!texto.trim()) return;
    addCommunicationCard(userId, { texto: texto.trim(), categoria, favorito: false });
    setTexto("");
    refresh();
  }

  function addDefault(d: { texto: string; categoria: CommunicationCard["categoria"] }) {
    addCommunicationCard(userId, { ...d, favorito: false });
    refresh();
  }

  function toggleFavorite(card: CommunicationCard) {
    updateCommunicationCard(card.id, { favorito: !card.favorito });
    refresh();
  }

  function handleRemove(id: string) {
    removeCommunicationCard(id);
    refresh();
  }

  if (presenting) {
    return (
      <div className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-[var(--nr-bg)] p-8 text-center">
        <p className="max-w-2xl text-4xl font-semibold text-[var(--nr-text)] sm:text-5xl">{presenting}</p>
        <button
          type="button"
          onClick={() => setPresenting(null)}
          className="mt-8 rounded-lg border border-[var(--nr-border)] px-5 py-2.5 text-sm font-medium text-[var(--nr-text)]"
        >
          Fechar
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-[var(--nr-text)]">Cartões de comunicação</h1>
      <p className="mt-2 text-sm text-[var(--nr-text-muted)]">
        Toque em um cartão para mostrá-lo em tela cheia.
      </p>

      {cards.length === 0 && (
        <div className="mt-6 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-5">
          <p className="text-sm text-[var(--nr-text-muted)]">Sugestões para começar:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {DEFAULT_CARDS.map((d) => (
              <button
                key={d.texto}
                type="button"
                onClick={() => addDefault(d)}
                className="rounded-lg border border-[var(--nr-border)] px-3 py-1.5 text-sm text-[var(--nr-text)] hover:bg-[var(--nr-surface-alt)]"
              >
                + {d.texto}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {cards.map((card) => (
          <div key={card.id} className="flex flex-col justify-between rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-4">
            <button
              type="button"
              onClick={() => setPresenting(card.texto)}
              className="text-left text-base font-medium text-[var(--nr-text)]"
            >
              {card.texto}
            </button>
            <div className="mt-3 flex items-center justify-between text-xs text-[var(--nr-text-muted)]">
              <span>{CATEGORY_LABELS[card.categoria]}</span>
              <div className="flex gap-2">
                <button type="button" onClick={() => toggleFavorite(card)} aria-pressed={card.favorito}>
                  {card.favorito ? "★ Favorito" : "☆ Favoritar"}
                </button>
                <button type="button" onClick={() => handleRemove(card.id)} className="text-[var(--nr-danger)]">
                  Remover
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleAdd} className="mt-6 flex flex-col gap-3 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6">
        <label htmlFor="novo-cartao" className="text-sm font-medium text-[var(--nr-text)]">
          Novo cartão
        </label>
        <input
          id="novo-cartao"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          maxLength={280}
          className="w-full rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface)] px-3 py-2 text-sm text-[var(--nr-text)]"
        />
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value as CommunicationCard["categoria"])}
          className="w-full rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface)] px-3 py-2 text-sm text-[var(--nr-text)]"
        >
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button type="submit" className="self-start rounded-lg bg-[var(--nr-accent-primary)] px-4 py-2 text-sm font-semibold text-[var(--nr-text-on-accent)]">
          Adicionar cartão
        </button>
      </form>

      <Link href="/quero-me-regular" className="mt-6 inline-block text-sm text-[var(--nr-accent-primary)] hover:underline">
        Voltar para Quero me regular
      </Link>
    </div>
  );
}
