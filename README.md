# NeuroRefúgio — um espaço para existir no seu ritmo

Plataforma **Corpo-Monitor — Acessibilidade Sensorial na Terapia Intensiva**, produto
técnico-científico vinculado ao projeto de mestrado *"Entre luzes, alarmes e o silêncio: uma
autoetnografia performática de um médico autista na terapia intensiva"*, de **Bruno Rocha de Lima**
(orientação de Gustavo Antônio Raimondi, coorientação de Danilo Borges Paulino), Universidade Federal
de Uberlândia — UFU, 2026.

> "Você não precisa se adaptar a este espaço. Este espaço pode se adaptar a você."

## O que é

Uma plataforma web inclusiva, instalável (PWA) e responsiva voltada principalmente a pessoas
autistas adultas — em especial profissionais e estudantes da saúde — familiares, profissionais de
saúde, educadores, gestores institucionais e pesquisadores em neurodiversidade. Funciona como refúgio
digital de baixo estímulo, ferramenta não terapêutica de autorregulação, central de jogos
neuroinclusivos, biblioteca científica e recurso educativo institucional.

Este repositório **não** trata autismo como doença. Não infantiliza. Não afirma que a experiência
autoetnográfica do autor representa todas as pessoas autistas. Ver `CLAUDE.md` para as regras
permanentes do projeto.

## Stack técnica

- **Next.js 16** (App Router) + **TypeScript** + **React 19**.
- **Tailwind CSS v4** para tokens de design e temas (claro/escuro/baixo estímulo).
- **Zod** para validação de dados.
- Camada de serviços própria (`src/lib/services`) que abstrai o backend: hoje roda em **modo
  demonstrativo local** (localStorage, dados fictícios); um adapter para **Supabase** pode ser
  ligado via variável de ambiente sem alterar o restante da aplicação.
- PWA instalável com funcionamento parcial offline para recursos essenciais.

Não fixamos versões desatualizadas: usamos as versões estáveis mais recentes no momento da criação
do projeto (Next.js 16 traz mudanças importantes em relação a versões anteriores — ver
`node_modules/next/dist/docs/` e `AGENTS.md`).

## Como rodar

```bash
npm install
cp .env.example .env.local   # opcional — o modo local funciona sem nenhuma variável
npm run dev                  # http://localhost:3000
```

Outros comandos:

```bash
npm run lint     # ESLint
npm run build    # build de produção (inclui checagem de tipos)
npm start        # servir o build de produção
```

## Modo demonstrativo

Nesta versão, todos os dados — perfil, check-ins, corpo-monitor, plano pessoal, hiperfocos,
progresso em jogos, publicações da comunidade — são armazenados apenas no navegador
(`localStorage`) e claramente identificados como fictícios/demonstrativos. Nenhuma credencial real
é necessária para explorar a plataforma, e nenhum dado sai do seu navegador.

`.env.example` documenta a variável `NEXT_PUBLIC_DATA_BACKEND` e as credenciais que um adapter
Supabase real precisaria — isso descreve a extensão planejada (ver
`docs/plano-de-expansao-futura.md`), não uma funcionalidade já implementada: hoje só existe o
adapter `local`, e nenhuma lógica de troca de backend está ativa no código.

## Testes

```bash
npm test         # Vitest: testes unitários e de componentes
```

Cobre lógica crítica (serviço de check-ins e sua síntese não diagnóstica, coleções locais e o
registro de exportação/exclusão de dados para LGPD, validação de schemas, persistência do
Passaporte Sensorial, autenticação demonstrativa) e componentes (campo de formulário acessível,
gráfico acessível com alternativa em tabela).

Além dos testes automatizados, todas as fases foram verificadas manualmente e via Playwright
(navegação real em Chromium) — ver `STATUS.md` para o que foi testado em cada fase, e
`docs/relatorio-de-acessibilidade.md` para a auditoria automatizada de acessibilidade (axe-core,
0 violações em 28 rotas nesta versão).

## PWA

O site é instalável (manifest em `public/manifest.webmanifest`, ícones em `public/icons/`) e tem
um service worker (`public/sw.js`, registrado apenas em produção) com estratégia network-first e
fallback em cache, cobrindo navegação básica e ativos estáticos para uso offline parcial.

## Documentação do projeto

- `CLAUDE.md` — regras permanentes (acessibilidade, privacidade, tom, arquitetura).
- `PLAN.md` — plano de implementação por fases.
- `STATUS.md` — o que está pronto, o que falta, como testar, atualizado por fase.
- `.env.example` — variáveis de ambiente documentadas.
- `docs/manual-do-usuario.md` — como usar a plataforma.
- `docs/manual-do-administrador.md` — como usar o painel administrativo.
- `docs/matriz-de-rastreabilidade-cientifica.md` — liga conceitos da pesquisa às funcionalidades.
- `docs/plano-de-validacao.md` — validação científica e técnica planejada.
- `docs/relatorio-de-acessibilidade.md` — auditoria automatizada e limitações conhecidas.
- `docs/limitacoes.md` — lista honesta do que ainda não foi feito.
- `docs/plano-de-expansao-futura.md` — próximos passos sugeridos, em ordem de prioridade.

## Licença e uso

Produto técnico-científico acadêmico. Dados de demonstração são fictícios. Este site não substitui
atendimento profissional de saúde e não é um serviço de emergência.
