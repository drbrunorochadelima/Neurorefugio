"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";
import { createHyperfocus, listHyperfocuses } from "@/lib/services/hyperfocus";
import { TextField } from "@/components/form/TextField";

export default function HiperfocosPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center sm:px-6">
        <h1 className="text-xl font-semibold text-[var(--nr-text)]">Hiperfocos</h1>
        <p className="mt-2 text-[var(--nr-text-muted)]">Entre para cadastrar e explorar seus hiperfocos.</p>
        <Link href="/entrar" className="mt-4 inline-block text-[var(--nr-accent-primary)] underline">
          Entrar
        </Link>
      </div>
    );
  }

  return <HiperfocosManager userId={user.id} />;
}

function HiperfocosManager({ userId }: { userId: string }) {
  const [list, setList] = useState(() => listHyperfocuses(userId));
  const [search, setSearch] = useState("");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [creating, setCreating] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [privado, setPrivado] = useState(true);

  function refresh() {
    setList(listHyperfocuses(userId));
  }

  const filtered = useMemo(() => {
    return list.filter((h) => {
      if (onlyFavorites && !h.favorito) return false;
      if (search && !`${h.titulo} ${h.categoria ?? ""}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [list, search, onlyFavorites]);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo.trim()) return;
    createHyperfocus(userId, {
      titulo: titulo.trim(),
      categoria: categoria || undefined,
      descricao: descricao || undefined,
      privado,
      favorito: false,
    });
    setTitulo("");
    setCategoria("");
    setDescricao("");
    setPrivado(true);
    setCreating(false);
    refresh();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-[var(--nr-text)]">Hiperfocos</h1>
      <p className="mt-2 max-w-2xl text-[var(--nr-text-muted)]">
        Hiperfocos podem ser fonte de prazer, conhecimento, identidade e pertencimento — não
        funcionam do mesmo jeito para todo mundo, e isso está tudo bem.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por título ou categoria"
          className="flex-1 rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface)] px-3 py-2 text-sm text-[var(--nr-text)]"
        />
        <label className="flex items-center gap-2 text-sm text-[var(--nr-text)]">
          <input
            type="checkbox"
            checked={onlyFavorites}
            onChange={(e) => setOnlyFavorites(e.target.checked)}
            className="h-4 w-4 accent-[var(--nr-accent-primary)]"
          />
          Só favoritos
        </label>
        <button
          type="button"
          onClick={() => setCreating((v) => !v)}
          className="rounded-lg bg-[var(--nr-accent-primary)] px-4 py-2 text-sm font-semibold text-[var(--nr-text-on-accent)]"
        >
          {creating ? "Cancelar" : "Novo hiperfoco"}
        </button>
      </div>

      {creating && (
        <form onSubmit={handleCreate} className="mt-4 flex flex-col gap-3 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6">
          <TextField label="Título" value={titulo} onChange={setTitulo} required />
          <TextField label="Categoria (opcional)" value={categoria} onChange={setCategoria} />
          <div>
            <label htmlFor="descricao-hf" className="text-sm font-medium text-[var(--nr-text)]">
              Descrição (opcional)
            </label>
            <textarea
              id="descricao-hf"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface)] px-3 py-2 text-sm text-[var(--nr-text)]"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-[var(--nr-text)]">
            <input
              type="checkbox"
              checked={privado}
              onChange={(e) => setPrivado(e.target.checked)}
              className="h-4 w-4 accent-[var(--nr-accent-primary)]"
            />
            Manter privado
          </label>
          <button type="submit" className="self-start rounded-lg bg-[var(--nr-accent-primary)] px-4 py-2 text-sm font-semibold text-[var(--nr-text-on-accent)]">
            Criar hiperfoco
          </button>
        </form>
      )}

      {filtered.length > 0 ? (
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map((h) => (
            <li key={h.id}>
              <Link
                href={`/hiperfocos/${h.id}`}
                className="block rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-4 hover:border-[var(--nr-accent-primary)]"
              >
                <p className="font-semibold text-[var(--nr-text)]">
                  {h.favorito && "★ "}
                  {h.titulo}
                </p>
                {h.categoria && <p className="text-sm text-[var(--nr-text-muted)]">{h.categoria}</p>}
                <p className="mt-1 text-xs text-[var(--nr-text-muted)]">{h.privado ? "Privado" : "Visível"}</p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-sm text-[var(--nr-text-muted)]">Nenhum hiperfoco encontrado.</p>
      )}

      <p className="mt-8 text-sm text-[var(--nr-text-muted)]">
        Quer encontrar pessoas com interesses parecidos?{" "}
        <Link href="/comunidade?categoria=hiperfocos" className="text-[var(--nr-accent-primary)] underline">
          Veja a categoria Hiperfocos na Comunidade
        </Link>
        .
      </p>
    </div>
  );
}
