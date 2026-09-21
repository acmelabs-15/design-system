import { expect, test } from "bun:test";
import { createOrderedStyleInputs } from "../ordered-style-inputs";
import { applyStyleInputBinding, attachStyleInputTarget, type StyleInputs } from "../style-input-binding";

const createValues = () =>
  createOrderedStyleInputs({
    padding: (value: unknown) => {
      if (typeof value !== "number" || value < 0) throw new TypeError("Invalid padding");
      return value;
    },
    paddingInline: (value: unknown) => {
      if (typeof value !== "number" || value < 0) throw new TypeError("Invalid padding inline");
      return value;
    },
    backgroundColor: (value: unknown) => {
      if (typeof value !== "string") throw new TypeError("Invalid background");
      return value;
    },
  });
type Key = "padding" | "paddingInline" | "backgroundColor";
const setup = () => {
  const target = document.createElement("div");
  const values = createValues();
  attachStyleInputTarget(target, (inputs, previous) => {
    values.apply(inputs, previous as readonly Key[]);
  });
  return { target, values };
};

test("same-owner clearing during first publication sees its newly supplied keys", () => {
  const { target, values } = setup();
  const owner = {};
  let first = true;
  const subscription = values.entries.subscribe(() => {
    if (!first) return;
    first = false;
    applyStyleInputBinding(target, owner, {});
  });
  applyStyleInputBinding(target, owner, { padding: 2 });
  expect(values.get("padding")).toBeUndefined();
  subscription.unsubscribe();
});

test("writes triggered while attaching a controller are applied instead of lost", () => {
  const target = document.createElement("div");
  const owner = {};
  const values = createValues();
  applyStyleInputBinding(target, owner, { padding: 2 });
  let first = true;
  attachStyleInputTarget(target, (inputs, previous) => {
    values.apply(inputs, previous as readonly Key[]);
    if (first) {
      first = false;
      applyStyleInputBinding(target, owner, { padding: 4 });
    }
  });
  expect(values.get("padding")).toBe(4);
});

test("grouped updates keep supplied order, remove missing owned keys and preserve unrelated inputs", () => {
  const { target, values } = setup();
  const owner = {};
  values.set("backgroundColor", "red");
  const authored = { paddingInline: 2, padding: 4 };
  applyStyleInputBinding(target, owner, authored);
  expect(values.entries.get()).toEqual([
    ["backgroundColor", "red"],
    ["paddingInline", 2],
    ["padding", 4],
  ]);
  values.set("padding", 8);
  applyStyleInputBinding(target, owner, authored);
  expect(values.get("padding")).toBe(4);
  applyStyleInputBinding(target, owner, { padding: 6 });
  expect(values.entries.get()).toEqual([
    ["backgroundColor", "red"],
    ["padding", 6],
  ]);
  applyStyleInputBinding(target, owner, {});
  expect(values.entries.get()).toEqual([["backgroundColor", "red"]]);
});

test("an older or unrelated owner cannot clear a newer owner's inputs", () => {
  const { target, values } = setup();
  const first = {},
    second = {};
  applyStyleInputBinding(target, first, { padding: 2, backgroundColor: "red" });
  applyStyleInputBinding(target, second, { padding: 4 });
  applyStyleInputBinding(target, first, {});
  expect(values.entries.get()).toEqual([["padding", 4]]);
  applyStyleInputBinding(target, {}, {});
  expect(values.get("padding")).toBe(4);
  applyStyleInputBinding(target, second, {});
  expect(values.entries.get()).toEqual([]);
});

test("failed grouped validation rolls back ownership without committing earlier values or removals", () => {
  const { target, values } = setup();
  const first = {},
    failed = {};
  applyStyleInputBinding(target, first, { padding: 2, paddingInline: 4 });
  const before = values.entries.get();
  expect(() => applyStyleInputBinding(target, failed, { backgroundColor: "red", padding: -1 })).toThrow("Invalid padding");
  expect(values.entries.get()).toBe(before);
  applyStyleInputBinding(target, failed, {});
  expect(values.entries.get()).toBe(before);
  applyStyleInputBinding(target, first, {});
  expect(values.entries.get()).toEqual([]);
});

test("pending clearing remains explicit and survives attachment validation failure", () => {
  const target = document.createElement("div");
  const owner = {};
  const values = createValues();
  values.set("padding", 8);
  values.set("backgroundColor", "blue");
  applyStyleInputBinding(target, owner, { padding: 2 });
  applyStyleInputBinding(target, owner, {});
  expect(() =>
    attachStyleInputTarget(target, () => {
      throw new TypeError("Attach validation failed");
    }),
  ).toThrow("Attach validation failed");
  attachStyleInputTarget(target, (inputs, previous) => {
    values.apply(inputs, previous as readonly Key[]);
  });
  expect(values.entries.get()).toEqual([["backgroundColor", "blue"]]);
  applyStyleInputBinding(target, owner, { padding: 4 });
  expect(values.get("padding")).toBe(4);
});

test("pending owners keep their latest order and an empty unrelated owner has no inherited claim", () => {
  const target = document.createElement("div");
  const first = {},
    second = {};
  const values = createValues();
  applyStyleInputBinding(target, first, { padding: 2 });
  applyStyleInputBinding(target, second, { paddingInline: 4 });
  applyStyleInputBinding(target, first, { padding: 6 });
  applyStyleInputBinding(target, {}, {});
  attachStyleInputTarget(target, (inputs, previous) => {
    values.apply(inputs, previous as readonly Key[]);
  });
  expect(values.entries.get()).toEqual([
    ["paddingInline", 4],
    ["padding", 6],
  ]);
});

test("pending responsive values are snapshots, not retained caller objects", () => {
  const target = document.createElement("div");
  const owner = {};
  const responsive = { compact: 2, medium: 4 };
  applyStyleInputBinding(target, owner, { padding: responsive });
  responsive.medium = 8;
  let pending: unknown;
  attachStyleInputTarget(target, (inputs) => {
    pending = inputs.padding;
  });
  expect(pending).toEqual({ compact: 2, medium: 4 });
  expect(Object.isFrozen(pending)).toBe(true);
});

test("malformed helper data never invokes accessors or changes existing ownership", () => {
  const { target, values } = setup();
  const owner = {};
  applyStyleInputBinding(target, owner, { padding: 2 });
  let reads = 0;
  const accessor = Object.defineProperty({}, "padding", { enumerable: true, get: () => ++reads });
  expect(() => applyStyleInputBinding(target, owner, accessor)).toThrow("enumerable data properties");
  expect(() => applyStyleInputBinding(target, owner, { mystery: 1 } as StyleInputs)).toThrow("Unknown style input");
  expect(reads).toBe(0);
  applyStyleInputBinding(target, owner, {});
  expect(values.get("padding")).toBeUndefined();
});

test("newer reentrant ownership survives an older invocation and its later clearing", () => {
  const { target, values } = setup();
  const first = {},
    second = {};
  let reenter = true;
  const subscription = values.entries.subscribe(() => {
    if (!reenter) return;
    reenter = false;
    applyStyleInputBinding(target, second, { padding: 4 });
  });
  applyStyleInputBinding(target, first, { padding: 2, backgroundColor: "red" });
  applyStyleInputBinding(target, first, {});
  expect(values.entries.get()).toEqual([["padding", 4]]);
  subscription.unsubscribe();
});
