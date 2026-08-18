import { createUserScopedCollection, generateId } from "@/lib/storage/local-collection";
import type { JournalEntry, RoutineItem } from "@/lib/schemas/journal";

const journalCollection = createUserScopedCollection<JournalEntry>("neurorefugio.journal.v1", "Diário");
const routineCollection = createUserScopedCollection<RoutineItem>("neurorefugio.routine.v1", "Rotina");

export function listJournalEntries(userId: string): JournalEntry[] {
  return journalCollection.listByUser(userId).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function addJournalEntry(userId: string, texto: string): JournalEntry {
  const entry: JournalEntry = { id: generateId("journal"), userId, texto, createdAt: new Date().toISOString() };
  journalCollection.create(entry);
  return entry;
}

export function removeJournalEntry(id: string): void {
  journalCollection.remove(id);
}

export function listRoutineItems(userId: string): RoutineItem[] {
  return routineCollection.listByUser(userId).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function addRoutineItem(userId: string, titulo: string, horario?: string): RoutineItem {
  const item: RoutineItem = {
    id: generateId("routine"),
    userId,
    titulo,
    horario,
    createdAt: new Date().toISOString(),
  };
  routineCollection.create(item);
  return item;
}

export function toggleRoutineItem(id: string, done: boolean): void {
  routineCollection.update(id, { concluidoEm: done ? new Date().toISOString() : undefined });
}

export function removeRoutineItem(id: string): void {
  routineCollection.remove(id);
}
