export default function PesquisaPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--nr-accent-secondary)]">
        Conheça a pesquisa
      </p>
      <h1 className="mt-2 text-2xl font-bold text-[var(--nr-text)]">
        Entre luzes, alarmes e o silêncio: uma autoetnografia performática de um médico autista na
        terapia intensiva
      </h1>
      <p className="mt-2 text-lg text-[var(--nr-text-muted)]">
        Neurodiversidade, capacitismo estrutural e violência sensorial no trabalho em saúde
      </p>

      <dl className="mt-6 grid grid-cols-1 gap-3 rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-6 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-medium text-[var(--nr-text)]">Autor</dt>
          <dd className="text-[var(--nr-text-muted)]">Bruno Rocha de Lima</dd>
        </div>
        <div>
          <dt className="font-medium text-[var(--nr-text)]">Orientador</dt>
          <dd className="text-[var(--nr-text-muted)]">Gustavo Antônio Raimondi</dd>
        </div>
        <div>
          <dt className="font-medium text-[var(--nr-text)]">Coorientador</dt>
          <dd className="text-[var(--nr-text-muted)]">Danilo Borges Paulino</dd>
        </div>
        <div>
          <dt className="font-medium text-[var(--nr-text)]">Instituição</dt>
          <dd className="text-[var(--nr-text-muted)]">Universidade Federal de Uberlândia (UFU)</dd>
        </div>
        <div>
          <dt className="font-medium text-[var(--nr-text)]">Ano</dt>
          <dd className="text-[var(--nr-text-muted)]">2026</dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-col gap-6 text-[var(--nr-text)]">
        <section>
          <h2 className="text-lg font-semibold">Problema</h2>
          <p className="mt-2">
            Ambientes de terapia intensiva concentram alta densidade de estímulos sensoriais —
            luzes, alarmes, ruídos, interrupções, circulação constante de pessoas — e demandas
            institucionais que pressupõem um único padrão de funcionamento corporal e cognitivo.
            Profissionais autistas da saúde navegam esse ambiente sob uma dupla exigência pouco
            reconhecida: monitorar o paciente e o ambiente, e ao mesmo tempo regular o próprio
            corpo diante de uma carga sensorial raramente considerada nos desenhos institucionais.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Objetivos</h2>
          <p className="mt-2">
            Investigar, a partir de uma experiência situada, como a ambiência sensorial da terapia
            intensiva atravessa o corpo de um profissional autista, e como capacitismo estrutural
            se manifesta em normas, rotinas e desenhos institucionais do trabalho em saúde. A partir
            dessa investigação, desenvolver um produto técnico-científico — esta plataforma — que
            traduza os achados em recursos concretos de acessibilidade sensorial, autoconhecimento
            e educação institucional.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Metodologia</h2>
          <p className="mt-2">
            A pesquisa combina autoetnografia performática — registro e reflexão sistemática sobre a
            própria experiência do pesquisador — com observação etnográfica da ambiência da UTI e
            análise temática reflexiva do material produzido. O conceito de corpo-monitor, central
            para a análise, é organizado em três eixos: luzes, alarmes e silêncio (este último
            associado a masking, sofrimento invisível e silenciamento institucional).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Aspectos éticos</h2>
          <p className="mt-2">
            A pesquisa lida com dados sobre a experiência do próprio pesquisador. Nenhum dado real
            de pacientes, colegas ou instituições é utilizado nesta plataforma — todo conteúdo
            demonstrativo é fictício e está identificado como tal. Qualquer investigação futura com
            outros participantes (por exemplo, na fase de validação semântica com pessoas autistas
            adultas) respeitará protocolo, consentimento informado, proteção de dados e as
            autorizações éticas aplicáveis.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Limitações</h2>
          <p className="mt-2">
            A experiência autoetnográfica de um único pesquisador não representa nem generaliza a
            diversidade de experiências de pessoas autistas — inclusive entre profissionais de
            saúde. Os achados são um ponto de partida situado, não uma conclusão universal. Esta
            plataforma, em sua versão atual, ainda não passou por validação formal de conteúdo,
            usabilidade ou acessibilidade com participantes externos — ver a seção de validação
            científica planejada abaixo.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Produto técnico-científico</h2>
          <p className="mt-2">
            O NeuroRefúgio — Plataforma Corpo-Monitor é o produto técnico-científico desta
            dissertação: uma plataforma web que traduz os eixos luzes/alarmes/silêncio e o conceito
            de corpo-monitor em recursos de autoconhecimento sensorial, autorregulação, jogos
            neuroinclusivos, biblioteca científica e recursos institucionais.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Validação planejada</h2>
          <p className="mt-2">
            Estão previstas etapas de validação de conteúdo por especialistas e validação semântica
            com pessoas autistas adultas — especialmente profissionais e estudantes da saúde —,
            além de avaliação de usabilidade, acessibilidade e conforto sensorial. Nenhuma
            funcionalidade desta plataforma, incluindo os jogos, é apresentada como clinicamente
            validada antes dessa avaliação formal.
          </p>
        </section>

        <section className="rounded-2xl border border-[var(--nr-border)] bg-[var(--nr-surface-alt)] p-5">
          <h2 className="text-lg font-semibold">Declaração importante</h2>
          <p className="mt-2">
            A experiência situada do pesquisador não representa todas as experiências autistas.
            Esta plataforma não substitui atendimento profissional de saúde e não é um serviço de
            emergência.
          </p>
        </section>

        <section id="contato">
          <h2 className="text-lg font-semibold">Referências e atualizações</h2>
          <p className="mt-2 text-sm text-[var(--nr-text-muted)]">
            A dissertação completa, com referências, será disponibilizada após a defesa, conforme
            os trâmites do Programa de Pós-Graduação da Universidade Federal de Uberlândia. Esta
            página será atualizada conforme o andamento da pesquisa.
          </p>
        </section>
      </div>
    </div>
  );
}
