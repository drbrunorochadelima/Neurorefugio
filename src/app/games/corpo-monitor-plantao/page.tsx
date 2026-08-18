"use client";

import { useState } from "react";
import { GameIntro, GameExitBar } from "@/components/games/GameIntro";
import { AccessibleLineChart } from "@/components/charts/AccessibleLineChart";
import { ResourceFeedbackWidget } from "@/components/ResourceFeedback";
import { useAuth } from "@/lib/auth/context";
import { saveGameProgress } from "@/lib/services/game-progress";
import { SHIFT_EVENTS, type EventChoice } from "./events";

interface Params {
  energia: number;
  tensao: number;
  sobrecargaAuditiva: number;
  sobrecargaVisual: number;
  sobrecargaSocial: number;
  masking: number;
  necessidadeStimming: number;
}

const BASELINE: Params = {
  energia: 6,
  tensao: 2,
  sobrecargaAuditiva: 1,
  sobrecargaVisual: 1,
  sobrecargaSocial: 1,
  masking: 0,
  necessidadeStimming: 1,
};

function clamp(v: number): number {
  return Math.max(0, Math.min(10, v));
}

interface LogEntry {
  eventTitle: string;
  choiceLabel: string;
  consequence: string;
  isMasking: boolean;
  isCommunication: boolean;
  params: Params;
}

