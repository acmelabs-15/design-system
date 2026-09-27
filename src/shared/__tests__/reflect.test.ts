import { describe, expect, test } from "bun:test";
import { LitElement } from "lit";
import "../../all";

class ReflectionProbe extends LitElement {
  static properties = { as: { reflect: true, useDefault: true } };
  as = "li";
}
customElements.define("test-reflected-default", ReflectionProbe);

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
    expect((await mount(`<acme-app-bar></acme-app-bar>`)).hasAttribute("placement")).toBe(false);
    expect((await mount(`<test-reflected-default></test-reflected-default>`)).hasAttribute("as")).toBe(false);
  });

  test("a value the consumer sets still reflects", async () => {
    expect((await mount(`<acme-app-bar placement="sticky"></acme-app-bar>`)).getAttribute("placement")).toBe("sticky");
    expect((await mount(`<test-reflected-default as="div"></test-reflected-default>`)).getAttribute("as")).toBe("div");
  });

  test("a value set through the property reflects too", async () => {
    const el = (await mount(`<acme-app-bar></acme-app-bar>`)) as HTMLElement & { placement: string; updateComplete: Promise<unknown> };
    el.placement = "sticky";
    await el.updateComplete;
    expect(el.getAttribute("placement")).toBe("sticky");
    const probe = (await mount(`<test-reflected-default></test-reflected-default>`)) as ReflectionProbe;
    probe.as = "div";
    await probe.updateComplete;
    expect(probe.getAttribute("as")).toBe("div");
  });
});
