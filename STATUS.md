# STATUS.md — NeuroRefúgio

Atualizado ao final de cada módulo concluído. Formato: o que está pronto, o que falta, como testar.

## 2026-08-18 — Fase 0: Fundação do projeto

**Pronto:**
- Projeto Next.js 16 (App Router, TypeScript, React 19, Tailwind CSS v4, ESLint flat config)
  inicializado em `/`.
- `CLAUDE.md`, `README.md`, `PLAN.md`, `STATUS.md`, `.env.example` criados na raiz.

**Falta:**
- Todas as fases de 1 a 12 descritas em `PLAN.md`.

**Como testar:**
```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```

---

## 2026-08-18 — Fase 1 e 2: Design system, acessibilidade e navegação

**Pronto:**
- Tokens de design em `src/app/globals.css`: paleta verde-sálvia/azul-petróleo/lavanda/areia/
  branco-quente/grafite, temas claro e escuro, modo de baixo estímulo, foco visível, skip link.
- Passaporte Sensorial completo (`src/lib/sensory`): tema, baixo estímulo, alto contraste, brilho,
  saturação, tamanho/peso/espaçamento de fonte, altura de linha, linguagem resumida/aprofundada,
  animações (completas/reduzidas/nenhuma), densidade, ocultar decorativos, interface simplificada,
  música/efeitos/vibração/bloqueio de sons agudos (todos opt-in, nada toca automaticamente).
  Persistido em localStorage, aplicado sem flash via script de bootstrap no `<head>`, nunca alterado
  silenciosamente. UI em `/configuracoes` ("Meu Ambiente").
- Botão global **Preciso de calma** (`src/components/CalmButton.tsx`) presente em todas as páginas,
  com as 6 opções exigidas e barramento de "silêncio" (`silence-bus.ts`) para reprodutores de áudio.
- Navegação: cabeçalho responsivo com os 11 itens do menu principal (`src/lib/nav.ts`), menu móvel
  colapsável, navegação inferior no celular com itens priorizados, rodapé acadêmico com os links e
  a citação obrigatórios.
- Página inicial com a mensagem de abertura, "Do que você precisa agora?" (12 botões), atalhos
  (baixo estímulo, Corpo-Monitor, games) e destaque dos eixos científicos (luzes/alarmes/silêncio).

**Falta:**
- Autenticação, camada de dados, e todas as páginas ainda não criadas (a navegação já aponta para
  rotas que serão implementadas nas próximas fases — ainda retornam 404).
- Auditoria de acessibilidade formal (axe/Lighthouse) — verificação manual feita via captura de tela
  e checagem de atributos (tema/baixo estímulo confirmados via Playwright).

**Como testar:**
```bash
npm run lint && npm run build
npm run dev   # http://localhost:3000 e http://localhost:3000/configuracoes
```
Testado manualmente: alternância de tema claro/escuro, modo de baixo estímulo (atributos
`data-theme`/`data-stimulus` aplicados corretamente), navegação responsiva em viewport de celular
(390px) e desktop (1280px).

---

## 2026-08-18 — Fase 3: Camada de dados, autenticação e perfis

**Pronto:**
- Camada de armazenamento local genérica (`src/lib/storage/local-collection.ts`) com coleções
  simples e coleções "user-scoped", que se auto-registram em um `user-data-registry` usado por
  exportação/exclusão de dados (LGPD) — assim novos domínios não exigem alterar o código de conta.
- Schemas Zod para todos os domínios centrais: autenticação, check-in, Corpo-Monitor, Plano
  Pessoal/contatos/cartões de comunicação, hiperfocos, comunidade (fórum/denúncias/bloqueios),
  biblioteca científica e progresso em games (`src/lib/schemas/*`).
- Serviços de domínio (`src/lib/services/*`) para check-ins (com síntese não diagnóstica),
  Corpo-Monitor, Plano Pessoal, hiperfocos, progresso em games, desenhos do Ateliê das Cores e
  comunidade (piloto fechado). Todos hoje rodam sobre o adapter `local`; a interface está pronta
  para receber um adapter `supabase` equivalente no futuro (ver `.env.example`).
