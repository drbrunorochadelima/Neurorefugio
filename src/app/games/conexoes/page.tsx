"use client";

import { useState } from "react";
import { GameIntro, GameExitBar } from "@/components/games/GameIntro";
import { ResourceFeedbackWidget } from "@/components/ResourceFeedback";
import { useAuth } from "@/lib/auth/context";
import { saveGameProgress } from "@/lib/services/game-progress";
import { CONNECTION_MODES, type ConnectionModeId } from "./modes";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function ConexoesPage() {
  const { user } = useAuth();
  const [stage, setStage] = useState<"intro" | "setup" | "playing" | "won">("intro");
  const [modeId, setModeId] = useState<ConnectionModeId>("emocaoNecessidade");
  const [leftOrder, setLeftOrder] = useState<string[]>([]);
  const [rightOrder, setRightOrder] = useState<string[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongFlash, setWrongFlash] = useState<{ left: string; right: string } | null>(null);
  const [attempts, setAttempts] = useState(0);

  const mode = CONNECTION_MODES[modeId];

  function startGame() {
    const pairs = mode.pairs;
    setLeftOrder(shuffle(pairs.map((p) => p.id)));
    setRightOrder(shuffle(pairs.map((p) => p.id)));
    setMatched(new Set());
    setSelectedLeft(null);
    setAttempts(0);
    setStage("playing");
  }

  function handleLeftClick(id: string) {
    if (matched.has(id)) return;
    setSelectedLeft(id);
  }

  function handleRightClick(rightId: string) {
    if (!selectedLeft || matched.has(rightId)) return;
    setAttempts((a) => a + 1);
    if (selectedLeft === rightId) {
      const next = new Set(matched);
      next.add(rightId);
      setMatched(next);
      setSelectedLeft(null);
      if (next.size === mode.pairs.length) {
        setStage("won");
        if (user) saveGameProgress(user.id, "conexoes", { jornada: { estrelas: 1, folhas: 0 } });
      }
    } else {
      setWrongFlash({ left: selectedLeft, right: rightId });
      setTimeout(() => setWrongFlash(null), 500);
      setSelectedLeft(null);
    }
  }

  if (stage === "intro") {
    return (
      <GameIntro
        title="Conexões: Combine e Organize"
        objective="Associar cada item da esquerda ao seu par correspondente."
        duration="Livre"
        difficulty="Ajustável (número de pares por modo)"
        sounds="Nenhum"
        movement="Nenhum"
        stimuli="Nenhum inesperado"
        controls="Clique ou toque; navegável por teclado"
        exit="Botão 'Sair do jogo' disponível a qualquer momento"
        onStart={() => setStage("setup")}
      />
    );
  }

  if (stage === "setup") {
    return (
      <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
        <GameExitBar title="Conexões" />
        <div className="rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6">
          <p className="text-sm font-medium text-[var(--nr-text)]">Modo</p>
          <div className="mt-2 flex flex-col gap-2">
            {Object.entries(CONNECTION_MODES).map(([id, m]) => (
              <button
                key={id}
                type="button"
                onClick={() => setModeId(id as ConnectionModeId)}
                aria-pressed={modeId === id}
                className={`rounded-lg border px-3 py-2 text-left text-sm ${modeId === id ? "border-[var(--nr-accent-primary)] font-semibold text-[var(--nr-accent-primary)]" : "border-[var(--nr-border)] text-[var(--nr-text)]"}`}
              >
                {m.label}
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm text-[var(--nr-text-muted)]">{mode.instruction}</p>
          <button
            type="button"
            onClick={startGame}
            className="mt-5 rounded-lg bg-[var(--nr-accent-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--nr-text-on-accent)]"
          >
            Começar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <GameExitBar title="Conexões" />
      <p className="mb-4 text-sm text-[var(--nr-text-muted)]">{mode.instruction}</p>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          {leftOrder.map((id) => {
            const pair = mode.pairs.find((p) => p.id === id)!;
            const isMatched = matched.has(id);
            const isSelected = selectedLeft === id;
            const isWrong = wrongFlash?.left === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleLeftClick(id)}
                disabled={isMatched}
                aria-pressed={isSelected}
                className={`rounded-lg border px-3 py-2.5 text-left text-sm ${
                  isMatched
                    ? "border-[var(--nr-success)] bg-[var(--nr-surface-alt)] text-[var(--nr-text-muted)]"
                    : isWrong
                      ? "border-[var(--nr-danger)]"
                      : isSelected
                        ? "border-[var(--nr-accent-primary)] font-semibold text-[var(--nr-accent-primary)]"
                        : "border-[var(--nr-border)] text-[var(--nr-text)]"
                }`}
              >
                {pair.left}
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
          {rightOrder.map((id) => {
            const pair = mode.pairs.find((p) => p.id === id)!;
            const isMatched = matched.has(id);
            const isWrong = wrongFlash?.right === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleRightClick(id)}
                disabled={isMatched}
                className={`rounded-lg border px-3 py-2.5 text-left text-sm ${
                  isMatched
                    ? "border-[var(--nr-success)] bg-[var(--nr-surface-alt)] text-[var(--nr-text-muted)]"
                    : isWrong
                      ? "border-[var(--nr-danger)]"
                      : "border-[var(--nr-border)] text-[var(--nr-text)]"
                }`}
              >
                {pair.right}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-sm text-[var(--nr-text-muted)]">
        {matched.size} de {mode.pairs.length} combinados · {attempts} tentativa(s)
      </p>

      {stage === "won" && (
        <div className="mt-6 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface-alt)] p-6 text-center">
          <p className="text-lg font-semibold text-[var(--nr-text)]">Todas as conexões encontradas.</p>
          <button
            type="button"
            onClick={() => setStage("setup")}
            className="mt-4 rounded-lg bg-[var(--nr-accent-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--nr-text-on-accent)]"
          >
            Jogar novamente
          </button>
        </div>
      )}

      <ResourceFeedbackWidget resourceId="games-conexoes" />
    </div>
  );
}
