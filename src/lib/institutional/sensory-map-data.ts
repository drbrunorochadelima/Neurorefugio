export type StimulusNecessity = "necessario" | "necessario_ajustavel" | "evitavel" | "dependente_pessoa";

export const STIMULUS_NECESSITY_LABELS: Record<StimulusNecessity, string> = {
  necessario: "Clinicamente necessário",
  necessario_ajustavel: "Necessário, mas ajustável",
  evitavel: "Evitável",
  dependente_pessoa: "Depende da pessoa",
};

export interface SensoryMapArea {
  id: string;
  titulo: string;
  estimulos: { descricao: string; necessidade: StimulusNecessity }[];
  barreiras: string[];
  demandasCognitivas: string[];
  impactosPossiveis: string[];
  estrategiasReducaoDanos: string[];
  adaptacoesInstitucionais: string[];
}

export const SENSORY_MAP_AREAS: SensoryMapArea[] = [
  {
    id: "posto-enfermagem",
    titulo: "Posto de enfermagem",
    estimulos: [
      { descricao: "Conversas simultâneas de várias pessoas", necessidade: "evitavel" },
      { descricao: "Telefones e monitores centrais soando", necessidade: "necessario_ajustavel" },
      { descricao: "Iluminação intensa contínua", necessidade: "necessario_ajustavel" },
    ],
    barreiras: ["Ausência de sinalização de prioridade entre demandas simultâneas"],
    demandasCognitivas: ["Atenção dividida entre múltiplas fontes de informação"],
    impactosPossiveis: ["Fadiga auditiva", "Dificuldade de priorização sob sobrecarga"],
    estrategiasReducaoDanos: ["Alternar tarefas de alta demanda com tarefas mais previsíveis"],
    adaptacoesInstitucionais: ["Sinalização visual de prioridade", "Rodízio de funções de maior exposição sonora"],
  },
  {
    id: "leitos",
    titulo: "Leitos",
    estimulos: [
      { descricao: "Alarmes de monitor multiparamétrico", necessidade: "necessario_ajustavel" },
      { descricao: "Luz de exame direta", necessidade: "necessario" },
      { descricao: "Toque em procedimentos", necessidade: "necessario" },
    ],
    barreiras: ["Volume de alarme não diferenciado por gravidade"],
    demandasCognitivas: ["Monitoramento contínuo de múltiplos parâmetros"],
    impactosPossiveis: ["Hipervigilância sustentada"],
    estrategiasReducaoDanos: ["Avisar verbalmente antes de procedimentos com toque"],
    adaptacoesInstitucionais: ["Configuração de alarmes por gravidade clínica"],
  },
  {
    id: "monitores-bombas",
    titulo: "Monitores e bombas de infusão",
    estimulos: [
      { descricao: "Bipes de alerta de bomba (ar, oclusão, fim de infusão)", necessidade: "necessario_ajustavel" },
      { descricao: "Telas piscantes de alerta", necessidade: "necessario_ajustavel" },
    ],
    barreiras: ["Alarmes de baixa prioridade com mesmo volume que os críticos"],
    demandasCognitivas: ["Discriminação rápida entre tipos de alarme"],
    impactosPossiveis: ["Sobrecarga auditiva cumulativa ao longo do plantão"],
    estrategiasReducaoDanos: ["Verificação preventiva para reduzir alarmes evitáveis"],
    adaptacoesInstitucionais: ["Manutenção preventiva de equipamentos", "Ajuste de limiares de alarme por protocolo"],
  },
  {
    id: "corredores",
    titulo: "Corredores",
    estimulos: [
      { descricao: "Circulação constante de pessoas", necessidade: "dependente_pessoa" },
      { descricao: "Conversas cruzadas", necessidade: "evitavel" },
    ],
    barreiras: ["Ausência de rota alternativa de menor circulação"],
    demandasCognitivas: ["Navegação social contínua"],
    impactosPossiveis: ["Sobrecarga social acumulada"],
    estrategiasReducaoDanos: ["Usar fones de baixo volume quando permitido pelo protocolo"],
    adaptacoesInstitucionais: ["Sinalização de horários de menor circulação"],
  },
  {
    id: "salas-descanso",
    titulo: "Salas de descanso",
    estimulos: [
      { descricao: "Televisão ou rádio ligados", necessidade: "evitavel" },
      { descricao: "Conversas em grupo", necessidade: "dependente_pessoa" },
    ],
    barreiras: ["Ausência de espaço silencioso alternativo dentro da sala de descanso"],
    demandasCognitivas: ["Nenhuma — este deveria ser um espaço de baixa demanda"],
    impactosPossiveis: ["Pausa que não gera recuperação real"],
    estrategiasReducaoDanos: ["Negociar uso de fones ou horário de silêncio combinado com a equipe"],
    adaptacoesInstitucionais: ["Reservar um espaço de baixa estimulação, mesmo que pequeno"],
  },
  {
    id: "passagem-plantao",
    titulo: "Passagem de plantão",
    estimulos: [
      { descricao: "Múltiplas vozes simultâneas", necessidade: "evitavel" },
      { descricao: "Ritmo acelerado de informações", necessidade: "necessario_ajustavel" },
    ],
    barreiras: ["Ausência de estrutura previsível para a passagem"],
    demandasCognitivas: ["Retenção rápida de múltiplas informações clínicas"],
    impactosPossiveis: ["Perda de informação sob sobrecarga"],
    estrategiasReducaoDanos: ["Pedir registro escrito complementar ao verbal"],
    adaptacoesInstitucionais: ["Roteiro estruturado e sequencial de passagem de plantão"],
  },
  {
    id: "visita-multiprofissional",
    titulo: "Visita multiprofissional",
    estimulos: [
      { descricao: "Grupo grande circulando e falando", necessidade: "dependente_pessoa" },
      { descricao: "Perguntas diretas e rápidas", necessidade: "necessario_ajustavel" },
    ],
    barreiras: ["Ausência de tempo de processamento entre pergunta e resposta esperada"],
    demandasCognitivas: ["Resposta verbal rápida sob observação do grupo"],
    impactosPossiveis: ["Sobrecarga social pontual intensa"],
    estrategiasReducaoDanos: ["Pedir um instante antes de responder"],
    adaptacoesInstitucionais: ["Cultura institucional que normalize pausas antes de responder"],
  },
  {
    id: "picos-circulacao",
    titulo: "Períodos de maior circulação (trocas de turno, visitas)",
    estimulos: [
      { descricao: "Pico simultâneo de pessoas, sons e demandas", necessidade: "dependente_pessoa" },
    ],
    barreiras: ["Concentração de múltiplas demandas no mesmo horário"],
    demandasCognitivas: ["Priorização sob pressão temporal"],
    impactosPossiveis: ["Pico de sobrecarga previsível, mas não planejado institucionalmente"],
    estrategiasReducaoDanos: ["Antecipar tarefas não urgentes para fora do pico"],
    adaptacoesInstitucionais: ["Escalonar horários de visita e troca de turno quando possível"],
  },
];
