"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";
import { addTrustedContact, listTrustedContacts, removeTrustedContact } from "@/lib/services/plan";
import { TextField } from "@/components/form/TextField";

export default function ContatosDeConfiancaPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center sm:px-6">
        <p className="text-[var(--nr-text)]">Entre para gerenciar seus contatos de confiança.</p>
        <Link href="/entrar" className="mt-4 inline-block text-[var(--nr-accent-primary)] underline">
          Entrar
        </Link>
      </div>
    );
  }

  return <ContactsManager userId={user.id} />;
}

function ContactsManager({ userId }: { userId: string }) {
  const [contacts, setContacts] = useState(() => listTrustedContacts(userId));
  const [nome, setNome] = useState("");
  const [relacao, setRelacao] = useState("");
  const [telefone, setTelefone] = useState("");
  const [comoAvisar, setComoAvisar] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;
    addTrustedContact(userId, { nome: nome.trim(), relacao, telefone, comoAvisar });
    setNome("");
    setRelacao("");
    setTelefone("");
    setComoAvisar("");
    setContacts(listTrustedContacts(userId));
  }

  function handleRemove(id: string) {
    removeTrustedContact(id);
    setContacts(listTrustedContacts(userId));
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-[var(--nr-text)]">Contatos de confiança</h1>
      <p className="mt-2 text-sm text-[var(--nr-text-muted)]">
        Pessoas que podem ser avisadas quando você precisar de apoio. Usado pelo botão &ldquo;Preciso
        de calma&rdquo; e pelo seu Plano Pessoal.
      </p>

      <form onSubmit={handleAdd} className="mt-6 flex flex-col gap-3 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6">
        <TextField label="Nome" value={nome} onChange={setNome} required />
        <TextField label="Relação (opcional)" value={relacao} onChange={setRelacao} />
        <TextField label="Telefone (opcional)" value={telefone} onChange={setTelefone} />
        <TextField label="Como prefere ser avisado (opcional)" value={comoAvisar} onChange={setComoAvisar} />
        <button
          type="submit"
          className="self-start rounded-lg bg-[var(--nr-accent-primary)] px-4 py-2 text-sm font-semibold text-[var(--nr-text-on-accent)] hover:bg-[var(--nr-accent-primary-hover)]"
        >
          Adicionar contato
        </button>
      </form>

      {contacts.length > 0 ? (
        <ul className="mt-6 flex flex-col gap-3">
          {contacts.map((c) => (
            <li key={c.id} className="flex items-start justify-between gap-3 rounded-xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-4">
              <div>
                <p className="font-medium text-[var(--nr-text)]">{c.nome}</p>
                {c.relacao && <p className="text-sm text-[var(--nr-text-muted)]">{c.relacao}</p>}
                {c.telefone && <p className="text-sm text-[var(--nr-text-muted)]">{c.telefone}</p>}
                {c.comoAvisar && <p className="text-sm text-[var(--nr-text-muted)]">Avisar: {c.comoAvisar}</p>}
              </div>
              <button
                type="button"
                onClick={() => handleRemove(c.id)}
                className="rounded-lg border border-[var(--nr-border)] px-3 py-1.5 text-sm text-[var(--nr-danger)] hover:bg-[var(--nr-surface-alt)]"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-sm text-[var(--nr-text-muted)]">Nenhum contato cadastrado ainda.</p>
      )}

      <Link href="/meu-espaco" className="mt-6 inline-block text-sm text-[var(--nr-accent-primary)] underline">
        Voltar para Meu Espaço
      </Link>
    </div>
  );
}