export default function CorpoMonitorPlantaoPage() {
  const { user } = useAuth();
  const [stage, setStage] = useState<"intro" | "setup" | "playing" | "summary">("intro");
  const [lowStimulusMode, setLowStimulusMode] = useState(false);
  const [eventIndex, setEventIndex] = useState(0);
  const [params, setParams] = useState<Params>(BASELINE);
  const [log, setLog] = useState<LogEntry[]>([]);

  function startGame() {
    setEventIndex(0);
    setParams(BASELINE);
    setLog([]);
    setStage("playing");
  }

  function choose(choice: EventChoice) {
    const event = SHIFT_EVENTS[eventIndex];
    const nextParams: Params = {
      energia: clamp(params.energia + (choice.effects.energia ?? 0)),
      tensao: clamp(params.tensao + (choice.effects.tensao ?? 0)),
      sobrecargaAuditiva: clamp(params.sobrecargaAuditiva + (choice.effects.sobrecargaAuditiva ?? 0)),
      sobrecargaVisual: clamp(params.sobrecargaVisual + (choice.effects.sobrecargaVisual ?? 0)),
      sobrecargaSocial: clamp(params.sobrecargaSocial + (choice.effects.sobrecargaSocial ?? 0)),
      masking: clamp(params.masking + (choice.effects.masking ?? 0)),
      necessidadeStimming: clamp(params.necessidadeStimming + (choice.effects.necessidadeStimming ?? 0)),
    };
    const entry: LogEntry = {
      eventTitle: event.title,
      choiceLabel: choice.label,
      consequence: choice.consequence,
      isMasking: choice.isMasking,
      isCommunication: choice.isCommunication,
      params: nextParams,
    };
    setParams(nextParams);
    setLog((prev) => [...prev, entry]);

    if (eventIndex + 1 >= SHIFT_EVENTS.length) {
      setStage("summary");
      if (user) saveGameProgress(user.id, "corpo-monitor-plantao", { jornada: { estrelas: 1, folhas: 1 } });
    } else {
      setEventIndex((i) => i + 1);
    }
  }

  if (stage === "intro") {
    return (
      <GameIntro
        title="Corpo-Monitor: Plantão em Camadas"
        objective="Acompanhar momentos de um plantão em UTI e ver como escolhas afetam energia, tensão e sobrecarga — sem certo ou errado."
        duration="Cerca de 10 minutos"
        difficulty="Não se aplica"
        sounds="Nenhum"
        movement="Nenhum"
        stimuli="Descrições textuais de ambientes de UTI (luzes, alarmes, movimentação)"
        controls="Clique ou toque nas opções de resposta"
        exit="Botão 'Sair do jogo' disponível a qualquer momento"
        onStart={() => setStage("setup")}
      />
    );
  }

  if (stage === "setup") {
    return (
      <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
        <GameExitBar title="Corpo-Monitor: Plantão em Camadas" />
        <div className="rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6">
          <p className="text-sm text-[var(--nr-text-muted)]">
            Versão funcional mínima desta sessão: modo história, com um resumo em modo de baixo
            estímulo opcional (menos detalhes visuais, mesmo conteúdo). Os modos estratégia, gestão
            institucional e livre estão no plano de expansão (ver STATUS.md).
          </p>
          <label className="mt-4 flex items-center gap-2 text-sm text-[var(--nr-text)]">
            <input
              type="checkbox"
              checked={lowStimulusMode}
              onChange={(e) => setLowStimulusMode(e.target.checked)}
              className="h-4 w-4 accent-[var(--nr-accent-primary)]"
            />
            Usar modo de baixo estímulo (menos ênfase visual)
          </label>
          <button
            type="button"
            onClick={startGame}
            className="mt-5 rounded-lg bg-[var(--nr-accent-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--nr-text-on-accent)]"
          >
            Começar o plantão
          </button>
        </div>
      </div>
    );
  }

  if (stage === "playing") {
    const event = SHIFT_EVENTS[eventIndex];
    return (
      <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
        <GameExitBar title="Corpo-Monitor: Plantão em Camadas" />
        <p className="text-sm text-[var(--nr-text-muted)]">
          Momento {eventIndex + 1} de {SHIFT_EVENTS.length}
        </p>
        <div className={`mt-3 rounded-2xl border border-[var(--nr-border)] p-6 ${lowStimulusMode ? "bg-[var(--nr-bg)]" : "bg-[var(--nr-surface)]"}`}>
          <h2 className="text-lg font-semibold text-[var(--nr-text)]">{event.title}</h2>
          <p className="mt-2 text-[var(--nr-text)]">{event.description}</p>
          {!lowStimulusMode && (
            <p className="mt-2 text-sm text-[var(--nr-text-muted)]">Estímulo em destaque: {event.estimulo}</p>
          )}

          <div className="mt-5 flex flex-col gap-2">
            {event.choices.map((choice) => (
              <button
                key={choice.label}
                type="button"
                onClick={() => choose(choice)}
                className="rounded-lg border border-[var(--nr-border)] px-4 py-3 text-left text-sm text-[var(--nr-text)] hover:border-[var(--nr-accent-primary)] hover:bg-[var(--nr-surface-alt)]"
              >
                {choice.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // summary
  const maskingMoments = log.filter((l) => l.isMasking);
  const communicationStrategies = log.filter((l) => l.isCommunication);
  const barriers = SHIFT_EVENTS.filter((e) => e.barreiraInstitucional).map((e) => e.barreiraInstitucional!);
  const mainStimuli = Array.from(new Set(SHIFT_EVENTS.map((e) => e.estimulo)));

  const chartPoints = log.map((l, i) => ({ label: `${i + 1}`, value: l.params.tensao }));
  const energyPoints = log.map((l, i) => ({ label: `${i + 1}`, value: l.params.energia }));

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <GameExitBar title="Corpo-Monitor: Plantão em Camadas — resumo" />

      <div className="rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6">
        <h2 className="text-lg font-semibold text-[var(--nr-text)]">Curva do corpo-monitor</h2>
        <AccessibleLineChart
          title="Tensão e energia ao longo do plantão"
          description="Evolução da tensão e da energia percebidas a cada momento do plantão, em escala de 0 a 10."
          min={0}
          max={10}
          series={[
            { name: "Tensão", color: "var(--nr-danger)", points: chartPoints },
            { name: "Energia", color: "var(--nr-accent-primary)", points: energyPoints },
          ]}
        />
      </div>

      <div className="mt-4 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6">
        <h2 className="text-lg font-semibold text-[var(--nr-text)]">Linha do tempo</h2>
        <ol className="mt-2 flex flex-col gap-3">
          {log.map((entry, i) => (
            <li key={i} className="border-l-2 border-[var(--nr-border)] pl-3 text-sm">
              <p className="font-medium text-[var(--nr-text)]">{entry.eventTitle}</p>
              <p className="text-[var(--nr-text-muted)]">Escolha: {entry.choiceLabel}</p>
              <p className="text-[var(--nr-text-muted)]">{entry.consequence}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-4 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6">
        <h2 className="text-lg font-semibold text-[var(--nr-text)]">Estímulos principais</h2>
        <ul className="mt-2 list-inside list-disc text-sm text-[var(--nr-text-muted)]">
          {mainStimuli.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6">
        <h2 className="text-lg font-semibold text-[var(--nr-text)]">Momentos de masking</h2>
        {maskingMoments.length > 0 ? (
          <ul className="mt-2 list-inside list-disc text-sm text-[var(--nr-text-muted)]">
            {maskingMoments.map((m, i) => (
              <li key={i}>{m.eventTitle}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-[var(--nr-text-muted)]">Nenhum, nesta partida.</p>
        )}
      </div>

      <div className="mt-4 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6">
        <h2 className="text-lg font-semibold text-[var(--nr-text)]">Estratégias de comunicação usadas</h2>
        {communicationStrategies.length > 0 ? (
          <ul className="mt-2 list-inside list-disc text-sm text-[var(--nr-text-muted)]">
            {communicationStrategies.map((m, i) => (
              <li key={i}>{m.choiceLabel}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-[var(--nr-text-muted)]">Nenhuma, nesta partida.</p>
        )}
      </div>

      <div className="mt-4 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6">
        <h2 className="text-lg font-semibold text-[var(--nr-text)]">Barreiras institucionais observadas</h2>
        <ul className="mt-2 list-inside list-disc text-sm text-[var(--nr-text-muted)]">
          {barriers.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-[var(--nr-text-muted)]">
          Recomendação: estas barreiras dependem de mudança institucional — espaços de baixa
          estimulação, aviso prévio de mudanças de escala e priorização diferenciada de alarmes não
          se resolvem apenas com esforço individual.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setStage("setup")}
        className="mt-6 rounded-lg bg-[var(--nr-accent-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--nr-text-on-accent)]"
      >
        Jogar novamente
      </button>

      <ResourceFeedbackWidget resourceId="games-corpo-monitor-plantao" />
    </div>
  );
}
