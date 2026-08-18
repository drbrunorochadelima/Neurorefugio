import { createUserScopedCollection, generateId } from "@/lib/storage/local-collection";
import type { Hyperfocus } from "@/lib/schemas/hyperfocus";

const collection = createUserScopedCollection<Hyperfocus>("neurorefugio.hyperfocus.v1", "Hiperfocos");

export function listHyperfocuses(userId: string): Hyperfocus[] {
  return collection.listByUser(userId).sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export function getHyperfocus(id: string): Hyperfocus | undefined {
  return collection.get(id);
}

export function createHyperfocus(
  userId: string,
  data: Omit<Hyperfocus, "id" | "userId" | "createdAt" | "updatedAt" | "links" | "timeline">,
): Hyperfocus {
  const now = new Date().toISOString();
  const hyperfocus: Hyperfocus = {
    ...data,
    id: generateId("hf"),
    userId,
    links: [],
    timeline: [],
    createdAt: now,
    updatedAt: now,
  };
  collection.create(hyperfocus);
  return hyperfocus;
}

export function updateHyperfocus(id: string, patch: Partial<Hyperfocus>): void {
  collection.update(id, { ...patch, updatedAt: new Date().toISOString() });
}

export function removeHyperfocus(id: string): void {
  collection.remove(id);
}
