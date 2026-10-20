import { expect, test } from "bun:test";
import { configureMessages, message } from "../messages";

test("message catalogs own string data and fall back through locale ancestry", () => {
  const source = { greeting: "Bonjour" };
  configureMessages("fr", source);
  source.greeting = "changed";
  expect(message("fr-CA-u-nu-latn", "greeting", "Hello")).toBe("Bonjour");
  expect(message("fr", "toString", "fallback")).toBe("fallback");
  configureMessages("fr-CA", { greeting: "Salut" });
  expect(message("fr-CA", "greeting", "Hello")).toBe("Salut");
  configureMessages("fr-CA", {});
  expect(message("fr-CA", "greeting", "Hello")).toBe("Bonjour");
});

test("invalid message records never invoke getters or change the catalog", () => {
  let reads = 0;
  configureMessages("de", { greeting: "Hallo" });
  expect(() =>
    configureMessages("de", {
      get greeting() {
        reads++;
        return "bad";
      },
    }),
  ).toThrow();
  expect(reads).toBe(0);
  expect(message("de", "greeting", "Hello")).toBe("Hallo");
  expect(() => configureMessages("invalid_locale", {})).toThrow();
});
