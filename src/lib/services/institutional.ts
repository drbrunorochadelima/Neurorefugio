import { createLocalCollection, generateId } from "@/lib/storage/local-collection";
import type { ChecklistItem } from "@/lib/schemas/institutional";

const collection = createLocalCollection<ChecklistItem>("neurorefugio.institutionalChecklist.v1");

export function listChecklistItems(): ChecklistItem[] {
  return collection.list().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function addChecklistItem(data: Omit<ChecklistItem, "id" | "createdAt">): ChecklistItem {
  const item: ChecklistItem = { ...data, id: generateId("checklist"), createdAt: new Date().toISOString() };
  collection.create(item);
  return item;
}

export function removeChecklistItem(id: string): void {
  collection.remove(id);
}
