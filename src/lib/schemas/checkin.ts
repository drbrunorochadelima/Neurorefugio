import { z } from "zod";

const scale0to5 = z.number().int().min(0).max(5);

export const quickCheckInSchema = z.object({
  id: z.string(),
  userId: z.string(),
  createdAt: z.string(),
  type: z.literal("rapido"),
  humor: scale0to5,
  energia: scale0to5,
  ansiedade: scale0to5,
  sobrecarga: scale0to5,
  capacidadeComunicacao: scale0to5,
  precisaPausa: z.boolean(),
});
export type QuickCheckIn = z.infer<typeof quickCheckInSchema>;

export const fullCheckInSchema = z.object({
  id: z.string(),
  userId: z.string(),
  createdAt: z.string(),
  type: z.literal("completo"),
  humor: scale0to5,
  energia: scale0to5,
  ansiedade: scale0to5,
  irritabilidade: scale0to5,
  sensibilidadeLuz: scale0to5,
  sensibilidadeSom: scale0to5,
  sensibilidadeToque: scale0to5,
  sensibilidadeCheiro: scale0to5,
  dor: scale0to5,
  fome: scale0to5,
  sede: scale0to5,
  sono: scale0to5,
  temperaturaConfortavel: z.boolean(),
  necessidadeIsolamento: scale0to5,
  capacidadeFalarInteragir: scale0to5,
  necessidadeStimming: scale0to5,
  esforcoMasking: scale0to5,
  sobrecargaPercebida: scale0to5,
  acontecimentos: z.string().max(2000).optional(),
  estrategiasUtilizadas: z.string().max(2000).optional(),
});
export type FullCheckIn = z.infer<typeof fullCheckInSchema>;

export type CheckIn = QuickCheckIn | FullCheckIn;
