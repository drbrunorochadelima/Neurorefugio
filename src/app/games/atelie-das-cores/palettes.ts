export const PALETTES: Record<string, { label: string; colors: string[] }> = {
  livre: {
    label: "Livre",
    colors: [
      "#2C5B66", "#7C9885", "#948BC0", "#DDCCA4", "#9C3B3B", "#93691F",
      "#3F6B4A", "#6F9AA3", "#BCB2DC", "#4A504E", "#FAF8F4", "#2B2F2E",
    ],
  },
  pasteis: {
    label: "Pastéis",
    colors: ["#CFE0E3", "#DFE9E0", "#E2DDF0", "#F0E8D6", "#F4DCDC", "#F0F0DC"],
  },
  monocromatico: {
    label: "Monocromático (petróleo)",
    colors: ["#EEF4F5", "#CFE0E3", "#6F9AA3", "#2C5B66", "#1E414A", "#12282E"],
  },
};

export type PaletteId = keyof typeof PALETTES;
