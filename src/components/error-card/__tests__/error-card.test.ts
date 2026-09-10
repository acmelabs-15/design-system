import { afterEach, describe, expect, spyOn, test } from "bun:test";
import "../../../index";
import type { AcmeErrorCard } from "../error-card";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeErrorCard;
  await el.updateComplete;
  return el;
};
const root = (el: AcmeErrorCard) => el.shadowRoot!.querySelector(".card") as HTMLElement;

describe("acme-error-card", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("renders the card with the icon and the title in the head, and no retry control by default", async () => {
    const el = await mount(`<acme-error-card heading="No credits left"></acme-error-card>`);
    const r = root(el);
    expect(r.className.trim()).toBe("card");
    expect(r.getAttribute("part")).toBe("card");
    const head = r.querySelector(":scope > .head")!;
    expect(head).not.toBeNull();
    expect(head.querySelector(":scope > svg[width='16'][height='16']")).not.toBeNull();
    const title = head.querySelector(":scope > h3.title")!;
    expect(title.textContent).toBe("No credits left");
    expect(title.querySelector("slot:not([name])")).not.toBeNull();
    expect(r.querySelector(".retry")).toBeNull();
  });

  test("slotted content joins the title", async () => {
    const el = await mount(`<acme-error-card heading="Couldn't load "><strong>deployments</strong></acme-error-card>`);
    const slot = root(el).querySelector("h3.title slot") as HTMLSlotElement;
    expect(slot.assignedElements().map((n) => n.tagName)).toEqual(["STRONG"]);
  });

  test("retry renders the Retry control with its label and dispatches acme-retry on click", async () => {
    const el = await mount(`<acme-error-card heading="Couldn't load deployments" retry retry-label="Retry loading deployments"></acme-error-card>`);
    const b = root(el).querySelector(":scope > button.retry") as HTMLButtonElement;
    expect(b).not.toBeNull();
    expect(b.getAttribute("type")).toBe("button");
    expect(b.getAttribute("tabindex")).toBe("0");
    expect(b.getAttribute("aria-label")).toBe("Retry loading deployments");
    expect(b.getAttribute("part")).toBe("retry");
    expect(b.querySelector(":scope > .retry-label > .retry-text")!.textContent).toBe("Retry");
    let fired = 0;
    el.addEventListener("acme-retry", () => fired++);
    b.click();
    expect(fired).toBe(1);
    el.retry = false;
    await el.updateComplete;
    expect(root(el).querySelector(".retry")).toBeNull();
  });

  test("no retry-label leaves the control without an aria-label", async () => {
    const el = await mount(`<acme-error-card heading="x" retry></acme-error-card>`);
    expect(root(el).querySelector(".retry")!.hasAttribute("aria-label")).toBe(false);
  });

  test("interaction states land as data attributes on the Retry control", async () => {
    const el = await mount(`<acme-error-card heading="x" retry></acme-error-card>`);
    const b = root(el).querySelector(".retry")!;
    b.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" }));
    expect(b.getAttribute("data-hover")).toBe("true");
    b.dispatchEvent(new PointerEvent("pointerdown", { pointerType: "mouse", button: 0 }));
    expect(b.getAttribute("data-active")).toBe("true");
    b.dispatchEvent(new PointerEvent("pointerleave", { pointerType: "mouse" }));
    expect(b.hasAttribute("data-hover")).toBe(false);
    expect(b.hasAttribute("data-active")).toBe(false);
  });

  test("the error object is logged to the console, never rendered", async () => {
    const log = spyOn(console, "log").mockImplementation(() => {});
    try {
      const el = await mount(`<acme-error-card heading="No credits left" error='{"message":"Quota exceeded","digest":"abc123"}'></acme-error-card>`);
      expect(log.mock.calls).toEqual([["Error digest: abc123"], ["Error message: Quota exceeded"]]);
      expect(root(el).textContent).not.toContain("Quota exceeded");
      log.mockClear();
      el.error = { message: "Again" };
      await el.updateComplete;
      expect(log.mock.calls).toEqual([["Error message: Again"]]);
    } finally {
      log.mockRestore();
    }
  });
});
