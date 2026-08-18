"use client";

import { useEffect, useMemo, useState } from "react";
import { GameIntro, GameExitBar } from "@/components/games/GameIntro";
import { ResourceFeedbackWidget } from "@/components/ResourceFeedback";
import { useAuth } from "@/lib/auth/context";
import { useSensory } from "@/lib/sensory/context";
import { saveGameProgress } from "@/lib/services/game-progress";
import { MEMORY_THEMES, type MemoryThemeId } from "./themes";

const BOARDS: { label: string; pairs: number; cols: number }[] = [
  { label: "2 × 2", pairs: 2, cols: 2 },
  { label: "2 × 3", pairs: 3, cols: 3 },
  { label: "3 × 4", pairs: 6, cols: 4 },
  { label: "4 × 4", pairs: 8, cols: 4 },
  { label: "4 × 5", pairs: 10, cols: 5 },
  { label: "6 × 6", pairs: 18, cols: 6 },
];

interface Card {
  key: string;
  itemId: string;
  symbol: string;
  label: string;
  matched: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function MemoriasPage() {
  const { user } = useAuth();
  const { prefs } = useSensory();
  const [stage, setStage] = useState<"intro" | "setup" | "preview" | "playing" | "won">("intro");
  const [themeId, setThemeId] = useState<MemoryThemeId>("animais");
  const [boardIndex, setBoardIndex] = useState(2);
  const [previewSeconds, setPreviewSeconds] = useState(5);
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const board = BOARDS[boardIndex];
  const flipDuration = prefs.motion === "full" ? 300 : 0;

  function buildDeck() {
    const items = shuffle(MEMORY_THEMES[themeId].items).slice(0, board.pairs);
    const deck: Card[] = shuffle(
      items.flatMap((item) => [
        { key: `${item.id}-a`, itemId: item.id, symbol: item.symbol, label: item.label, matched: false },
        { key: `${item.id}-b`, itemId: item.id, symbol: item.symbol, label: item.label, matched: false },
      ]),
    );
    setCards(deck);
    setFlipped([]);
    setMoves(0);
  }

  function startSetup() {
    setStage("setup");
  }

  function startPreview() {
    buildDeck();
    setStage("preview");
  }

  useEffect(() => {
    if (stage !== "preview") return;
    const id = setTimeout(() => setStage("playing"), previewSeconds * 1000);
    return () => clearTimeout(id);
  }, [stage, previewSeconds]);

  function handleFlip(index: number) {
    if (stage !== "playing") return;
    if (flipped.includes(index) || cards[index].matched) return;
    if (flipped.length === 2) return;

    const next = [...flipped, index];
    setFlipped(next);

    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next;
      if (cards[a].itemId === cards[b].itemId) {
        setTimeout(() => {
          setCards((prev) => {
            const updated = prev.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c));
            if (updated.every((c) => c.matched)) {
              setStage("won");
              if (user) {
                saveGameProgress(user.id, "memorias", { jornada: { estrelas: 1, folhas: 0 } });
              }
            }
            return updated;
          });
          setFlipped([]);
        }, 400);
      } else {
        setTimeout(() => setFlipped([]), 700);
      }
    }
  }

  const gridStyle = useMemo(
    () => ({ gridTemplateColumns: `repeat(${board.cols}, minmax(0, 1fr))` }),
    [board.cols],
  );

  if (stage === "intro") {
    return (
      <GameIntro
        title="Memórias no Meu Ritmo"
        objective="Encontrar os pares, no seu próprio ritmo."
        duration="Livre — sem cronômetro obrigatório"
        difficulty="Ajustável (tamanho do tabuleiro)"
        sounds="Nenhum"
        movement="Nenhum movimento inesperado"
        stimuli="Troca visual das cartas ao virar"
        controls="Clique ou toque; navegável por teclado (Tab e Enter)"
        exit="Botão 'Sair do jogo' disponível a qualquer momento"
        onStart={startSetup}
      />
    );
  }

  if (stage === "setup") {
    return (
      <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
        <GameExitBar title="Memórias no Meu Ritmo" />
        <div className="rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6">
          <p className="text-sm font-medium text-[var(--nr-text)]">Tema</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.entries(MEMORY_THEMES).map(([id, t]) => (
              <button
                key={id}
                type="button"
                onClick={() => setThemeId(id as MemoryThemeId)}
                aria-pressed={themeId === id}
                className={`rounded-lg border px-3 py-1.5 text-sm ${themeId === id ? "border-[var(--nr-accent-primary)] font-semibold text-[var(--nr-accent-primary)]" : "border-[var(--nr-border)] text-[var(--nr-text)]"}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <p className="mt-4 text-sm font-medium text-[var(--nr-text)]">Tabuleiro</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {BOARDS.map((b, i) => (
              <button
                key={b.label}
                type="button"
                onClick={() => setBoardIndex(i)}
                aria-pressed={boardIndex === i}
                className={`rounded-lg border px-3 py-1.5 text-sm ${boardIndex === i ? "border-[var(--nr-accent-primary)] font-semibold text-[var(--nr-accent-primary)]" : "border-[var(--nr-border)] text-[var(--nr-text)]"}`}
              >
                {b.label}
              </button>
            ))}
          </div>

          <label className="mt-4 block text-sm font-medium text-[var(--nr-text)]">
            Tempo de visualização antes de começar: {previewSeconds}s
            <input
              type="range"
              min={2}
              max={15}
              value={previewSeconds}
              onChange={(e) => setPreviewSeconds(Number(e.target.value))}
              className="mt-1 w-full accent-[var(--nr-accent-primary)]"
            />
          </label>

          <button
            type="button"
            onClick={startPreview}
            className="mt-5 rounded-lg bg-[var(--nr-accent-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--nr-text-on-accent)]"
          >
            Ver cartas e começar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <GameExitBar title="Memórias no Meu Ritmo" />

      {stage === "preview" && (
        <p role="status" className="mb-3 text-sm text-[var(--nr-text-muted)]">
          Observe as cartas... o jogo começa em instantes.
        </p>
      )}
      {stage === "playing" && (
        <p className="mb-3 text-sm text-[var(--nr-text-muted)]">Jogadas: {moves}</p>
      )}

      <div className="grid gap-2" style={gridStyle}>
        {cards.map((card, index) => {
          const isFaceUp = stage === "preview" || flipped.includes(index) || card.matched;
          return (
            <button
              key={card.key}
              type="button"
              onClick={() => handleFlip(index)}
              disabled={stage === "preview"}
              aria-label={isFaceUp ? card.label : "Carta virada para baixo"}
              className="aspect-square rounded-xl border text-2xl sm:text-3xl"
              style={{
                background: isFaceUp ? "var(--nr-surface)" : "var(--nr-accent-secondary)",
                borderColor: card.matched ? "var(--nr-success)" : "var(--nr-border)",
                transition: `background ${flipDuration}ms ease`,
              }}
            >
              {isFaceUp ? card.symbol : ""}
            </button>
          );
        })}
      </div>

      {stage === "won" && (
        <div className="mt-6 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface-alt)] p-6 text-center">
          <p className="text-lg font-semibold text-[var(--nr-text)]">Você encontrou todos os pares.</p>
          <p className="mt-1 text-sm text-[var(--nr-text-muted)]">{moves} jogada(s). Não é uma medida de memória ou inteligência.</p>
          <button
            type="button"
            onClick={() => setStage("setup")}
            className="mt-4 rounded-lg bg-[var(--nr-accent-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--nr-text-on-accent)]"
          >
            Jogar novamente
          </button>
        </div>
      )}

      <ResourceFeedbackWidget resourceId="games-memorias" />
    </div>
  );
}
