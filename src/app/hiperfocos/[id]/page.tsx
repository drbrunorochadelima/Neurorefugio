"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import {
  getHyperfocus,
  removeHyperfocus,
  updateHyperfocus,
} from "@/lib/services/hyperfocus";
import { generateId } from "@/lib/storage/local-collection";

export default function HiperfocoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [hyperfocus, setHyperfocus] = useState(() => getHyperfocus(id));
  const [linkTitulo, setLinkTitulo] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [timelineData, setTimelineData] = useState("");
  const [timelineDescricao, setTimelineDescricao] = useState("");

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center sm:px-6">
        <p className="text-[var(--nr-text)]">Entre para ver este hiperfoco.</p>
        <Link href="/entrar" className="mt-4 inline-block text-[var(--nr-accent-primary)] hover:underline">
          Entrar
        </Link>
      </div>
    );
  }

  if (!hyperfocus || hyperfocus.userId !== user.id) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center sm:px-6">
        <p className="text-[var(--nr-text)]">Hiperfoco não encontrado.</p>
        <Link href="/hiperfocos" className="mt-4 inline-block text-[var(--nr-accent-primary)] hover:underline">
          Voltar
        </Link>
      </div>
    );
  }

  function refresh() {
    setHyperfocus(getHyperfocus(id));
  }

  function toggleFavorite() {
    if (!hyperfocus) return;
    updateHyperfocus(hyperfocus.id, { favorito: !hyperfocus.favorito });
    refresh();
  }

  function togglePrivacy() {
    if (!hyperfocus) return;
    updateHyperfocus(hyperfocus.id, { privado: !hyperfocus.privado });
    refresh();
  }

  function handleAddLink(e: React.FormEvent) {
    e.preventDefault();
    if (!hyperfocus || !linkTitulo.trim() || !linkUrl.trim()) return;
    updateHyperfocus(hyperfocus.id, {
      links: [...hyperfocus.links, { id: generateId("link"), titulo: linkTitulo.trim(), url: linkUrl.trim() }],
    });
    setLinkTitulo("");
    setLinkUrl("");
    refresh();
  }

  function handleRemoveLink(linkId: string) {
    if (!hyperfocus) return;
    updateHyperfocus(hyperfocus.id, { links: hyperfocus.links.filter((l) => l.id !== linkId) });
    refresh();
  }

  function handleAddTimeline(e: React.FormEvent) {
    e.preventDefault();
    if (!hyperfocus || !timelineDescricao.trim()) return;
    updateHyperfocus(hyperfocus.id, {
      timeline: [
        ...hyperfocus.timeline,
        { id: generateId("tl"), data: timelineData || new Date().toISOString().slice(0, 10), descricao: timelineDescricao.trim() },
      ],
    });
    setTimelineData("");
    setTimelineDescricao("");
    refresh();
  }

  function handleRemoveTimeline(itemId: string) {
    if (!hyperfocus) return;
    updateHyperfocus(hyperfocus.id, { timeline: hyperfocus.timeline.filter((t) => t.id !== itemId) });
    refresh();
  }

  function handleDelete() {
    removeHyperfocus(id);
    router.push("/hiperfocos");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="flex items-start justify-between gap-3">
        <h1 className="text-2xl font-bold text-[var(--nr-text)]">{hyperfocus.titulo}</h1>
        <button type="button" onClick={handleDelete} className="rounded-lg border border-[var(--nr-border)] px-3 py-1.5 text-sm text-[var(--nr-danger)]">
          Excluir
        </button>
      </div>
      {hyperfocus.categoria && <p className="mt-1 text-sm text-[var(--nr-text-muted)]">{hyperfocus.categoria}</p>}
      {hyperfocus.descricao && <p className="mt-3 text-[var(--nr-text)]">{hyperfocus.descricao}</p>}

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={toggleFavorite} className="rounded-lg border border-[var(--nr-border)] px-3 py-1.5 text-sm text-[var(--nr-text)]">
          {hyperfocus.favorito ? "★ Remover dos favoritos" : "☆ Favoritar"}
        </button>
        <button type="button" onClick={togglePrivacy} className="rounded-lg border border-[var(--nr-border)] px-3 py-1.5 text-sm text-[var(--nr-text)]">
          {hyperfocus.privado ? "Privado — tornar visível" : "Visível — tornar privado"}
        </button>
      </div>

      <section className="mt-6 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6">
        <h2 className="text-lg font-semibold text-[var(--nr-text)]">Coleção de links</h2>
        {hyperfocus.links.length > 0 && (
          <ul className="mt-2 flex flex-col gap-2">
            {hyperfocus.links.map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-2 text-sm">
                <a href={l.url} target="_blank" rel="noreferrer" className="text-[var(--nr-accent-primary)] hover:underline">
                  {l.titulo}
                </a>
                <button type="button" onClick={() => handleRemoveLink(l.id)} className="text-xs text-[var(--nr-danger)]">
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}
        <form onSubmit={handleAddLink} className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input value={linkTitulo} onChange={(e) => setLinkTitulo(e.target.value)} placeholder="Título" className="flex-1 rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface)] px-3 py-2 text-sm text-[var(--nr-text)]" />
          <input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." className="flex-1 rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface)] px-3 py-2 text-sm text-[var(--nr-text)]" />
          <button type="submit" className="rounded-lg border border-[var(--nr-border)] px-3 py-2 text-sm text-[var(--nr-text)]">
            Adicionar
          </button>
        </form>
      </section>

      <section className="mt-4 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6">
        <h2 className="text-lg font-semibold text-[var(--nr-text)]">Linha do tempo de descobertas</h2>
        {hyperfocus.timeline.length > 0 && (
          <ol className="mt-2 flex flex-col gap-2">
            {hyperfocus.timeline
              .slice()
              .sort((a, b) => (a.data < b.data ? -1 : 1))
              .map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-2 border-l-2 border-[var(--nr-border)] pl-3 text-sm">
                  <span>
                    <span className="text-[var(--nr-text-muted)]">{t.data}: </span>
                    {t.descricao}
                  </span>
                  <button type="button" onClick={() => handleRemoveTimeline(t.id)} className="text-xs text-[var(--nr-danger)]">
                    Remover
                  </button>
                </li>
              ))}
          </ol>
        )}
        <form onSubmit={handleAddTimeline} className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input type="date" value={timelineData} onChange={(e) => setTimelineData(e.target.value)} className="rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface)] px-3 py-2 text-sm text-[var(--nr-text)]" />
          <input value={timelineDescricao} onChange={(e) => setTimelineDescricao(e.target.value)} placeholder="O que você descobriu?" className="flex-1 rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface)] px-3 py-2 text-sm text-[var(--nr-text)]" />
          <button type="submit" className="rounded-lg border border-[var(--nr-border)] px-3 py-2 text-sm text-[var(--nr-text)]">
            Adicionar
          </button>
        </form>
      </section>

      <Link href="/hiperfocos" className="mt-6 inline-block text-sm text-[var(--nr-accent-primary)] hover:underline">
        Voltar para Hiperfocos
      </Link>
    </div>
  );
}
