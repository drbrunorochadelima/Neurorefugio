import { createUserScopedCollection, generateId } from "@/lib/storage/local-collection";
import type { CheckIn, FullCheckIn, QuickCheckIn } from "@/lib/schemas/checkin";

const collection = createUserScopedCollection<CheckIn>("neurorefugio.checkins.v1", "Check-ins");

export function listCheckIns(userId: string): CheckIn[] {
  return collection
    .listByUser(userId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function addQuickCheckIn(
  userId: string,
  data: Omit<QuickCheckIn, "id" | "userId" | "createdAt" | "type">,
): QuickCheckIn {
  const checkIn: QuickCheckIn = {
    ...data,
    id: generateId("checkin"),
    userId,
    createdAt: new Date().toISOString(),
    type: "rapido",
  };
  collection.create(checkIn);
  return checkIn;
}

export function addFullCheckIn(
  userId: string,
  data: Omit<FullCheckIn, "id" | "userId" | "createdAt" | "type">,
): FullCheckIn {
  const checkIn: FullCheckIn = {
    ...data,
    id: generateId("checkin"),
    userId,
    createdAt: new Date().toISOString(),
    type: "completo",
  };
  collection.create(checkIn);
  return checkIn;
}

/**
 * Síntese acolhedora e não diagnóstica do check-in, conforme §8 do prompt
 * mestre: descreve o que a pessoa registrou e sugere possibilidades, sem
 * interpretar clinicamente ou afirmar causalidade.
 */
export function synthesizeCheckIn(checkIn: CheckIn): string {
  const observacoes: string[] = [];
  const sugestoes: string[] = [];

  if (checkIn.energia <= 1) {
    observacoes.push("energia bem reduzida");
    sugestoes.push("diminuir o ritmo, se possível");
  } else if (checkIn.energia <= 2) {
    observacoes.push("energia reduzida");
  }

  if (checkIn.ansiedade >= 4) {
    observacoes.push("ansiedade elevada");
    sugestoes.push("um recurso de aterramento ou respiração");
  }

  const sobrecarga = checkIn.type === "rapido" ? checkIn.sobrecarga : checkIn.sobrecargaPercebida;
  if (sobrecarga >= 4) {
    observacoes.push("sobrecarga elevada");
    sugestoes.push("diminuir estímulos ao seu redor");
  }

  if (checkIn.type === "rapido") {
    if (checkIn.precisaPausa) {
      sugestoes.push("abrir seu Plano Pessoal ou fazer uma pausa");
    }
    if (checkIn.capacidadeComunicacao <= 1) {
      observacoes.push("maior dificuldade para se comunicar agora");
      sugestoes.push("usar um cartão de comunicação, se ajudar");
    }
  }

  if (checkIn.type === "completo") {
    if (checkIn.capacidadeFalarInteragir <= 1) {
      observacoes.push("maior dificuldade para se comunicar agora");
      sugestoes.push("usar um cartão de comunicação, se ajudar");
    }
    if (checkIn.esforcoMasking >= 4) observacoes.push("esforço alto de masking");
    if (checkIn.necessidadeStimming >= 4) sugestoes.push("um espaço para stimming, se possível");
    if (checkIn.sono <= 1) observacoes.push("sono insuficiente");
  }

  if (observacoes.length === 0) {
    return "Registro guardado. Obrigado por reservar este momento para se observar.";
  }

  let texto = `Você indicou ${observacoes.join(", ")}.`;
  if (sugestoes.length > 0) {
    texto += ` Talvez seja útil ${sugestoes.join(" ou ")}.`;
  }
  texto += " Este é um registro pessoal, não um diagnóstico.";
  return texto;
}
