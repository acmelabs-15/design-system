import { expect, test } from "bun:test";
import { connectTheme, themeStore } from "../state";

test("theme document effects last until its final control disconnects", () => {
  const document = globalThis.document.implementation.createHTMLDocument("theme owner");
  const first = connectTheme(document);
  const second = connectTheme(document);
  try {
    themeStore.setState(() => "dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    first();
    first();
    themeStore.setState(() => "light");
    expect(document.documentElement.dataset.theme).toBe("light");
    second();
    themeStore.setState(() => "dark");
    expect(document.documentElement.dataset.theme).toBe("light");
  } finally {
    first();
    second();
    themeStore.setState(() => "auto");
  }
});
