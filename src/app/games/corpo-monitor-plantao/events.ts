export interface EventEffect {
  energia?: number;
  tensao?: number;
  sobrecargaAuditiva?: number;
  sobrecargaVisual?: number;
  sobrecargaSocial?: number;
  masking?: number;
  necessidadeStimming?: number;
}

export interface EventChoice {
  label: string;
  isMasking: boolean;
  isCommunication: boolean;
  effects: EventEffect;
  consequence: string;
}

export interface ShiftEvent {
  id: string;
  title: string;
  description: string;
  estimulo: string;
  barreiraInstitucional?: string;
  choices: EventChoice[];
}

export const SHIFT_EVENTS: ShiftEvent[] = [
  {
    id: "passagem-plantao",
    title: "Passagem de plantão",
    description:
      "Vários profissionais falam ao mesmo tempo enquanto os monitores emitem alarmes intermitentes. Você precisa registrar informações de vários pacientes.",
    estimulo: "Ruído sobreposto, múltiplas vozes simultâneas",
    choices: [
      {
        label: "Pedir para as informações serem passadas uma de cada vez",
        isMasking: false,
        isCommunication: true,
        effects: { tensao: -1, sobrecargaAuditiva: -1 },
        consequence: "A equipe concorda, embora leve um pouco mais de tempo.",
      },
      {
        label: "Tentar acompanhar tudo em silêncio, anotando o máximo possível",
        isMasking: true,
        isCommunication: false,
        effects: { tensao: 2, sobrecargaAuditiva: 2, masking: 1 },
        consequence: "Você consegue registrar quase tudo, mas termina tenso.",
      },
    ],
  },
  {
    id: "visita-multiprofissional",
    title: "Visita multiprofissional",
    description:
      "Uma equipe grande circula pelo leito, conversando entre si e fazendo perguntas rápidas, enquanto luzes do monitor piscam.",
    estimulo: "Circulação de pessoas, luzes, perguntas simultâneas",
    choices: [
      {
        label: "Pedir um instante antes de responder",
        isMasking: false,
        isCommunication: true,
        effects: { tensao: -1, sobrecargaSocial: -1 },
        consequence: "Um colega nota e ajuda a organizar as perguntas.",
      },
      {
        label: "Responder tudo imediatamente, mesmo sobrecarregado(a)",
        isMasking: true,
        isCommunication: false,
        effects: { sobrecargaSocial: 2, tensao: 1, masking: 1 },
        consequence: "A visita segue rápido, mas a sobrecarga social aumenta.",
      },
    ],
  },
  {
    id: "mudanca-escala",
    title: "Mudança de escala sem aviso prévio",
    description: "Você descobre, já no plantão, que sua escala foi alterada sem aviso.",
    estimulo: "Imprevisibilidade, quebra de rotina",
    barreiraInstitucional: "Mudanças de escala são comunicadas sem antecedência.",
    choices: [
      {
        label: "Comunicar ao gestor que mudanças sem aviso afetam seu planejamento",
        isMasking: false,
        isCommunication: true,
        effects: { tensao: 1 },
        consequence: "O gestor registra o pedido, sem garantia de mudança imediata.",
      },
      {
        label: "Não dizer nada e se adaptar por conta própria",
        isMasking: true,
        isCommunication: false,
        effects: { tensao: 2, necessidadeStimming: 1 },
        consequence: "Você segue o plantão, mas a imprevisibilidade pesa mais.",
      },
    ],
  },
  {
    id: "alarmes-simultaneos",
    title: "Alarmes simultâneos",
    description: "Dois monitores disparam alarmes ao mesmo tempo em leitos diferentes.",
    estimulo: "Alarmes sobrepostos, hipervigilância",
    barreiraInstitucional: "Não há priorização visual diferenciada entre alarmes de gravidades distintas.",
    choices: [
      {
        label: "Priorizar por gravidade clínica, comunicando à equipe qual está assumindo",
        isMasking: false,
        isCommunication: true,
        effects: { sobrecargaAuditiva: 1, tensao: 1 },
        consequence: "A equipe se divide, mas o processo fica mais organizado.",
      },
      {
        label: "Tentar responder aos dois sozinho(a)",
        isMasking: true,
        isCommunication: false,
        effects: { sobrecargaAuditiva: 2, tensao: 2 },
        consequence: "Ambos são atendidos, com maior custo pessoal.",
      },
    ],
  },
  {
    id: "sobrecarga-tarefas",
    title: "Sobrecarga de tarefas simultâneas",
    description: "Três tarefas urgentes chegam ao mesmo tempo, de pessoas diferentes.",
    estimulo: "Demandas simultâneas, pressão temporal",
    choices: [
      {
        label: "Negociar prazos e pedir ajuda de um colega",
        isMasking: false,
        isCommunication: true,
        effects: { tensao: -1 },
        consequence: "Uma tarefa é redistribuída.",
      },
      {
        label: "Assumir tudo sozinho(a) para não parecer incapaz",
        isMasking: true,
        isCommunication: false,
        effects: { tensao: 2, energia: -2, masking: 1 },
        consequence: "Tudo é feito, mas a energia cai bastante.",
      },
    ],
  },
  {
    id: "ausencia-pausa",
    title: "Ausência de local de pausa",
    description: "Você precisa de um momento de silêncio, mas não há espaço reservado para isso na unidade.",
    estimulo: "Ausência de espaço de baixa estimulação",
    barreiraInstitucional: "Não existe espaço de baixa estimulação disponível na unidade.",
    choices: [
      {
        label: "Buscar um canto mais silencioso por alguns minutos, mesmo improvisado",
        isMasking: false,
        isCommunication: false,
        effects: { tensao: -2, energia: 1 },
        consequence: "Ajuda parcialmente, mesmo sem um espaço ideal.",
      },
      {
        label: "Continuar trabalhando sem pausa",
        isMasking: true,
        isCommunication: false,
        effects: { tensao: 2, energia: -1 },
        consequence: "O plantão segue, mas o cansaço se acumula.",
      },
    ],
  },
  {
    id: "colega-ajuda",
    title: "Um colega oferece ajuda",
    description: "Um colega percebe sua tensão e oferece assumir uma tarefa.",
    estimulo: "Interação social inesperada",
    choices: [
      {
        label: "Aceitar a ajuda",
        isMasking: false,
        isCommunication: true,
        effects: { tensao: -2, energia: 1 },
        consequence: "A carga imediata diminui.",
      },
      {
        label: "Recusar, dizendo que está tudo bem",
        isMasking: true,
        isCommunication: false,
        effects: { tensao: 1, masking: 1 },
        consequence: "Você segue sozinho(a) com a tarefa.",
      },
    ],
  },
  {
    id: "gestor-adaptacao",
    title: "Pedido de adaptação ao gestor",
    description: "Você decide pedir para reduzir o volume dos alarmes não críticos no seu setor.",
    estimulo: "Resposta institucional incerta",
    choices: [
      {
        label: "Fazer o pedido formalmente, por escrito",
        isMasking: false,
        isCommunication: true,
        effects: { tensao: -1 },
        consequence: "O pedido é registrado e entra na pauta da próxima reunião — a resposta ainda depende da instituição.",
      },
      {
        label: "Comentar informalmente numa conversa rápida",
        isMasking: false,
        isCommunication: true,
        effects: { tensao: 1 },
        consequence: "O gestor ouve, mas sem compromisso claro de mudança — a barreira institucional permanece por ora.",
      },
    ],
  },
  {
    id: "comunicar-limite",
    title: "Necessidade de comunicar um limite",
    description: "Você percebe que não vai conseguir continuar no mesmo ritmo pelo resto do plantão.",
    estimulo: "Autopercepção de sobrecarga",
    choices: [
      {
        label: "Comunicar à equipe que precisa reduzir o ritmo por um momento",
        isMasking: false,
        isCommunication: true,
        effects: { tensao: -1, energia: 1 },
        consequence: "A equipe se reorganiza para apoiar.",
      },
      {
        label: "Manter o ritmo mesmo sentindo que não consegue mais",
        isMasking: true,
        isCommunication: false,
        effects: { tensao: 2, energia: -2, masking: 1 },
        consequence: "O plantão termina, mas o custo pessoal foi alto.",
      },
    ],
  },
];
