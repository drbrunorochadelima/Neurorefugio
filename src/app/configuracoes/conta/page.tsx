"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";
import { exportUserData, setUserRole } from "@/lib/auth/store";
import { TextField } from "@/components/form/TextField";

export default function ContaPage() {
  const { user, updateProfile, deleteAccount, logout } = useAuth();
  const router = useRouter();
  const [pseudonym, setPseudonym] = useState(user?.pseudonym ?? "");
  const [nomeSocial, setNomeSocial] = useState(user?.nomeSocial ?? "");
  const [pronouns, setPronouns] = useState(user?.pronouns ?? "");
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center sm:px-6">
        <p className="text-[var(--nr-text)]">Você precisa entrar para ver sua conta.</p>
        <Link href="/entrar" className="mt-4 inline-block text-[var(--nr-accent-primary)] hover:underline">
          Entrar
        </Link>
      </div>
    );
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    updateProfile({
      pseudonym,
      nomeSocial: nomeSocial || undefined,
      pronouns: pronouns || undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleTogglePrivate() {
    if (!user) return;
    updateProfile({ profilePrivate: !user.profilePrivate });
  }

  function handleExport() {
    if (!user) return;
    const data = exportUserData(user.id);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `neurorefugio-meus-dados-${user.id}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function handleDelete() {
    deleteAccount();
    router.push("/");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--nr-text)]">Minha conta</h1>
        <button
          type="button"
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="rounded-lg border border-[var(--nr-border)] px-3 py-2 text-sm font-medium text-[var(--nr-text)] hover:bg-[var(--nr-surface-alt)]"
        >
          Sair
        </button>
      </div>

      <form onSubmit={handleSave} className="mt-6 flex flex-col gap-4 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6">
        <TextField label="Pseudônimo" value={pseudonym} onChange={setPseudonym} required />
        <TextField label="Nome social (opcional)" value={nomeSocial} onChange={setNomeSocial} />
        <TextField label="Pronomes (opcional)" value={pronouns} onChange={setPronouns} />

        <label className="flex items-start justify-between gap-4">
          <span>
            <span className="block text-sm font-medium text-[var(--nr-text)]">Perfil privado</span>
            <span className="block text-sm text-[var(--nr-text-muted)]">
              Seu perfil é privado por padrão. Desative apenas se quiser ser encontrável na
              comunidade.
            </span>
          </span>
          <input
            type="checkbox"
            checked={!user.profilePrivate}
            onChange={handleTogglePrivate}
            className="mt-1 h-5 w-5 shrink-0 accent-[var(--nr-accent-primary)]"
          />
        </label>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-lg bg-[var(--nr-accent-primary)] px-4 py-2.5 text-base font-semibold text-[var(--nr-text-on-accent)] hover:bg-[var(--nr-accent-primary-hover)]"
          >
            Salvar
          </button>
          {saved && (
            <span role="status" className="text-sm text-[var(--nr-success)]">
              Salvo.
            </span>
          )}
        </div>
      </form>

      <div className="mt-6 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6">
        <h2 className="text-lg font-semibold text-[var(--nr-text)]">Meus dados</h2>
        <p className="mt-1 text-sm text-[var(--nr-text-muted)]">
          Baixe uma cópia de todos os dados vinculados à sua conta neste navegador.
        </p>
        <button
          type="button"
          onClick={handleExport}
          className="mt-3 rounded-lg border border-[var(--nr-border)] px-4 py-2 text-sm font-medium text-[var(--nr-text)] hover:bg-[var(--nr-surface-alt)]"
        >
          Exportar meus dados (.json)
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6">
        <h2 className="text-lg font-semibold text-[var(--nr-text)]">Papel de acesso (modo demonstrativo)</h2>
        <p className="mt-1 text-sm text-[var(--nr-text-muted)]">
          Como não há um backend real nesta versão, qualquer conta pode assumir o papel de
          administrador(a) localmente, apenas para fins de teste do painel administrativo. Papel
          atual: <strong>{user.role}</strong>.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {user.role !== "administrador" ? (
            <button
              type="button"
              onClick={() => setUserRole(user.id, "administrador")}
              className="rounded-lg border border-[var(--nr-border)] px-4 py-2 text-sm font-medium text-[var(--nr-text)] hover:bg-[var(--nr-surface-alt)]"
            >
              Assumir papel de administrador(a) (demonstrativo)
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setUserRole(user.id, "usuario")}
                className="rounded-lg border border-[var(--nr-border)] px-4 py-2 text-sm font-medium text-[var(--nr-text)] hover:bg-[var(--nr-surface-alt)]"
              >
                Voltar a usuário(a) comum
              </button>
              <Link
                href="/admin"
                className="rounded-lg bg-[var(--nr-accent-primary)] px-4 py-2 text-sm font-semibold text-[var(--nr-text-on-accent)]"
              >
                Abrir painel administrativo
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-[var(--nr-danger)]/40 bg-[var(--nr-surface)] p-6">
        <h2 className="text-lg font-semibold text-[var(--nr-danger)]">Excluir conta</h2>
        <p className="mt-1 text-sm text-[var(--nr-text-muted)]">
          Isto remove permanentemente sua conta e todos os dados associados a ela neste navegador.
          Esta ação não pode ser desfeita.
        </p>
        {!confirmDelete ? (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="mt-3 rounded-lg border border-[var(--nr-danger)] px-4 py-2 text-sm font-medium text-[var(--nr-danger)] hover:bg-[var(--nr-danger)]/10"
          >
            Excluir minha conta
          </button>
        ) : (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <p className="text-sm font-medium text-[var(--nr-text)]">Tem certeza? Isto é definitivo.</p>
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-lg bg-[var(--nr-danger)] px-4 py-2 text-sm font-semibold text-white"
            >
              Sim, excluir tudo
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="rounded-lg border border-[var(--nr-border)] px-4 py-2 text-sm font-medium text-[var(--nr-text)]"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
