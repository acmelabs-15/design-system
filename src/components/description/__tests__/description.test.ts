import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeDescription } from "../description";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeDescription;
  await el.updateComplete;
  return el;
};
const root = (el: AcmeDescription) => el.shadowRoot!.querySelector("dl.description") as HTMLElement;

describe("acme-description", () => {
  test("renders a dl with the key in dt.title and the value in dd.content; the host loses its title attribute", async () => {
    const el = await mount(`<acme-description title="Section Title" content="Data about this section."></acme-description>`);
    const dl = root(el);
    expect(dl.className.trim()).toBe("description");
    expect(dl.querySelector("dt.title")!.textContent).toBe("Section Title");
    expect(dl.querySelector("dd.content")!.textContent).toBe("Data about this section.");
    expect(dl.querySelector(".info")).toBeNull();
    expect(el.hasAttribute("title")).toBe(false);
    expect(el.title).toBe("Section Title");
  });

  test("tooltip renders the info wrapper as a tooltip with a focusable 14px icon after the key", async () => {
    const el = await mount(`<acme-description title="T" content="c" tooltip="Additional context."></acme-description>`);
    const info = root(el).querySelector("dt.title > .info > acme-tooltip.trigger") as HTMLElement;
    expect(info.getAttribute("text")).toBe("Additional context.");
    const icon = info.querySelector("svg") as SVGElement;
    expect(icon.getAttribute("tabindex")).toBe("0");
    expect(icon.getAttribute("role")).toBe("img");
    expect(icon.getAttribute("aria-label")).toBe("Additional context.");
    expect(icon.getAttribute("width")).toBe("14");
  });

  test("right and ellipsis map to modifier classes", async () => {
    const dl = root(await mount(`<acme-description title="T" content="c" right ellipsis></acme-description>`));
    expect(dl.classList.contains("right")).toBe(true);
    expect(dl.classList.contains("ellipsis")).toBe(true);
  });

  test("slotted content lands in the dd", async () => {
    const dl = root(await mount(`<acme-description title="T"><b>rich</b></acme-description>`));
    expect(dl.querySelector("dd.content > slot")).not.toBeNull();
  });
});
