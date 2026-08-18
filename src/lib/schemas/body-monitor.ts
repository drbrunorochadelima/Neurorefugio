import { z } from "zod";

export const BODY_REGIONS = [
  "cabeca",
  "pescoco",
  "ombros",
  "bracos",
  "maos",
  "peito",
  "abdomen",
  "costas",
  "quadril",
  "pernas",
  "pes",
] as const;
export type BodyRegion = (typeof BODY_REGIONS)[number];

export const BODY_SENSATIONS = [
  "dor",
  "tensao",
  "calor",
  "frio",
  "formigamento",
  "agitacao",
  "dificuldade_perceber",
  "sensibilidade_toque",
] as const;
export type BodySensation = (typeof BODY_SENSATIONS)[number];

export const bodyMarkSchema = z.object({
  region: z.enum(BODY_REGIONS),
  sensations: z.array(z.enum(BODY_SENSATIONS)),
  intensity: z.number().int().min(1).max(5),
});
export type BodyMark = z.infer<typeof bodyMarkSchema>;

export const EXTERNAL_STIMULI = [
  "luz_forte",
  "ruido",
  "alarmes",
  "cheiro_forte",
  "toque",
  "temperatura",
  "circulacao_pessoas",
  "interrupcoes",
] as const;
export type ExternalStimulus = (typeof EXTERNAL_STIMULI)[number];

export const bodyMonitorEntrySchema = z.object({
  id: z.string(),
  userId: z.string(),
  createdAt: z.string(),
  ambiente: z.string().max(120).optional(),
  marks: z.array(bodyMarkSchema),
  externalStimuli: z.array(z.enum(EXTERNAL_STIMULI)),
  necessidadeMovimento: z.boolean(),
  pesoCorporalPercebido: z.enum(["leve", "normal", "pesado"]),
  notas: z.string().max(2000).optional(),
});
export type BodyMonitorEntry = z.infer<typeof bodyMonitorEntrySchema>;
