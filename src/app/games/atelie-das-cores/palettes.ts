export const PALETTES: Record<string, { label: string; colors: string[] }> = {
  livre: {
    label: "Livre",
    colors: [
      "#2563EB", "#059669", "#7C3AED", "#D97706", "#E11D48", "#0891B2",
      "#65A30D", "#DB2777", "#EA580C", "#4F46E5", "#201F2B", "#FFFFFF",
    ],
  },
  pasteis: {
    label: "Pastéis",
    colors: ["#93C5FD", "#6EE7B7", "#C4B5FD", "#FCD34D", "#FDA4AF", "#67E8F9"],
  },
  monocromatico: {
    label: "Monocromático (azul)",
    colors: ["#EFF6FF", "#93C5FD", "#3B82F6", "#2563EB", "#1D4ED8", "#1E3A8A"],
  },
};

export type PaletteId = keyof typeof PALETTES;
