import { z } from "zod";

export const FORUM_CATEGORIES = [
  "trabalho-em-saude",
  "diagnostico-tardio",
  "universidade",
  "hiperfocos",
  "sobrecarga",
  "masking",
  "burnout-autista",
  "direitos",
  "relacionamentos",
  "lgbtqiapn",
  "capacitismo",
  "conquistas",
  "desabafos",
] as const;
export type ForumCategory = (typeof FORUM_CATEGORIES)[number];

export const FORUM_CATEGORY_LABELS: Record<ForumCategory, string> = {
  "trabalho-em-saude": "Trabalho em saúde",
  "diagnostico-tardio": "Diagnóstico tardio",
  universidade: "Universidade",
  hiperfocos: "Hiperfocos",
  sobrecarga: "Sobrecarga",
  masking: "Masking",
  "burnout-autista": "Burnout autista",
  direitos: "Direitos",
  relacionamentos: "Relacionamentos",
  lgbtqiapn: "LGBTQIAPN+",
  capacitismo: "Capacitismo",
  conquistas: "Conquistas",
  desabafos: "Desabafos",
};

export const REACTION_TYPES = [
  "eu-entendo",
  "obrigado-por-compartilhar",
  "estou-com-voce",
  "isso-foi-util",
  "quero-saber-mais",
] as const;
export type ReactionType = (typeof REACTION_TYPES)[number];

export const REACTION_LABELS: Record<ReactionType, string> = {
  "eu-entendo": "Eu entendo",
  "obrigado-por-compartilhar": "Obrigado por compartilhar",
  "estou-com-voce": "Estou com você",
  "isso-foi-util": "Isso foi útil",
  "quero-saber-mais": "Quero saber mais",
};

export const forumPostSchema = z.object({
  id: z.string(),
  authorId: z.string(),
  authorDisplayName: z.string(),
  categoria: z.enum(FORUM_CATEGORIES),
  titulo: z.string().min(3).max(160),
  corpo: z.string().min(1).max(8000),
  avisoConteudo: z.string().max(200).optional(),
  status: z.enum(["rascunho", "em_revisao", "publicado"]),
  createdAt: z.string(),
  updatedAt: z.string(),
  reactions: z.record(z.string(), z.array(z.string())).default({}),
});
export type ForumPost = z.infer<typeof forumPostSchema>;

export const forumCommentSchema = z.object({
  id: z.string(),
  postId: z.string(),
  authorId: z.string(),
  authorDisplayName: z.string(),
  corpo: z.string().min(1).max(3000),
  createdAt: z.string(),
  status: z.enum(["rascunho", "em_revisao", "publicado"]),
});
export type ForumComment = z.infer<typeof forumCommentSchema>;

export const reportSchema = z.object({
  id: z.string(),
  reporterId: z.string(),
  targetType: z.enum(["post", "comment", "user"]),
  targetId: z.string(),
  motivo: z.string().min(1).max(1000),
  createdAt: z.string(),
  status: z.enum(["pendente", "em_analise", "resolvida"]),
});
export type Report = z.infer<typeof reportSchema>;

export const blockSchema = z.object({
  id: z.string(),
  userId: z.string(),
  blockedUserId: z.string(),
  createdAt: z.string(),
});
export type Block = z.infer<typeof blockSchema>;
