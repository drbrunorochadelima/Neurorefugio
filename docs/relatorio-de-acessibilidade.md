# Relatório de acessibilidade

## O que foi feito

- Auditoria automatizada com **axe-core** (via `@axe-core/playwright`), regras WCAG 2.0 A/AA,
  2.1 AA e 2.2 AA, em **28 rotas** representativas de todos os módulos da plataforma (build de
  produção): início, Meu Espaço, Corpo-Monitor, Quero me regular (hub + 3 recursos), Games (hub +
  4 games), Hiperfocos, Comunidade (feed + criação), Biblioteca (lista + artigo), Instituições,
  Conheça a pesquisa, Configurações + conta, autenticação (entrar/cadastro/recuperar senha),
  Segurança, Termos, Privacidade, Acessibilidade, Admin.
- **Resultado nesta versão: 0 violações automatizadas** nas 28 rotas testadas.
- Durante a auditoria, duas classes reais de problema foram encontradas e corrigidas:
  1. **Contraste de cor insuficiente** (`color-contrast`, impacto sério): o tom de verde-sálvia
     usado como texto (rótulos de categoria, texto de destaque) tinha razão de contraste de
     aproximadamente 3,1:1 contra o fundo — abaixo do mínimo de 4,5:1 para texto normal (WCAG
     1.4.3). Corrigido com um token de texto dedicado (`--nr-accent-secondary-text`, verde-sálvia
     mais escuro, ~5,4:1 de contraste), mantendo o tom original apenas para elementos gráficos
     (bordas, indicadores), onde o limite de 3:1 já era atendido.
  2. **Links distinguíveis apenas por cor dentro de blocos de texto** (`link-in-text-block`,
     impacto sério, WCAG 1.4.1): vários links inline (ex.: "Entre luzes, alarmes e o silêncio",
     "Criar conta", "Entrar") só ficavam sublinhados no hover, não por padrão — inacessível para
     quem não usa mouse ou tem dificuldade de perceber a mudança de estado. Corrigido tornando
     esses links permanentemente sublinhados.
- Navegação por teclado verificada manualmente nos fluxos principais (cadastro, check-in,
  Corpo-Monitor, jogos de Memórias e Conexões, painel administrativo): todos os controles
  interativos são alcançáveis via Tab, com foco visível (contorno de 3px definido globalmente em
  `globals.css`) e ativáveis via Enter/Espaço.
- Landmarks e semântica: cabeçalho, navegação principal, conteúdo principal (`id="conteudo-
  principal"`, alvo do skip link) e rodapé são elementos semânticos ou têm `role`/`aria-label`
  apropriados. Formulários usam `<label>` associado, `aria-describedby` para dicas/erros e
  `aria-invalid` em campos inválidos.
- Gráficos (histórico de check-ins, curva do Corpo-Monitor no game Plantão em Camadas) expõem
  `role="img"` com `<title>`/`<desc>` e uma alternativa em tabela de dados acessível via botão.
- Nenhuma página reproduz som automaticamente; todo som exige ação explícita e pode ser
  interrompido pelo botão "Preciso de calma".

## O que NÃO foi feito nesta versão (limitações honestas)

- **Testes manuais com leitores de tela reais** (NVDA, JAWS, VoiceOver, TalkBack) não foram
  executados — a verificação foi automatizada (axe-core) e manual apenas via inspeção de
  marcação/foco, não com software de leitura de tela real.
- **Testes com usuários** que dependem de tecnologia assistiva não foram realizados (ver
  `docs/plano-de-validacao.md`).
- Ferramentas automatizadas (incluindo axe-core) detectam uma fração dos problemas de
  acessibilidade — tipicamente entre 30% e 50% segundo a própria documentação do axe-core. Zero
  violações automatizadas **não** significa conformidade total com WCAG 2.2 AA; significa que a
  camada de checagem automatizada não encontrou problemas nas rotas testadas nesta versão.
- Zoom de 200% e navegação por voz não foram testados sistematicamente em todas as páginas.
- Rotas dinâmicas com parâmetros (`/hiperfocos/[id]`, `/comunidade/[id]`, `/biblioteca/[slug]`)
  foram testadas em uma amostra, não em todas as instâncias possíveis de conteúdo.

## Como reproduzir esta auditoria

```bash
npm run build && npm run start -- -p 3200
# em outro terminal, com o Chromium do Playwright disponível:
node -e "
const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await (await browser.newContext()).newPage();
  await page.goto('http://localhost:3200/');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag22aa']).analyze();
  console.log(results.violations);
  await browser.close();
})();
"
```
