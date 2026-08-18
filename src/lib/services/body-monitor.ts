import { createUserScopedCollection, generateId } from "@/lib/storage/local-collection";
import type { BodyMonitorEntry } from "@/lib/schemas/body-monitor";

const collection = createUserScopedCollection<BodyMonitorEntry>(
  "neurorefugio.bodyMonitor.v1",
  "Corpo-Monitor",
);

export function listBodyMonitorEntries(userId: string): BodyMonitorEntry[] {
  return collection.listByUser(userId).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function addBodyMonitorEntry(
  userId: string,
  data: Omit<BodyMonitorEntry, "id" | "userId" | "createdAt">,
): BodyMonitorEntry {
  const entry: BodyMonitorEntry = {
    ...data,
    id: generateId("bodymonitor"),
    userId,
    createdAt: new Date().toISOString(),
  };
  collection.create(entry);
  return entry;
}

export function removeBodyMonitorEntry(id: string): void {
  collection.remove(id);
}
