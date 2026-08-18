@AGENTS.md

# CLAUDE.md — Regras permanentes do projeto NeuroRefúgio

Este arquivo registra as regras permanentes do projeto **NeuroRefúgio — Plataforma Corpo-Monitor**,
produto técnico-científico do mestrado de Bruno Rocha de Lima (UFU, 2026). Qualquer trabalho futuro
neste repositório — humano ou de agente de IA — deve respeitar estas regras sem exceção.

## Regras permanentes (não negociáveis)

1. **Idioma**: todo o conteúdo voltado ao usuário final é em português brasileiro. Código, nomes de
   variáveis, commits e documentação técnica podem usar termos técnicos em inglês quando for a
   convenção da stack, mas textos de interface, dados de demonstração e documentação de produto são
   em pt-BR.
2. **Acessibilidade WCAG 2.2 AA**: todo componente novo deve ser navegável por teclado, compatível
   com leitores de tela, ter foco visível, contraste adequado e funcionar com zoom de 200%. Não é
   opcional — é critério de aceite.
3. **Nenhuma infantilização**: o público é adulto (pessoas autistas adultas, profissionais de saúde,
   pesquisadores, gestores). Linguagem, tom visual e interações devem ser adultos, técnicos quando
   necessário, e nunca tutelares.
4. **Nenhum som automático**: nenhum áudio, música, efeito sonoro ou vibração pode iniciar sem ação
   explícita do usuário. Todo som é opt-in e deve poder ser desligado a qualquer momento pelo
   Passaporte Sensorial.
5. **Proteção de dados (LGPD)**: coleta mínima, consentimento granular e revogável, dados sensíveis
   privados por padrão, exportação/correção/exclusão disponíveis, nenhuma venda de dados, nenhuma
   publicidade baseada em saúde/diagnóstico. Dados de demonstração são sempre fictícios — nunca use
   dados reais de pacientes, colegas ou instituições.
6. **Funcionalidade real**: proibido lorem ipsum, botões decorativos, links falsos, telas vazias ou
   funções simuladas sem identificação clara de que são demonstrativas. Toda função implementada deve
   funcionar de fato no modo demonstrativo local.
7. **Obrigação de testar antes de concluir**: após cada fase, rodar lint, checagem de tipos e build de
   produção; corrigir erros antes de seguir. Funcionalidades de UI devem ser exercitadas manualmente
   (ou documentar explicitamente que não foi possível testar visualmente).
8. **Autismo não é doença**: nunca tratar autismo como patologia, tragédia ou falha moral. Nunca
   generalizar a experiência autoetnográfica do autor como representativa de todas as pessoas
   autistas. Evitar estereótipos, símbolo de quebra-cabeça, cores neon, elementos piscantes e excesso
   de estímulo visual.
9. **Sem push/deploy não autorizado**: nunca publicar, contratar serviços pagos ou implantar em
   produção sem autorização expressa do usuário na conversa.
10. **Sem decisões técnicas desnecessárias**: resolver com boas práticas quando possível; só perguntar
    ao usuário quando a decisão alterar materialmente o produto, exigir credencial externa ou
    autorização de publicação.

## Arquitetura e convenções

- **Stack**: Next.js (App Router) + TypeScript + React 19, Tailwind CSS v4 para tokens visuais,
  Zod para validação. Ver `node_modules/next/dist/docs/` para a documentação da versão instalada do
  Next.js antes de escrever código novo — a versão 16 tem mudanças relevantes em relação ao
  treinamento de modelos de IA (params/searchParams assíncronos, `next lint` removido, ESLint flat
  config, `middleware` → `proxy`).
- **Camada de serviços**: toda leitura/escrita de dados passa por `src/lib/services/*`, que expõe uma
  interface única. Hoje a implementação padrão é `local` (localStorage, dados fictícios). Uma
  implementação `supabase` pode ser adicionada depois sem alterar o restante do app — variável de
  ambiente `NEXT_PUBLIC_DATA_BACKEND` escolhe o adapter.
- **Nunca grave credenciais no código-fonte.** Toda variável sensível fica em `.env.local` (fora do
  git) e é documentada em `.env.example`.
- **PLAN.md** guia as fases de implementação; **STATUS.md** é atualizado ao final de cada módulo
  concluído com o que está pronto, o que falta e como testar.

## Comandos

```bash
npm run dev      # ambiente de desenvolvimento
npm run lint     # ESLint
npm run build    # build de produção (também faz checagem de tipos)
```
