import { z } from "zod";

export const personalPlanSchema = z.object({
  id: z.string(),
  userId: z.string(),
  updatedAt: z.string(),
  comoPercebendoSobrecarga: z.string().max(2000).default(""),
  estimulosQueAfetam: z.string().max(2000).default(""),
  oQueCostumaAjudar: z.string().max(2000).default(""),
  oQueNaoDeveSerFeito: z.string().max(2000).default(""),
  comoPreferoComunicar: z.string().max(2000).default(""),
  quemPodeSerAvisado: z.string().max(2000).default(""),
  ondeConsigoMeRegular: z.string().max(2000).default(""),
  comoApoiarEmCriseMeltdownShutdown: z.string().max(2000).default(""),
  oQuePrecisoDepois: z.string().max(2000).default(""),
  quandoProcurarAjudaProfissional: z.string().max(2000).default(""),
  compartilhadoCom: z.array(z.string()).default([]),
});
export type PersonalPlan = z.infer<typeof personalPlanSchema>;

export const trustedContactSchema = z.object({
  id: z.string(),
  userId: z.string(),
  nome: z.string().min(1).max(120),
  relacao: z.string().max(120).optional(),
  telefone: z.string().max(40).optional(),
  email: z.string().email().optional().or(z.literal("")),
  comoAvisar: z.string().max(500).optional(),
});
export type TrustedContact = z.infer<typeof trustedContactSchema>;

export const communicationCardSchema = z.object({
  id: z.string(),
  userId: z.string(),
  texto: z.string().min(1).max(280),
  categoria: z.enum(["pausa", "sobrecarga", "instrucao", "recusa", "esclarecimento", "outro"]),
  favorito: z.boolean().default(false),
});
export type CommunicationCard = z.infer<typeof communicationCardSchema>;

export const resourceFeedbackSchema = z.object({
  id: z.string(),
  userId: z.string(),
  recursoId: z.string(),
  createdAt: z.string(),
  avaliacao: z.enum(["ajudou", "ajudou_parcialmente", "nao_ajudou", "piorou", "nao_avaliar"]),
});
export type ResourceFeedback = z.infer<typeof resourceFeedbackSchema>;
