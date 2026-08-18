"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";
import { listOfficialContacts, type OfficialContact } from "@/lib/services/official-contacts";

export default function SegurancaPage() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<OfficialContact[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => setContacts(listOfficialContacts()), 0);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-[var(--nr-text)]">Segurança e situações de crise</h1>

      <div className="mt-4 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface-alt)] p-6">
        <p className="text-[var(--nr-text)]">
          O NeuroRefúgio não é um serviço de emergência, de diagnóstico ou de atendimento
          psicológico. Se você está em risco imediato, ou correndo perigo, procure ajuda
          profissional agora — um serviço de emergência local, um hospital, ou alguém de confiança
          perto de você.
        </p>
        <p className="mt-3 text-sm text-[var(--nr-text-muted)]">
          Não podemos prometer sigilo absoluto sobre o que é compartilhado nesta plataforma, e não
          tentamos fazer nenhum tipo de diagnóstico a partir do que você registra aqui.
        </p>
      </div>

      <div className="mt-4 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6">
        <h2 className="text-lg font-semibold text-[var(--nr-text)]">Contatos oficiais</h2>
        {contacts.length > 0 ? (
          <ul className="mt-2 flex flex-col gap-2 text-sm text-[var(--nr-text)]">
            {contacts.map((c) => (
              <li key={c.id}>
                <p className="font-medium">{c.nome}</p>
                <p className="text-[var(--nr-text-muted)]">{c.telefone}</p>
                {c.descricao && <p className="text-[var(--nr-text-muted)]">{c.descricao}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-[var(--nr-text-muted)]">
            Nenhum contato oficial foi confirmado e cadastrado para esta instalação ainda. Um
            administrador pode adicionar contatos oficiais confirmados no painel administrativo.
            Enquanto isso: em emergência médica, procure o serviço de urgência/emergência mais
            próximo de você. Para apoio emocional no Brasil, o CVV (Centro de Valorização da Vida)
            oferece atendimento gratuito — consulte o número e os canais atualizados em{" "}
            <a href="https://www.cvv.org.br" target="_blank" rel="noreferrer" className="text-[var(--nr-accent-primary)] underline">
              cvv.org.br
            </a>
            .
          </p>
        )}
      </div>

      <div className="mt-4 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6">
        <h2 className="text-lg font-semibold text-[var(--nr-text)]">Seus contatos de confiança</h2>
        {user ? (
          <Link href="/meu-espaco/contatos-de-confianca" className="mt-2 inline-block text-sm text-[var(--nr-accent-primary)] underline">
            Ver ou avisar um contato de confiança
          </Link>
        ) : (
          <p className="mt-2 text-sm text-[var(--nr-text-muted)]">
            <Link href="/entrar" className="text-[var(--nr-accent-primary)] underline">
              Entre
            </Link>{" "}
            para acessar seus contatos de confiança cadastrados.
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/quero-me-regular/pausa" className="rounded-lg border border-[var(--nr-border)] px-4 py-2 text-sm font-medium text-[var(--nr-text)]">
          Fazer uma pausa agora
        </Link>
        <Link href="/meu-espaco/plano-pessoal" className="rounded-lg border border-[var(--nr-border)] px-4 py-2 text-sm font-medium text-[var(--nr-text)]">
          Abrir meu Plano Pessoal
        </Link>
      </div>
    </div>
  );
}
