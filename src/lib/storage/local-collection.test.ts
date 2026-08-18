import { describe, expect, it, beforeEach } from "vitest";
import { createLocalCollection, createUserScopedCollection, generateId } from "./local-collection";
import { exportAllUserData, deleteAllUserData } from "./user-data-registry";

interface Widget {
  id: string;
  label: string;
}

interface Note {
  id: string;
  userId: string;
  text: string;
}

describe("createLocalCollection", () => {
  beforeEach(() => window.localStorage.clear());

  it("creates, lists, updates and removes items", () => {
    const collection = createLocalCollection<Widget>("test.widgets");
    const item = collection.create({ id: generateId("w"), label: "A" });

    expect(collection.list()).toHaveLength(1);
    expect(collection.get(item.id)?.label).toBe("A");

    collection.update(item.id, { label: "B" });
    expect(collection.get(item.id)?.label).toBe("B");

    collection.remove(item.id);
    expect(collection.list()).toHaveLength(0);
  });

  it("only seeds when the collection is empty", () => {
    const collection = createLocalCollection<Widget>("test.seeded");
    collection.seedIfEmpty([{ id: "s1", label: "seed" }]);
    collection.seedIfEmpty([{ id: "s2", label: "should not appear" }]);

    expect(collection.list()).toEqual([{ id: "s1", label: "seed" }]);
  });

  it("survives malformed JSON in storage by returning an empty list", () => {
    window.localStorage.setItem("test.broken", "{not valid json");
    const collection = createLocalCollection<Widget>("test.broken");
    expect(collection.list()).toEqual([]);
  });
});

describe("createUserScopedCollection", () => {
  beforeEach(() => window.localStorage.clear());

  it("scopes list/removeAllByUser to a single user", () => {
    const collection = createUserScopedCollection<Note>("test.notes", "Notas de teste");
    collection.create({ id: generateId("n"), userId: "alice", text: "oi" });
    collection.create({ id: generateId("n"), userId: "alice", text: "tudo bem" });
    collection.create({ id: generateId("n"), userId: "bob", text: "outra pessoa" });

    expect(collection.listByUser("alice")).toHaveLength(2);
    expect(collection.listByUser("bob")).toHaveLength(1);

    collection.removeAllByUser("alice");
    expect(collection.listByUser("alice")).toHaveLength(0);
    expect(collection.listByUser("bob")).toHaveLength(1);
  });

  it("registers itself so LGPD export/delete reach its data", () => {
    const collection = createUserScopedCollection<Note>("test.notes.registry", "Notas registradas");
    collection.create({ id: generateId("n"), userId: "carol", text: "dado sensível" });

    const exported = exportAllUserData("carol");
    expect(exported["test.notes.registry"]).toHaveLength(1);

    deleteAllUserData("carol");
    expect(collection.listByUser("carol")).toHaveLength(0);
  });
});
