import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeProjectBanner } from "../project-banner";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeProjectBanner;
  await el.updateComplete;
  return el;
};
const root = (el: AcmeProjectBanner) => el.shadowRoot!.querySelector("aside") as HTMLElement;
const action = (el: AcmeProjectBanner) => root(el).querySelector(".action") as HTMLElement | null;

describe("acme-project-banner", () => {
  test("renders the aside, the column, the message with icon wrapper and label, and the action wrapper", async () => {
    const el = await mount(`<acme-project-banner cta-label="Disable" cta-href="/"><svg slot="icon"></svg>Attack Challenge Mode is enabled for this project</acme-project-banner>`);
    const aside = root(el);
    expect(aside.className.trim()).toBe("project-banner");
    expect(aside.querySelector(".inner > .message > .icon[aria-hidden='true'] > slot[name='icon']")).not.toBeNull();
    expect(aside.querySelector(".inner > .message > p.label > slot:not([name])")).not.toBeNull();
    expect(aside.querySelector(".inner > .cta > .action")).not.toBeNull();
  });

  test("gray is the default; cta-href renders a link with the blue ring", async () => {
    const el = await mount(`<acme-project-banner cta-label="Disable" cta-href="/">Attack Challenge Mode is enabled for this project</acme-project-banner>`);
    const a = action(el) as HTMLAnchorElement;
    expect(a.tagName).toBe("A");
    expect(a.textContent).toBe("Disable");
    expect(a.getAttribute("href")).toBe("/");
    const style = a.getAttribute("style") ?? "";
    expect(style).toContain("--banner-focus-color:var(--ds-blue-600)");
    expect(style).toContain("--acme-shadow:0 0 0 2px var(--ds-background-100), 0 0 0 4px var(--banner-focus-color) !important");
  });

  test("each variant maps to a class and colors the ring: success blue, warning amber, error red", async () => {
    const success = await mount(`<acme-project-banner variant="success" cta-label="Disable" cta-href="/">Enabled</acme-project-banner>`);
    expect(root(success).className.trim()).toBe("project-banner success");
    expect(action(success)!.getAttribute("style")).toContain("--banner-focus-color:var(--ds-blue-600)");
    const warning = await mount(`<acme-project-banner variant="warning" cta-label="Undo Rollback">Rolled back</acme-project-banner>`);
    expect(root(warning).className.trim()).toBe("project-banner warning");
    expect(action(warning)!.getAttribute("style")).toContain("--banner-focus-color:var(--ds-amber-700)");
    const error = await mount(`<acme-project-banner variant="error" cta-label="Add Credit Card" cta-href="/$">Payment failed</acme-project-banner>`);
    expect(root(error).className.trim()).toBe("project-banner error");
    expect(action(error)!.getAttribute("style")).toContain("--banner-focus-color:var(--ds-red-700)");
  });

  test("without a href the action is a button that dispatches acme-action", async () => {
    const el = await mount(`<acme-project-banner variant="warning" cta-label="Undo Rollback">This project was rolled back</acme-project-banner>`);
    const b = action(el) as HTMLButtonElement;
    expect(b.tagName).toBe("BUTTON");
    expect(b.getAttribute("type")).toBe("button");
    let fired = 0;
    el.addEventListener("acme-action", () => fired++);
    b.click();
    expect(fired).toBe(1);
  });

  test("without a call to action the wrapper stays and holds no action", async () => {
    const el = await mount(`<acme-project-banner>Routine notice</acme-project-banner>`);
    expect(root(el).querySelector(".cta")).not.toBeNull();
    expect(action(el)).toBeNull();
  });

  test("interaction states land as data attributes on the action", async () => {
    const el = await mount(`<acme-project-banner cta-label="Disable" cta-href="/">Enabled</acme-project-banner>`);
    const a = action(el)!;
    a.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" }));
    expect(a.getAttribute("data-hover")).toBe("true");
    a.dispatchEvent(new PointerEvent("pointerdown", { pointerType: "mouse", button: 0 }));
    expect(a.getAttribute("data-active")).toBe("true");
    a.dispatchEvent(new PointerEvent("pointerleave", { pointerType: "mouse" }));
    expect(a.hasAttribute("data-hover")).toBe(false);
    expect(a.hasAttribute("data-active")).toBe(false);
  });

  test("the action element follows a change of cta-href, and the states move with it", async () => {
    const el = await mount(`<acme-project-banner cta-label="Disable">Enabled</acme-project-banner>`);
    expect(action(el)!.tagName).toBe("BUTTON");
    el.ctaHref = "/settings";
    await el.updateComplete;
    const a = action(el)!;
    expect(a.tagName).toBe("A");
    a.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" }));
    expect(a.getAttribute("data-hover")).toBe("true");
  });
});
