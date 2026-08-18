"use client";

import { useRouter } from "next/navigation";
import { useSensory } from "@/lib/sensory/context";
import { requestSilence } from "@/lib/sensory/silence-bus";

function CalmOverlay({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  const actions: { label: string; onSelect: () => void }[] = [
    {
      label: "Quero silêncio",
      onSelect: () => requestSilence(),
    },
    {
      label: "Abrir meu plano",
      onSelect: () => {
        onClose();
        router.push("/meu-espaco/plano-pessoal");
      },
    },
    {
      label: "Usar cartão de comunicação",
      onSelect: () => {
        onClose();
        router.push("/quero-me-regular/cartoes-de-comunicacao");
      },
    },
    {
      label: "Avisar alguém",
      onSelect: () => {
        onClose();
        router.push("/meu-espaco/contatos-de-confianca");
      },
    },
    {
      label: "Fazer uma pausa",
      onSelect: () => {
        onClose();
        router.push("/quero-me-regular/pausa");
      },
    },
    {
      label: "Voltar quando eu quiser",
      onSelect: onClose,
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="calm-overlay-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--nr-bg)] p-6"
    >
      <div className="w-full max-w-md rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-8 text-center">
        <h2 id="calm-overlay-title" className="text-xl font-semibold text-[var(--nr-text)]">
          Modo calma
        </h2>
        <p className="mt-2 text-sm text-[var(--nr-text-muted)]">
          Sons e movimentos foram interrompidos. Você não precisa responder nada agora.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={action.onSelect}
              className="w-full rounded-xl border border-[var(--nr-border)] px-4 py-3 text-base font-medium text-[var(--nr-text)] hover:bg-[var(--nr-surface-alt)]"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CalmButton() {
  const { calmMode, activateCalmMode, deactivateCalmMode } = useSensory();

  if (calmMode) {
    return <CalmOverlay onClose={deactivateCalmMode} />;
  }

  return (
    <button
      type="button"
      onClick={activateCalmMode}
      className="fixed bottom-4 right-4 z-50 rounded-full border border-[var(--nr-border)] bg-[var(--nr-surface)] px-4 py-3 text-sm font-semibold text-[var(--nr-text)] shadow-lg hover:bg-[var(--nr-surface-alt)] sm:bottom-6 sm:right-6"
    >
      Preciso de calma
    </button>
  );
}
