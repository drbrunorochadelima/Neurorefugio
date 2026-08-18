"use client";

import type { BodyMark, BodyRegion } from "@/lib/schemas/body-monitor";
import { BODY_REGION_LABELS } from "@/lib/schemas/body-monitor-labels";

const LAYOUT: { region: BodyRegion; area: string }[] = [
  { region: "cabeca", area: "cabeca" },
  { region: "pescoco", area: "pescoco" },
  { region: "ombros", area: "ombros" },
  { region: "bracos", area: "bracos" },
  { region: "peito", area: "peito" },
  { region: "maos", area: "maos" },
  { region: "abdomen", area: "abdomen" },
  { region: "costas", area: "costas" },
  { region: "quadril", area: "quadril" },
  { region: "pernas", area: "pernas" },
  { region: "pes", area: "pes" },
];

const GRID_TEMPLATE = `
  ".      cabeca   ."
  ".      pescoco  ."
  ".      ombros   ."
  "bracos peito    maos"
  ".      abdomen  ."
  ".      costas   ."
  ".      quadril  ."
  ".      pernas   ."
  ".      pes      ."
`;

interface BodyMapProps {
  marks: BodyMark[];
  selectedRegion: BodyRegion | null;
  onSelectRegion: (region: BodyRegion) => void;
}

export function BodyMap({ marks, selectedRegion, onSelectRegion }: BodyMapProps) {
  return (
    <div
      role="group"
      aria-label="Mapa corporal — selecione uma região para registrar sensações"
      className="mx-auto grid max-w-xs gap-2"
      style={{ gridTemplateAreas: GRID_TEMPLATE, gridTemplateColumns: "1fr 1.4fr 1fr" }}
    >
      {LAYOUT.map(({ region, area }) => {
        const mark = marks.find((m) => m.region === region);
        const selected = selectedRegion === region;
        return (
          <button
            key={region}
            type="button"
            style={{ gridArea: area }}
            onClick={() => onSelectRegion(region)}
            aria-pressed={selected}
            aria-describedby={mark ? `${region}-status` : undefined}
            className={`rounded-xl border px-2 py-3 text-xs font-medium sm:text-sm ${
              selected
                ? "border-[var(--nr-accent-primary)] bg-[var(--nr-accent-primary)] text-[var(--nr-text-on-accent)]"
                : mark
                  ? "border-[var(--nr-accent-secondary)] bg-[var(--nr-surface-alt)] text-[var(--nr-text)]"
                  : "border-[var(--nr-border)] bg-[var(--nr-surface)] text-[var(--nr-text)]"
            }`}
          >
            {BODY_REGION_LABELS[region]}
            {mark && (
              <span id={`${region}-status`} className="sr-only">
                {" "}
                — {mark.sensations.length} sensação(ões) registrada(s)
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
