import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeEntityContent } from "../entity-content";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeEntityContent;
  await el.updateComplete;
  return el;
};
const content = (el: AcmeEntityContent) => el.shadowRoot!.querySelector(".content") as HTMLElement;

describe("acme-entity-content", () => {
  test("title and description are lines in the text column; fill reflects and marks the root", async () => {
    const el = await mount(`<acme-entity-content fill title="Evil Rabbit" description="Glenn Hitchcock (@gln)"></acme-entity-content>`);
    const c = content(el);
    expect(c.className.trim()).toBe("content fill");
    expect(el.hasAttribute("fill")).toBe(true);
    expect(c.querySelector(".text > .title")?.textContent).toBe("Evil Rabbit");
    expect(c.querySelector(".text > .description")?.textContent).toBe("Glenn Hitchcock (@gln)");
    expect(c.querySelector("slot[name=avatar]")).not.toBeNull();
    // The title is not a host attribute (the browser's own tooltip); the property keeps it.
    expect(el.hasAttribute("title")).toBe(false);
    expect(el.title).toBe("Evil Rabbit");
  });

  test("a description alone renders no title line; nothing renders no text column; width writes the variable", async () => {
    const el = await mount(`<acme-entity-content description="This is a simple description" width="200px"></acme-entity-content>`);
    const c = content(el);
    expect(c.className.trim()).toBe("content");
    expect(c.querySelector(".title")).toBeNull();
    expect(c.querySelector(".text > .description")).not.toBeNull();
    expect(c.getAttribute("style")).toContain("--width:200px");
    const empty = await mount(`<acme-entity-content></acme-entity-content>`);
    expect(content(empty).querySelector(".text")).toBeNull();
  });

  test("a slotted title stands in for the attribute", async () => {
    const el = await mount(`<acme-entity-content><b slot="title">Rich</b></acme-entity-content>`);
    const c = content(el);
    expect(c.querySelector(".text > slot[name=title]")).not.toBeNull();
    expect(c.querySelector(".title")).toBeNull();
  });
});
