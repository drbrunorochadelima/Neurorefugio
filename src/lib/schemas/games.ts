import { z } from "zod";

export const gameProgressSchema = z.object({
  id: z.string(),
  userId: z.string(),
  gameId: z.string(),
  updatedAt: z.string(),
  data: z.record(z.string(), z.unknown()).default({}),
  jornada: z.object({
    estrelas: z.number().int().min(0).default(0),
    folhas: z.number().int().min(0).default(0),
  }),
});
export type GameProgress = z.infer<typeof gameProgressSchema>;

export const coloringArtworkSchema = z.object({
  id: z.string(),
  userId: z.string(),
  templateId: z.string(),
  titulo: z.string().max(120).default("Sem título"),
  svgPaths: z.record(z.string(), z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type ColoringArtwork = z.infer<typeof coloringArtworkSchema>;
