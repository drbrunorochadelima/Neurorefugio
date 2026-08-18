# Manual do administrador — NeuroRefúgio

## Acesso ao painel

O painel administrativo (`/admin`) é restrito a contas com papel `administrador`. **Nesta versão
demonstrativa não há backend real**, então qualquer conta pode se autopromover a administradora em
**Configurações → Minha conta**, em uma seção claramente identificada como recurso apenas para
teste local. Em uma implantação real com backend (ver `.env.example`), essa autopromoção deve ser
removida e a atribuição de papéis deve ser feita apenas por quem já é administrador, via
`/admin/usuarios`.

## Usuários e permissões (`/admin/usuarios`)

Lista todas as contas criadas neste navegador (e-mail, pseudônimo, papel). Permite alterar o papel
de qualquer conta entre: visitante, usuário, moderador, revisor científico, administrador. Toda
alteração é registrada na trilha de auditoria.

## Moderação da comunidade (`/admin/moderacao`)

- **Publicações aguardando revisão**: toda publicação enviada por um usuário fica com status "em
  revisão" até ser aprovada. Aqui você pode **Publicar** (torna visível a todos) ou **Rejeitar e
  remover** (exclui definitivamente).
- **Denúncias**: lista denúncias feitas por usuários sobre publicações, comentários ou perfis.
  Marque como "resolvida" após analisar e agir (por exemplo, removendo o conteúdo denunciado
  diretamente na Comunidade, se aplicável).

## Contatos oficiais e checklists (`/admin/institucional`)

Cadastre contatos oficiais de segurança/emergência **apenas depois de confirmados pela sua
instituição** — nunca invente números. Esses contatos aparecem na página pública **Segurança**.
Também é possível visualizar os itens de checklist institucional registrados em `/instituicoes`
(o preenchimento em si acontece naquela página pública, voltada a gestores e equipes).

## Trilha de auditoria (`/admin/auditoria`)

Histórico cronológico de ações administrativas (quem fez o quê e quando), sem expor dados
sensíveis de usuários. Use para prestar contas sobre decisões de moderação e configuração.

## Limitações desta versão

- Não há UI administrativa para gerenciar conteúdos da Biblioteca científica, games, desenhos,
  paletas, baralhos de memória, categorias do fórum ou versões — esses dados hoje são definidos em
  código (`src/lib/services/*`) e carregados como seed. Ver `PLAN.md`/`STATUS.md` para o plano de
  expansão.
- Não há métricas anônimas agregadas (não há telemetria real).
- O papel de administrador não é protegido por autenticação de servidor nesta versão demonstrativa
  — qualquer pessoa com acesso ao navegador pode alterá-lo. Isto **não é adequado para produção**
  sem um backend real com controle de acesso no servidor.
