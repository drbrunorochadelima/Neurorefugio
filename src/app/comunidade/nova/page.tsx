"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { createDraftPost, submitPostForReview } from "@/lib/services/community";
import { FORUM_CATEGORIES, FORUM_CATEGORY_LABELS, type ForumCategory } from "@/lib/schemas/community";
import { TextField } from "@/components/form/TextField";

export default function NovaPublicacaoPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [categoria, setCategoria] = useState<ForumCategory>("desabafos");
  const [titulo, setTitulo] = useState("");
  const [corpo, setCorpo] = useState("");
  const [avisoConteudo, setAvisoConteudo] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center sm:px-6">
        <p className="text-[var(--nr-text)]">Entre para publicar na comunidade.</p>
        <Link href="/entrar" className="mt-4 inline-block text-[var(--nr-accent-primary)] hover:underline">
          Entrar
        </Link>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (titulo.trim().length < 3 || corpo.trim().length < 1) {
      setError("Preencha título e texto antes de enviar.");
      return;
    }
    const post = createDraftPost({
      authorId: user.id,
      authorDisplayName: user.nomeSocial || user.pseudonym,
      categoria,
      titulo: titulo.trim(),
      corpo: corpo.trim(),
      avisoConteudo: avisoConteudo || undefined,
    });
    submitPostForReview(post.id);
    router.push("/comunidade");
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-[var(--nr-text)]">Nova publicação</h1>
      <p className="mt-2 text-sm text-[var(--nr-text-muted)]">
        Sua publicação passa por revisão antes de ficar visível a outras pessoas. Não inclua dados
        pessoais identificáveis seus ou de terceiros. Não é permitido conteúdo de terapias de cura,
        assédio, capacitismo, racismo, LGBTfobia, incentivo à violência ou desinformação médica.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6">
        <div>
          <label htmlFor="categoria" className="text-sm font-medium text-[var(--nr-text)]">
            Categoria
          </label>
          <select
            id="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value as ForumCategory)}
            className="mt-1 w-full rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface)] px-3 py-2 text-sm text-[var(--nr-text)]"
          >
            {FORUM_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {FORUM_CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </div>

        <TextField label="Título" value={titulo} onChange={setTitulo} required />

        <div>
          <label htmlFor="corpo" className="text-sm font-medium text-[var(--nr-text)]">
            Texto
          </label>
          <textarea
            id="corpo"
            value={corpo}
            onChange={(e) => setCorpo(e.target.value)}
            rows={8}
            className="mt-1 w-full rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface)] px-3 py-2 text-sm text-[var(--nr-text)]"
          />
        </div>

        <TextField
          label="Aviso de conteúdo (opcional)"
          value={avisoConteudo}
          onChange={setAvisoConteudo}
          hint="Ex.: menção a burnout, luto, crise de saúde."
        />

        {error && <p className="text-sm text-[var(--nr-danger)]">{error}</p>}

        <button type="submit" className="self-start rounded-lg bg-[var(--nr-accent-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--nr-text-on-accent)]">
          Enviar para revisão
        </button>
      </form>

      <Link href="/comunidade" className="mt-6 inline-block text-sm text-[var(--nr-accent-primary)] hover:underline">
        Voltar para a Comunidade
      </Link>
    </div>
  );
}
