import { createUserScopedCollection, generateId } from "@/lib/storage/local-collection";
import type { CommunicationCard, PersonalPlan, ResourceFeedback, TrustedContact } from "@/lib/schemas/plan";

const planCollection = createUserScopedCollection<PersonalPlan>(
  "neurorefugio.personalPlan.v1",
  "Plano Pessoal de Autorregulação",
);
const contactsCollection = createUserScopedCollection<TrustedContact>(
  "neurorefugio.trustedContacts.v1",
  "Contatos de confiança",
);
const cardsCollection = createUserScopedCollection<CommunicationCard>(
  "neurorefugio.communicationCards.v1",
  "Cartões de comunicação",
);
const feedbackCollection = createUserScopedCollection<ResourceFeedback>(
  "neurorefugio.resourceFeedback.v1",
  "Avaliações de recursos",
);

function emptyPlan(userId: string): PersonalPlan {
  return {
    id: generateId("plan"),
    userId,
    updatedAt: new Date().toISOString(),
    comoPercebendoSobrecarga: "",
    estimulosQueAfetam: "",
    oQueCostumaAjudar: "",
    oQueNaoDeveSerFeito: "",
    comoPreferoComunicar: "",
    quemPodeSerAvisado: "",
    ondeConsigoMeRegular: "",
    comoApoiarEmCriseMeltdownShutdown: "",
    oQuePrecisoDepois: "",
    quandoProcurarAjudaProfissional: "",
    compartilhadoCom: [],
  };
}

export function getPersonalPlan(userId: string): PersonalPlan {
  const existing = planCollection.listByUser(userId)[0];
  if (existing) return existing;
  const created = emptyPlan(userId);
  planCollection.create(created);
  return created;
}

export function savePersonalPlan(userId: string, patch: Partial<PersonalPlan>): PersonalPlan {
  const current = getPersonalPlan(userId);
  const updated = planCollection.update(current.id, { ...patch, updatedAt: new Date().toISOString() });
  return updated ?? current;
}

export function listTrustedContacts(userId: string): TrustedContact[] {
  return contactsCollection.listByUser(userId);
}

export function addTrustedContact(userId: string, data: Omit<TrustedContact, "id" | "userId">): TrustedContact {
  const contact: TrustedContact = { ...data, id: generateId("contact"), userId };
  contactsCollection.create(contact);
  return contact;
}

export function removeTrustedContact(id: string): void {
  contactsCollection.remove(id);
}

export function listCommunicationCards(userId: string): CommunicationCard[] {
  return cardsCollection.listByUser(userId);
}

export function addCommunicationCard(
  userId: string,
  data: Omit<CommunicationCard, "id" | "userId">,
): CommunicationCard {
  const card: CommunicationCard = { ...data, id: generateId("card"), userId };
  cardsCollection.create(card);
  return card;
}

export function updateCommunicationCard(id: string, patch: Partial<CommunicationCard>): void {
  cardsCollection.update(id, patch);
}

export function removeCommunicationCard(id: string): void {
  cardsCollection.remove(id);
}

export function recordResourceFeedback(
  userId: string,
  data: Omit<ResourceFeedback, "id" | "userId" | "createdAt">,
): ResourceFeedback {
  const feedback: ResourceFeedback = {
    ...data,
    id: generateId("feedback"),
    userId,
    createdAt: new Date().toISOString(),
  };
  feedbackCollection.create(feedback);
  return feedback;
}
