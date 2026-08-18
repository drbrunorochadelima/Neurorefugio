"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { listArticles } from "@/lib/services/library";
import {
  CONTENT_CLASSIFICATION_LABELS,
  LIBRARY_AXES,
  type ContentClassification,
  type LibraryArticle,
  type LibraryAxis,
} from "@/lib/schemas/library";

const AXIS_LABELS: Record<LibraryAxis, string> = {
  luzes: "Luzes",
  alarmes: "Alarmes",
  silencio: "Silêncio",
  geral: "Geral",
};

function BibliotecaContent() {
  const searchParams = useSearchParams();
  const initialAxis = searchParams.get("eixo") as LibraryAxis | null;
  const [axis, setAxis] = useState<LibraryAxis | null>(
    initialAxis && LIBRARY_AXES.includes(initialAxis) ? initialAxis : null,
  );
  const [classification, setClassification] = useState<ContentClassification | null>(null);
  const [search, setSearch] = useState("");
  const [articles, setArticles] = useState<LibraryArticle[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => setArticles(listArticles()), 0);
    return () => clearTimeout(timeout);
  }, []);

  const filtered = articles.filter((a) => {
    if (axis && a.eixo !== axis) return false;
    if (classification && a.classificacao !== classification) return false;
    if (search && !`${a.titulo} ${a.resumo}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-[var(--nr-text)]">Biblioteca científica</h1>
      <p className="mt-2 max-w-2xl text-[var(--nr-text-muted)]">
        Conteúdos sobre autismo, neurodiversidade, masking, sobrecarga, capacitismo e o
        corpo-monitor, classificados por tipo. Conteúdos ainda não revisados formalmente estão
        marcados como demonstrativos ou pendentes de revisão.
      </p>

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar na biblioteca"
        className="mt-4 w-full rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface)] px-3 py-2 text-sm text-[var(--nr-text)]"
      />

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setAxis(null)}
          aria-pressed={axis === null}
          className={`rounded-lg border px-3 py-1.5 text-xs ${axis === null ? "border-[var(--nr-accent-primary)] font-semibold text-[var(--nr-accent-primary)]" : "border-[var(--nr-border)] text-[var(--nr-text)]"}`}
        >
          Todos os eixos
        </button>
        {LIBRARY_AXES.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => setAxis(a)}
            aria-pressed={axis === a}
            className={`rounded-lg border px-3 py-1.5 text-xs ${axis === a ? "border-[var(--nr-accent-primary)] font-semibold text-[var(--nr-accent-primary)]" : "border-[var(--nr-border)] text-[var(--nr-text)]"}`}
          >
            {AXIS_LABELS[a]}
          </button>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setClassification(null)}
          aria-pressed={classification === null}
          className={`rounded-lg border px-3 py-1.5 text-xs ${classification === null ? "border-[var(--nr-accent-primary)] font-semibold text-[var(--nr-accent-primary)]" : "border-[var(--nr-border)] text-[var(--nr-text)]"}`}
        >
          Todas as classificações
        </button>
        {Object.entries(CONTENT_CLASSIFICATION_LABELS).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setClassification(value as ContentClassification)}
            aria-pressed={classification === value}
            className={`rounded-lg border px-3 py-1.5 text-xs ${classification === value ? "border-[var(--nr-accent-primary)] font-semibold text-[var(--nr-accent-primary)]" : "border-[var(--nr-border)] text-[var(--nr-text)]"}`}
          >
            {label}
          </button>
        ))}
      </div>

      <ul className="mt-6 flex flex-col gap-3">
        {filtered.map((article) => (
          <li key={article.id}>
            <Link
              href={`/biblioteca/${article.slug}`}
              className="block rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-5 hover:border-[var(--nr-accent-primary)]"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--nr-text-muted)]">
                <span className="rounded-full bg-[var(--nr-surface-alt)] px-2 py-0.5">
                  {CONTENT_CLASSIFICATION_LABELS[article.classificacao]}
                </span>
                <span className="rounded-full bg-[var(--nr-surface-alt)] px-2 py-0.5">{AXIS_LABELS[article.eixo]}</span>
                {article.status !== "revisado" && (
                  <span className="rounded-full bg-[var(--nr-surface-alt)] px-2 py-0.5">
                    {article.status === "demonstrativo" ? "Demonstrativo" : "Pendente de revisão"}
                  </span>
                )}
              </div>
              <h2 className="mt-2 font-semibold text-[var(--nr-text)]">{article.titulo}</h2>
              <p className="mt-1 text-sm text-[var(--nr-text-muted)]">{article.resumo}</p>
            </Link>
          </li>
        ))}
        {filtered.length === 0 && <p className="text-sm text-[var(--nr-text-muted)]">Nenhum conteúdo encontrado.</p>}
      </ul>
    </div>
  );
}

export default function BibliotecaPage() {
  return (
    <Suspense fallback={null}>
      <BibliotecaContent />
    </Suspense>
  );
}
