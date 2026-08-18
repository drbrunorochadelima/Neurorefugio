import { z } from "zod";

export const USER_ROLES = ["visitante", "usuario", "moderador", "revisor", "administrador"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  pseudonym: z.string().min(2, "Use ao menos 2 caracteres").max(60),
  nomeSocial: z.string().max(80).optional(),
  pronouns: z.string().max(40).optional(),
  role: z.enum(USER_ROLES),
  profilePrivate: z.boolean(),
  createdAt: z.string(),
  consents: z.object({
    termos: z.boolean(),
    privacidade: z.boolean(),
    dadosSensiveis: z.boolean(),
    telemetriaOpcional: z.boolean(),
  }),
});
export type User = z.infer<typeof userSchema>;

export const signUpSchema = z.object({
  email: z.string().email("Informe um e-mail válido"),
  password: z.string().min(8, "A senha precisa ter ao menos 8 caracteres"),
  pseudonym: z.string().min(2, "Use ao menos 2 caracteres").max(60),
  aceitaTermos: z.boolean().refine((v) => v, "É necessário aceitar os termos para continuar"),
  aceitaPrivacidade: z
    .boolean()
    .refine((v) => v, "É necessário confirmar a leitura da política de privacidade"),
});
export type SignUpInput = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  email: z.string().email("Informe um e-mail válido"),
  password: z.string().min(1, "Informe sua senha"),
});
export type LoginInput = z.infer<typeof loginSchema>;
