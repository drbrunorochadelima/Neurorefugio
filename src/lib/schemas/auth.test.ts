import { describe, expect, it } from "vitest";
import { signUpSchema, loginSchema } from "./auth";

describe("signUpSchema", () => {
  it("accepts a valid signup", () => {
    const result = signUpSchema.safeParse({
      email: "pessoa@example.com",
      password: "senha12345",
      pseudonym: "Rio",
      aceitaTermos: true,
      aceitaPrivacidade: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = signUpSchema.safeParse({
      email: "pessoa@example.com",
      password: "1234567",
      pseudonym: "Rio",
      aceitaTermos: true,
      aceitaPrivacidade: true,
    });
    expect(result.success).toBe(false);
  });

  it("rejects when terms are not accepted", () => {
    const result = signUpSchema.safeParse({
      email: "pessoa@example.com",
      password: "senha12345",
      pseudonym: "Rio",
      aceitaTermos: false,
      aceitaPrivacidade: true,
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid e-mail", () => {
    const result = signUpSchema.safeParse({
      email: "não-é-email",
      password: "senha12345",
      pseudonym: "Rio",
      aceitaTermos: true,
      aceitaPrivacidade: true,
    });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("requires a non-empty password", () => {
    const result = loginSchema.safeParse({ email: "pessoa@example.com", password: "" });
    expect(result.success).toBe(false);
  });
});
