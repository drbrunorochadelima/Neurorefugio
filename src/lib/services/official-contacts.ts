import { createLocalCollection, generateId } from "@/lib/storage/local-collection";

export interface OfficialContact {
  id: string;
  nome: string;
  telefone: string;
  descricao?: string;
  createdAt: string;
}

const collection = createLocalCollection<OfficialContact>("neurorefugio.officialContacts.v1");

export function listOfficialContacts(): OfficialContact[] {
  return collection.list();
}

export function addOfficialContact(data: { nome: string; telefone: string; descricao?: string }): OfficialContact {
  const contact: OfficialContact = { ...data, id: generateId("official"), createdAt: new Date().toISOString() };
  collection.create(contact);
  return contact;
}

export function removeOfficialContact(id: string): void {
  collection.remove(id);
}
