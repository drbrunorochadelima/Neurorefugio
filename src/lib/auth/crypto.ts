/**
 * Hash de senha para o modo demonstrativo local (Web Crypto SubtleCrypto,
 * SHA-256 com salt). Isto NÃO é uma prática de produção completa (faltam
 * fatores como bcrypt/argon2 e proteção contra força bruta) — em um backend
 * real (Supabase Auth ou equivalente) a autenticação é delegada ao provedor,
 * que já implementa isso corretamente. Aqui o objetivo é apenas não gravar
 * senhas em texto puro no localStorage do navegador.
 */
async function digestHex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function hashPassword(password: string, salt: string): Promise<string> {
  return digestHex(`${salt}:${password}`);
}

export function generateSalt(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
