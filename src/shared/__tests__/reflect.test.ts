import { describe, expect, test } from "bun:test";
import "../../index";

/**
 * A reflected property whose default is not empty writes that default onto the host as an attribute
 * the consumer never set, unless the property declares `useDefault: true`. That is wrong twice: the
 * host's markup gains an attribute nobody asked for, and the parity census reads selectors against
 * the host, so a spurious attribute can change what a rule matches.
 */
describe("reflected properties do not spawn attributes the consumer never set", () => {
  const mount = async (markup: string) => {
    document.body.innerHTML = markup;
    const el = document.body.firstElementChild as HTMLElement & { updateComplete: Promise<unknown> };
    await el.updateComplete;
    return el;
  };

  test("a default value reflects nothing", async () => {
    expect((await mount(`<acme-sheet></acme-sheet>`)).hasAttribute("side")).toBe(false);
    expect((await mount(`<acme-entity></acme-entity>`)).hasAttribute("as")).toBe(false);
  });

  test("a value the consumer sets still reflects", async () => {
    expect((await mount(`<acme-sheet side="left"></acme-sheet>`)).getAttribute("side")).toBe("left");
    expect((await mount(`<acme-entity as="div"></acme-entity>`)).getAttribute("as")).toBe("div");
  });

  test("a value set through the property reflects too", async () => {
    const el = (await mount(`<acme-sheet></acme-sheet>`)) as HTMLElement & { side: string; updateComplete: Promise<unknown> };
    el.side = "top";
    await el.updateComplete;
    expect(el.getAttribute("side")).toBe("top");
  });
});
