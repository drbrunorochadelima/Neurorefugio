"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";
import { addOfficialContact, listOfficialContacts, removeOfficialContact } from "@/lib/services/official-contacts";
import { listChecklistItems } from "@/lib/services/institutional";
import { CHECKLIST_TOPIC_LABELS } from "@/lib/schemas/institutional";
import { logAdminAction } from "@/lib/services/audit-log";
import { TextField } from "@/components/form/TextField";

export default function AdminInstitucionalPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "administrador";
  const [contacts, setContacts] = useState<ReturnType<typeof listOfficialContacts>>([]);
  const [checklist, setChecklist] = useState<ReturnType<typeof listChecklistItems>>([]);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    if (!isAdmin) return;
    const timeout = setTimeout(() => {
      setContacts(listOfficialContacts());
      setChecklist(listChecklistItems());
    }, 0);
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

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !nome.trim() || !telefone.trim()) return;
    addOfficialContact({ nome: nome.trim(), telefone: telefone.trim(), descricao: descricao || undefined });
    logAdminAction(user.id, user.pseudonym, `Adicionou contato oficial "${nome.trim()}"`);
    setNome("");
    setTelefone("");
    setDescricao("");
    setContacts(listOfficialContacts());
  }

  function handleRemove(id: string, nomeContato: string) {
    if (!user) return;
    removeOfficialContact(id);
    logAdminAction(user.id, user.pseudonym, `Removeu contato oficial "${nomeContato}"`);
    setContacts(listOfficialContacts());
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-[var(--nr-text)]">Contatos oficiais e checklists</h1>

      <section className="mt-6">
        <h2 className="text-lg font-semibold text-[var(--nr-text)]">Contatos oficiais confirmados</h2>
        <p className="mt-1 text-sm text-[var(--nr-text-muted)]">
          Exibidos na página &ldquo;Segurança&rdquo;. Adicione apenas contatos já confirmados pela
          sua instituição — nunca invente números.
        </p>

        {contacts.length > 0 && (
          <ul className="mt-3 flex flex-col gap-2">
            {contacts.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-2 rounded-lg border border-[var(--nr-border)] p-3 text-sm">
                <span>
                  <strong>{c.nome}</strong> — {c.telefone}
                  {c.descricao && ` (${c.descricao})`}
                </span>
                <button type="button" onClick={() => handleRemove(c.id, c.nome)} className="text-xs text-[var(--nr-danger)]">
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleAdd} className="mt-4 flex flex-col gap-3 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6">
          <TextField label="Nome do serviço" value={nome} onChange={setNome} required />
          <TextField label="Telefone" value={telefone} onChange={setTelefone} required />
          <TextField label="Descrição (opcional)" value={descricao} onChange={setDescricao} />
          <button type="submit" className="self-start rounded-lg bg-[var(--nr-accent-primary)] px-4 py-2 text-sm font-semibold text-[var(--nr-text-on-accent)]">
            Adicionar contato confirmado
          </button>
        </form>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-[var(--nr-text)]">Itens de checklist institucional registrados</h2>
        {checklist.length > 0 ? (
          <ul className="mt-3 flex flex-col gap-2 text-sm text-[var(--nr-text-muted)]">
            {checklist.map((item) => (
              <li key={item.id}>
                {item.unidade} · {CHECKLIST_TOPIC_LABELS[item.topico]} · prioridade {item.prioridade}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-[var(--nr-text-muted)]">Nenhum item registrado ainda.</p>
        )}
        <Link href="/instituicoes" className="mt-3 inline-block text-sm text-[var(--nr-accent-primary)] underline">
          Ver checklist completo
        </Link>
      </section>

      <Link href="/admin" className="mt-8 inline-block text-sm text-[var(--nr-accent-primary)] underline">
        Voltar ao painel
      </Link>
    </div>
  );
}
