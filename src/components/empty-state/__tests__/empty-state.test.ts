import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeIconTile } from "../../icon-tile/icon-tile";
import type { AcmeEmptyState } from "../empty-state";

const mount = async <T extends HTMLElement & { updateComplete: Promise<unknown> }>(markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as T;
  await el.updateComplete;
  return el;
};
const root = (el: AcmeEmptyState) => el.shadowRoot!.querySelector(".empty-state") as HTMLElement;

describe("acme-empty-state", () => {
  test("renders the title and the description in the text column, no icon wrapper without an icon", async () => {
    const el = await mount<AcmeEmptyState>(`<acme-empty-state title="Title" description="A message."></acme-empty-state>`);
    const r = root(el);
    expect(r.className.trim()).toBe("empty-state");
    expect(r.querySelector(".text .title")?.textContent?.trim()).toBe("Title");
    expect(r.querySelector(".text .description")?.textContent?.trim()).toBe("A message.");
    expect(r.querySelector(".icon")).toBeNull();
    expect(r.querySelector("slot:not([name])")).not.toBeNull();
  });

  test("a slotted icon renders inside the icon wrapper", async () => {
    const el = await mount<AcmeEmptyState>(`<acme-empty-state title="Title"><acme-icon-tile slot="icon"><svg></svg></acme-icon-tile></acme-empty-state>`);
    expect(root(el).querySelector(".icon slot[name=icon]")).not.toBeNull();
  });

  test("the children are slotted straight into the column, with no row of their own", async () => {
    const el = await mount<AcmeEmptyState>(
      `<acme-empty-state title="Title" description="d"><acme-button variant="secondary">Primary Action</acme-button><a href="/">Learn more</a></acme-empty-state>`,
    );
    const r = root(el);
    expect(r.querySelector(".actions")).toBeNull();
    const slot = r.querySelector(":scope > slot:not([name])") as HTMLSlotElement;
    expect(slot.assignedElements().map((e) => e.tagName.toLowerCase())).toEqual(["acme-button", "a"]);
  });

  test("an empty title and description render no line; the title and description slots render one", async () => {
    const bare = await mount<AcmeEmptyState>(`<acme-empty-state></acme-empty-state>`);
    expect(root(bare).querySelector(".title")).toBeNull();
    expect(root(bare).querySelector(".description")).toBeNull();
    expect(root(bare).querySelector(".text")).not.toBeNull();
    const rich = await mount<AcmeEmptyState>(`<acme-empty-state><b slot="title">Rich</b><span slot="description">Text</span></acme-empty-state>`);
    expect(root(rich).querySelector(".title slot[name=title]")).not.toBeNull();
    expect(root(rich).querySelector(".description slot[name=description]")).not.toBeNull();
  });

  test("border=false and secondary map to the modifier classes", async () => {
    const el = await mount<AcmeEmptyState>(`<acme-empty-state title="T" border="false" secondary></acme-empty-state>`);
    expect(root(el).className.trim()).toBe("empty-state no-border secondary");
    expect(el.border).toBe(false);
    const on = await mount<AcmeEmptyState>(`<acme-empty-state title="T" border></acme-empty-state>`);
    expect(on.border).toBe(true);
    expect(root(on).className.trim()).toBe("empty-state");
  });
});

describe("acme-icon-tile", () => {
  const tile = (el: AcmeIconTile) => el.shadowRoot!.querySelector(".tile") as HTMLElement;

  test("renders the tile, hidden from assistive technology, around the slotted icon", async () => {
    const el = await mount<AcmeIconTile>(`<acme-icon-tile><svg></svg></acme-icon-tile>`);
    const t = tile(el);
    expect(t.getAttribute("aria-hidden")).toBe("true");
    expect(t.hasAttribute("style")).toBe(false);
    expect(t.querySelector("slot")).not.toBeNull();
  });

  test("size fixes the width and the height: a number in pixels, a length as given", async () => {
    const px = await mount<AcmeIconTile>(`<acme-icon-tile size="54"><svg></svg></acme-icon-tile>`);
    expect(tile(px).getAttribute("style")).toBe("width:54px;height:54px");
    const rem = await mount<AcmeIconTile>(`<acme-icon-tile size="3rem"><svg></svg></acme-icon-tile>`);
    expect(tile(rem).getAttribute("style")).toBe("width:3rem;height:3rem");
  });
});
