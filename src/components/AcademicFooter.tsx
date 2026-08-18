import Link from "next/link";

const LAST_UPDATE = "18 de agosto de 2026";
const VERSION = "0.1.0 (demonstrativo)";

export function AcademicFooter() {
  return (
    <footer className="mt-16 border-t border-[var(--nr-border)] bg-[var(--nr-surface-alt)] pb-20 lg:pb-8">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="max-w-3xl text-sm text-[var(--nr-text-muted)]">
          Produto técnico-científico desenvolvido no âmbito do projeto de mestrado
          &ldquo;Entre luzes, alarmes e o silêncio: uma autoetnografia performática de um médico
          autista na terapia intensiva&rdquo;, de Bruno Rocha de Lima, Universidade Federal de
          Uberlândia, 2026.
        </p>

        <nav aria-label="Links institucionais" className="mt-6">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <li>
              <Link href="/pesquisa" className="text-[var(--nr-accent-primary)] underline">
                Orientação e instituição
              </Link>
            </li>
            <li>
              <Link href="/biblioteca" className="text-[var(--nr-accent-primary)] underline">
                Referências
              </Link>
            </li>
            <li>
              <Link href="/pesquisa#contato" className="text-[var(--nr-accent-primary)] underline">
                Contato
              </Link>
            </li>
            <li>
              <Link href="/acessibilidade" className="text-[var(--nr-accent-primary)] underline">
                Acessibilidade
              </Link>
            </li>
            <li>
              <Link href="/seguranca" className="text-[var(--nr-accent-primary)] underline">
                Segurança
              </Link>
            </li>
            <li>
              <Link href="/privacidade" className="text-[var(--nr-accent-primary)] underline">
                Privacidade
              </Link>
            </li>
            <li>
              <Link href="/termos" className="text-[var(--nr-accent-primary)] underline">
                Termos
              </Link>
            </li>
          </ul>
        </nav>

        <p className="mt-6 text-xs text-[var(--nr-text-muted)]">
          Versão {VERSION} · Última atualização em {LAST_UPDATE}. Dados de demonstração são
          fictícios. Este site não substitui atendimento profissional de saúde e não é um serviço
          de emergência.
        </p>
      </div>
    </footer>
  );
}
