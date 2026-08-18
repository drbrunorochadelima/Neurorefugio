"use client";

import { useId } from "react";
import { useSensory } from "@/lib/sensory/context";
import type { SensoryPrefs } from "@/lib/sensory/types";

function Fieldset({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6">
      <legend className="px-2 text-base font-semibold text-[var(--nr-text)]">{legend}</legend>
      <div className="mt-4 flex flex-col gap-5">{children}</div>
    </fieldset>
  );
}

function RadioGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  const name = useId();
  return (
    <div>
      <span className="block text-sm font-medium text-[var(--nr-text)]">{label}</span>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`cursor-pointer rounded-lg border px-3 py-2 text-sm ${
              value === opt.value
                ? "border-[var(--nr-accent-primary)] bg-[var(--nr-surface-alt)] text-[var(--nr-accent-primary)] font-semibold"
                : "border-[var(--nr-border)] text-[var(--nr-text)]"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-start justify-between gap-4">
      <span>
        <span className="block text-sm font-medium text-[var(--nr-text)]">{label}</span>
        {description && (
          <span className="block text-sm text-[var(--nr-text-muted)]">{description}</span>
        )}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-5 w-5 shrink-0 accent-[var(--nr-accent-primary)]"
      />
    </label>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}) {
  const id = useId();
  return (
    <div>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-[var(--nr-text)]">
          {label}
        </label>
        <span className="text-sm text-[var(--nr-text-muted)]" aria-hidden="true">
          {value}
          {unit}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={`${value}${unit}`}
        className="mt-2 w-full accent-[var(--nr-accent-primary)]"
      />
    </div>
  );
}

export default function ConfiguracoesPage() {
  const { prefs, setPrefs, resetPrefs } = useSensory();

  function set<K extends keyof SensoryPrefs>(key: K, value: SensoryPrefs[K]) {
    setPrefs({ [key]: value } as Partial<SensoryPrefs>);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-[var(--nr-text)]">Meu Ambiente</h1>
      <p className="mt-2 max-w-2xl text-[var(--nr-text-muted)]">
        O Passaporte Sensorial reúne suas preferências de conforto visual, sonoro e de movimento.
        Elas ficam salvas neste navegador e nunca são alteradas sem sua ação direta.
      </p>

      <div className="mt-8 flex flex-col gap-6">
        <Fieldset legend="Aparência">
          <RadioGroup
            label="Tema"
            value={prefs.theme}
            onChange={(v) => set("theme", v)}
            options={[
              { value: "light", label: "Claro" },
              { value: "dark", label: "Escuro" },
              { value: "system", label: "Seguir o sistema" },
            ]}
          />
          <Toggle
            label="Modo de baixo estímulo"
            description="Reduz cores de destaque, densidade visual e elementos decorativos."
            checked={prefs.lowStimulus}
            onChange={(v) => set("lowStimulus", v)}
          />
          <Toggle
            label="Alto contraste"
            checked={prefs.highContrast}
            onChange={(v) => set("highContrast", v)}
          />
          <SliderField
            label="Brilho"
            value={prefs.brightness}
            min={70}
            max={130}
            unit="%"
            onChange={(v) => set("brightness", v)}
          />
          <SliderField
            label="Saturação"
            value={prefs.saturation}
            min={0}
            max={150}
            unit="%"
            onChange={(v) => set("saturation", v)}
          />
          <Toggle
            label="Ocultar imagens decorativas"
            checked={prefs.hideDecorativeImages}
            onChange={(v) => set("hideDecorativeImages", v)}
          />
        </Fieldset>

        <Fieldset legend="Texto">
          <SliderField
            label="Tamanho da fonte"
            value={Math.round(prefs.fontSizeScale * 100)}
            min={85}
            max={160}
            step={5}
            unit="%"
            onChange={(v) => set("fontSizeScale", v / 100)}
          />
          <RadioGroup
            label="Peso da fonte"
            value={prefs.fontWeight}
            onChange={(v) => set("fontWeight", v)}
            options={[
              { value: "normal", label: "Normal" },
              { value: "medium", label: "Médio" },
              { value: "bold", label: "Negrito" },
            ]}
          />
          <RadioGroup
            label="Espaçamento entre letras"
            value={prefs.letterSpacing}
            onChange={(v) => set("letterSpacing", v)}
            options={[
              { value: "normal", label: "Normal" },
              { value: "wide", label: "Ampliado" },
              { value: "wider", label: "Bem ampliado" },
            ]}
          />
          <RadioGroup
            label="Altura da linha"
            value={prefs.lineHeight}
            onChange={(v) => set("lineHeight", v)}
            options={[
              { value: "normal", label: "Normal" },
              { value: "relaxed", label: "Relaxada" },
              { value: "loose", label: "Bem espaçada" },
            ]}
          />
          <RadioGroup
            label="Linguagem"
            value={prefs.languageDepth}
            onChange={(v) => set("languageDepth", v)}
            options={[
              { value: "summary", label: "Resumida" },
              { value: "detailed", label: "Aprofundada" },
            ]}
          />
        </Fieldset>

        <Fieldset legend="Movimento e densidade">
          <RadioGroup
            label="Animações"
            value={prefs.motion}
            onChange={(v) => set("motion", v)}
            options={[
              { value: "full", label: "Completas" },
              { value: "reduced", label: "Reduzidas" },
              { value: "none", label: "Nenhuma" },
            ]}
          />
          <RadioGroup
            label="Quantidade de elementos visíveis"
            value={prefs.density}
            onChange={(v) => set("density", v)}
            options={[
              { value: "normal", label: "Normal" },
              { value: "low", label: "Reduzida" },
            ]}
          />
          <Toggle
            label="Interface simplificada"
            description="Reduz opções secundárias nas telas para focar no essencial."
            checked={prefs.simplifiedInterface}
            onChange={(v) => set("simplifiedInterface", v)}
          />
        </Fieldset>

        <Fieldset legend="Som e vibração">
          <p className="text-sm text-[var(--nr-text-muted)]">
            Nenhum som toca automaticamente em nenhuma página. Estas opções controlam se sons
            opcionais (em jogos e recursos de autorregulação) podem ser ativados por você.
          </p>
          <Toggle
            label="Permitir música opcional"
            checked={prefs.soundMusic}
            onChange={(v) => set("soundMusic", v)}
          />
          <Toggle
            label="Permitir efeitos sonoros opcionais"
            checked={prefs.soundEffects}
            onChange={(v) => set("soundEffects", v)}
          />
          <Toggle
            label="Permitir vibração"
            checked={prefs.vibration}
            onChange={(v) => set("vibration", v)}
          />
          <Toggle
            label="Bloquear sons agudos"
            checked={prefs.blockHighPitchSounds}
            onChange={(v) => set("blockHighPitchSounds", v)}
          />
        </Fieldset>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={resetPrefs}
            className="rounded-lg border border-[var(--nr-border)] px-4 py-2 text-sm font-medium text-[var(--nr-text)] hover:bg-[var(--nr-surface-alt)]"
          >
            Restaurar padrões
          </button>
        </div>
      </div>
    </div>
  );
}
