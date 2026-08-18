# Plano de expansão futura

Ordem sugerida para continuar o desenvolvimento, por impacto e dependência.

## Curto prazo

1. **Adapter de backend real** (Supabase ou equivalente): autenticação real, banco relacional,
   Row Level Security, substituindo o adapter `local`. A camada de serviços (`src/lib/services/*`)
   já foi desenhada para tornar essa troca incremental, sem reescrever as páginas.
2. **Remover a autopromoção a administrador** do modo demonstrativo assim que houver backend real,
   substituindo por atribuição de papéis controlada no servidor.
3. **Fila de moderação acessível** sem depender de papel administrador local — parte natural do
   item 1.
4. Testes manuais com leitores de tela reais e com usuários que dependem de tecnologia assistiva,
   fechando as lacunas listadas em `docs/relatorio-de-acessibilidade.md`.

## Médio prazo

5. **Demais games**, na ordem sugerida pelo prompt mestre: Comunicação sem Pressão e Fábrica de
   Padrões (menor complexidade), seguidos por Rotas de Pausa, Constelação de Hiperfocos (reaproveita
   dados do módulo Hiperfocos já existente), Aquário Sensorial e Jardim do Meu Ritmo, depois Sala
   de Controle Sensorial e Construa uma Instituição Neuroinclusiva, e por fim Meu Ritmo: A Jornada
   do Corpo e Entre Luzes, Alarmes e o Silêncio (narrativas ramificadas mais extensas).
6. Modos adicionais dos games já existentes (camadas e importação no Ateliê das Cores; arrastar-e-
   soltar e mais modos em Conexões; temas e formatos adicionais em Memórias; modos
   estratégia/gestão institucional/livre no Plantão em Camadas).
7. Expandir a Biblioteca científica com mais conteúdos por eixo, iniciando o processo real de
   revisão por especialistas (mudando o status de `pendente_revisao` para `revisado`).
8. Painel administrativo: UI para gerenciar conteúdos da Biblioteca, games, desenhos/paletas/
   baralhos, categorias do fórum e métricas anônimas agregadas.

## Longo prazo

9. Execução do plano de validação científica completo (`docs/plano-de-validacao.md`): validação de
   conteúdo por especialistas, validação semântica com pessoas autistas adultas, usabilidade,
   acessibilidade e conforto sensorial com participantes reais.
10. Comunidade aberta (saindo do piloto fechado) uma vez que a estrutura de governança e moderação
    esteja madura e testada.
11. Fila de sincronização offline-primeiro mais robusta no service worker, incluindo cache de
    rotas dinâmicas visitadas.
12. Internacionalização, caso a plataforma venha a atender públicos fora do Brasil — hoje todo o
    conteúdo é intencionalmente pt-BR, incluindo estrutura de dados sem campos de idioma.
