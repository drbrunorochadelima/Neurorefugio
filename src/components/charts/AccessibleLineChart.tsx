"use client";

import { useId, useState } from "react";

interface SeriesPoint {
  label: string;
  value: number;
}

interface Series {
  name: string;
  color: string;
  points: SeriesPoint[];
}

interface AccessibleLineChartProps {
  title: string;
  description: string;
  series: Series[];
  min?: number;
  max?: number;
}

const WIDTH = 480;
const HEIGHT = 200;
const PADDING = 32;

export function AccessibleLineChart({ title, description, series, min = 0, max = 5 }: AccessibleLineChartProps) {
  const titleId = useId();
  const descId = useId();
  const [showTable, setShowTable] = useState(false);

  const pointCount = series[0]?.points.length ?? 0;
  const usableWidth = WIDTH - PADDING * 2;
  const usableHeight = HEIGHT - PADDING * 2;

  function coordsFor(points: SeriesPoint[]): string {
    if (points.length === 0) return "";
    return points
      .map((point, index) => {
        const x = PADDING + (pointCount > 1 ? (index / (pointCount - 1)) * usableWidth : usableWidth / 2);
        const ratio = (point.value - min) / (max - min || 1);
        const y = PADDING + usableHeight - ratio * usableHeight;
        return `${x},${y}`;
      })
      .join(" ");
  }

  if (pointCount === 0) {
    return (
      <p className="text-sm text-[var(--nr-text-muted)]">Ainda não há dados suficientes para este gráfico.</p>
    );
  }

  return (
    <div>
      <svg
        role="img"
        aria-labelledby={`${titleId} ${descId}`}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
      >
        <title id={titleId}>{title}</title>
        <desc id={descId}>{description}</desc>
        <line
          x1={PADDING}
          y1={PADDING + usableHeight}
          x2={WIDTH - PADDING}
          y2={PADDING + usableHeight}
          stroke="var(--nr-border)"
          strokeWidth={1}
        />
        <line x1={PADDING} y1={PADDING} x2={PADDING} y2={PADDING + usableHeight} stroke="var(--nr-border)" strokeWidth={1} />
        {series.map((s) => (
          <polyline
            key={s.name}
            points={coordsFor(s.points)}
            fill="none"
            stroke={s.color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>

      <div className="mt-2 flex flex-wrap items-center gap-4">
        {series.map((s) => (
          <span key={s.name} className="flex items-center gap-1.5 text-sm text-[var(--nr-text-muted)]">
            <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
            {s.name}
          </span>
        ))}
        <button
          type="button"
          onClick={() => setShowTable((v) => !v)}
          className="ml-auto text-sm font-medium text-[var(--nr-accent-primary)] underline"
        >
          {showTable ? "Ocultar dados em tabela" : "Ver dados em tabela"}
        </button>
      </div>

      {showTable && (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-max border-collapse text-sm">
            <caption className="sr-only">{title}</caption>
            <thead>
              <tr>
                <th scope="col" className="border-b border-[var(--nr-border)] px-2 py-1 text-left">
                  Data
                </th>
                {series.map((s) => (
                  <th key={s.name} scope="col" className="border-b border-[var(--nr-border)] px-2 py-1 text-left">
                    {s.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {series[0].points.map((point, index) => (
                <tr key={point.label}>
                  <th scope="row" className="px-2 py-1 text-left font-normal text-[var(--nr-text-muted)]">
                    {point.label}
                  </th>
                  {series.map((s) => (
                    <td key={s.name} className="px-2 py-1">
                      {s.points[index]?.value ?? "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
