import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeEntity } from "../entity";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeEntity;
  await el.updateComplete;
  return el;
};
const root = (el: AcmeEntity) => el.shadowRoot!.querySelector(".entity") as HTMLElement;

describe("acme-entity", () => {
  test("renders a list item by default: the left column holds the left slot and the content, the right column the right slot", async () => {
    const el = await mount(`<acme-entity><span slot="left">L</span><acme-entity-content title="Evil Rabbit"></acme-entity-content><span slot="right">Connected</span></acme-entity>`);
    const li = root(el);
    expect(li.tagName).toBe("LI");
    expect(li.className.trim()).toBe("entity");
    expect(li.querySelector(".row > .left > slot[name=left] + slot:not([name])")).not.toBeNull();
    expect(li.querySelector(".row > .right > slot[name=right]")).not.toBeNull();
    expect(li.querySelector("slot[name=footer]")).not.toBeNull();
  });

  test("a column renders only with content in it", async () => {
    const el = await mount(`<acme-entity><acme-entity-content title="Only content"></acme-entity-content></acme-entity>`);
    const li = root(el);
    expect(li.querySelector(".left")).not.toBeNull();
    expect(li.querySelector(".right")).toBeNull();
    expect(li.querySelector(".row > slot[name=right]")).not.toBeNull();
  });

  test("as=button renders a clickable button row whose click reaches the host; as=div a plain block", async () => {
    const el = await mount(`<acme-entity as="button"><acme-checkbox slot="left" aria-label="Select"></acme-checkbox><acme-entity-content title="VS Code"></acme-entity-content></acme-entity>`);
    const b = root(el);
    expect(b.tagName).toBe("BUTTON");
    expect(b.className.trim()).toBe("entity clickable");
    let clicks = 0;
    el.addEventListener("click", () => clicks++);
    b.click();
    expect(clicks).toBe(1);
    el.as = "div";
    await el.updateComplete;
    expect(root(el).tagName).toBe("DIV");
    expect(root(el).className.trim()).toBe("entity");
  });

  test("hover and press land on the button row as attributes, never on a list item", async () => {
    const el = await mount(`<acme-entity as="button"><acme-entity-content title="Row"></acme-entity-content></acme-entity>`);
    const b = root(el);
    b.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" }));
    expect(b.getAttribute("data-hover")).toBe("true");
    b.dispatchEvent(new PointerEvent("pointerdown", { pointerType: "mouse", button: 0 }));
    expect(b.getAttribute("data-active")).toBe("true");
    b.dispatchEvent(new PointerEvent("pointerleave", { pointerType: "mouse" }));
    expect(b.hasAttribute("data-hover")).toBe(false);
    const li = await mount(`<acme-entity><acme-entity-content title="Row"></acme-entity-content></acme-entity>`);
    root(li).dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" }));
    expect(root(li).hasAttribute("data-hover")).toBe(false);
  });
});
