/**
 * Registro de fontes de dados do usuário — usado por "Exportar meus dados" e
 * "Excluir minha conta" (LGPD) para alcançar todas as coleções locais sem
 * acoplar o módulo de conta a cada domínio individualmente. Cada coleção
 * criada com `createUserScopedCollection` se registra automaticamente aqui.
 */
interface UserDataSource {
  key: string;
  label: string;
  exportForUser: (userId: string) => unknown[];
  deleteForUser: (userId: string) => void;
}

const sources: UserDataSource[] = [];

export function registerUserDataSource(source: UserDataSource): void {
  sources.push(source);
}

export function exportAllUserData(userId: string): Record<string, unknown[]> {
  const result: Record<string, unknown[]> = {};
  for (const source of sources) {
    result[source.key] = source.exportForUser(userId);
  }
  return result;
}

export function deleteAllUserData(userId: string): void {
  for (const source of sources) {
    source.deleteForUser(userId);
  }
}
