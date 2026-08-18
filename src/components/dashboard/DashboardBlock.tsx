"use client";

interface DashboardBlockProps {
  title: string;
  children: React.ReactNode;
  compact: boolean;
  onHide: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggleCompact: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export function DashboardBlock({
  title,
  children,
  compact,
  onHide,
  onMoveUp,
  onMoveDown,
  onToggleCompact,
  canMoveUp,
  canMoveDown,
}: DashboardBlockProps) {
  return (
    <section
      aria-label={title}
      className="rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-base font-semibold text-[var(--nr-text)]">{title}</h2>
        <div className="flex shrink-0 flex-wrap gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            aria-label={`Mover ${title} para cima`}
            className="rounded border border-[var(--nr-border)] px-2 py-1 text-xs text-[var(--nr-text-muted)] hover:bg-[var(--nr-surface-alt)] disabled:opacity-30"
          >
            ▲
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            aria-label={`Mover ${title} para baixo`}
            className="rounded border border-[var(--nr-border)] px-2 py-1 text-xs text-[var(--nr-text-muted)] hover:bg-[var(--nr-surface-alt)] disabled:opacity-30"
          >
            ▼
          </button>
          <button
            type="button"
            onClick={onToggleCompact}
            aria-pressed={compact}
            className="rounded border border-[var(--nr-border)] px-2 py-1 text-xs text-[var(--nr-text-muted)] hover:bg-[var(--nr-surface-alt)]"
          >
            {compact ? "Padrão" : "Compacto"}
          </button>
          <button
            type="button"
            onClick={onHide}
            className="rounded border border-[var(--nr-border)] px-2 py-1 text-xs text-[var(--nr-text-muted)] hover:bg-[var(--nr-surface-alt)]"
          >
            Ocultar
          </button>
        </div>
      </div>
      {!compact && <div className="mt-3">{children}</div>}
    </section>
  );
}
