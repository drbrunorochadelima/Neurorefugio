import { z } from "zod";

export const journalEntrySchema = z.object({
  id: z.string(),
  userId: z.string(),
  createdAt: z.string(),
  texto: z.string().min(1).max(5000),
});
export type JournalEntry = z.infer<typeof journalEntrySchema>;

export const routineItemSchema = z.object({
  id: z.string(),
  userId: z.string(),
  titulo: z.string().min(1).max(160),
  horario: z.string().max(20).optional(),
  concluidoEm: z.string().optional(),
  createdAt: z.string(),
});
export type RoutineItem = z.infer<typeof routineItemSchema>;
