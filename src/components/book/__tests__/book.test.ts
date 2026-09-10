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

  test("the gesture is one store with one action, and the frames derive from it", async () => {
    const el = await mount(`<acme-book title="A"></acme-book>`);
    // The pointer bindings sit on the ROOT, beside Interaction's, so `caught()` reads the box
    // before data-hover flips the CSS to the far state.
    const w = root(el);
    const probe = el as unknown as {
      gesture: { get: () => { hovered: boolean; from?: string } };
      frames: { get: () => { transform: string }[] };
    };
    // `Interaction` sets data-hover on the root for the generated rules and the census, but with
    // setAttribute and no update. The directive runs only in Lit's update cycle, so the cover keeps
    // the gesture in a store of its own and the pointer handlers sit on the wrap.
    const before = el.shadowRoot!.innerHTML;
    expect(probe.gesture.get().hovered).toBe(false);
    expect(probe.frames.get()[1].transform).toContain("rotateY(0deg)");

    w.dispatchEvent(new PointerEvent("pointerenter", { bubbles: true, pointerType: "mouse" }));
    await el.updateComplete;
    expect(probe.gesture.get().hovered).toBe(true);
    // The derived frames follow the store: the cover now travels TO the lifted state.
    expect(probe.frames.get()[1].transform).toContain("var(--hover-rotate)");

    w.dispatchEvent(new PointerEvent("pointerleave", { bubbles: true, pointerType: "mouse" }));
    await el.updateComplete;
    expect(probe.gesture.get().hovered).toBe(false);
    expect(probe.frames.get()[1].transform).toContain("rotateY(0deg)");
    // The markup is unchanged: the hover animates, it does not re-template.
    expect(el.shadowRoot!.innerHTML).toBe(before);
  });

  test("a repeat of the current direction changes nothing", async () => {
    const el = await mount(`<acme-book title="A"></acme-book>`);
    const w = root(el);
    const probe = el as unknown as { gesture: { get: () => { hovered: boolean; from?: string } } };
    const before = probe.gesture.get();
    // The action returns the same object when the direction has not changed, so the compare drops
    // it: no recapture of the caught matrix, no dirty frames, no update.
    w.dispatchEvent(new PointerEvent("pointerleave", { bubbles: true, pointerType: "mouse" }));
    await el.updateComplete;
    expect(probe.gesture.get()).toBe(before);
    w.dispatchEvent(new PointerEvent("pointerenter", { bubbles: true, pointerType: "mouse" }));
    await el.updateComplete;
    expect(probe.gesture.get()).not.toBe(before);
  });

  test("the caught matrix is read before Interaction flips data-hover", async () => {
    const el = await mount(`<acme-book title="A"></acme-book>`);
    const b = root(el);
    const probe = el as unknown as { gesture: { get: () => { hovered: boolean; from?: string } } };
    // The generated rule puts the FULL hover transform on data-hover with no transition, so a
    // `caught()` that ran after the attribute would read the far state and the cover would snap
    // there instead of travelling. Both bindings are on the root; ours registers at first render,
    // Interaction's in `updated`, so ours runs first.
    const order: string[] = [];
    const observer = new MutationObserver(() => order.push("data-hover"));
    observer.observe(b, { attributes: true, attributeFilter: ["data-hover"] });
    b.addEventListener("pointerenter", () => order.push("read"), { once: true, capture: true });
    b.dispatchEvent(new PointerEvent("pointerenter", { bubbles: true, pointerType: "mouse" }));
    await el.updateComplete;
    observer.disconnect();
    expect(b.hasAttribute("data-hover")).toBe(true);
    // The gesture turned, and its captured matrix is not the hover state.
    expect(probe.gesture.get().hovered).toBe(true);
    expect(probe.gesture.get().from ?? "").not.toContain("matrix3d");
  });

  test("a turn cancels the motion in flight, so the reversal does not overshoot", async () => {
    const el = await mount(`<acme-book title="A"></acme-book>`);
    const w = root(el);
    const cancelled: string[] = [];
    // happy-dom runs no animations, so the cancel path is proven by what the turn asks for.
    (el as unknown as { motion: { cancel: () => void } }).motion.cancel = () => cancelled.push("cancel");
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