- Autenticação demonstrativa completa (`src/lib/auth`): cadastro, login, logout, recuperação de
  senha (token exibido em tela — não há envio real de e-mail neste modo), exclusão de conta com
  purga de todos os domínios registrados, exportação de dados em `.json`. Senhas nunca gravadas em
  texto puro (hash SHA-256 com salt via Web Crypto — suficiente para demonstração, não substitui um
  provedor de auth real). Estado de sessão via `useSyncExternalStore` (sem risco de divergência de
  hidratação SSR/cliente). Perfil privado por padrão, pseudônimo/nome social/pronomes opcionais.
- Páginas `/cadastro`, `/entrar`, `/recuperar-senha`, `/configuracoes/conta`.

**Falta:**
- Adapter Supabase real (hoje só o modo `local`).
- Páginas que a navegação já referencia mas ainda não existem (`/meu-espaco`, `/corpo-monitor`,
  `/quero-me-regular`, `/games`, `/hiperfocos`, `/comunidade`, `/biblioteca`, `/instituicoes`,
  `/pesquisa`, `/termos`, `/privacidade`, `/acessibilidade`) — próximas fases.
- Papéis "moderador"/"revisor"/"administrador" existem no schema mas ainda não têm UI que os
  utilize (chega no painel administrativo, fase 11).

**Como testar:**
```bash
npm run lint && npm run build
npm run dev -- -p 3100
```
Testado via Playwright: cadastro completo (pseudônimo, e-mail, senha, aceite de termos e
privacidade) cria a conta e autentica automaticamente, redirecionando para `/meu-espaco` (ainda não
implementada nesta fase, 404 esperado). Testar manualmente também: `/entrar`, `/recuperar-senha`
(gera código em tela) e `/configuracoes/conta` (editar perfil, alternar privacidade, exportar
`.json`, excluir conta).

---

## 2026-08-18 — Fase 4: Meu Espaço, check-in e Corpo-Monitor

**Pronto:**
- `/meu-espaco`: painel com os 13 blocos do §7 (check-in, resumo do Corpo-Monitor, plano, games,
  hiperfocos, comunidades, conteúdos salvos, diário, rotina, cartões, contatos, histórico,
  configurações sensoriais). Cada bloco pode ser reordenado (▲/▼), reduzido a modo compacto e
  ocultado/restaurado — preferências salvas em `localStorage`.
- Check-in rápido embutido no painel e check-in completo em `/meu-espaco/check-in`, ambos com
  síntese acolhedora e não diagnóstica (`synthesizeCheckIn`) e escalas 0–5 com rótulos textuais
  (não dependem só de cor).
- Gráfico acessível (`AccessibleLineChart`): SVG com `title`/`desc`, alternativa em tabela de dados
  visível sob demanda — usado no histórico de humor/energia/sobrecarga.
- `/corpo-monitor`: mapa corporal interativo (11 regiões, navegável por teclado e leitor de tela),
  sensações e intensidade por região, estímulos externos associados sem inferir causalidade, linha
  do tempo, comparação descritiva entre ambientes (com aviso explícito de que não indica
  causalidade) e exportação via impressão/PDF do navegador.
- `/meu-espaco/plano-pessoal`: Plano Pessoal de Autorregulação completo (10 seções), modo "cartão
  resumido", impressão/exportação em PDF via navegador, e compartilhamento seletivo/revogável com
  contatos de confiança (registrado localmente; entrega real a outra conta depende de um backend).
- `/meu-espaco/contatos-de-confianca`: cadastro/remoção de contatos.

**Falta:**
- "Conteúdos salvos" ainda é um bloco vazio honesto (a Biblioteca científica, onde o salvamento
  faria sentido, é uma fase futura).
