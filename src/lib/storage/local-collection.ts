/**
 * Coleção genérica persistida em localStorage — base das implementações de
 * serviço em modo demonstrativo (`src/lib/services/local`). Cada coleção é
 * identificada por uma chave própria; todos os registros têm `id`.
 *
 * Isto não é um banco de dados real: é o adapter "local" descrito em
 * CLAUDE.md, que permite a plataforma funcionar sem credenciais externas.
 * Um adapter "supabase" pode implementar a mesma interface de serviço
 * (`src/lib/services/types.ts`) usando Postgres/RLS no lugar disto.
 */

function readAll<T>(storageKey: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll<T>(storageKey: string, items: T[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  } catch {
    // Armazenamento indisponível (modo privado, quota excedida): os dados
    // continuam válidos em memória para a sessão atual.
  }
}

export function createLocalCollection<T extends { id: string }>(storageKey: string) {
  return {
    list(): T[] {
      return readAll<T>(storageKey);
    },
    get(id: string): T | undefined {
      return readAll<T>(storageKey).find((item) => item.id === id);
    },
    seedIfEmpty(seed: T[]): void {
      const existing = readAll<T>(storageKey);
      if (existing.length === 0 && seed.length > 0) {
        writeAll(storageKey, seed);
      }
    },
    create(item: T): T {
      const items = readAll<T>(storageKey);
      items.push(item);
      writeAll(storageKey, items);
      return item;
    },
    update(id: string, patch: Partial<T>): T | undefined {
      const items = readAll<T>(storageKey);
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) return undefined;
      items[index] = { ...items[index], ...patch };
      writeAll(storageKey, items);
      return items[index];
    },
    remove(id: string): void {
      const items = readAll<T>(storageKey).filter((item) => item.id !== id);
      writeAll(storageKey, items);
    },
    replaceAll(items: T[]): void {
      writeAll(storageKey, items);
    },
    clear(): void {
      writeAll(storageKey, []);
    },
  };
}

import { registerUserDataSource } from "./user-data-registry";

/**
 * Variante de `createLocalCollection` para entidades pertencentes a um
 * usuário (`{ id, userId }`). Registra-se automaticamente no
 * user-data-registry para que exportação e exclusão de conta (LGPD)
 * alcancem estes dados sem exigir integração manual em cada domínio.
 */
export function createUserScopedCollection<T extends { id: string; userId: string }>(
  storageKey: string,
  label: string,
) {
  const base = createLocalCollection<T>(storageKey);

  const scoped = {
    ...base,
    listByUser(userId: string): T[] {
      return base.list().filter((item) => item.userId === userId);
    },
    removeAllByUser(userId: string): void {
      base.replaceAll(base.list().filter((item) => item.userId !== userId));
    },
  };

  registerUserDataSource({
    key: storageKey,
    label,
    exportForUser: (userId) => scoped.listByUser(userId),
    deleteForUser: (userId) => scoped.removeAllByUser(userId),
  });

  return scoped;
}

export function generateId(prefix: string): string {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}_${random}`;
}
