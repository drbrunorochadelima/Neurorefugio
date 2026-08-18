"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth/context";

const SECTIONS = [
  { href: "/admin/usuarios", title: "Usuários e permissões", description: "Ver contas e alterar papéis de acesso." },
  { href: "/admin/moderacao", title: "Moderação da comunidade", description: "Publicações aguardando revisão e denúncias." },
  { href: "/admin/institucional", title: "Contatos oficiais e checklists", description: "Gerenciar contatos de segurança e ver checklists institucionais." },
  { href: "/admin/auditoria", title: "Trilha de auditoria", description: "Histórico de ações administrativas." },
];

export default function AdminPage() {
  const { user } = useAuth();

  if (!user || user.role !== "administrador") {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center sm:px-6">
        <h1 className="text-xl font-semibold text-[var(--nr-text)]">Painel administrativo</h1>
        <p className="mt-2 text-[var(--nr-text-muted)]">
          Esta área é restrita a contas com papel de administrador(a).
        </p>
        <Link href="/configuracoes/conta" className="mt-4 inline-block text-[var(--nr-accent-primary)] hover:underline">
          Ir para Minha conta
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-[var(--nr-text)]">Painel administrativo</h1>
      <p className="mt-2 text-sm text-[var(--nr-text-muted)]">
        Modo demonstrativo: as ações aqui afetam apenas os dados armazenados neste navegador.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <Link key={s.href} href={s.href} className="rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-5 hover:border-[var(--nr-accent-primary)]">
            <h2 className="font-semibold text-[var(--nr-text)]">{s.title}</h2>
            <p className="mt-1 text-sm text-[var(--nr-text-muted)]">{s.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