- Adapter de backend real para sincronizar em nuvem (hoje 100% local).
- Auditoria formal de acessibilidade (axe/Lighthouse); verificação até aqui foi manual e via
  Playwright (fluxo de cadastro → check-in → Corpo-Monitor testado ponta a ponta).

**Como testar:**
```bash
npm run lint && npm run build
npm run dev -- -p 3100
```
Fluxo testado via Playwright: cadastro → `/meu-espaco` (13 blocos renderizando, check-in rápido
funcional) → `/corpo-monitor` (selecionar região, marcar sensação, salvar registro, ver na linha do
tempo). Testar manualmente também: reordenar/ocultar/compactar blocos, check-in completo, Plano
Pessoal (preencher, cartão resumido, imprimir), contatos de confiança.

---

## 2026-08-18 — Fase 5: Autorregulação

**Pronto:**
- `/quero-me-regular`: hub com a pergunta "Que tipo de apoio parece possível agora?" (filtro por
  tipo de apoio), os 10 recursos do §10 e a seção "Quero apenas ficar aqui" (âncora usada pela
  página inicial), com o aviso explícito de que nenhum recurso exige olhos fechados, imobilidade,
  interrupção de stims, contato visual, respiração controlada ou permanência forçada.
- `/quero-me-regular/pausa`: temporizador de pausa, tela silenciosa (escurece a tela inteira) e
  contagem visual — os três integrados ao barramento de silêncio do botão "Preciso de calma".
- `/quero-me-regular/respiracao`: ritmo visual de respiração com durações configuráveis e pausa
  opcional entre inspirar/expirar (nunca obrigatória).
- `/quero-me-regular/aterramento`: aterramento sensorial (adaptação do 5-4-3-2-1) e relaxamento
  muscular progressivo, em passo a passo autoguiado (sem temporizador forçado).
- `/quero-me-regular/sons`: chuva, ondas, ventilador e ruído marrom **sintetizados no navegador**
  via Web Audio API (sem arquivos externos), sempre iniciados por ação explícita e bloqueados por
  padrão até o usuário ativar "sons opcionais" no Passaporte Sensorial.
- `/quero-me-regular/stimming`: grade tátil ("bolhas") e um fidget de arrastar.
- `/quero-me-regular/desenho-livre`: tela de desenho com cores calmas, espessura ajustável, limpar
  e baixar como PNG.
- `/quero-me-regular/cartoes-de-comunicacao`: criação de cartões, modo apresentação em tela cheia,
  favoritos.
- `/quero-me-regular/checklist-corporal`, `/pos-sobrecarga` e `/meditacoes` (1/3/5/10/20 min, em
  texto, narração opcional via Web Speech API — também condicionada à preferência de som —, imagem
  estática ou silêncio).
- Avaliação de utilidade ("ajudou/ajudou parcialmente/não ajudou/piorou/não desejo avaliar") em
  cada recurso, salva por usuário.
- Plano Pessoal de Autorregulação já implementado na fase anterior (`/meu-espaco/plano-pessoal`).

**Falta:**
- Persistência de desenhos livres numa galeria (hoje só baixa o PNG; a galeria completa fica no
  Ateliê das Cores, fase de games).
- Locução das meditações usa a voz padrão do navegador (Web Speech API) — não há narração gravada
  profissionalmente.

**Como testar:**
```bash
npm run lint && npm run build
npm run dev -- -p 3100
```
Testado via Playwright (hub, pausa, sons, respiração com animação de fase) e captura de tela.
Testar manualmente também: ativar sons opcionais em Meu Ambiente e ouvir cada som contínuo; testar
narração das meditações; verificar que o botão "Preciso de calma" interrompe sons/tela
silenciosa/respiração em andamento.

---

## 2026-08-18 — Fase 6: Laboratório de Games (estrutura + 4 games prioritários)

