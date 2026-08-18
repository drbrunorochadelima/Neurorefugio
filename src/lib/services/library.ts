import { createLocalCollection } from "@/lib/storage/local-collection";
import type { LibraryArticle } from "@/lib/schemas/library";

const collection = createLocalCollection<LibraryArticle>("neurorefugio.libraryArticles.v1");

const NOW = "2026-08-18";

function seed(): void {
  collection.seedIfEmpty([
    {
      id: "lib-corpo-monitor",
      slug: "o-que-e-o-corpo-monitor",
      titulo: "O que é o corpo-monitor",
      resumo: "O conceito de corpo-monitor descreve a relação de mão dupla entre monitorar o ambiente da UTI e ser atravessado por ele.",
      corpoResumido:
        "O corpo-monitor representa duas direções ao mesmo tempo: de fora para dentro (luzes, alarmes, ruídos, interrupções) e de dentro para fora (hipervigilância, tensão, fadiga, necessidade de stimming, masking, sobrecarga). Sinais corporais são dados legítimos da experiência, não indicadores de incompetência profissional.",
      corpoAprofundado:
        "O conceito de corpo-monitor nasce da observação de que, na terapia intensiva, o profissional autista não apenas monitora pacientes, equipamentos e parâmetros — seu próprio corpo também funciona como um instrumento de leitura do ambiente, e é atravessado por ele. De fora para dentro: luzes, alarmes, ruídos, cheiros, temperatura, toque, circulação de pessoas, interrupções, imprevisibilidade e pressão institucional. De dentro para fora: hipervigilância, tensão, fadiga, dificuldade de comunicação, necessidade de stimming, esforço de masking, sobrecarga, possibilidade de meltdown ou shutdown, necessidade de pausa ou afastamento. Tratar esses sinais como dados legítimos — e não como falhas pessoais — é o ponto de partida para pensar acessibilidade sensorial no trabalho em saúde.",
      classificacao: "reflexao_teorica",
      eixo: "geral",
      autoria: "Bruno Rocha de Lima",
      status: "pendente_revisao",
      dataPublicacao: NOW,
      ultimaAtualizacao: NOW,
      referencias: [],
      relacionados: ["lib-masking", "lib-alarmes-hipervigilancia"],
    },
    {
      id: "lib-masking",
      slug: "masking-o-que-e-e-por-que-cansa",
      titulo: "Masking: o que é e por que cansa",
      resumo: "Masking é o esforço de mascarar traços autistas para se adequar a expectativas sociais — e tem um custo real.",
      corpoResumido:
        "Masking é suprimir stims, forçar contato visual, script de conversas e esconder sobrecarga para parecer 'neurotípico'. É um trabalho invisível e cansativo, associado a maior risco de burnout autista.",
      corpoAprofundado:
        "Masking (ou camuflagem social) descreve estratégias — conscientes ou não — usadas por pessoas autistas para ocultar ou minimizar traços percebidos como 'diferentes' em contextos sociais: suprimir stims, forçar contato visual, ensaiar roteiros de conversa, mascarar sinais de sobrecarga. Embora possa funcionar como estratégia de sobrevivência em ambientes pouco acessíveis, o masking sustentado tem custo cumulativo: fadiga, ansiedade, perda de autoconhecimento sobre os próprios limites e maior risco de burnout autista. Em ambientes de trabalho em saúde, onde a expectativa de controle emocional e desempenho é alta, esse custo tende a ser ainda mais invisibilizado.",
      classificacao: "conteudo_educativo",
      eixo: "silencio",
      autoria: "Equipe NeuroRefúgio",
      status: "pendente_revisao",
      dataPublicacao: NOW,
      ultimaAtualizacao: NOW,
      referencias: [],
      relacionados: ["lib-corpo-monitor", "lib-capacitismo-estrutural"],
    },
    {
      id: "lib-luzes-sobrecarga",
      slug: "luzes-artificiais-e-sobrecarga-visual",
      titulo: "Luzes artificiais e sobrecarga visual em ambientes de saúde",
      resumo: "Iluminação fluorescente contínua, reflexos e telas de monitores compõem um dos eixos centrais de sobrecarga sensorial na UTI.",
      corpoResumido:
        "Unidades de terapia intensiva costumam manter iluminação artificial intensa e contínua, sem variação natural, somada a telas de monitores e superfícies reflexivas. Para pessoas com maior sensibilidade visual, isso pode gerar fadiga, dor de cabeça e dificuldade de concentração ao longo do plantão.",
      corpoAprofundado:
        "A ausência de luz natural, a iluminação fluorescente de alta intensidade e a multiplicação de telas (monitores multiparamétricos, bombas de infusão, prontuário eletrônico) formam um ambiente visualmente denso. Esse tipo de estímulo, quando contínuo e sem possibilidade de regulação individual, pode contribuir para fadiga visual, cefaleia e dificuldade de manter atenção sustentada — especialmente para profissionais com maior sensibilidade sensorial. Adaptações possíveis incluem iluminação regulável por setor, redução de reflexos em superfícies, e a criação de espaços de baixa estimulação para pausas breves.",
      classificacao: "conteudo_educativo",
      eixo: "luzes",
      autoria: "Equipe NeuroRefúgio",
      status: "pendente_revisao",
      dataPublicacao: NOW,
      ultimaAtualizacao: NOW,
      referencias: [],
      relacionados: ["lib-corpo-monitor"],
    },
    {
      id: "lib-alarmes-hipervigilancia",
      slug: "alarmes-hospitalares-e-hipervigilancia",
      titulo: "Alarmes hospitalares e hipervigilância",
      resumo: "Alarmes simultâneos e não priorizados exigem hipervigilância constante e podem ser uma fonte contínua de sobrecarga auditiva.",
      corpoResumido:
        "A multiplicação de alarmes sonoros — muitos deles não críticos — em uma unidade de terapia intensiva exige que a equipe mantenha atenção constante a estímulos sobrepostos, o que pode ser especialmente desgastante para quem tem maior sensibilidade auditiva.",
      corpoAprofundado:
        "Estudos sobre fadiga de alarmes em ambientes hospitalares já documentam o problema da quantidade de alarmes não acionáveis ou de baixa prioridade clínica que soam ao longo de um plantão. Para além do risco de dessensibilização da equipe como um todo, para profissionais com maior sensibilidade auditiva a sobreposição constante de alarmes pode gerar hipervigilância, tensão muscular e dificuldade de distinguir prioridades em momentos de pico. A diferenciação visual e sonora entre alarmes por gravidade, e a criação de protocolos de priorização, são adaptações institucionais possíveis — não apenas questões de conforto individual.",
      classificacao: "conteudo_educativo",
      eixo: "alarmes",
      autoria: "Equipe NeuroRefúgio",
      status: "pendente_revisao",
      dataPublicacao: NOW,
      ultimaAtualizacao: NOW,
      referencias: [],
      relacionados: ["lib-corpo-monitor", "lib-recomendacoes-institucionais"],
    },
    {
      id: "lib-dsm5-criterios",
      slug: "criterios-diagnosticos-dsm-5",
      titulo: "Critérios diagnósticos do DSM-5 para o Transtorno do Espectro Autista",
      resumo: "Panorama geral dos critérios diagnósticos formais, como referência técnica — não como definição da experiência vivida.",
      corpoResumido:
        "O DSM-5 define o Transtorno do Espectro Autista a partir de dois domínios centrais: diferenças persistentes na comunicação e interação social, e padrões restritos e repetitivos de comportamento, interesses ou atividades, incluindo particularidades sensoriais.",
      corpoAprofundado:
        "O Manual Diagnóstico e Estatístico de Transtornos Mentais, 5ª edição (DSM-5), da American Psychiatric Association, descreve o Transtorno do Espectro Autista a partir de critérios em dois domínios: (A) déficits persistentes na comunicação e na interação social em múltiplos contextos; e (B) padrões restritos e repetitivos de comportamento, interesses ou atividades — incluindo hiper ou hiporreatividade a estímulos sensoriais ou interesse incomum por aspectos sensoriais do ambiente. É importante lembrar que critérios diagnósticos formais descrevem categorias clínicas, não a totalidade da experiência vivida por uma pessoa autista, e não devem ser usados para julgar a legitimidade de vivências individuais.",
      classificacao: "evidencia_cientifica",
      eixo: "geral",
      autoria: "Equipe NeuroRefúgio",
      revisadoPor: undefined,
      status: "pendente_revisao",
      dataPublicacao: NOW,
      ultimaAtualizacao: NOW,
      referencias: [
        { citacao: "American Psychiatric Association. (2013). Manual diagnóstico e estatístico de transtornos mentais (5ª ed.)." },
      ],
      relacionados: ["lib-corpo-monitor"],
    },
    {
      id: "lib-autoetnografia-plantao",
      slug: "uma-cena-de-plantao",
      titulo: "Uma cena de plantão: fragmento autoetnográfico",
      resumo: "Um fragmento da autoetnografia performática que fundamenta esta plataforma — uma experiência situada, não generalizável.",
      corpoResumido:
        "Este é um trecho ilustrativo do tipo de material produzido na pesquisa de mestrado que originou o NeuroRefúgio: observações em primeira pessoa sobre o ambiente sensorial da UTI durante um plantão.",
      corpoAprofundado:
        "A pesquisa de mestrado que origina esta plataforma usa autoetnografia performática como método: o pesquisador registra e reflete sobre sua própria experiência sensorial e institucional durante plantões em terapia intensiva, articulando essas observações com literatura sobre neurodiversidade, capacitismo estrutural e ambiência hospitalar. Este conteúdo é um exemplo demonstrativo do tipo de material que compõe essa análise — a versão completa e revisada faz parte da dissertação. É fundamental reforçar: a experiência situada de um único pesquisador não representa nem substitui a diversidade de experiências de outras pessoas autistas.",
      classificacao: "experiencia_autoetnografica",
      eixo: "geral",
      autoria: "Bruno Rocha de Lima",
      status: "pendente_revisao",
      dataPublicacao: NOW,
      ultimaAtualizacao: NOW,
      referencias: [],
      relacionados: ["lib-corpo-monitor"],
    },
    {
      id: "lib-recomendacoes-institucionais",
      slug: "recomendacoes-institucionais-espacos-baixa-estimulacao",
      titulo: "Recomendações institucionais para espaços de baixa estimulação",
      resumo: "Sugestões práticas para instituições de saúde que queiram avaliar e reduzir barreiras sensoriais evitáveis.",
      corpoResumido:
        "Recomendações gerais: criar ao menos um espaço de baixa estimulação por unidade, priorizar alarmes por gravidade, comunicar mudanças de escala com antecedência, e incluir avaliação sensorial em processos de acolhimento de novos profissionais.",
      corpoAprofundado:
        "Estas recomendações não substituem uma avaliação institucional formal, mas oferecem um ponto de partida: (1) reservar ao menos um espaço silencioso e de baixa estimulação visual por unidade, acessível durante todo o plantão; (2) diferenciar alarmes por gravidade clínica, visual e sonoramente; (3) comunicar mudanças de escala e rotina com antecedência sempre que possível; (4) estruturar reuniões e passagens de plantão com pauta previsível; (5) incluir formação sobre neurodiversidade e acessibilidade sensorial na capacitação de equipes; (6) tratar pedidos de adaptação razoável como parte da gestão de segurança psicológica da equipe, não como exceção burocrática.",
      classificacao: "recomendacao_institucional",
      eixo: "geral",
      autoria: "Equipe NeuroRefúgio",
      status: "pendente_revisao",
      dataPublicacao: NOW,
      ultimaAtualizacao: NOW,
      referencias: [],
      relacionados: ["lib-alarmes-hipervigilancia", "lib-capacitismo-estrutural"],
    },
    {
      id: "lib-capacitismo-estrutural",
      slug: "capacitismo-estrutural-no-trabalho-em-saude",
      titulo: "Capacitismo estrutural no trabalho em saúde",
      resumo: "Capacitismo não é apenas atitude individual: é também organização do trabalho, dos espaços e das normas institucionais.",
      corpoResumido:
        "Capacitismo estrutural se manifesta em normas, rotinas e desenhos institucionais que presumem um único tipo de corpo e mente 'padrão' — tornando invisíveis as barreiras enfrentadas por profissionais neurodivergentes.",
      corpoAprofundado:
        "Capacitismo estrutural descreve como normas, processos e desenhos institucionais — não apenas atitudes individuais — presumem um padrão único de corpo, ritmo e funcionamento cognitivo como 'normal', tornando qualquer desvio desse padrão um problema a ser resolvido pela pessoa, e não pelo ambiente. No trabalho em saúde, isso aparece em escalas inflexíveis, ausência de espaços de baixa estimulação, expectativa de disponibilidade constante, e associação entre 'profissionalismo' e supressão de sinais corporais de sobrecarga. Reconhecer essa dimensão estrutural desloca a pergunta de 'como essa pessoa pode se adaptar' para 'como o ambiente pode ser transformado'.",
      classificacao: "reflexao_teorica",
      eixo: "geral",
      autoria: "Equipe NeuroRefúgio",
      status: "pendente_revisao",
      dataPublicacao: NOW,
      ultimaAtualizacao: NOW,
      referencias: [],
      relacionados: ["lib-masking", "lib-recomendacoes-institucionais"],
    },
  ]);
}

seed();

export function listArticles(): LibraryArticle[] {
  return collection.list();
}

export function getArticleBySlug(slug: string): LibraryArticle | undefined {
  return collection.list().find((a) => a.slug === slug);
}
