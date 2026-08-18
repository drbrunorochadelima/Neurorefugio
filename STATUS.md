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

*(As próximas entradas serão adicionadas ao final deste arquivo conforme cada fase for concluída.)*
