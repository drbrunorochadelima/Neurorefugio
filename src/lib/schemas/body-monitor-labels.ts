import type { BodyRegion, BodySensation, ExternalStimulus } from "./body-monitor";

export const BODY_REGION_LABELS: Record<BodyRegion, string> = {
  cabeca: "Cabeça",
  pescoco: "Pescoço",
  ombros: "Ombros",
  bracos: "Braços",
  maos: "Mãos",
  peito: "Peito",
  abdomen: "Abdômen",
  costas: "Costas",
  quadril: "Quadril",
  pernas: "Pernas",
  pes: "Pés",
};

export const BODY_SENSATION_LABELS: Record<BodySensation, string> = {
  dor: "Dor",
  tensao: "Tensão",
  calor: "Calor",
  frio: "Frio",
  formigamento: "Formigamento",
  agitacao: "Agitação",
  dificuldade_perceber: "Dificuldade de perceber",
  sensibilidade_toque: "Sensibilidade ao toque",
};

export const EXTERNAL_STIMULUS_LABELS: Record<ExternalStimulus, string> = {
  luz_forte: "Luz forte",
  ruido: "Ruído",
  alarmes: "Alarmes",
  cheiro_forte: "Cheiro forte",
  toque: "Toque",
  temperatura: "Temperatura",
  circulacao_pessoas: "Circulação de pessoas",
  interrupcoes: "Interrupções",
};
