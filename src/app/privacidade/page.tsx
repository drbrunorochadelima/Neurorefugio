import Link from "next/link";

export default function PrivacidadePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-[var(--nr-text)]">Política de privacidade</h1>
      <p className="mt-2 text-sm text-[var(--nr-text-muted)]">
        Em linguagem simples. Última atualização: 18 de agosto de 2026.
      </p>

      <div className="mt-6 flex flex-col gap-4 text-[var(--nr-text)]">
        <h2 className="text-lg font-semibold">Onde seus dados ficam</h2>
        <p>
          Nesta versão demonstrativa, todos os seus dados — perfil, check-ins, Corpo-Monitor, Plano
          Pessoal, hiperfocos, publicações, progresso em jogos — ficam armazenados apenas no
          navegador que você está usando (localStorage). Nada é enviado para um servidor. Isso
          também significa que seus dados não estão disponíveis em outro dispositivo ou navegador.
        </p>

        <h2 className="mt-2 text-lg font-semibold">Coleta mínima</h2>
        <p>
          Pedimos apenas o necessário para cada funcionalidade: e-mail e senha para criar conta,
          pseudônimo para identificação na plataforma. Nome social e pronomes são opcionais.
        </p>

        <h2 className="mt-2 text-lg font-semibold">Dados sensíveis</h2>
        <p>
          Check-ins, registros do Corpo-Monitor e o Plano Pessoal de Autorregulação são dados
          sensíveis sobre sua saúde e funcionamento sensorial. Eles são privados por padrão e só são
          compartilhados quando você escolhe explicitamente compartilhar (por exemplo, com um
          contato de confiança).
        </p>

        <h2 className="mt-2 text-lg font-semibold">Consentimento</h2>
        <p>
          Ao criar conta, você aceita os{" "}
          <Link href="/termos" className="text-[var(--nr-accent-primary)] underline">
            Termos de uso
          </Link>{" "}
          e esta política. Consentimentos para dados sensíveis e telemetria são opcionais e
          separados, e podem ser revistos a qualquer momento em{" "}
          <Link href="/configuracoes/conta" className="text-[var(--nr-accent-primary)] underline">
            Minha conta
          </Link>
          .
        </p>

        <h2 className="mt-2 text-lg font-semibold">Seus direitos</h2>
        <ul className="list-inside list-disc">
          <li>Exportar todos os seus dados em formato legível (.json).</li>
          <li>Corrigir seu perfil a qualquer momento.</li>
          <li>Excluir sua conta e todos os dados associados a ela, de forma definitiva.</li>
        </ul>

        <h2 className="mt-2 text-lg font-semibold">O que nunca fazemos</h2>
        <ul className="list-inside list-disc">
          <li>Não vendemos dados.</li>
          <li>Não fazemos publicidade baseada em diagnóstico ou saúde mental.</li>
          <li>Não misturamos dados de demonstração com dados reais de pacientes ou instituições.</li>
          <li>Não alteramos suas preferências sensoriais silenciosamente.</li>
        </ul>

        <h2 className="mt-2 text-lg font-semibold">Quando houver um backend real</h2>
        <p>
          Se esta plataforma for conectada a um backend real (ver <code>.env.example</code>), dados
          de identificação e dados analíticos serão mantidos separados, com criptografia em
          trânsito e repouso quando suportada pela infraestrutura, e políticas de segurança por
          linha (row-level security) restringindo o acesso de um usuário aos dados de outro.
        </p>
      </div>
    </div>
  );
}
