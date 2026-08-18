"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ResourceFeedbackWidget } from "@/components/ResourceFeedback";

const COLORS = ["#2563EB", "#059669", "#7C3AED", "#D97706", "#E11D48", "#201F2B"];

export default function DesenhoLivrePage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const [color, setColor] = useState(COLORS[0]);
  const [size, setSize] = useState(6);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#FAF8F4";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  function getPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    drawingRef.current = true;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function handlePointerUp() {
    drawingRef.current = false;
  }

  function handleClear() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.fillStyle = "#FAF8F4";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "neurorefugio-desenho.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-[var(--nr-text)]">Desenho livre</h1>
      <p className="mt-2 text-sm text-[var(--nr-text-muted)]">
        Uma tela em branco. Não há avaliação, nem certo ou errado.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="flex gap-1.5" role="group" aria-label="Cor do traço">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              aria-label={`Cor ${c}`}
              aria-pressed={color === c}
              style={{ background: c }}
              className={`h-8 w-8 rounded-full border-2 ${color === c ? "border-[var(--nr-accent-primary)]" : "border-transparent"}`}
            />
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-[var(--nr-text)]">
          Espessura
          <input
            type="range"
            min={2}
            max={24}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="accent-[var(--nr-accent-primary)]"
          />
        </label>
      </div>

      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="mt-4 w-full touch-none rounded-2xl border border-[var(--nr-border)]"
      />

      <div className="mt-3 flex gap-2">
        <button type="button" onClick={handleClear} className="rounded-lg border border-[var(--nr-border)] px-4 py-2 text-sm font-medium text-[var(--nr-text)]">
          Limpar
        </button>
        <button type="button" onClick={handleDownload} className="rounded-lg border border-[var(--nr-border)] px-4 py-2 text-sm font-medium text-[var(--nr-text)]">
          Baixar desenho
        </button>
      </div>

      <ResourceFeedbackWidget resourceId="desenho-livre" />

      <Link href="/quero-me-regular" className="mt-6 inline-block text-sm text-[var(--nr-accent-primary)] underline">
        Voltar para Quero me regular
      </Link>
    </div>
  );
}
