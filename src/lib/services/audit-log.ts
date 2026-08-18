import { createLocalCollection, generateId } from "@/lib/storage/local-collection";

export interface AuditLogEntry {
  id: string;
  actorId: string;
  actorLabel: string;
  action: string;
  createdAt: string;
}

const collection = createLocalCollection<AuditLogEntry>("neurorefugio.auditLog.v1");

export function logAdminAction(actorId: string, actorLabel: string, action: string): void {
  collection.create({ id: generateId("audit"), actorId, actorLabel, action, createdAt: new Date().toISOString() });
}

export function listAuditLog(): AuditLogEntry[] {
  return collection.list().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}
