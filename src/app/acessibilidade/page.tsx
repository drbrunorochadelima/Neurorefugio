import Link from "next/link";

export default function AcessibilidadePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-[var(--nr-text)]">Acessibilidade</h1>
      <p className="mt-2 text-sm text-[var(--nr-text-muted)]">Última atualização: 18 de agosto de 2026.</p>

      <div className="mt-6 flex flex-col gap-4 text-[var(--nr-text)]">
        <p>
          O NeuroRefúgio segue as diretrizes WCAG 2.2, nível AA, como critério de aceite para todo
          componente novo. Isto inclui:
        </p>
        <ul className="list-inside list-disc">
          <li>Navegação completa por teclado, com foco sempre visível.</li>
          <li>Compatibilidade com leitores de tela (marcação semântica, textos alternativos, landmarks ARIA).</li>
          <li>Funcionamento com ampliação de até 200% sem perda de conteúdo.</li>
          <li>Contraste adequado entre texto e plano de fundo.</li>
          <li>Nenhum som automático em nenhuma página.</li>
          <li>Controle de movimento, densidade visual, tamanho e espaçamento de fonte pelo Passaporte Sensorial.</li>
          <li>Modo de baixo estímulo e botão global &ldquo;Preciso de calma&rdquo;.</li>
        </ul>

        <h2 className="mt-2 text-lg font-semibold">Passaporte Sensorial</h2>
        <p>
          Em{" "}
          <Link href="/configuracoes" className="text-[var(--nr-accent-primary)] hover:underline">
            Meu Ambiente
          </Link>{" "}
          você configura tema, contraste, saturação, tamanho e peso da fonte, espaçamento,
          altura de linha, animações, densidade de elementos, som e vibração. Essas preferências
          nunca são alteradas sem sua ação direta.
        </p>

        <h2 className="mt-2 text-lg font-semibold">Limitações conhecidas</h2>
        <p>
          Esta versão ainda não passou por uma auditoria formal de acessibilidade com ferramentas
          automatizadas (como axe ou Lighthouse) nem por testes com usuários leitores de tela reais
          — ver <code>STATUS.md</code> no repositório para o estado atual e as limitações
          registradas a cada fase.
        </p>

        <h2 className="mt-2 text-lg font-semibold">Encontrou uma barreira?</h2>
        <p>
          Se algum recurso não estiver acessível para você, isso é uma falha da plataforma, não
          sua. Veja as informações de contato em{" "}
          <Link href="/pesquisa" className="text-[var(--nr-accent-primary)] hover:underline">
            Conheça a pesquisa
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
