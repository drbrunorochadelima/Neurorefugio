"use client";

import { useRef, useState } from "react";
import { GameIntro, GameExitBar } from "@/components/games/GameIntro";
import { useAuth } from "@/lib/auth/context";
import { listArtworks, saveArtwork } from "@/lib/services/coloring";
import { COLORING_TEMPLATES } from "./templates";
import { PALETTES, type PaletteId } from "./palettes";

const BACKGROUND = "#FAF8F4";

export default function AtelieDasCoresPage() {
  const { user } = useAuth();
  const [stage, setStage] = useState<"intro" | "editing">("intro");
  const [templateId, setTemplateId] = useState(COLORING_TEMPLATES[0].id);
  const [svgPaths, setSvgPaths] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<Record<string, string>[]>([{}]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [paletteId, setPaletteId] = useState<PaletteId>("livre");
  const [selectedColor, setSelectedColor] = useState(PALETTES.livre.colors[0]);
  const [tool, setTool] = useState<"pincel" | "borracha">("pincel");
  const [artworkId, setArtworkId] = useState<string | undefined>(undefined);
  const [titulo, setTitulo] = useState("Sem título");
  const [saved, setSaved] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const template = COLORING_TEMPLATES.find((t) => t.id === templateId) ?? COLORING_TEMPLATES[0];

  function pushHistory(next: Record<string, string>) {
    const truncated = history.slice(0, historyIndex + 1);
    const updated = [...truncated, next];
    setHistory(updated);
    setHistoryIndex(updated.length - 1);
    setSvgPaths(next);
  }

  function handleRegionClick(regionId: string) {
    const next = { ...svgPaths };
    if (tool === "borracha") {
      delete next[regionId];
    } else {
      next[regionId] = selectedColor;
    }
    pushHistory(next);
  }

  function undo() {
    if (historyIndex === 0) return;
    const idx = historyIndex - 1;
    setHistoryIndex(idx);
    setSvgPaths(history[idx]);
  }

  function redo() {
    if (historyIndex >= history.length - 1) return;
    const idx = historyIndex + 1;
    setHistoryIndex(idx);
    setSvgPaths(history[idx]);
  }

  function clearAll() {
    pushHistory({});
  }

  function handleSave() {
    if (!user) return;
    const result = saveArtwork(user.id, { id: artworkId, templateId, titulo, svgPaths });
    setArtworkId(result.id);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function loadArtwork(id: string) {
    if (!user) return;
    const artwork = listArtworks(user.id).find((a) => a.id === id);
    if (!artwork) return;
    setTemplateId(artwork.templateId);
    setSvgPaths(artwork.svgPaths);
    setHistory([artwork.svgPaths]);
    setHistoryIndex(0);
    setArtworkId(artwork.id);
    setTitulo(artwork.titulo);
    setStage("editing");
  }

  function handleDownload() {
    const svg = svgRef.current;
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 800;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = BACKGROUND;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `${titulo || "desenho"}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    };
    img.src = url;
  }

  if (stage === "intro") {
    return (
      <GameIntro
        title="Ateliê das Cores"
        objective="Colorir livremente, sem certo ou errado."
        duration="Livre"
        difficulty="Não se aplica"
        sounds="Nenhum"
        movement="Nenhum"
        stimuli="Cores intensas evitáveis pela paleta pastel/monocromática"
        controls="Clique ou toque para preencher regiões"
        exit="Botão 'Sair do jogo' disponível a qualquer momento"
        onStart={() => setStage("editing")}
      />
    );
  }

  const myArtworks = user ? listArtworks(user.id) : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <GameExitBar title="Ateliê das Cores" />

      <div className="flex flex-wrap gap-2">
        {COLORING_TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setTemplateId(t.id);
              setHistory([{}]);
              setHistoryIndex(0);
              setSvgPaths({});
              setArtworkId(undefined);
            }}
            aria-pressed={templateId === t.id}
            className={`rounded-lg border px-3 py-1.5 text-sm ${templateId === t.id ? "border-[var(--nr-accent-primary)] font-semibold text-[var(--nr-accent-primary)]" : "border-[var(--nr-border)] text-[var(--nr-text)]"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-[1fr_260px]">
        <div className="rounded-2xl border border-[var(--nr-border)] bg-white p-4">
          <svg ref={svgRef} viewBox={template.viewBox} className="w-full" role="img" aria-label={`Desenho para colorir: ${template.label}`}>
            <rect x="0" y="0" width="100%" height="100%" fill={BACKGROUND} />
            {template.regions.map((region) => (
              <path
                key={region.id}
                d={region.d}
                fill={svgPaths[region.id] ?? "#ffffff"}
                stroke="#4A504E"
                strokeWidth={1.5}
                onClick={() => handleRegionClick(region.id)}
                tabIndex={0}
                role="button"
                aria-label={`Região ${region.id}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleRegionClick(region.id);
                  }
                }}
                style={{ cursor: "pointer" }}
              />
            ))}
          </svg>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-4">
            <p className="text-sm font-medium text-[var(--nr-text)]">Ferramenta</p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setTool("pincel")}
                aria-pressed={tool === "pincel"}
                className={`flex-1 rounded-lg border px-3 py-1.5 text-sm ${tool === "pincel" ? "border-[var(--nr-accent-primary)] font-semibold text-[var(--nr-accent-primary)]" : "border-[var(--nr-border)] text-[var(--nr-text)]"}`}
              >
                Pincel
              </button>
              <button
                type="button"
                onClick={() => setTool("borracha")}
                aria-pressed={tool === "borracha"}
                className={`flex-1 rounded-lg border px-3 py-1.5 text-sm ${tool === "borracha" ? "border-[var(--nr-accent-primary)] font-semibold text-[var(--nr-accent-primary)]" : "border-[var(--nr-border)] text-[var(--nr-text)]"}`}
              >
                Borracha
              </button>
            </div>

            <p className="mt-4 text-sm font-medium text-[var(--nr-text)]">Paleta</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {Object.entries(PALETTES).map(([id, p]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setPaletteId(id as PaletteId);
                    setSelectedColor(p.colors[0]);
                  }}
                  aria-pressed={paletteId === id}
                  className={`rounded-lg border px-2 py-1 text-xs ${paletteId === id ? "border-[var(--nr-accent-primary)] font-semibold text-[var(--nr-accent-primary)]" : "border-[var(--nr-border)] text-[var(--nr-text)]"}`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {PALETTES[paletteId].colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  aria-label={`Cor ${c}`}
                  aria-pressed={selectedColor === c}
                  style={{ background: c }}
                  className={`h-8 w-8 rounded-full border-2 ${selectedColor === c ? "border-[var(--nr-accent-primary)]" : "border-transparent"}`}
                />
              ))}
              <label className="h-8 w-8 overflow-hidden rounded-full border border-[var(--nr-border)]">
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  aria-label="Cor personalizada"
                  className="h-10 w-10 -translate-x-0.5 -translate-y-0.5 cursor-pointer"
                />
              </label>
            </div>

            <div className="mt-4 flex gap-2">
              <button type="button" onClick={undo} disabled={historyIndex === 0} className="rounded-lg border border-[var(--nr-border)] px-3 py-1.5 text-sm text-[var(--nr-text)] disabled:opacity-40">
                Desfazer
              </button>
              <button type="button" onClick={redo} disabled={historyIndex >= history.length - 1} className="rounded-lg border border-[var(--nr-border)] px-3 py-1.5 text-sm text-[var(--nr-text)] disabled:opacity-40">
                Refazer
              </button>
            </div>
            <button type="button" onClick={clearAll} className="mt-2 w-full rounded-lg border border-[var(--nr-border)] px-3 py-1.5 text-sm text-[var(--nr-text)]">
              Limpar tudo
            </button>
          </div>

          <div className="rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-4">
            <label htmlFor="titulo-desenho" className="text-sm font-medium text-[var(--nr-text)]">
              Título
            </label>
            <input
              id="titulo-desenho"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface)] px-3 py-2 text-sm text-[var(--nr-text)]"
            />
            <div className="mt-2 flex flex-col gap-2">
              {user && (
                <button type="button" onClick={handleSave} className="rounded-lg bg-[var(--nr-accent-primary)] px-3 py-2 text-sm font-semibold text-[var(--nr-text-on-accent)]">
                  {saved ? "Salvo!" : "Salvar / continuar depois"}
                </button>
              )}
              <button type="button" onClick={handleDownload} className="rounded-lg border border-[var(--nr-border)] px-3 py-2 text-sm text-[var(--nr-text)]">
                Baixar imagem
              </button>
            </div>
          </div>

          {user && myArtworks.length > 0 && (
            <div className="rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-4">
              <p className="text-sm font-medium text-[var(--nr-text)]">Minha galeria</p>
              <ul className="mt-2 flex flex-col gap-1">
                {myArtworks.map((a) => (
                  <li key={a.id}>
                    <button type="button" onClick={() => loadArtwork(a.id)} className="text-sm text-[var(--nr-accent-primary)] hover:underline">
                      {a.titulo || "Sem título"}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
