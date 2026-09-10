import { describe, expect, test } from "bun:test";
import "../../../index";
import { type AcmeBook, textureFlipped, widthVars } from "../book";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeBook;
  await el.updateComplete;
  return el;
};
const root = (el: AcmeBook) => el.shadowRoot!.querySelector(".book") as HTMLElement;
const wrap = (el: AcmeBook) => el.shadowRoot!.querySelector(".wrap") as HTMLElement;

describe("acme-book", () => {
  test("a stripe cover by default: amber band, the title, the default mark, the pages and the back", async () => {
    const el = await mount(`<acme-book title="The user experience of the Frontend Cloud"></acme-book>`);
    const b = root(el);
    expect(b.className.trim()).toBe("book stripe color");
    expect(b.getAttribute("style")).toBe("--book-width:196");
    expect(wrap(el).getAttribute("style")).toBe("--book-color:var(--ds-amber-600)");
    expect(b.querySelector(".cover > .band[aria-hidden] > .illustration slot[name=illustration]")).not.toBeNull();
    expect(b.querySelector(".cover > .band > .bind")).not.toBeNull();
    expect(b.querySelector(".cover > .body > .bind[aria-hidden]")).not.toBeNull();
    expect(b.querySelector(".body > .content > .title")?.textContent).toBe("The user experience of the Frontend Cloud");
    expect(b.querySelector(".content > slot[name=icon] + svg")).not.toBeNull();
    expect(b.querySelector(".wrap > .pages[aria-hidden]")).not.toBeNull();
    expect(b.querySelector(".wrap > .back[aria-hidden]")).not.toBeNull();
    expect(b.querySelector(".texture")).toBeNull();
  });

  test("the title attribute is read and removed, so no tooltip shows", async () => {
    const el = await mount(`<acme-book title="Design Engineering"></acme-book>`);
    expect(el.hasAttribute("title")).toBe(false);
    expect(el.title).toBe("Design Engineering");
    el.title = "Changed";
    await el.updateComplete;
    expect(root(el).querySelector(".title")?.textContent).toBe("Changed");
    expect(el.hasAttribute("title")).toBe(false);
  });

  test("simple: no band, no color by default, the default illustration below the title", async () => {
    const el = await mount(`<acme-book title="T" variant="simple"></acme-book>`);
    const b = root(el);
    expect(b.className.trim()).toBe("book simple");
    expect(wrap(el).hasAttribute("style")).toBe(false);
    expect(b.querySelector(".band")).toBeNull();
    expect(b.querySelector(".content > .title + .illustration > slot[name=illustration] > svg")).not.toBeNull();
    expect(b.querySelector(".content > slot[name=icon]")).toBeNull();
  });

  test("color and text-color become the wrapper's variables; a simple cover with a color is .color", async () => {
    const el = await mount(`<acme-book title="T" variant="simple" color="#7DC1C1" text-color="white"></acme-book>`);
    expect(root(el).className.trim()).toBe("book simple color");
    expect(wrap(el).getAttribute("style")).toBe("--book-color:#7DC1C1;--book-text-color:white");
  });

  test("width: a number, or a per-breakpoint object", async () => {
    const el = await mount(`<acme-book title="T" width="300"></acme-book>`);
    expect(root(el).getAttribute("style")).toBe("--book-width:300");
    const r = await mount(`<acme-book title="T" width='{"sm":150,"md":196}'></acme-book>`);
    expect(root(r).getAttribute("style")).toBe("--sm-book-width:150;--md-book-width:196");
    expect(widthVars({ xs: 100, sm: 100, smd: 100, md: 200, lg: 200 })).toEqual(["--sm-book-width:100", "--smd-book-width:100", "--md-book-width:200"]);
  });

  test("textured: the grain over the cover, turned by the title's hash; the pages take the ribbed edge through the root class", async () => {
    const el = await mount(`<acme-book title="Design Engineering at Vercel" textured></acme-book>`);
    const b = root(el);
    expect(b.className).toContain("textured");
    expect(textureFlipped("Design Engineering at Vercel")).toBe(true);
    expect(b.querySelector(".cover > .texture[aria-hidden]")?.getAttribute("style")).toBe("transform:rotate(180deg)");
    const even = await mount(`<acme-book title="${"x".repeat(2)}" textured></acme-book>`);
    expect(textureFlipped("xx")).toBe((((120 << 5) - 120 + 120) & 1) === 1);
    expect(root(even).querySelector(".texture")?.getAttribute("style")).toBe(`transform:rotate(${textureFlipped("xx") ? 180 : 0}deg)`);
  });

  test("a slotted icon replaces the default mark", async () => {
    const el = await mount(`<acme-book title="T"><svg slot="icon" width="16" height="16"></svg></acme-book>`);
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(root(el).querySelector(".content > slot[name=icon] + svg")).toBeNull();
  });

  test("the cover's hover is reactive state as well as an attribute, so the animate directive fires", async () => {
    const el = await mount(`<acme-book title="A"></acme-book>`);
    const w = wrap(el);
    // `Interaction` sets data-hover on the root for the generated rules and the census, but with
    // setAttribute and no update. The directive runs only in Lit's update cycle, so the cover
    // carries its own reactive `hovered` and the pointer handlers sit on the wrap.
    const before = el.shadowRoot!.innerHTML;
    w.dispatchEvent(new PointerEvent("pointerenter", { bubbles: true, pointerType: "mouse" }));
    await el.updateComplete;
    expect((el as unknown as { hovered: boolean }).hovered).toBe(true);
    w.dispatchEvent(new PointerEvent("pointerleave", { bubbles: true, pointerType: "mouse" }));
    await el.updateComplete;
    expect((el as unknown as { hovered: boolean }).hovered).toBe(false);
    // The markup is unchanged: the hover animates, it does not re-template.
    expect(el.shadowRoot!.innerHTML).toBe(before);
  });

  test("a turn mid-flight cancels the animation in progress, so the reversal does not overshoot", async () => {
    const el = await mount(`<acme-book title="A"></acme-book>`);
    const w = wrap(el);
    const cancelled: string[] = [];
    // happy-dom runs no animations, so the cancel path is proven by what the turn asks for.
    (w as unknown as { getAnimations: () => Animation[] }).getAnimations = () =>
      [{ cancel: () => cancelled.push("cancel") }] as unknown as Animation[];
    w.dispatchEvent(new PointerEvent("pointerenter", { bubbles: true, pointerType: "mouse" }));
    await el.updateComplete;
    w.dispatchEvent(new PointerEvent("pointerleave", { bubbles: true, pointerType: "mouse" }));
    await el.updateComplete;
    expect(cancelled.length).toBe(2);
  });

  test("hover lands on the perspective root as data-hover, for mouse pointers only", async () => {
    const el = await mount(`<acme-book title="T"></acme-book>`);
    const b = root(el);
    b.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" }));
    expect(b.getAttribute("data-hover")).toBe("true");
    b.dispatchEvent(new PointerEvent("pointerleave", { pointerType: "mouse" }));
    expect(b.hasAttribute("data-hover")).toBe(false);
    b.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "touch" }));
    expect(b.hasAttribute("data-hover")).toBe(false);
  });
});
