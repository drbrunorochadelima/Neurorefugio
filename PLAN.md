# PLAN.md — NeuroRefúgio / Plataforma Corpo-Monitor

Plano de implementação em fases pequenas e verificáveis, seguindo a ordem obrigatória de
desenvolvimento do prompt mestre. Cada fase é concluída, testada (lint + typecheck + build, e
navegação manual quando visual) e registrada em `STATUS.md` antes de seguir para a próxima.

## Fase 0 — Fundação do projeto
- [x] Inicializar projeto Next.js (TypeScript, App Router, Tailwind v4, ESLint flat config).
- [x] Criar `CLAUDE.md`, `README.md`, `PLAN.md`, `STATUS.md`, `.env.example`.

## Fase 1 — Design system e acessibilidade
- [ ] Tokens de design (cores, tipografia, espaçamento) com paleta verde-sálvia/azul-petróleo/lavanda/
      areia/branco-quente/cinza-esverdeado/grafite.
- [ ] Modo claro, escuro e baixo estímulo; contraste, saturação, fonte, espaçamento, movimento
      configuráveis — central **Meu Ambiente** (Passaporte Sensorial).
- [ ] Botão global **Preciso de calma**.
- [ ] Skip links, foco visível, landmarks ARIA.

## Fase 2 — Navegação responsiva e página inicial
- [ ] Cabeçalho/menu principal, navegação inferior no celular, rodapé acadêmico.
- [ ] Página inicial com "Do que você precisa agora?" e atalhos.

## Fase 3 — Camada de dados, autenticação e perfis
- [ ] Interfaces de serviço (`src/lib/services`) + adapter `local` (localStorage) + schemas Zod.
- [ ] Autenticação demonstrativa (cadastro, login, recuperação, exclusão de conta), perfil privado por
      padrão, pseudônimo/nome social/pronomes opcionais.

## Fase 4 — Meu Espaço, check-in e Corpo-Monitor
- [ ] Painel personalizável (blocos reordenáveis/ocultáveis).
- [ ] Check-in rápido e completo, síntese acolhedora não diagnóstica, gráficos acessíveis.
- [ ] Corpo-Monitor interativo (mapa corporal/sensorial, linha do tempo, relatório exportável).

## Fase 5 — Autorregulação e Plano Pessoal
- [ ] Hub "Quero me regular" com recursos opt-in (temporizador, respiração, sons, aterramento,
      stimming digital, desenho livre, cartões de comunicação).
- [ ] Plano Pessoal de Autorregulação (salvar, editar, exportar PDF, cartão para celular).

## Fase 6 — Estrutura do Laboratório de Games
- [ ] Hub de games por intenção, ficha prévia (objetivo, duração, sons, controles, saída).
- [ ] Regras comuns (sem anúncios, sem vidas, sem punição) aplicadas via componente compartilhado.

## Fase 7 — Games funcionais (prioridade definida no prompt mestre)
- [ ] Corpo-Monitor: Plantão em Camadas (versão funcional mínima: modo história + baixo estímulo).
- [ ] Ateliê das Cores (colorir livre, por números, ferramentas básicas, galeria local).
- [ ] Conexões: Combine e Organize (associação/arrastar, múltiplos modos).
- [ ] Memórias no Meu Ritmo (jogo da memória com tabuleiros/temas configuráveis).
- [ ] Demais 10 games: registrados como expansão futura em `STATUS.md` (fora do escopo desta sessão).

## Fase 8 — Hiperfocos
- [ ] Cadastro, coleções, linha do tempo, privacidade por item, busca/favoritos.

## Fase 9 — Comunidade e moderação
- [ ] Fórum piloto fechado: categorias, publicações com rascunho/revisão, reações acolhedoras,
      denúncia/bloqueio, avisos de conteúdo.

## Fase 10 — Biblioteca científica e área institucional
- [ ] Conteúdos classificados (evidência/reflexão teórica/autoetnografia/educativo/institucional).
- [ ] Mapa sensorial da UTI + checklist institucional com relatório exportável.

## Fase 11 — Pesquisa, painel administrativo e LGPD
- [ ] Página "Conheça a pesquisa" com metadados acadêmicos completos.
- [ ] Painel administrativo (usuários, conteúdo, moderação, checklists, consentimentos).
- [ ] Política de privacidade, consentimento granular, exportação/exclusão de dados.

## Fase 12 — Testes, PWA e documentação final
- [ ] PWA instalável (manifest + service worker para recursos essenciais offline).
- [ ] Testes unitários/componentes para fluxos críticos; auditoria de acessibilidade.
- [ ] Lint, typecheck, build de produção limpos.
- [ ] README, manual do usuário, manual do administrador, matriz de rastreabilidade científica,
      plano de validação, relatório de acessibilidade, lista de limitações, plano de expansão.

## Fora do escopo desta sessão (registrar como expansão futura)

Dado o tamanho do escopo total (14 games completos, integração real com Supabase, fórum aberto com
moderação avançada, IA adaptativa completa), esta sessão prioriza uma fatia vertical funcional e
honesta: fundação + acessibilidade + módulos centrais + 4 games totalmente jogáveis + estrutura
pronta para os demais. Cada limitação será listada explicitamente em `STATUS.md`.
