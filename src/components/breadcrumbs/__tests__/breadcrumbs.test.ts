import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeBreadcrumb } from "../../breadcrumb/breadcrumb";
import type { AcmeBreadcrumbs } from "../breadcrumbs";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeBreadcrumbs;
  await el.updateComplete;
  const crumbs = [...el.querySelectorAll("acme-breadcrumb")] as AcmeBreadcrumb[];
  for (const c of crumbs) await c.updateComplete;
  // The list hands its type to the crumbs on its first update; the crumbs re-render after it.
  await new Promise((r) => setTimeout(r, 0));
  for (const c of crumbs) await c.updateComplete;
  return { el, crumbs };
};
const root = (c: AcmeBreadcrumb) => c.shadowRoot!.querySelector(".item") as HTMLElement;

describe("acme-breadcrumbs", () => {
  test("the text type is a labelled nav around a list; each crumb is a list item with a chevron", async () => {
    const { el, crumbs } = await mount(
      `<acme-breadcrumbs><acme-breadcrumb>Home</acme-breadcrumb><acme-breadcrumb active>Dashboard</acme-breadcrumb><acme-breadcrumb disabled>Overview</acme-breadcrumb></acme-breadcrumbs>`,
    );
    const nav = el.shadowRoot!.querySelector("nav")!;
    expect(nav.getAttribute("aria-label")).toBe("Breadcrumb");
    expect(nav.querySelector("ol.list")).not.toBeNull();
    expect(el.shadowRoot!.querySelector(".list.menu")).toBeNull();
    expect(crumbs.map((c) => c.menu)).toEqual([false, false, false]);
    const [home, dash, over] = crumbs.map(root);
    expect(home.tagName).toBe("LI");
    expect(home.className.trim()).toBe("item");
    expect(home.querySelector("svg")).not.toBeNull();
    expect(home.querySelector("slot:not([name])")).not.toBeNull();
    expect(home.hasAttribute("aria-current")).toBe(false);
    expect(dash.className.trim()).toBe("item active");
    expect(dash.getAttribute("aria-current")).toBe("true");
    expect(over.className.trim()).toBe("item disabled");
  });

  test("the menu type is a row of chips: a span around a div around a button, disabled when the crumb is", async () => {
    const { el, crumbs } = await mount(
      `<acme-breadcrumbs type="menu"><acme-breadcrumb>Home</acme-breadcrumb><acme-breadcrumb active>Dashboard</acme-breadcrumb><acme-breadcrumb disabled>Overview</acme-breadcrumb></acme-breadcrumbs>`,
    );
    expect(el.shadowRoot!.querySelector("nav")).toBeNull();
    expect(el.shadowRoot!.querySelector("div.list.menu")).not.toBeNull();
    expect(crumbs.every((c) => c.menu && c.hasAttribute("menu"))).toBe(true);
    const [home, dash, over] = crumbs.map(root);
    expect(home.tagName).toBe("SPAN");
    expect(home.className.trim()).toBe("item menu");
    const chip = home.querySelector(":scope > div > button.chip") as HTMLButtonElement;
    expect(chip).not.toBeNull();
    expect(chip.disabled).toBe(false);
    expect(home.querySelector("svg")).toBeNull();
    expect(dash.className.trim()).toBe("item menu active");
    expect(dash.hasAttribute("aria-current")).toBe(false);
    expect((over.querySelector("button.chip") as HTMLButtonElement).disabled).toBe(true);
    // The chip's text fits, so no tooltip wraps it.
    expect(home.querySelector("acme-tooltip")).toBeNull();
  });

  test("href renders a link: an anchor around the text in a list, the chip itself in a menu", async () => {
    const { crumbs } = await mount(`<acme-breadcrumbs><acme-breadcrumb href="/" target="_blank" rel="noopener">Home</acme-breadcrumb><acme-breadcrumb>Overview</acme-breadcrumb></acme-breadcrumbs>`);
    const a = root(crumbs[0]).querySelector("a.link") as HTMLAnchorElement;
    expect(a).not.toBeNull();
    expect(a.getAttribute("href")).toBe("/");
    expect(a.getAttribute("target")).toBe("_blank");
    expect(a.getAttribute("rel")).toBe("noopener");
    expect(a.querySelector("slot")).not.toBeNull();
    expect(root(crumbs[1]).querySelector("a")).toBeNull();
    const menu = await mount(`<acme-breadcrumbs type="menu"><acme-breadcrumb href="/">Home</acme-breadcrumb></acme-breadcrumbs>`);
    const chip = root(menu.crumbs[0]).querySelector("a.chip") as HTMLAnchorElement;
    expect(chip).not.toBeNull();
    expect(chip.getAttribute("href")).toBe("/");
    expect(root(menu.crumbs[0]).querySelector("button")).toBeNull();
  });

  test("changing the type re-renders the list and the crumbs", async () => {
    const { el, crumbs } = await mount(`<acme-breadcrumbs><acme-breadcrumb>Home</acme-breadcrumb></acme-breadcrumbs>`);
    el.type = "menu";
    await el.updateComplete;
    await crumbs[0].updateComplete;
    expect(el.shadowRoot!.querySelector("div.list.menu")).not.toBeNull();
    expect(root(crumbs[0]).tagName).toBe("SPAN");
    expect(root(crumbs[0]).querySelector("button.chip")).not.toBeNull();
  });

  test("hover lands on the list item, the chip's focus and hover on the chip", async () => {
    const { crumbs } = await mount(`<acme-breadcrumbs><acme-breadcrumb disabled>Home</acme-breadcrumb></acme-breadcrumbs>`);
    const li = root(crumbs[0]);
    li.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" }));
    expect(li.getAttribute("data-hover")).toBe("true");
    li.dispatchEvent(new PointerEvent("pointerleave", { pointerType: "mouse" }));
    expect(li.hasAttribute("data-hover")).toBe(false);
    const menu = await mount(`<acme-breadcrumbs type="menu"><acme-breadcrumb>Home</acme-breadcrumb></acme-breadcrumbs>`);
    const chip = root(menu.crumbs[0]).querySelector("button.chip") as HTMLElement;
    chip.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" }));
    expect(chip.getAttribute("data-hover")).toBe("true");
    expect(root(menu.crumbs[0]).hasAttribute("data-hover")).toBe(false);
  });
});