**Pronto:**
- `/games`: hub com a pergunta de intenção (11 opções, filtro client-side), regras comuns visíveis
  (sem anúncios, sem vidas, sem punição por pausa, sem ranking obrigatório), e lista honesta de
  "Em desenvolvimento" para os 10 games ainda não implementados (sem botões falsos).
- Componente `GameIntro` compartilhado: objetivo, duração, dificuldade, sons, movimentos, estímulos,
  controles e forma de saída antes de cada game; `GameExitBar` com saída imediata em qualquer tela.
- **Memórias no Meu Ritmo** (`/games/memorias`): 5 temas (animais, natureza, espaço, tecnologia,
  corpo-monitor), tabuleiros de 2×2 a 6×6, tempo de visualização prévio configurável, sem
  cronômetro obrigatório, sem punição por erro, navegável por teclado.
- **Conexões: Combine e Organize** (`/games/conexoes`): 3 modos (emoção/necessidade, sinal
  corporal/estratégia, estímulo/adaptação), seleção por clique, novas tentativas sem punição.
- **Ateliê das Cores** (`/games/atelie-das-cores`): 4 modelos gerados proceduralmente (mandala,
  padrão de grade, corpo-monitor, formas abstratas), pincel/borracha, 3 paletas (livre/pastel/
  monocromática) + cor personalizada, desfazer/refazer, salvar e continuar depois (galeria privada
  via `coloring` service), baixar como PNG.
- **Corpo-Monitor: Plantão em Camadas** (`/games/corpo-monitor-plantao`): versão funcional mínima
  (modo história + opção de baixo estímulo) com 9 eventos de plantão, escolhas sem certo/errado,
  parâmetros internos (energia/tensão/sobrecarga/masking) que evoluem, e resumo final completo:
  curva do corpo-monitor (gráfico acessível), linha do tempo, estímulos principais, momentos de
  masking, estratégias de comunicação e barreiras institucionais observadas.
- Progresso salvo por usuário (`game-progress` service) com estrelas/folhas ("Minha Jornada").
- Avaliação de utilidade em cada game (`ResourceFeedbackWidget`).

**Falta (registrado como expansão futura, ver PLAN.md):**
- Os demais 10 games do prompt mestre (Entre Luzes/Alarmes/Silêncio, Sala de Controle Sensorial,
  Meu Ritmo, Jardim, Aquário Sensorial, Constelação de Hiperfocos, Fábrica de Padrões, Rotas de
  Pausa, Comunicação sem Pressão, Construa uma Instituição Neuroinclusiva).
- No Plantão em Camadas: modos estratégia/gestão institucional/livre separados (hoje simplificados
  em um único modo história); no Ateliê das Cores: camadas, espelhamento, zoom, carimbos, texturas,
  importação de desenho e colaboração autorizada; no Memórias: modos imagem+palavra, som+imagem,
  baralhos personalizados e compartilhamento moderado; no Conexões: arrastar-e-soltar (hoje é por
  clique/seleção) e modos adicionais (objeto/função, sequências).

**Como testar:**
```bash
npm run lint && npm run build
npm run dev -- -p 3100
```
Testado via Playwright, sem erros de console: os 4 games jogados do início ao fim (Memórias:
virar cartas e formar pares; Conexões: combinar todos os pares; Ateliê: colorir regiões da mandala;
Plantão: completar os 9 eventos e verificar o resumo com gráfico, linha do tempo e barreiras).

---

## 2026-08-18 — Fase 7: Hiperfocos e Comunidade

**Pronto:**
- `/hiperfocos`: cadastro, busca por título/categoria, favoritos, privacidade por item; detalhe em
  `/hiperfocos/[id]` com coleção de links e linha do tempo de descobertas. Link honesto para a
  categoria "Hiperfocos" da Comunidade no lugar de um sistema de matching não implementado.
