"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";
import {
  addComment,
  blockUser,
  getPost,
  listBlockedUserIds,
  listCommentsForPost,
  reactToPost,
  reportContent,
} from "@/lib/services/community";
import { FORUM_CATEGORY_LABELS, REACTION_LABELS, REACTION_TYPES } from "@/lib/schemas/community";
import { categoryColor } from "@/lib/category-colors";

export default function PublicacaoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const [loaded, setLoaded] = useState(false);
  const [post, setPost] = useState<ReturnType<typeof getPost>>(undefined);
  const [comments, setComments] = useState<ReturnType<typeof listCommentsForPost>>([]);
  const [novoComentario, setNovoComentario] = useState("");
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSent, setReportSent] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPost(getPost(id));
      setComments(listCommentsForPost(id));
      setLoaded(true);
    }, 0);
    return () => clearTimeout(timeout);
  }, [id]);

  if (!loaded) return null;

  if (!post || post.status !== "publicado") {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center sm:px-6">
        <p className="text-[var(--nr-text)]">Publicação não encontrada ou ainda não publicada.</p>
        <Link href="/comunidade" className="mt-4 inline-block text-[var(--nr-accent-primary)] underline">
          Voltar para a Comunidade
        </Link>
      </div>
    );
  }

  const blocked = user ? listBlockedUserIds(user.id) : [];
  if (blocked.includes(post.authorId)) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center sm:px-6">
        <p className="text-[var(--nr-text)]">Você bloqueou o autor desta publicação.</p>
        <Link href="/comunidade" className="mt-4 inline-block text-[var(--nr-accent-primary)] underline">
          Voltar para a Comunidade
        </Link>
      </div>
    );
  }

  function refreshPost() {
    setPost(getPost(id));
  }

  function handleReact(reaction: (typeof REACTION_TYPES)[number]) {
    if (!user || !post) return;
    reactToPost(post.id, reaction, user.id);
    refreshPost();
  }

  function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !novoComentario.trim() || !post) return;
    addComment({
      postId: post.id,
      authorId: user.id,
      authorDisplayName: user.nomeSocial || user.pseudonym,
      corpo: novoComentario.trim(),
    });
    setNovoComentario("");
    setComments(listCommentsForPost(post.id));
  }

  function handleReport(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !post || !reportReason.trim()) return;
    reportContent({ reporterId: user.id, targetType: "post", targetId: post.id, motivo: reportReason.trim() });
    setReportSent(true);
    setReportReason("");
    setReportOpen(false);
  }

  function handleBlock() {
    if (!user || !post) return;
    blockUser(user.id, post.authorId);
    refreshPost();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <span
        className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide"
        style={{ background: categoryColor(post.categoria).bg, color: categoryColor(post.categoria).text }}
      >
        {FORUM_CATEGORY_LABELS[post.categoria]}
      </span>
      <h1 className="mt-1 text-2xl font-bold text-[var(--nr-text)]">{post.titulo}</h1>
      <p className="mt-1 text-sm text-[var(--nr-text-muted)]">{post.authorDisplayName}</p>
      {post.avisoConteudo && (
        <p className="mt-2 rounded-lg border border-[var(--nr-danger)]/40 bg-[var(--nr-surface-alt)] p-2 text-sm text-[var(--nr-danger)]">
          Aviso de conteúdo: {post.avisoConteudo}
        </p>
      )}
      <p className="mt-4 whitespace-pre-wrap text-[var(--nr-text)]">{post.corpo}</p>

      {user && (
        <div className="mt-4 flex flex-wrap gap-2">
          {REACTION_TYPES.map((r) => {
            const count = post.reactions[r]?.length ?? 0;
            const reacted = post.reactions[r]?.includes(user.id);
            return (
              <button
                key={r}
                type="button"
                onClick={() => handleReact(r)}
                aria-pressed={reacted}
                className={`rounded-lg border px-3 py-1.5 text-xs ${reacted ? "border-[var(--nr-accent-primary)] font-semibold text-[var(--nr-accent-primary)]" : "border-[var(--nr-border)] text-[var(--nr-text)]"}`}
              >
                {REACTION_LABELS[r]} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>
      )}

      {user && user.id !== post.authorId && (
        <div className="mt-4 flex gap-3 text-sm">
          <button type="button" onClick={() => setReportOpen((v) => !v)} className="text-[var(--nr-text-muted)] hover:underline">
            Denunciar
          </button>
          <button type="button" onClick={handleBlock} className="text-[var(--nr-text-muted)] hover:underline">
            Bloquear autor(a)
          </button>
        </div>
      )}

      {reportOpen && (
        <form onSubmit={handleReport} className="mt-3 flex flex-col gap-2 rounded-lg border border-[var(--nr-border)] p-3">
          <label htmlFor="motivo-denuncia" className="text-sm font-medium text-[var(--nr-text)]">
            Motivo da denúncia
          </label>
          <textarea
            id="motivo-denuncia"
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface)] px-3 py-2 text-sm text-[var(--nr-text)]"
          />
          <button type="submit" className="self-start rounded-lg border border-[var(--nr-border)] px-3 py-1.5 text-sm text-[var(--nr-text)]">
            Enviar denúncia
          </button>
        </form>
      )}
      {reportSent && <p className="mt-2 text-sm text-[var(--nr-success)]">Denúncia enviada à moderação.</p>}

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-[var(--nr-text)]">Comentários</h2>
        {comments.length > 0 ? (
          <ul className="mt-3 flex flex-col gap-3">
            {comments
              .filter((c) => !blocked.includes(c.authorId))
              .map((c) => (
                <li key={c.id} className="rounded-lg border border-[var(--nr-border)] p-3 text-sm">
                  <p className="font-medium text-[var(--nr-text)]">{c.authorDisplayName}</p>
                  <p className="mt-1 text-[var(--nr-text)]">{c.corpo}</p>
                </li>
              ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-[var(--nr-text-muted)]">Nenhum comentário ainda.</p>
        )}

        {user ? (
          <form onSubmit={handleComment} className="mt-4 flex flex-col gap-2">
            <label htmlFor="novo-comentario" className="sr-only">
              Novo comentário
            </label>
            <textarea
              id="novo-comentario"
              value={novoComentario}
              onChange={(e) => setNovoComentario(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface)] px-3 py-2 text-sm text-[var(--nr-text)]"
            />
            <button type="submit" className="self-start rounded-lg bg-[var(--nr-accent-primary)] px-4 py-2 text-sm font-semibold text-[var(--nr-text-on-accent)]">
              Comentar
            </button>
          </form>
        ) : (
          <p className="mt-3 text-sm text-[var(--nr-text-muted)]">
            <Link href="/entrar" className="text-[var(--nr-accent-primary)] underline">
              Entre
            </Link>{" "}
            para comentar.
          </p>
        )}
      </section>

      <Link href="/comunidade" className="mt-8 inline-block text-sm text-[var(--nr-accent-primary)] underline">
        Voltar para a Comunidade
      </Link>
    </div>
  );
}
