# Lista honesta de limitações

Esta lista existe para que ninguém — usuário, avaliador, orientador ou banca — seja surpreendido
por algo que a plataforma não faz ainda. Ver também `STATUS.md` para o histórico fase a fase.

## Dados e backend

- **Não há backend real.** Todos os dados ficam em `localStorage`, no navegador do usuário. Trocar
  de navegador, de dispositivo ou limpar dados do site apaga tudo. Isso é intencional para esta
  fase (modo demonstrativo), documentado em `.env.example` e no rodapé de todas as páginas.
- O papel de "administrador" pode ser autoatribuído por qualquer conta (ver
  `docs/manual-do-administrador.md`) — inaceitável em produção, aceitável apenas como recurso de
  teste local nesta versão.
- Não existe sincronização entre dispositivos, backup em nuvem, ou recuperação de dados após
  limpeza do navegador.

## Conteúdo

- A Biblioteca científica tem 8 conteúdos demonstrativos (não os "dezenas" que uma biblioteca real
  teria), todos marcados `pendente_revisao` — nenhum foi revisado por especialistas de verdade.
- Apenas uma referência bibliográfica real é citada (DSM-5) para evitar qualquer risco de citação
  inventada; os demais conteúdos evitam citar estudos específicos por esse mesmo motivo.
- A dissertação completa (com a lista real de referências) ainda não existe publicamente — a
  página "Conheça a pesquisa" descreve a pesquisa em andamento, não um trabalho já defendido.

## Games

- Apenas **4 dos 14 games** descritos no prompt mestre estão jogáveis: Memórias no Meu Ritmo,
  Conexões: Combine e Organize, Ateliê das Cores e Corpo-Monitor: Plantão em Camadas. Os outros 10
  estão listados como "em desenvolvimento" na própria interface, sem botões falsos.
- O Corpo-Monitor: Plantão em Camadas tem apenas o modo história implementado (os modos estratégia,
  gestão institucional e livre descritos no prompt mestre foram simplificados/unificados nesta
  versão).
- O Ateliê das Cores não tem camadas, espelhamento, zoom, carimbos, texturas ou importação de
  desenho externo.
- Memórias no Meu Ritmo tem o modo "pares iguais" com 5 temas; os modos imagem+palavra, som+imagem
  e baralhos personalizados/compartilhados não foram implementados.
- Conexões usa seleção por clique, não arrastar-e-soltar; tem 3 modos dos ~11 descritos no prompt.

## Comunidade

- Não há fila de aprovação acessível a usuários comuns — a moderação depende de uma conta com
  papel de administrador ou moderador (ver limitação de backend acima).
- Silenciamento de palavras específicas não foi implementado (apenas bloqueio de usuário).
- Não há "apoio automatizado revisável" mencionado no prompt mestre.

## Acessibilidade

- Auditoria automatizada (axe-core) sem violações em 28 rotas — mas **sem** testes manuais com
  leitores de tela reais nem testes com usuários que dependem de tecnologia assistiva. Ver
  `docs/relatorio-de-acessibilidade.md`.

## Validação científica

- Nada nesta plataforma foi validado formalmente com especialistas ou com pessoas autistas
  adultas. Ver `docs/plano-de-validacao.md` para o que está planejado e ainda não executado.

## PWA / offline

- O service worker cobre navegação básica e ativos estáticos com estratégia network-first; não há
  fila de sincronização para ações feitas offline (ex.: um check-in preenchido offline não é
  reenviado automaticamente quando a conexão volta — como não há backend, isso também não se
  aplicaria da forma tradicional).

## Painel administrativo

- Não há UI para administrar conteúdos da Biblioteca, games, desenhos/paletas/baralhos, categorias
  do fórum ou métricas anônimas agregadas — esses dados são definidos em código nesta versão.
