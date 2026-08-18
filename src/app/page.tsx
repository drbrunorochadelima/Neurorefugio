import Link from "next/link";

interface IntentButton {
  label: string;
  href: string;
}

const INTENTS: IntentButton[] = [
  { label: "Quero me acalmar", href: "/quero-me-regular" },
  { label: "Quero entender o que estou sentindo", href: "/meu-espaco/check-in" },
  { label: "Quero jogar", href: "/games" },
  { label: "Quero colorir", href: "/games/atelie-das-cores" },
  { label: "Quero combinar e organizar", href: "/games/conexoes" },
  { label: "Quero exercitar minha memória", href: "/games/memorias" },
  { label: "Quero descansar", href: "/quero-me-regular/pausa" },
  { label: "Quero explorar meu hiperfoco", href: "/hiperfocos" },
  { label: "Quero conversar", href: "/comunidade" },
  { label: "Quero organizar meu dia", href: "/meu-espaco" },
  { label: "Quero apenas ficar aqui", href: "/quero-me-regular#estar-aqui" },
  { label: "Não sei do que preciso", href: "/quero-me-regular" },
];

const CARD_ACCENTS = [
  "var(--nr-accent-primary)",
  "var(--nr-accent-secondary)",
  "var(--nr-accent-tertiary)",
  "var(--nr-accent-warm)",
  "var(--nr-accent-pink)",
];

export default function Home() {
  return (
    <div className="flex flex-col gap-12 pb-12">
      <section
        className="px-4 py-16 text-center text-white sm:px-6"
        style={{
          background:
            "linear-gradient(135deg, var(--nr-blue-600), var(--nr-violet-600) 55%, var(--nr-rose-600))",
        }}
      >
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
            Plataforma Corpo-Monitor · Acessibilidade Sensorial na Terapia Intensiva
          </p>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
            Você não precisa se adaptar a este espaço.
            <br />
            Este espaço pode se adaptar a você.
          </h1>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/configuracoes"
              className="rounded-lg border border-white/40 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur hover:bg-white/20"
            >
              Ativar baixo estímulo
            </Link>
            <Link
              href="/corpo-monitor"
              className="rounded-lg border border-white/40 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur hover:bg-white/20"
            >
              Conhecer o Corpo-Monitor
            </Link>
            <Link
              href="/games"
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[var(--nr-blue-700)] hover:bg-white/90"
            >
              Ver os games
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 sm:px-6">
        <section aria-labelledby="do-que-precisa">
          <h2 id="do-que-precisa" className="text-center text-2xl font-semibold text-[var(--nr-text)]">
            Do que você precisa agora?
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {INTENTS.map((intent, index) => {
              const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];
              return (
                <Link
                  key={intent.label}
                  href={intent.href}
                  style={{ borderTopColor: accent, borderTopWidth: 4 }}
                  className="rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] px-5 py-6 text-center text-base font-medium text-[var(--nr-text)] shadow-sm hover:shadow-md"
                >
                  {intent.label}
                </Link>
              );
            })}
          </div>
        </section>

        <section
          aria-labelledby="sobre-a-plataforma"
          className="rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface-alt)] p-8"
        >
          <h2 id="sobre-a-plataforma" className="text-xl font-semibold text-[var(--nr-text)]">
            O que é o NeuroRefúgio
          </h2>
          <p className="mt-3 max-w-3xl text-[var(--nr-text-muted)]">
            Um espaço digital de baixo estímulo para autoconhecimento corporal e sensorial, games
            neuroinclusivos, valorização de hiperfocos, biblioteca científica e comunidade moderada —
            voltado principalmente a pessoas autistas adultas, profissionais e estudantes da saúde,
            familiares, educadores, gestores institucionais e pesquisadores em neurodiversidade.
          </p>
          <p className="mt-3 max-w-3xl text-[var(--nr-text-muted)]">
            É um produto técnico-científico vinculado ao mestrado{" "}
            <Link href="/pesquisa" className="text-[var(--nr-accent-primary)] underline">
              &ldquo;Entre luzes, alarmes e o silêncio&rdquo;
            </Link>
            , de Bruno Rocha de Lima (UFU, 2026). Não trata autismo como doença e não afirma que a
            experiência de um pesquisador representa todas as pessoas autistas.
          </p>
        </section>

        <section aria-labelledby="conteudos-cientificos">
          <h2 id="conteudos-cientificos" className="text-xl font-semibold text-[var(--nr-text)]">
            Conteúdos científicos em destaque
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link
              href="/biblioteca?eixo=luzes"
              className="rounded-xl border p-5 hover:shadow-md"
              style={{ borderColor: "var(--nr-amber-300)", background: "var(--nr-amber-50)" }}
            >
              <h3 className="font-semibold" style={{ color: "var(--nr-accent-warm-text)" }}>
                Luzes
              </h3>
              <p className="mt-1 text-sm text-[var(--nr-text-muted)]">
                Iluminação artificial, reflexos e ausência de espaços de baixa estimulação.
              </p>
            </Link>
            <Link
              href="/biblioteca?eixo=alarmes"
              className="rounded-xl border p-5 hover:shadow-md"
              style={{ borderColor: "var(--nr-rose-300)", background: "var(--nr-rose-50)" }}
            >
              <h3 className="font-semibold" style={{ color: "var(--nr-accent-pink-text)" }}>
                Alarmes
              </h3>
              <p className="mt-1 text-sm text-[var(--nr-text-muted)]">
                Ruídos, interrupções, simultaneidade e hipervigilância no ambiente de trabalho.
              </p>
            </Link>
            <Link
              href="/biblioteca?eixo=silencio"
              className="rounded-xl border p-5 hover:shadow-md"
              style={{ borderColor: "var(--nr-violet-300)", background: "var(--nr-violet-50)" }}
            >
              <h3 className="font-semibold" style={{ color: "var(--nr-violet-700)" }}>
                Silêncio
              </h3>
              <p className="mt-1 text-sm text-[var(--nr-text-muted)]">
                Masking, sofrimento invisível e silenciamento institucional.
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
