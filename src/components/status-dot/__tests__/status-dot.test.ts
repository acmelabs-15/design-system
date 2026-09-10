import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeStatusDot } from "../status-dot";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeStatusDot;
  await el.updateComplete;
  return el;
};
const root = (el: AcmeStatusDot) => el.shadowRoot!.querySelector(".status-dot") as HTMLElement;

describe("acme-status-dot", () => {
  test("the default state is queued: a bare root, the dot child, the label and title", async () => {
    const el = await mount(`<acme-status-dot></acme-status-dot>`);
    const r = root(el);
    expect(r.className.trim()).toBe("status-dot");
    expect(r.getAttribute("aria-label")).toBe("Queued");
    expect(r.getAttribute("title")).toBe("This deployment is queued.");
    expect(r.querySelector(".dot")).not.toBeNull();
    expect(r.querySelector(".label")).toBeNull();
  });

  test("each state maps to its class, label and sentence", async () => {
    const cases: [string, string, string, string][] = [
      ["BUILDING", "building", "Building", "This deployment is building."],
      ["READY", "ready", "Ready", "This deployment is ready."],
      ["ERROR", "error", "Error", "This deployment had an error."],
      ["CANCELED", "canceled", "Canceled", "This deployment was canceled."],
      ["DELETED", "deleted", "Deleted", "This deployment was deleted."],
    ];
    for (const [state, cls, label, title] of cases) {
      const r = root(await mount(`<acme-status-dot state="${state}"></acme-status-dot>`));
      expect(r.className.trim()).toBe(`status-dot ${cls}`);
      expect(r.getAttribute("aria-label")).toBe(label);
      expect(r.getAttribute("title")).toBe(title);
    }
  });

  test("lower-case state values are accepted", async () => {
    const r = root(await mount(`<acme-status-dot state="ready"></acme-status-dot>`));
    expect(r.className.trim()).toBe("status-dot ready");
  });

  test("label renders the state name after the dot", async () => {
    const r = root(await mount(`<acme-status-dot state="BUILDING" label></acme-status-dot>`));
    const label = r.querySelector(".label") as HTMLElement;
    expect(label.textContent).toBe("Building");
    expect(label.previousElementSibling?.className).toBe("dot");
  });
});
