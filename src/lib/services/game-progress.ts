import { createUserScopedCollection, generateId } from "@/lib/storage/local-collection";
import type { GameProgress } from "@/lib/schemas/games";

const collection = createUserScopedCollection<GameProgress>(
  "neurorefugio.gameProgress.v1",
  "Progresso em games",
);

export function getGameProgress(userId: string, gameId: string): GameProgress {
  const existing = collection.listByUser(userId).find((p) => p.gameId === gameId);
  if (existing) return existing;
  const created: GameProgress = {
    id: generateId("progress"),
    userId,
    gameId,
    updatedAt: new Date().toISOString(),
    data: {},
    jornada: { estrelas: 0, folhas: 0 },
  };
  collection.create(created);
  return created;
}

export function saveGameProgress(
  userId: string,
  gameId: string,
  patch: Partial<Pick<GameProgress, "data" | "jornada">>,
): GameProgress {
  const current = getGameProgress(userId, gameId);
  const updated = collection.update(current.id, { ...patch, updatedAt: new Date().toISOString() });
  return updated ?? current;
}

export function listGameProgress(userId: string): GameProgress[] {
  return collection.listByUser(userId);
}
