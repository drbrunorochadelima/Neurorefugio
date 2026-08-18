"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";
import { listAuditLog } from "@/lib/services/audit-log";

export default function AdminAuditoriaPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "administrador";
  const [log, setLog] = useState<ReturnType<typeof listAuditLog>>([]);

  useEffect(() => {
    if (!isAdmin) return;
    const timeout = setTimeout(() => setLog(listAuditLog()), 0);
    return () => clearTimeout(timeout);
  }, [isAdmin]);

  if (!user || user.role !== "administrador") {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center sm:px-6">
        <p className="text-[var(--nr-text)]">Acesso restrito a administradores.</p>
        <Link href="/admin" className="mt-4 inline-block text-[var(--nr-accent-primary)] underline">
          Voltar
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-[var(--nr-text)]">Trilha de auditoria</h1>
      <p className="mt-2 text-sm text-[var(--nr-text-muted)]">
        Registro de ações administrativas. Nenhum dado sensível de usuário é exposto aqui — apenas
        a ação e quem a executou.
      </p>

      {log.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-2">
          {log.map((entry) => (
            <li key={entry.id} className="rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface)] p-3 text-sm">
              <p className="text-[var(--nr-text)]">{entry.action}</p>
              <p className="text-xs text-[var(--nr-text-muted)]">
                {entry.actorLabel} · {new Date(entry.createdAt).toLocaleString("pt-BR")}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-[var(--nr-text-muted)]">Nenhuma ação registrada ainda.</p>
      )}

      <Link href="/admin" className="mt-6 inline-block text-sm text-[var(--nr-accent-primary)] underline">
        Voltar ao painel
      </Link>
    </div>
  );
}
