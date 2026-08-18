import { z } from "zod";

export const hyperfocusLinkSchema = z.object({
  id: z.string(),
  titulo: z.string().min(1).max(200),
  url: z.string().url(),
});

export const hyperfocusTimelineItemSchema = z.object({
  id: z.string(),
  data: z.string(),
  descricao: z.string().max(500),
});

export const hyperfocusSchema = z.object({
  id: z.string(),
  userId: z.string(),
  titulo: z.string().min(1).max(120),
  descricao: z.string().max(3000).optional(),
  categoria: z.string().max(80).optional(),
  privado: z.boolean().default(true),
  favorito: z.boolean().default(false),
  links: z.array(hyperfocusLinkSchema).default([]),
  timeline: z.array(hyperfocusTimelineItemSchema).default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Hyperfocus = z.infer<typeof hyperfocusSchema>;
