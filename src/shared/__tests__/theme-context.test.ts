import { expect, test } from "bun:test";
import { html, LitElement } from "lit";
import { bindThemeContext, ThemeContextController } from "../theme-context";

class ThemeConsumer extends LitElement {
  theme = new ThemeContextController(this);
  render() {
    return html`<slot></slot>`;
  }
}
class ThemeProvider extends ThemeConsumer {
  constructor() {
    super();
    this.theme.provide();
  }
}
customElements.define("theme-context-consumer-test", ThemeConsumer);
customElements.define("theme-context-provider-test", ThemeProvider);
const consumer = () => document.createElement("theme-context-consumer-test") as ThemeConsumer;
const provider = () => document.createElement("theme-context-provider-test") as ThemeProvider;
const settle = async () => {
  for (let index = 0; index < 8; index++) await Promise.resolve();
};

test("nearest providers carry live TanStack state without replacing the provided source", async () => {
  const outer = provider(),
    inner = provider(),
    child = consumer();
  outer.theme.scope.setAuthored({ appearance: "dark", density: "compact" });
  inner.theme.scope.setAuthored({ density: "normal" });
  inner.append(child);
  outer.append(inner);
  document.body.append(outer);
  await settle();
  expect(child.theme.parentSource.get()).toBe(inner.theme.scope.effective);
  expect(child.theme.scope.effective.get().resolvedAppearance).toBe("dark");
  expect(child.theme.scope.effective.get().density).toBe("normal");
  outer.theme.scope.setAuthored({ appearance: "light" });
  expect(child.theme.scope.effective.get().resolvedAppearance).toBe("light");
  outer.remove();
});

test("moving outside a provider clears the previous source", async () => {
  const parent = provider(),
    child = consumer();
  parent.theme.scope.setAuthored({ theme: "brand" });
  parent.append(child);
  document.body.append(parent);
  await settle();
  expect(child.theme.scope.effective.get().theme).toBe("brand");
  document.body.append(child);
  await settle();
  expect(child.theme.parentSource.get()).toBeUndefined();
  expect(child.theme.scope.effective.get().theme).toBeUndefined();
  parent.remove();
  child.remove();
});

test("an existing host can start providing after consumers connect", async () => {
  const parent = consumer(),
    child = consumer();
  parent.append(child);
  document.body.append(parent);
  await settle();
  expect(child.theme.parentSource.get()).toBeUndefined();
  parent.theme.scope.setAuthored({ theme: "late" });
  parent.theme.provide();
  await settle();
  expect(child.theme.parentSource.get()).toBe(parent.theme.scope.effective);
  expect(child.theme.scope.effective.get().theme).toBe("late");
  parent.remove();
});

test("the same controller can provide and consume without selecting itself", async () => {
  const parent = provider(),
    nested = provider();
  parent.append(nested);
  document.body.append(parent);
  await settle();
  expect(nested.theme.parentSource.get()).toBe(parent.theme.scope.effective);
  expect(parent.theme.parentSource.get()).toBeUndefined();
  parent.remove();
});

test("native opener binding follows moves and stops discovery after release", async () => {
  const first = provider(),
    second = provider(),
    opener = document.createElement("button");
  first.theme.scope.setAuthored({ theme: "first" });
  second.theme.scope.setAuthored({ theme: "second" });
  first.append(opener);
  document.body.append(first, second);
  const binding = bindThemeContext(opener);
  expect(binding.scope.effective.get().theme).toBe("first");
  second.append(opener);
  await settle();
  expect(binding.scope.effective.get().theme).toBe("second");
  binding.release();
  binding.release();
  first.append(opener);
  await settle();
  expect(binding.parentSource.get()).toBeUndefined();
  const afterRelease = binding.scope.effective.get();
  second.theme.scope.setAuthored({ theme: "after-release" });
  expect(binding.scope.effective.get()).toBe(afterRelease);
  first.remove();
  second.remove();
});

test("consumer resource connection and release can repeat", async () => {
  const parent = provider(),
    child = consumer();
  parent.append(child);
  document.body.append(parent);
  await settle();
  for (const theme of ["one", "two", "three"]) {
    child.remove();
    parent.theme.scope.setAuthored({ theme });
    parent.append(child);
    await settle();
    expect(child.theme.scope.effective.get().theme).toBe(theme);
  }
  parent.remove();
});

test("opener detachment ends its binding and retains the final appearance for exit", async () => {
  const parent = provider(),
    opener = document.createElement("button");
  expect(() => bindThemeContext(opener)).toThrow("connected");
  parent.theme.scope.setAuthored({ theme: "closing", appearance: "dark" });
  parent.append(opener);
  document.body.append(parent);
  const binding = bindThemeContext(opener);
  opener.remove();
  await settle();
  expect(binding.parentSource.get()).toBeUndefined();
  expect(binding.scope.effective.get().theme).toBe("closing");
  parent.theme.scope.setAuthored({ theme: "new" });
  parent.append(opener);
  await settle();
  expect(binding.scope.effective.get().theme).toBe("closing");
  const reopened = bindThemeContext(opener);
  expect(reopened.scope.effective.get().theme).toBe("new");
  reopened.release();
  binding.release();
  parent.remove();
});

test("a supplied complete scope resets inherited names and can resume DOM inheritance", async () => {
  const parent = provider(),
    child = consumer(),
    source = consumer();
  parent.theme.scope.setAuthored({ theme: "brand", appearance: "dark", locale: "fr-CA" });
  parent.append(child);
  document.body.append(parent, source);
  await settle();
  child.theme.setSource(source.theme.scope.effective);
  await settle();
  expect(child.theme.scope.effective.get().theme).toBeUndefined();
  expect(child.theme.scope.effective.get().locale).toBeUndefined();
  expect(child.theme.parentSource.get()).toBeUndefined();
  parent.theme.scope.setAuthored({ theme: "different-brand" });
  parent.theme.refresh();
  await settle();
  expect(child.theme.scope.effective.get().theme).toBeUndefined();
  source.theme.scope.setAuthored({ locale: "de-DE" });
  expect(child.theme.scope.effective.get().locale).toBe("de-DE");
  child.theme.setSource(undefined);
  await settle();
  expect(child.theme.scope.effective.get().theme).toBe("different-brand");
  expect(child.theme.scope.effective.get().locale).toBe("fr-CA");
  parent.remove();
  source.remove();
});
