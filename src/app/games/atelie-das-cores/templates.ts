export interface ColoringRegion {
  id: string;
  d: string;
}

export interface ColoringTemplate {
  id: string;
  label: string;
  viewBox: string;
  regions: ColoringRegion[];
}

function annularSectorPath(cx: number, cy: number, r1: number, r2: number, a1: number, a2: number): string {
  const p = (r: number, a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const [x1, y1] = p(r1, a1);
  const [x2, y2] = p(r2, a1);
  const [x3, y3] = p(r2, a2);
  const [x4, y4] = p(r1, a2);
  const largeArc = a2 - a1 > Math.PI ? 1 : 0;
  return `M ${x1} ${y1} L ${x2} ${y2} A ${r2} ${r2} 0 ${largeArc} 1 ${x3} ${y3} L ${x4} ${y4} A ${r1} ${r1} 0 ${largeArc} 0 ${x1} ${y1} Z`;
}

function buildMandala(): ColoringTemplate {
  const cx = 200;
  const cy = 200;
  const rings = [
    { r1: 20, r2: 70, segments: 8 },
    { r1: 70, r2: 120, segments: 12 },
    { r1: 120, r2: 170, segments: 16 },
  ];
  const regions: ColoringRegion[] = [];
  rings.forEach((ring, ringIndex) => {
    const step = (Math.PI * 2) / ring.segments;
    for (let i = 0; i < ring.segments; i++) {
      const a1 = i * step;
      const a2 = a1 + step;
      regions.push({
        id: `anel${ringIndex}-${i}`,
        d: annularSectorPath(cx, cy, ring.r1, ring.r2, a1, a2),
      });
    }
  });
  return { id: "mandala", label: "Mandala", viewBox: "0 0 400 400", regions };
}

function buildGrade(): ColoringTemplate {
  const size = 8;
  const cell = 400 / size;
  const regions: ColoringRegion[] = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const x = col * cell;
      const y = row * cell;
      regions.push({
        id: `c${row}-${col}`,
        d: `M ${x} ${y} h ${cell} v ${cell} h ${-cell} Z`,
      });
    }
  }
  return { id: "grade", label: "Padrão de grade", viewBox: "0 0 400 400", regions };
}

function buildCorpoMonitor(): ColoringTemplate {
  const areas: { id: string; x: number; y: number; w: number; h: number }[] = [
    { id: "cabeca", x: 160, y: 20, w: 80, h: 50 },
    { id: "pescoco", x: 175, y: 75, w: 50, h: 20 },
    { id: "ombros", x: 110, y: 100, w: 180, h: 30 },
    { id: "bracoEsq", x: 70, y: 135, w: 40, h: 90 },
    { id: "peito", x: 130, y: 135, w: 140, h: 90 },
    { id: "bracoDir", x: 290, y: 135, w: 40, h: 90 },
    { id: "abdomen", x: 130, y: 230, w: 140, h: 70 },
    { id: "quadril", x: 130, y: 305, w: 140, h: 40 },
    { id: "pernaEsq", x: 140, y: 350, w: 55, h: 100 },
    { id: "pernaDir", x: 205, y: 350, w: 55, h: 100 },
  ];
  const regions: ColoringRegion[] = areas.map((a) => ({
    id: a.id,
    d: `M ${a.x} ${a.y} h ${a.w} v ${a.h} h ${-a.w} Z`,
  }));
  return { id: "corpoMonitor", label: "Corpo-monitor", viewBox: "0 0 400 460", regions };
}

function buildFormasAbstratas(): ColoringTemplate {
  const circle = (cx: number, cy: number, r: number) => {
    return `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 ${-r * 2} 0 Z`;
  };
  const regions: ColoringRegion[] = [
    { id: "c1", d: circle(150, 150, 90) },
    { id: "c2", d: circle(260, 150, 90) },
    { id: "c3", d: circle(150, 260, 90) },
    { id: "c4", d: circle(260, 260, 90) },
    { id: "c5", d: circle(205, 205, 50) },
  ];
  return { id: "formasAbstratas", label: "Formas abstratas", viewBox: "0 0 410 410", regions };
}

export const COLORING_TEMPLATES: ColoringTemplate[] = [
  buildMandala(),
  buildGrade(),
  buildCorpoMonitor(),
  buildFormasAbstratas(),
];
