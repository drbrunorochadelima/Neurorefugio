import { z } from "zod";

export const CONTENT_CLASSIFICATIONS = [
  "evidencia_cientifica",
  "reflexao_teorica",
  "experiencia_autoetnografica",
  "conteudo_educativo",
  "recomendacao_institucional",
] as const;
export type ContentClassification = (typeof CONTENT_CLASSIFICATIONS)[number];

export const CONTENT_CLASSIFICATION_LABELS: Record<ContentClassification, string> = {
  evidencia_cientifica: "Evidência científica",
  reflexao_teorica: "Reflexão teórica",
  experiencia_autoetnografica: "Experiência autoetnográfica",
  conteudo_educativo: "Conteúdo educativo",
  recomendacao_institucional: "Recomendação institucional",
};

export const LIBRARY_AXES = ["luzes", "alarmes", "silencio", "geral"] as const;
export type LibraryAxis = (typeof LIBRARY_AXES)[number];

export const libraryReferenceSchema = z.object({
  citacao: z.string().min(1).max(500),
  url: z.string().url().optional(),
});

export const libraryArticleSchema = z.object({
  id: z.string(),
  slug: z.string(),
  titulo: z.string().min(1).max(200),
  resumo: z.string().min(1).max(600),
  corpoResumido: z.string().min(1),
  corpoAprofundado: z.string().min(1),
  classificacao: z.enum(CONTENT_CLASSIFICATIONS),
  eixo: z.enum(LIBRARY_AXES),
  autoria: z.string().min(1).max(200),
  revisadoPor: z.string().max(200).optional(),
  status: z.enum(["demonstrativo", "pendente_revisao", "revisado"]),
  dataPublicacao: z.string(),
  ultimaAtualizacao: z.string(),
  referencias: z.array(libraryReferenceSchema).default([]),
  relacionados: z.array(z.string()).default([]),
});
export type LibraryArticle = z.infer<typeof libraryArticleSchema>;
