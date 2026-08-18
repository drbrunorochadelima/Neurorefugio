"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";
import {
  listPostsForModeration,
  listReports,
  publishPost,
  removePost,
  resolveReport,
} from "@/lib/services/community";
import { FORUM_CATEGORY_LABELS } from "@/lib/schemas/community";
import { logAdminAction } from "@/lib/services/audit-log";

export default function AdminModeracaoPage() {
  const { user } = useAuth();
  const isModerator = user?.role === "administrador" || user?.role === "moderador";
  const [pendingPosts, setPendingPosts] = useState<ReturnType<typeof listPostsForModeration>>([]);
  const [reports, setReports] = useState<ReturnType<typeof listReports>>([]);

  useEffect(() => {
    if (!isModerator) return;
    const timeout = setTimeout(() => {
      setPendingPosts(listPostsForModeration());
      setReports(listReports());
    }, 0);
    return () => clearTimeout(timeout);
  }, [isModerator]);

  if (!user || (user.role !== "administrador" && user.role !== "moderador")) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center sm:px-6">
        <p className="text-[var(--nr-text)]">Acesso restrito a administradores e moderadores.</p>
        <Link href="/admin" className="mt-4 inline-block text-[var(--nr-accent-primary)] hover:underline">
          Voltar
        </Link>
      </div>
    );
  }

  function handlePublish(postId: string, titulo: string) {
    publishPost(postId);
    logAdminAction(user!.id, user!.pseudonym, `Publicou a publicação "${titulo}"`);
    setPendingPosts(listPostsForModeration());
  }

  function handleReject(postId: string, titulo: string) {
    removePost(postId);
    logAdminAction(user!.id, user!.pseudonym, `Rejeitou e removeu a publicação "${titulo}"`);
    setPendingPosts(listPostsForModeration());
  }

  function handleResolveReport(reportId: string) {
    resolveReport(reportId);
    logAdminAction(user!.id, user!.pseudonym, `Marcou denúncia ${reportId} como resolvida`);
    setReports(listReports());
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-[var(--nr-text)]">Moderação da comunidade</h1>

      <section className="mt-6">
        <h2 className="text-lg font-semibold text-[var(--nr-text)]">Publicações aguardando revisão</h2>
        {pendingPosts.length > 0 ? (
          <ul className="mt-3 flex flex-col gap-3">
            {pendingPosts.map((post) => (
              <li key={post.id} className="rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-5">
                <p className="text-xs uppercase tracking-wide text-[var(--nr-accent-secondary)]">
                  {FORUM_CATEGORY_LABELS[post.categoria]}
                </p>
                <h3 className="mt-1 font-semibold text-[var(--nr-text)]">{post.titulo}</h3>
                <p className="mt-1 text-sm text-[var(--nr-text-muted)]">{post.corpo}</p>
                <p className="mt-1 text-xs text-[var(--nr-text-muted)]">{post.authorDisplayName}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handlePublish(post.id, post.titulo)}
                    className="rounded-lg bg-[var(--nr-accent-primary)] px-3 py-1.5 text-sm font-semibold text-[var(--nr-text-on-accent)]"
                  >
                    Publicar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReject(post.id, post.titulo)}
                    className="rounded-lg border border-[var(--nr-danger)] px-3 py-1.5 text-sm text-[var(--nr-danger)]"
                  >
                    Rejeitar e remover
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-[var(--nr-text-muted)]">Nenhuma publicação aguardando revisão.</p>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-[var(--nr-text)]">Denúncias</h2>
        {reports.length > 0 ? (
          <ul className="mt-3 flex flex-col gap-3">
            {reports.map((report) => (
              <li key={report.id} className="rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-4">
                <p className="text-sm text-[var(--nr-text)]">
                  {report.targetType} · {report.targetId}
                </p>
                <p className="mt-1 text-sm text-[var(--nr-text-muted)]">{report.motivo}</p>
                <p className="mt-1 text-xs text-[var(--nr-text-muted)]">Status: {report.status}</p>
                {report.status !== "resolvida" && (
                  <button
                    type="button"
                    onClick={() => handleResolveReport(report.id)}
                    className="mt-2 rounded-lg border border-[var(--nr-border)] px-3 py-1.5 text-sm text-[var(--nr-text)]"
                  >
                    Marcar como resolvida
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-[var(--nr-text-muted)]">Nenhuma denúncia registrada.</p>
        )}
      </section>

      <Link href="/admin" className="mt-8 inline-block text-sm text-[var(--nr-accent-primary)] hover:underline">
        Voltar ao painel
      </Link>
    </div>
  );
}
