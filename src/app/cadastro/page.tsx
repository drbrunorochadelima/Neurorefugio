"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { signUpSchema } from "@/lib/schemas/auth";
import { TextField } from "@/components/form/TextField";

export default function CadastroPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pseudonym, setPseudonym] = useState("");
  const [aceitaTermos, setAceitaTermos] = useState(false);
  const [aceitaPrivacidade, setAceitaPrivacidade] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const parsed = signUpSchema.safeParse({ email, password, pseudonym, aceitaTermos, aceitaPrivacidade });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      await signUp({ email, password, pseudonym });
      router.push("/meu-espaco");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Não foi possível criar sua conta.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-[var(--nr-text)]">Criar conta</h1>
      <p className="mt-2 text-sm text-[var(--nr-text-muted)]">
        Você pode usar a maior parte da plataforma sem cadastro. Crie uma conta apenas se quiser
        salvar seus dados entre sessões. Seu perfil é privado por padrão e você pode usar um
        pseudônimo.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
        <TextField
          label="Pseudônimo (como você quer ser chamado aqui)"
          value={pseudonym}
          onChange={setPseudonym}
          error={errors.pseudonym}
          required
        />
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
          hint="Ao menos 8 caracteres."
          autoComplete="new-password"
          required
        />

        <label className="flex items-start gap-2 text-sm text-[var(--nr-text)]">
          <input
            type="checkbox"
            checked={aceitaTermos}
            onChange={(e) => setAceitaTermos(e.target.checked)}
            className="mt-1 h-4 w-4 accent-[var(--nr-accent-primary)]"
          />
          Li e aceito os{" "}
          <Link href="/termos" className="text-[var(--nr-accent-primary)] underline">
            Termos de uso
          </Link>
          .
        </label>
        {errors.aceitaTermos && <p className="text-sm text-[var(--nr-danger)]">{errors.aceitaTermos}</p>}

        <label className="flex items-start gap-2 text-sm text-[var(--nr-text)]">
          <input
            type="checkbox"
            checked={aceitaPrivacidade}
            onChange={(e) => setAceitaPrivacidade(e.target.checked)}
            className="mt-1 h-4 w-4 accent-[var(--nr-accent-primary)]"
          />
          Li a{" "}
          <Link href="/privacidade" className="text-[var(--nr-accent-primary)] underline">
            Política de Privacidade
          </Link>
          .
        </label>
        {errors.aceitaPrivacidade && (
          <p className="text-sm text-[var(--nr-danger)]">{errors.aceitaPrivacidade}</p>
        )}

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
          {submitting ? "Criando conta…" : "Criar conta"}
        </button>
      </form>

      <p className="mt-6 text-sm text-[var(--nr-text-muted)]">
        Já tem conta?{" "}
        <Link href="/entrar" className="text-[var(--nr-accent-primary)] underline">
          Entrar
        </Link>
      </p>
      <p className="mt-2 text-xs text-[var(--nr-text-muted)]">
        Modo demonstrativo: seus dados ficam salvos apenas neste navegador.
      </p>
    </div>
  );
}