- `/comunidade`: fórum piloto fechado (`COMMUNITY_PILOT_CLOSED = true`), categorias (13), busca,
  aviso de piloto fechado, publicações demonstrativas seedadas e claramente identificadas
  ("perfil demonstrativo"). Fluxo real: rascunho → revisão → publicado (`/comunidade/nova`
  envia para revisão; sem fila de aprovação nesta fase — ver limitação abaixo). Reações
  acolhedoras, comentários, denúncia e bloqueio de usuário implementados e funcionais em
  `/comunidade/[id]`.
- Corrigido um problema real de hidratação SSR/cliente descoberto durante o teste: páginas públicas
  que leem dados do localStorage (feed da comunidade, detalhe de publicação) agora carregam os
  dados após a montagem, evitando divergência entre o HTML do servidor e o do navegador.

**Falta:**
- Fila de moderação para aprovar publicações "em revisão" — chega no painel administrativo
  (fase 12). Até lá, publicações enviadas por usuários reais ficam pendentes (visíveis apenas para
  o próprio autor como "aguardando revisão"); os posts públicos visíveis hoje são os
  demonstrativos pré-publicados.
- Silenciamento de palavras específicas (apenas bloqueio de usuário está implementado).
- Apoio automatizado revisável (não implementado nesta fase).

**Como testar:**
```bash
npm run lint && npm run build
npm run dev -- -p 3100
```
Testado via Playwright (feed carrega sem erro de hidratação, publicação demonstrativa abre
corretamente). Testar manualmente: criar hiperfoco com links/timeline, enviar uma publicação
(ficará como "aguardando revisão" até a fila de moderação existir), reagir/comentar/denunciar/
bloquear em uma publicação demonstrativa.

---

## 2026-08-18 — Fase 8: Biblioteca científica e Área institucional

**Pronto:**
- `/biblioteca`: 8 conteúdos demonstrativos cobrindo as 5 classificações do §15 (evidência
  científica, reflexão teórica, experiência autoetnográfica, conteúdo educativo, recomendação
  institucional) e os eixos luzes/alarmes/silêncio/geral. Busca, filtro por eixo e por
  classificação. Todos marcados `pendente_revisao` (nenhum é apresentado como já revisado
  formalmente, conforme exigido). A única referência bibliográfica usada é o DSM-5 (American
  Psychiatric Association, 2013) — nenhuma citação, DOI ou autor foi inventado; os demais
  conteúdos não citam estudos específicos para evitar qualquer risco de referência fabricada.
- `/biblioteca/[slug]`: alternância entre linguagem simples e versão aprofundada, autoria,
  datas, referências e conteúdos relacionados.
- `/instituicoes`: mapa sensorial interativo de 8 áreas da UTI (posto de enfermagem, leitos,
  monitores/bombas, corredores, salas de descanso, passagem de plantão, visita multiprofissional,
  picos de circulação), cada uma com estímulos classificados (necessário/necessário-ajustável/
  evitável/depende da pessoa), barreiras, demandas cognitivas, impactos, estratégias de redução de
  danos e adaptações institucionais.
- Checklist institucional funcional (10 tópicos do §16) com prioridade, recomendação, responsável,
  prazo e acompanhamento — avalia o ambiente, nunca o desempenho da pessoa autista — exportável via
  impressão/PDF do navegador.
- Corrigido o mesmo padrão de hidratação (carregamento pós-montagem) nas novas páginas públicas
  que leem dados locais.

**Falta:**
- Revisão formal por especialistas dos conteúdos da Biblioteca (nenhum pode ser marcado como
  "revisado" sem esse processo real).
- Mais conteúdos por eixo/classificação (hoje 8 artigos cobrindo o mínimo exigido).

**Como testar:**
```bash
npm run lint && npm run build
npm run dev -- -p 3100
```
Testado via Playwright sem erros de hidratação. Testar manualmente: filtros da Biblioteca,
alternância resumo/aprofundado, navegação do mapa sensorial, preenchimento e impressão do
checklist institucional.

---

*(As próximas entradas serão adicionadas ao final deste arquivo conforme cada fase for concluída.)*
