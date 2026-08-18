import { describe, expect, it, beforeEach } from "vitest";
import * as store from "./store";

describe("auth store", () => {
  beforeEach(() => window.localStorage.clear());

  it("signs up, persists the session and logs in with the same password", async () => {
    const user = await store.signUp({ email: "pessoa@example.com", password: "senha12345", pseudonym: "Rio" });
    expect(user.role).toBe("usuario");
    expect(user.profilePrivate).toBe(true);
    expect(store.getSessionUserId()).toBe(user.id);

    store.logout();
    expect(store.getSessionUserId()).toBeNull();

    const loggedIn = await store.login({ email: "pessoa@example.com", password: "senha12345" });
    expect(loggedIn.id).toBe(user.id);
  });

  it("rejects login with the wrong password without leaking which field was wrong", async () => {
    await store.signUp({ email: "pessoa2@example.com", password: "senha12345", pseudonym: "Rio2" });
    await expect(store.login({ email: "pessoa2@example.com", password: "senha-errada" })).rejects.toThrow(
      "E-mail ou senha incorretos.",
    );
  });

  it("prevents duplicate accounts for the same e-mail", async () => {
    await store.signUp({ email: "duplicado@example.com", password: "senha12345", pseudonym: "Um" });
    await expect(
      store.signUp({ email: "duplicado@example.com", password: "outrasenha", pseudonym: "Dois" }),
    ).rejects.toThrow("Já existe uma conta com este e-mail.");
  });

  it("deleteAccount removes the user and clears the session", async () => {
    const user = await store.signUp({ email: "apagar@example.com", password: "senha12345", pseudonym: "Apagar" });
    store.deleteAccount(user.id);
    expect(store.getUser(user.id)).toBeUndefined();
    expect(store.getSessionUserId()).toBeNull();
    await expect(store.login({ email: "apagar@example.com", password: "senha12345" })).rejects.toThrow();
  });
});
