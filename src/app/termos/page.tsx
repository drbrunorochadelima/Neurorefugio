import Link from "next/link";

export default function TermosPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-[var(--nr-text)]">Termos de uso</h1>
      <p className="mt-2 text-sm text-[var(--nr-text-muted)]">Última atualização: 18 de agosto de 2026.</p>

      <div className="mt-6 flex flex-col gap-4 text-[var(--nr-text)]">
        <p>
          O NeuroRefúgio é um produto técnico-científico vinculado ao projeto de mestrado
          &ldquo;Entre luzes, alarmes e o silêncio: uma autoetnografia performática de um médico
          autista na terapia intensiva&rdquo;, de Bruno Rocha de Lima, Universidade Federal de
          Uberlândia (UFU), 2026. Ao usar esta plataforma, você concorda com estes termos.
        </p>

        <h2 className="mt-2 text-lg font-semibold">O que este site é</h2>
        <p>
          Um espaço de autoconhecimento sensorial e corporal, autorregulação, jogos
          neuroinclusivos, biblioteca científica e comunidade moderada, voltado principalmente a
          pessoas autistas adultas, profissionais e estudantes da saúde, familiares, educadores,
          gestores institucionais e pesquisadores em neurodiversidade.
        </p>

        <h2 className="mt-2 text-lg font-semibold">O que este site não é</h2>
        <p>
          Não é um serviço de emergência, diagnóstico ou atendimento psicológico ou médico. Não
          substitui acompanhamento profissional de saúde. Em situações de risco, procure ajuda
          profissional imediata — veja a página{" "}
          <Link href="/seguranca" className="text-[var(--nr-accent-primary)] underline">
            Segurança
          </Link>
          .
        </p>

        <h2 className="mt-2 text-lg font-semibold">Modo demonstrativo</h2>
        <p>
          Nesta versão, os dados ficam armazenados localmente no seu navegador (modo
          demonstrativo). Nenhum dado é enviado a um servidor real. Limpar os dados do navegador ou
          usar outro dispositivo apaga o acesso a esses dados.
        </p>

        <h2 className="mt-2 text-lg font-semibold">Conduta na comunidade</h2>
        <p>
          É proibido publicar terapias de cura, assédio, capacitismo, racismo, LGBTfobia, incentivo
          à violência, exposição de dados pessoais de terceiros ou desinformação médica.
          Publicações passam por revisão antes de ficarem públicas (piloto fechado).
        </p>

        <h2 className="mt-2 text-lg font-semibold">Sua conta</h2>
        <p>
          Você pode excluir sua conta e todos os dados associados a ela a qualquer momento, em{" "}
          <Link href="/configuracoes/conta" className="text-[var(--nr-accent-primary)] underline">
            Minha conta
          </Link>
          .
        </p>

        <h2 className="mt-2 text-lg font-semibold">Contato</h2>
        <p>
          Para dúvidas sobre estes termos, veja as informações de orientação e instituição em{" "}
          <Link href="/pesquisa" className="text-[var(--nr-accent-primary)] underline">
            Conheça a pesquisa
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
