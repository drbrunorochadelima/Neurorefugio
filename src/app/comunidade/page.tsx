"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { listPublishedPosts, listMyPosts, COMMUNITY_PILOT_CLOSED } from "@/lib/services/community";
import { FORUM_CATEGORIES, FORUM_CATEGORY_LABELS, type ForumCategory } from "@/lib/schemas/community";

function ComunidadeContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("categoria") as ForumCategory | null;
  const [category, setCategory] = useState<ForumCategory | null>(
    initialCategory && FORUM_CATEGORIES.includes(initialCategory) ? initialCategory : null,
  );
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState<ReturnType<typeof listPublishedPosts>>([]);
  const [myPending, setMyPending] = useState<ReturnType<typeof listMyPosts>>([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let list = listPublishedPosts();
      if (category) list = list.filter((p) => p.categoria === category);
      if (search) {
        const q = search.toLowerCase();
        list = list.filter((p) => p.titulo.toLowerCase().includes(q) || p.corpo.toLowerCase().includes(q));
      }
      setPosts(list);
    }, 0);
    return () => clearTimeout(timeout);
  }, [category, search]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMyPending(user ? listMyPosts(user.id).filter((p) => p.status !== "publicado") : []);
    }, 0);
    return () => clearTimeout(timeout);
  }, [user]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-[var(--nr-text)]">Comunidade</h1>
      {COMMUNITY_PILOT_CLOSED && (
        <p className="mt-2 rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface-alt)] p-3 text-sm text-[var(--nr-text-muted)]">
          Piloto fechado: publicações passam por revisão antes de ficarem visíveis a outras pessoas.
          Não publique dados pessoais identificáveis seus ou de terceiros.
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar publicações"
          className="flex-1 rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface)] px-3 py-2 text-sm text-[var(--nr-text)]"
        />
        {user && (
          <Link href="/comunidade/nova" className="rounded-lg bg-[var(--nr-accent-primary)] px-4 py-2 text-sm font-semibold text-[var(--nr-text-on-accent)]">
            Nova publicação
          </Link>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory(null)}
          aria-pressed={category === null}
          className={`rounded-lg border px-3 py-1.5 text-xs ${category === null ? "border-[var(--nr-accent-primary)] font-semibold text-[var(--nr-accent-primary)]" : "border-[var(--nr-border)] text-[var(--nr-text)]"}`}
        >
          Todas
        </button>
        {FORUM_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
            className={`rounded-lg border px-3 py-1.5 text-xs ${category === c ? "border-[var(--nr-accent-primary)] font-semibold text-[var(--nr-accent-primary)]" : "border-[var(--nr-border)] text-[var(--nr-text)]"}`}
          >
            {FORUM_CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      {myPending.length > 0 && (
        <div className="mt-5 rounded-2xl border border-dashed border-[var(--nr-border)] p-4">
          <p className="text-sm font-medium text-[var(--nr-text)]">Minhas publicações pendentes</p>
          <ul className="mt-2 flex flex-col gap-1">
            {myPending.map((p) => (
              <li key={p.id} className="text-sm text-[var(--nr-text-muted)]">
                {p.titulo} —{" "}
                {p.status === "rascunho" ? "rascunho (não enviado)" : "aguardando revisão"}
              </li>
            ))}
          </ul>
        </div>
      )}

      <ul className="mt-6 flex flex-col gap-3">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              href={`/comunidade/${post.id}`}
              className="block rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-5 hover:border-[var(--nr-accent-primary)]"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--nr-accent-secondary-text)]">
                {FORUM_CATEGORY_LABELS[post.categoria]}
              </p>
              <h2 className="mt-1 font-semibold text-[var(--nr-text)]">{post.titulo}</h2>
              {post.avisoConteudo && (
                <p className="mt-1 text-xs text-[var(--nr-danger)]">Aviso de conteúdo: {post.avisoConteudo}</p>
              )}
              <p className="mt-2 line-clamp-2 text-sm text-[var(--nr-text-muted)]">{post.corpo}</p>
              <p className="mt-2 text-xs text-[var(--nr-text-muted)]">{post.authorDisplayName}</p>
            </Link>
          </li>
        ))}
        {posts.length === 0 && (
          <p className="text-sm text-[var(--nr-text-muted)]">Nenhuma publicação encontrada.</p>
        )}
      </ul>
    </div>
  );
}

export default function ComunidadePage() {
  return (
    <Suspense fallback={null}>
      <ComunidadeContent />
    </Suspense>
  );
}
