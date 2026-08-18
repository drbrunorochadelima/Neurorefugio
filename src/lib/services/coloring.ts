import { createUserScopedCollection, generateId } from "@/lib/storage/local-collection";
import type { ColoringArtwork } from "@/lib/schemas/games";

const collection = createUserScopedCollection<ColoringArtwork>(
  "neurorefugio.coloringArtworks.v1",
  "Desenhos do Ateliê das Cores",
);

export function listArtworks(userId: string): ColoringArtwork[] {
  return collection.listByUser(userId).sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export function saveArtwork(
  userId: string,
  data: Omit<ColoringArtwork, "id" | "userId" | "createdAt" | "updatedAt"> & { id?: string },
): ColoringArtwork {
  const now = new Date().toISOString();
  if (data.id) {
    const updated = collection.update(data.id, { ...data, updatedAt: now });
    if (updated) return updated;
  }
  const artwork: ColoringArtwork = {
    ...data,
    id: data.id ?? generateId("art"),
    userId,
    createdAt: now,
    updatedAt: now,
  };
  collection.create(artwork);
  return artwork;
}

export function removeArtwork(id: string): void {
  collection.remove(id);
}
