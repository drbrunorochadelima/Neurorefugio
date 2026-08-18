# Plano de validação científica e técnica

Nenhuma parte desta plataforma — incluindo os games — está descrita como clinicamente validada.
Este documento descreve as etapas de validação planejadas, ainda não executadas nesta versão.

## 1. Validação de conteúdo por especialistas

- **Objetivo**: revisar a precisão e adequação dos conteúdos da Biblioteca científica.
- **Método**: painel de especialistas (neurodiversidade, saúde do trabalhador, acessibilidade)
  avalia cada conteúdo com um instrumento estruturado (clareza, precisão, relevância).
- **Critério de conclusão**: cada conteúdo revisado passa de `pendente_revisao` para `revisado`,
  com `revisadoPor` preenchido.

## 2. Validação semântica com pessoas autistas adultas

- **Público prioritário**: profissionais e estudantes autistas da área da saúde.
- **Objetivo**: verificar se a linguagem, os conceitos (corpo-monitor, eixos luzes/alarmes/
  silêncio) e os recursos fazem sentido e são reconhecíveis na experiência vivida.
- **Método**: entrevistas semiestruturadas ou grupos focais, com consentimento informado e
  protocolo de proteção de dados.

## 3. Usabilidade

- Tarefas guiadas cobrindo os fluxos centrais: check-in, Corpo-Monitor, Plano Pessoal, um game de
  cada categoria, cadastro/exclusão de conta.
- Métrica: taxa de conclusão de tarefa, tempo, erros, System Usability Scale (SUS) ou instrumento
  equivalente.

## 4. Acessibilidade

- Auditoria automatizada (axe-core e/ou Lighthouse) em todas as rotas — **ainda não executada
  nesta versão** (ver `docs/relatorio-de-acessibilidade.md`).
- Testes manuais com teclado e leitores de tela (NVDA, VoiceOver, TalkBack) em pelo menos um fluxo
  completo por módulo.
- Testes com usuários que dependem de tecnologia assistiva.

## 5. Conforto sensorial

- Avaliação qualitativa do modo de baixo estímulo, do Passaporte Sensorial e dos games, com
  participantes autistas relatando conforto/desconforto sensorial percebido.

## 6. Clareza e utilidade percebida

- Uso do widget de avaliação já implementado (`ResourceFeedbackWidget`) como fonte de dados
  contínua sobre utilidade percebida dos recursos de autorregulação e dos games, complementado por
  entrevistas.

## 7. Aprendizagem nos games educativos

- Para o Corpo-Monitor: Plantão em Camadas, avaliar se o resumo pós-jogo (linha do tempo, curva do
  corpo-monitor, barreiras institucionais) é compreendido e considerado útil pelos participantes.

## 8. Autonomia, sobrecarga e intenção de reutilização

- Instrumentos padronizados (a definir) aplicados após uso supervisionado da plataforma.

## Aspectos éticos transversais

Qualquer etapa com participantes externos segue: consentimento informado, proteção de dados
pessoais (LGPD), possibilidade de desistência a qualquer momento, e submissão às instâncias éticas
aplicáveis da Universidade Federal de Uberlândia antes da coleta de dados.
