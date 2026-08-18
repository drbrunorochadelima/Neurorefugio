"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { getArticleBySlug, listArticles } from "@/lib/services/library";
import { CONTENT_CLASSIFICATION_LABELS } from "@/lib/schemas/library";
import type { LibraryArticle } from "@/lib/schemas/library";

export default function ArtigoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [loaded, setLoaded] = useState(false);
  const [article, setArticle] = useState<LibraryArticle | undefined>(undefined);
  const [related, setRelated] = useState<LibraryArticle[]>([]);
  const [depth, setDepth] = useState<"resumo" | "aprofundado">("resumo");

  useEffect(() => {
    const timeout = setTimeout(() => {
      const found = getArticleBySlug(slug);
      setArticle(found);
      if (found) {
        setRelated(listArticles().filter((a) => found.relacionados.includes(a.id)));
      }
      setLoaded(true);
    }, 0);
    return () => clearTimeout(timeout);
  }, [slug]);

  if (!loaded) return null;

  if (!article) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center sm:px-6">
        <p className="text-[var(--nr-text)]">Conteúdo não encontrado.</p>
        <Link href="/biblioteca" className="mt-4 inline-block text-[var(--nr-accent-primary)] hover:underline">
          Voltar para a Biblioteca
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--nr-text-muted)]">
        <span className="rounded-full bg-[var(--nr-surface-alt)] px-2 py-0.5">
          {CONTENT_CLASSIFICATION_LABELS[article.classificacao]}
        </span>
        {article.status !== "revisado" && (
          <span className="rounded-full bg-[var(--nr-surface-alt)] px-2 py-0.5">
            {article.status === "demonstrativo" ? "Demonstrativo" : "Pendente de revisão"}
          </span>
        )}
      </div>

      <h1 className="mt-2 text-2xl font-bold text-[var(--nr-text)]">{article.titulo}</h1>
      <p className="mt-1 text-sm text-[var(--nr-text-muted)]">
        {article.autoria} · publicado em {article.dataPublicacao} · atualizado em {article.ultimaAtualizacao}
        {article.revisadoPor && ` · revisado por ${article.revisadoPor}`}
      </p>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => setDepth("resumo")}
          aria-pressed={depth === "resumo"}
          className={`rounded-lg border px-3 py-1.5 text-sm ${depth === "resumo" ? "border-[var(--nr-accent-primary)] font-semibold text-[var(--nr-accent-primary)]" : "border-[var(--nr-border)] text-[var(--nr-text)]"}`}
        >
          Linguagem simples
        </button>
        <button
          type="button"
          onClick={() => setDepth("aprofundado")}
          aria-pressed={depth === "aprofundado"}
          className={`rounded-lg border px-3 py-1.5 text-sm ${depth === "aprofundado" ? "border-[var(--nr-accent-primary)] font-semibold text-[var(--nr-accent-primary)]" : "border-[var(--nr-border)] text-[var(--nr-text)]"}`}
        >
          Versão aprofundada
        </button>
      </div>

      <div className="mt-4 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6">
        <p className="whitespace-pre-wrap text-[var(--nr-text)]">
          {depth === "resumo" ? article.corpoResumido : article.corpoAprofundado}
        </p>
      </div>

      {article.referencias.length > 0 && (
        <div className="mt-4 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6">
          <h2 className="text-sm font-semibold text-[var(--nr-text)]">Referências</h2>
          <ul className="mt-2 flex flex-col gap-1 text-sm text-[var(--nr-text-muted)]">
            {article.referencias.map((r) => (
              <li key={r.citacao}>
                {r.url ? (
                  <a href={r.url} target="_blank" rel="noreferrer" className="text-[var(--nr-accent-primary)] hover:underline">
                    {r.citacao}
                  </a>
                ) : (
                  r.citacao
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-4">
          <h2 className="text-sm font-semibold text-[var(--nr-text)]">Conteúdos relacionados</h2>
          <ul className="mt-2 flex flex-col gap-1">
            {related.map((r) => (
              <li key={r.id}>
                <Link href={`/biblioteca/${r.slug}`} className="text-sm text-[var(--nr-accent-primary)] hover:underline">
                  {r.titulo}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link href="/biblioteca" className="mt-6 inline-block text-sm text-[var(--nr-accent-primary)] hover:underline">
        Voltar para a Biblioteca
      </Link>
    </div>
  );
}
