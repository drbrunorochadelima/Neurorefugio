export interface ConnectionPair {
  id: string;
  left: string;
  right: string;
}

export const CONNECTION_MODES: Record<string, { label: string; instruction: string; pairs: ConnectionPair[] }> = {
  emocaoNecessidade: {
    label: "Emoção e necessidade",
    instruction: "Combine cada emoção com uma necessidade possível associada a ela.",
    pairs: [
      { id: "1", left: "Sobrecarga", right: "Reduzir estímulos" },
      { id: "2", left: "Ansiedade", right: "Previsibilidade" },
      { id: "3", left: "Cansaço", right: "Descanso" },
      { id: "4", left: "Frustração", right: "Espaço para expressar" },
      { id: "5", left: "Alegria", right: "Compartilhar" },
      { id: "6", left: "Insegurança", right: "Apoio de alguém de confiança" },
    ],
  },
  sinalEstrategia: {
    label: "Sinal corporal e estratégia",
    instruction: "Combine cada sinal do corpo com uma estratégia que pode ajudar.",
    pairs: [
      { id: "1", left: "Tensão nos ombros", right: "Alongamento leve" },
      { id: "2", left: "Respiração acelerada", right: "Respiração opcional guiada" },
      { id: "3", left: "Dificuldade de foco", right: "Pausa curta" },
      { id: "4", left: "Vontade de se mexer", right: "Stimming digital" },
      { id: "5", left: "Exaustão", right: "Reduzir demandas" },
    ],
  },
  estimuloAdaptacao: {
    label: "Estímulo e possível adaptação",
    instruction: "Combine cada estímulo do ambiente com uma adaptação institucional possível.",
    pairs: [
      { id: "1", left: "Luz fluorescente forte", right: "Iluminação regulável" },
      { id: "2", left: "Alarmes simultâneos", right: "Priorização visual de alarmes" },
      { id: "3", left: "Sala sem silêncio", right: "Espaço de baixa estimulação" },
      { id: "4", left: "Reuniões sem pauta", right: "Pauta enviada com antecedência" },
      { id: "5", left: "Mudança de escala sem aviso", right: "Comunicação prévia de mudanças" },
    ],
  },
};

export type ConnectionModeId = keyof typeof CONNECTION_MODES;
