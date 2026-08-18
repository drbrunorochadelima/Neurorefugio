import Link from "next/link";

const ORIENTACOES = [
  "Sobrecarga, meltdown e shutdown não são falhas — são respostas do corpo a um ambiente que exigiu mais do que era sustentável.",
  "Depois de um momento difícil, é comum precisar de mais tempo, mais silêncio ou menos exigência de comunicação do que o habitual. Isso é esperado, não um exagero.",
  "Recuperar-se pode levar minutos, horas ou dias. Não há um tempo certo.",
  "Se possível, reduza estímulos e demandas nas horas seguintes, mesmo que pareça que 'já passou'.",
  "Beber água, comer algo, descansar fisicamente e evitar decisões importantes logo em seguida costuma ajudar, quando possível.",
  "Se você tiver um Plano Pessoal preenchido, esta pode ser uma boa hora para revê-lo.",
  "Se a sobrecarga envolveu risco à sua segurança ou de outra pessoa, ou se acontece com frequência que compromete seu bem-estar, considerar apoio profissional é razoável — isto não é um diagnóstico, apenas uma sugestão.",
];

export default function PosSobrecargaPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-[var(--nr-text)]">Orientação pós-sobrecarga</h1>
      <p className="mt-2 text-sm text-[var(--nr-text-muted)]">
        Algumas ideias gerais — não são regras, e nem tudo vai fazer sentido para você.
      </p>

      <ul className="mt-6 flex flex-col gap-4">
        {ORIENTACOES.map((texto) => (
          <li key={texto} className="rounded-xl border border-[var(--nr-border)] bg-[var(--nr-surface)] p-4 text-[var(--nr-text)]">
            {texto}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/meu-espaco/plano-pessoal" className="rounded-lg border border-[var(--nr-border)] px-4 py-2 text-sm font-medium text-[var(--nr-text)]">
          Abrir meu Plano Pessoal
        </Link>
        <Link href="/quero-me-regular/pausa" className="rounded-lg border border-[var(--nr-border)] px-4 py-2 text-sm font-medium text-[var(--nr-text)]">
          Fazer uma pausa
        </Link>
      </div>

      <Link href="/quero-me-regular" className="mt-6 inline-block text-sm text-[var(--nr-accent-primary)] underline">
        Voltar para Quero me regular
      </Link>
    </div>
  );
}
