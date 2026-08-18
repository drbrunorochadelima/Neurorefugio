"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { loginSchema } from "@/lib/schemas/auth";
import { TextField } from "@/components/form/TextField";

export default function EntrarPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      await login({ email, password });
      router.push("/meu-espaco");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Não foi possível entrar.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-[var(--nr-text)]">Entrar</h1>
      <p className="mt-2 text-sm text-[var(--nr-text-muted)]">
        Muitos recursos funcionam sem conta. Entre apenas se quiser recuperar dados salvos.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
        <TextField
          label="E-mail"
          type="email"
          value={email}
          onChange={setEmail}
          error={errors.email}
          autoComplete="email"
          required
        />
        <TextField
          label="Senha"
          type="password"
          value={password}
          onChange={setPassword}
          error={errors.password}
          autoComplete="current-password"
          required
        />

        {formError && (
          <p role="alert" className="text-sm text-[var(--nr-danger)]">
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-lg bg-[var(--nr-accent-primary)] px-4 py-2.5 text-base font-semibold text-[var(--nr-text-on-accent)] hover:bg-[var(--nr-accent-primary-hover)] disabled:opacity-60"
        >
          {submitting ? "Entrando…" : "Entrar"}
        </button>
      </form>

      <div className="mt-6 flex flex-col gap-2 text-sm text-[var(--nr-text-muted)]">
        <Link href="/recuperar-senha" className="text-[var(--nr-accent-primary)] underline">
          Esqueci minha senha
        </Link>
        <p>
          Não tem conta?{" "}
          <Link href="/cadastro" className="text-[var(--nr-accent-primary)] underline">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
