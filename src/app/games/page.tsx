"use client";

import { useState } from "react";
import Link from "next/link";

interface GameCard {
  href: string;
  title: string;
  description: string;
  intents: string[];
  lowStimulus: boolean;
}

const AVAILABLE_GAMES: GameCard[] = [
  {
    href: "/games/atelie-das-cores",
    title: "Ateliê das Cores",
    description: "Colorir livremente ou por regiões, com paleta própria e galeria salva.",
    intents: ["criar", "colorir", "sugestao-confortavel"],
    lowStimulus: true,
  },
  {
    href: "/games/conexoes",
    title: "Conexões: Combine e Organize",
    description: "Associe pares por categoria, sem punição por erro.",
    intents: ["combinar", "organizar", "aprender"],
    lowStimulus: true,
  },
  {
    href: "/games/memorias",
    title: "Memórias no Meu Ritmo",
    description: "Jogo da memória com tabuleiros e temas configuráveis, sem cronômetro obrigatório.",
    intents: ["memoria", "sugestao-confortavel"],
    lowStimulus: true,
  },
  {
    href: "/games/corpo-monitor-plantao",
    title: "Corpo-Monitor: Plantão em Camadas",
    description: "Narrativa e estratégia sobre um plantão em UTI, com eventos e consequências institucionais.",
    intents: ["historia", "aprender"],
    lowStimulus: false,
  },
];

const PLANNED_GAMES: { title: string; description: string }[] = [
  { title: "Entre Luzes, Alarmes e o Silêncio", description: "Narrativa ramificada em capítulos, com múltiplos finais." },
  { title: "Sala de Controle Sensorial", description: "Simulador de ajustes ambientais em uma UTI." },
  { title: "Meu Ritmo: A Jornada do Corpo", description: "Exploração por paisagens simbólicas do corpo e das emoções." },
  { title: "Jardim do Meu Ritmo", description: "Construção de jardim, sem plantas que morrem por ausência." },
  { title: "Aquário Sensorial", description: "Criação de habitats aquáticos contemplativos." },
  { title: "Constelação de Hiperfocos", description: "Visualização dos hiperfocos como um mapa de estrelas." },
  { title: "Fábrica de Padrões", description: "Criação de mosaicos, mandalas e simetrias." },
  { title: "Rotas de Pausa", description: "Planejamento sustentável de rotina, sem foco em produtividade." },
  { title: "Comunicação sem Pressão", description: "Cenários para praticar pedidos de pausa e limites." },
  { title: "Construa uma Instituição Neuroinclusiva", description: "Gestão estratégica de acessibilidade institucional." },
];

const INTENTS: { value: string; label: string }[] = [
  { value: "relaxar", label: "Quero relaxar" },
  { value: "criar", label: "Quero criar" },
  { value: "colorir", label: "Quero colorir" },
  { value: "combinar", label: "Quero combinar itens" },
  { value: "memoria", label: "Quero exercitar minha memória" },
  { value: "organizar", label: "Quero organizar" },
  { value: "hiperfoco", label: "Quero explorar um hiperfoco" },
  { value: "aprender", label: "Quero aprender" },
  { value: "historia", label: "Quero jogar uma história" },
  { value: "sugestao-confortavel", label: "Quero uma sugestão confortável" },
];

export default function GamesPage() {
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null);
  const visible = selectedIntent
    ? AVAILABLE_GAMES.filter((g) => g.intents.includes(selectedIntent))
    : AVAILABLE_GAMES;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-[var(--nr-text)]">Laboratório de Games</h1>
      <p className="mt-2 max-w-2xl text-[var(--nr-text-muted)]">
        Sem anúncios, sem limite de vidas, sem punição por pausas, sem ranking obrigatório. Todo
        game pode ser pausado ou encerrado a qualquer momento, e nenhum interpreta desempenho como
        diagnóstico.
      </p>

      <h2 className="mt-8 text-lg font-semibold text-[var(--nr-text)]">O que você quer agora?</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {INTENTS.map((i) => (
          <button
            key={i.value}
            type="button"
            onClick={() => setSelectedIntent((prev) => (prev === i.value ? null : i.value))}
            aria-pressed={selectedIntent === i.value}
            className={`rounded-lg border px-3 py-1.5 text-sm ${
              selectedIntent === i.value
                ? "border-[var(--nr-accent-primary)] bg-[var(--nr-surface-alt)] font-semibold text-[var(--nr-accent-primary)]"
                : "border-[var(--nr-border)] text-[var(--nr-text)] hover:bg-[var(--nr-surface-alt)]"
            }`}
          >
            {i.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {visible.map((game) => (
          <Link
            key={game.href}
            href={game.href}
            className="rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-5 hover:border-[var(--nr-accent-primary)]"
          >
            <h3 className="font-semibold text-[var(--nr-text)]">{game.title}</h3>
            <p className="mt-1 text-sm text-[var(--nr-text-muted)]">{game.description}</p>
            {game.lowStimulus && (
              <span className="mt-2 inline-block rounded-full bg-[var(--nr-surface-alt)] px-2 py-0.5 text-xs text-[var(--nr-text-muted)]">
                Baixo estímulo disponível
              </span>
            )}
          </Link>
        ))}
        {visible.length === 0 && (
          <p className="text-sm text-[var(--nr-text-muted)]">
            Nenhum game disponível ainda para essa intenção — veja a lista de games em desenvolvimento abaixo.
          </p>
        )}
      </div>

      <h2 className="mt-10 text-lg font-semibold text-[var(--nr-text)]">Em desenvolvimento</h2>
      <p className="mt-1 text-sm text-[var(--nr-text-muted)]">
        Estes games fazem parte do plano da plataforma e ainda não estão jogáveis nesta versão.
      </p>
      <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {PLANNED_GAMES.map((g) => (
          <li key={g.title} className="rounded-xl border border-dashed border-[var(--nr-border)] p-4">
            <p className="font-medium text-[var(--nr-text)]">{g.title}</p>
            <p className="mt-1 text-sm text-[var(--nr-text-muted)]">{g.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
