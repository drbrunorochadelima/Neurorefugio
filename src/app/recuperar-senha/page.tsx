"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { requestPasswordReset, resetPassword } from "@/lib/auth/store";
import { TextField } from "@/components/form/TextField";

export default function RecuperarSenhaPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleRequestToken(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const generated = requestPasswordReset(email);
    if (!generated) {
      setError("Não encontramos uma conta com este e-mail.");
      return;
    }
    setToken(generated);
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await resetPassword(email, tokenInput, newPassword);
      setSuccess(true);
      setTimeout(() => router.push("/entrar"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível redefinir a senha.");
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-[var(--nr-text)]">Recuperar senha</h1>
      <p className="mt-2 text-sm text-[var(--nr-text-muted)]">
        Modo demonstrativo: não há envio real de e-mail. O código de recuperação é exibido nesta
        tela para fins de teste.
      </p>

      {!token && (
        <form onSubmit={handleRequestToken} className="mt-6 flex flex-col gap-4" noValidate>
          <TextField label="E-mail da conta" type="email" value={email} onChange={setEmail} required />
          {error && (
            <p role="alert" className="text-sm text-[var(--nr-danger)]">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="mt-2 rounded-lg bg-[var(--nr-accent-primary)] px-4 py-2.5 text-base font-semibold text-[var(--nr-text-on-accent)] hover:bg-[var(--nr-accent-primary-hover)]"
          >
            Gerar código de recuperação
          </button>
        </form>
      )}

      {token && !success && (
        <form onSubmit={handleReset} className="mt-6 flex flex-col gap-4" noValidate>
          <p className="rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface-alt)] p-3 text-sm text-[var(--nr-text)]">
            Seu código de recuperação (demonstrativo): <strong>{token}</strong>
          </p>
          <TextField label="Código de recuperação" value={tokenInput} onChange={setTokenInput} required />
          <TextField
            label="Nova senha"
            type="password"
            value={newPassword}
            onChange={setNewPassword}
            hint="Ao menos 8 caracteres."
            required
          />
          {error && (
            <p role="alert" className="text-sm text-[var(--nr-danger)]">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="mt-2 rounded-lg bg-[var(--nr-accent-primary)] px-4 py-2.5 text-base font-semibold text-[var(--nr-text-on-accent)] hover:bg-[var(--nr-accent-primary-hover)]"
          >
            Redefinir senha
          </button>
        </form>
      )}

      {success && (
        <p role="status" className="mt-6 text-[var(--nr-success)]">
          Senha redefinida com sucesso. Levando você para a tela de entrada…
        </p>
      )}

      <p className="mt-6 text-sm">
        <Link href="/entrar" className="text-[var(--nr-accent-primary)] underline">
          Voltar para entrar
        </Link>
      </p>
    </div>
  );
}
