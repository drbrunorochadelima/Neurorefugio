"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";
import { loadDashboardPrefs, saveDashboardPrefs, type DashboardPrefs } from "@/lib/dashboard/prefs";
import { DashboardBlock } from "@/components/dashboard/DashboardBlock";
import {
  CheckInBlock,
  CorpoMonitorBlock,
  PlanoBlock,
  GamesBlock,
  HiperfocosBlock,
  ComunidadesBlock,
  ConteudosSalvosBlock,
  DiarioBlock,
  RotinaBlock,
  CartoesBlock,
  ContatosBlock,
  HistoricoBlock,
  ConfiguracoesSensoriaisBlock,
} from "./blocks";

const BLOCK_TITLES: Record<string, string> = {
  checkin: "Check-in do dia",
  corpoMonitor: "Resumo do Corpo-Monitor",
  plano: "Plano de autorregulação",
  games: "Games favoritos e progresso",
  hiperfocos: "Hiperfocos",
  comunidades: "Comunidades",
  conteudosSalvos: "Conteúdos salvos",
  diario: "Diário",
  rotina: "Rotina",
  cartoes: "Cartões de comunicação",
  contatos: "Contatos de confiança",
  historico: "Histórico de humor, energia e sobrecarga",
  configuracoesSensoriais: "Configurações sensoriais",
};

const DEFAULT_ORDER = Object.keys(BLOCK_TITLES);

export default function MeuEspacoPage() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<DashboardPrefs>(() => loadDashboardPrefs(DEFAULT_ORDER));

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center sm:px-6">
        <h1 className="text-xl font-semibold text-[var(--nr-text)]">Meu Espaço</h1>
        <p className="mt-2 text-[var(--nr-text-muted)]">
          Entre ou crie uma conta para acessar seu painel pessoal.
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <Link href="/entrar" className="rounded-lg bg-[var(--nr-accent-primary)] px-4 py-2 text-sm font-semibold text-[var(--nr-text-on-accent)]">
            Entrar
          </Link>
          <Link href="/cadastro" className="rounded-lg border border-[var(--nr-border)] px-4 py-2 text-sm font-medium text-[var(--nr-text)]">
            Criar conta
          </Link>
        </div>
      </div>
    );
  }

  function update(next: DashboardPrefs) {
    setPrefs(next);
    saveDashboardPrefs(next);
  }

  function hide(id: string) {
    update({ ...prefs, hidden: [...prefs.hidden, id] });
  }

  function show(id: string) {
    update({ ...prefs, hidden: prefs.hidden.filter((h) => h !== id) });
  }

  function toggleCompact(id: string) {
    const isCompact = prefs.compact.includes(id);
    update({
      ...prefs,
      compact: isCompact ? prefs.compact.filter((c) => c !== id) : [...prefs.compact, id],
    });
  }

  const visibleOrder = prefs.order.filter((id) => !prefs.hidden.includes(id));
  const userId = user.id;

  function move(id: string, direction: -1 | 1) {
    const visibleIndex = visibleOrder.indexOf(id);
    const targetVisibleIndex = visibleIndex + direction;
    if (targetVisibleIndex < 0 || targetVisibleIndex >= visibleOrder.length) return;
    const targetId = visibleOrder[targetVisibleIndex];
    const next = [...prefs.order];
    const i = next.indexOf(id);
    const j = next.indexOf(targetId);
    [next[i], next[j]] = [next[j], next[i]];
    update({ ...prefs, order: next });
  }

  function renderBlockContent(id: string) {
    switch (id) {
      case "checkin":
        return <CheckInBlock userId={userId} />;
      case "corpoMonitor":
        return <CorpoMonitorBlock userId={userId} />;
      case "plano":
        return <PlanoBlock userId={userId} />;
      case "games":
        return <GamesBlock userId={userId} />;
      case "hiperfocos":
        return <HiperfocosBlock userId={userId} />;
      case "comunidades":
        return <ComunidadesBlock />;
      case "conteudosSalvos":
        return <ConteudosSalvosBlock />;
      case "diario":
        return <DiarioBlock userId={userId} />;
      case "rotina":
        return <RotinaBlock userId={userId} />;
      case "cartoes":
        return <CartoesBlock userId={userId} />;
      case "contatos":
        return <ContatosBlock userId={userId} />;
      case "historico":
        return <HistoricoBlock userId={userId} />;
      case "configuracoesSensoriais":
        return <ConfiguracoesSensoriaisBlock />;
      default:
        return null;
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-[var(--nr-text)]">Meu Espaço</h1>
      <p className="mt-1 text-sm text-[var(--nr-text-muted)]">
        Olá, {user.pseudonym}. Use as setas para reordenar os blocos, &ldquo;Compacto&rdquo; para
        reduzi-los e &ldquo;Ocultar&rdquo; para escondê-los.
      </p>

      {prefs.hidden.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {prefs.hidden.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => show(id)}
              className="rounded-lg border border-dashed border-[var(--nr-border)] px-3 py-1.5 text-xs text-[var(--nr-text-muted)] hover:bg-[var(--nr-surface-alt)]"
            >
              Mostrar &ldquo;{BLOCK_TITLES[id]}&rdquo;
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {visibleOrder.map((id, index) => (
          <DashboardBlock
            key={id}
            title={BLOCK_TITLES[id]}
            compact={prefs.compact.includes(id)}
            onHide={() => hide(id)}
            onMoveUp={() => move(id, -1)}
            onMoveDown={() => move(id, 1)}
            onToggleCompact={() => toggleCompact(id)}
            canMoveUp={index > 0}
            canMoveDown={index < visibleOrder.length - 1}
          >
            {renderBlockContent(id)}
          </DashboardBlock>
        ))}
      </div>
    </div>
  );
}
