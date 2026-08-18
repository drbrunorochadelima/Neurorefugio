import { createLocalCollection, generateId } from "@/lib/storage/local-collection";
import { deleteAllUserData, exportAllUserData } from "@/lib/storage/user-data-registry";
import { userSchema, type User, type UserRole } from "@/lib/schemas/auth";
import { hashPassword, generateSalt } from "./crypto";

interface Credential {
  id: string;
  email: string;
  salt: string;
  passwordHash: string;
}

interface ResetToken {
  id: string;
  email: string;
  token: string;
  expiresAt: string;
}

const usersCollection = createLocalCollection<User>("neurorefugio.users.v1");
const credentialsCollection = createLocalCollection<Credential>("neurorefugio.credentials.v1");
const resetTokensCollection = createLocalCollection<ResetToken>("neurorefugio.resetTokens.v1");

const SESSION_KEY = "neurorefugio.session.v1";

export function getSessionUserId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(SESSION_KEY);
}

function setSessionUserId(userId: string | null) {
  if (typeof window === "undefined") return;
  if (userId) window.localStorage.setItem(SESSION_KEY, userId);
  else window.localStorage.removeItem(SESSION_KEY);
}

/**
 * Store externa (padrão `useSyncExternalStore`) para o usuário da sessão
 * atual. Evita divergência de hidratação: o servidor sempre "vê" ninguém
 * logado (não há acesso a localStorage no servidor), e o React sincroniza
 * para o valor real assim que o componente monta no navegador.
 */
type SessionListener = () => void;
const sessionListeners = new Set<SessionListener>();
let cachedSessionUser: User | null | undefined;

function computeSessionUser(): User | null {
  const id = getSessionUserId();
  return id ? getUser(id) ?? null : null;
}

function notifySessionChange(): void {
  cachedSessionUser = computeSessionUser();
  sessionListeners.forEach((listener) => listener());
}

export function subscribeSession(listener: SessionListener): () => void {
  sessionListeners.add(listener);
  return () => sessionListeners.delete(listener);
}

export function getSessionSnapshot(): User | null {
  if (cachedSessionUser === undefined) cachedSessionUser = computeSessionUser();
  return cachedSessionUser;
}

export function getServerSessionSnapshot(): User | null {
  return null;
}

export function findUserByEmail(email: string): User | undefined {
  return usersCollection.list().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function getUser(id: string): User | undefined {
  return usersCollection.get(id);
}

export async function signUp(input: {
  email: string;
  password: string;
  pseudonym: string;
}): Promise<User> {
  if (findUserByEmail(input.email)) {
    throw new Error("Já existe uma conta com este e-mail.");
  }
  const id = generateId("user");
  const salt = generateSalt();
  const passwordHash = await hashPassword(input.password, salt);
  credentialsCollection.create({ id: generateId("cred"), email: input.email, salt, passwordHash });

  const user: User = userSchema.parse({
    id,
    email: input.email,
    pseudonym: input.pseudonym,
    role: "usuario" satisfies UserRole,
    profilePrivate: true,
    createdAt: new Date().toISOString(),
    consents: {
      termos: true,
      privacidade: true,
      dadosSensiveis: false,
      telemetriaOpcional: false,
    },
  });
  usersCollection.create(user);
  setSessionUserId(user.id);
  notifySessionChange();
  return user;
}

export async function login(input: { email: string; password: string }): Promise<User> {
  const credential = credentialsCollection
    .list()
    .find((c) => c.email.toLowerCase() === input.email.toLowerCase());
  if (!credential) throw new Error("E-mail ou senha incorretos.");
  const hash = await hashPassword(input.password, credential.salt);
  if (hash !== credential.passwordHash) throw new Error("E-mail ou senha incorretos.");
  const user = findUserByEmail(input.email);
  if (!user) throw new Error("E-mail ou senha incorretos.");
  setSessionUserId(user.id);
  notifySessionChange();
  return user;
}

export function logout(): void {
  setSessionUserId(null);
  notifySessionChange();
}

export function updateProfile(userId: string, patch: Partial<User>): User | undefined {
  const updated = usersCollection.update(userId, patch);
  notifySessionChange();
  return updated;
}

/** Gera um token de recuperação de senha demonstrativo (não há envio real de e-mail). */
export function requestPasswordReset(email: string): string | null {
  const user = findUserByEmail(email);
  if (!user) return null;
  const token = generateId("reset").slice(-8);
  resetTokensCollection.create({
    id: generateId("resettoken"),
    email,
    token,
    expiresAt: new Date(Date.now() + 30 * 60_000).toISOString(),
  });
  return token;
}

export async function resetPassword(email: string, token: string, newPassword: string): Promise<void> {
  const record = resetTokensCollection
    .list()
    .find((t) => t.email.toLowerCase() === email.toLowerCase() && t.token === token);
  if (!record) throw new Error("Código de recuperação inválido.");
  if (new Date(record.expiresAt).getTime() < Date.now()) {
    throw new Error("Código de recuperação expirado. Solicite um novo.");
  }
  const credential = credentialsCollection.list().find((c) => c.email.toLowerCase() === email.toLowerCase());
  if (!credential) throw new Error("Conta não encontrada.");
  const salt = generateSalt();
  const passwordHash = await hashPassword(newPassword, salt);
  credentialsCollection.update(credential.id, { salt, passwordHash });
  resetTokensCollection.remove(record.id);
}

export function deleteAccount(userId: string): void {
  const user = usersCollection.get(userId);
  if (user) {
    credentialsCollection
      .list()
      .filter((c) => c.email.toLowerCase() === user.email.toLowerCase())
      .forEach((c) => credentialsCollection.remove(c.id));
  }
  deleteAllUserData(userId);
  usersCollection.remove(userId);
  setSessionUserId(null);
  notifySessionChange();
}

/** Exportação completa dos dados do usuário (LGPD), incluindo o perfil e todos os domínios registrados. */
export function exportUserData(userId: string): Record<string, unknown> {
  const user = usersCollection.get(userId);
  return { perfil: user ?? null, ...exportAllUserData(userId) };
}
