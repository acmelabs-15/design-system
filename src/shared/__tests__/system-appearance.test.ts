import { expect, test } from "bun:test";
import { acquireSystemAppearance } from "../system-appearance";

function documentWithMedia(dark = false) {
  const listeners = new Set<() => void>();
  let queries = 0;
  const media = {
    matches: dark,
    addEventListener(name: string, listener: () => void) {
      expect(name).toBe("change");
      listeners.add(listener);
    },
    removeEventListener(name: string, listener: () => void) {
      expect(name).toBe("change");
      listeners.delete(listener);
    },
  };
  const document = {
    defaultView: {
      matchMedia(query: string) {
        expect(query).toBe("(prefers-color-scheme: dark)");
        queries++;
        return media;
      },
    },
  } as unknown as Document;
  return {
    document,
    listeners,
    get queries() {
      return queries;
    },
    change(value: boolean) {
      media.matches = value;
      for (const listener of listeners) listener();
    },
  };
}

test("one document shares its media observation and exposes only readonly state", () => {
  const fixture = documentWithMedia(true);
  const first = acquireSystemAppearance(fixture.document);
  const second = acquireSystemAppearance(fixture.document);
  expect(fixture.queries).toBe(1);
  expect(fixture.listeners.size).toBe(1);
  expect(first.appearance).toBe(second.appearance);
  expect(first.appearance.get()).toBe("dark");
  expect("set" in first.appearance).toBe(false);
  first.release();
  expect(fixture.listeners.size).toBe(1);
  second.release();
  expect(fixture.listeners.size).toBe(0);
});

test("changes publish through the canonical source and disposal is idempotent", () => {
  const fixture = documentWithMedia();
  const binding = acquireSystemAppearance(fixture.document);
  const seen: string[] = [];
  const subscription = binding.appearance.subscribe((value) => seen.push(value));
  fixture.change(true);
  fixture.change(true);
  fixture.change(false);
  expect(seen).toEqual(["dark", "light"]);
  binding.release();
  binding.release();
  fixture.change(true);
  expect(fixture.listeners.size).toBe(0);
  expect(seen).toEqual(["dark", "light"]);
  subscription.unsubscribe();
});

test("reacquiring after the final release reads the current document preference", () => {
  const fixture = documentWithMedia();
  const old = acquireSystemAppearance(fixture.document);
  old.release();
  fixture.change(true);
  const current = acquireSystemAppearance(fixture.document);
  expect(current.appearance.get()).toBe("dark");
  expect(current.appearance).not.toBe(old.appearance);
  old.release();
  expect(fixture.listeners.size).toBe(1);
  expect(fixture.queries).toBe(2);
  current.release();
});

test("documents do not share preferences or listener lifetime", () => {
  const light = documentWithMedia(false);
  const dark = documentWithMedia(true);
  const a = acquireSystemAppearance(light.document);
  const b = acquireSystemAppearance(dark.document);
  expect(a.appearance.get()).toBe("light");
  expect(b.appearance.get()).toBe("dark");
  a.release();
  expect(dark.listeners.size).toBe(1);
  dark.change(false);
  expect(b.appearance.get()).toBe("light");
  b.release();
});

test("a document without a browsing context uses the light baseline without global access", () => {
  const document = { defaultView: null } as Document;
  const binding = acquireSystemAppearance(document);
  expect(binding.appearance.get()).toBe("light");
  binding.release();
});
