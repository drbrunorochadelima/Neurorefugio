import { useId } from "react";

interface TextFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  autoComplete?: string;
  hint?: string;
}

export function TextField({
  label,
  type = "text",
  value,
  onChange,
  error,
  required,
  autoComplete,
  hint,
}: TextFieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[var(--nr-text)]">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {hint && (
        <p id={hintId} className="mt-0.5 text-sm text-[var(--nr-text-muted)]">
          {hint}
        </p>
      )}
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
        aria-invalid={error ? true : undefined}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface)] px-3 py-2.5 text-base text-[var(--nr-text)]"
      />
      {error && (
        <p id={errorId} className="mt-1 text-sm text-[var(--nr-danger)]">
          {error}
        </p>
      )}
    </div>
  );
}
