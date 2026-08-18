import { z } from "zod";

export const CHECKLIST_TOPICS = [
  "iluminacao",
  "ruidos",
  "interrupcoes",
  "pausas",
  "espacos_baixa_estimulacao",
  "comunicacao_previsivel",
  "avisos_mudancas",
  "reunioes_acessiveis",
  "formacao_equipes",
  "adaptacoes_razoaveis",
] as const;
export type ChecklistTopic = (typeof CHECKLIST_TOPICS)[number];

export const CHECKLIST_TOPIC_LABELS: Record<ChecklistTopic, string> = {
  iluminacao: "Iluminação",
  ruidos: "Ruídos",
  interrupcoes: "Interrupções",
  pausas: "Espaços e tempos de pausa",
  espacos_baixa_estimulacao: "Espaços de baixa estimulação",
  comunicacao_previsivel: "Comunicação previsível",
  avisos_mudancas: "Avisos de mudanças",
  reunioes_acessiveis: "Reuniões acessíveis",
  formacao_equipes: "Formação das equipes",
  adaptacoes_razoaveis: "Adaptações razoáveis",
};

export const checklistItemSchema = z.object({
  id: z.string(),
  unidade: z.string().min(1).max(160),
  topico: z.enum(CHECKLIST_TOPICS),
  barreira: z.string().max(1000).default(""),
  prioridade: z.enum(["alta", "media", "baixa"]),
  recomendacao: z.string().max(1000).default(""),
  responsavel: z.string().max(160).default(""),
  prazo: z.string().default(""),
  acompanhamento: z.string().max(1000).default(""),
  status: z.enum(["atende", "parcial", "nao_atende"]),
  createdAt: z.string(),
});
export type ChecklistItem = z.infer<typeof checklistItemSchema>;
