import { describe, expect, test } from "bun:test";
import "../../../index";
import { themeStore } from "../../../shared/state";
import type { AcmeThemeSwitcher } from "../theme-switcher";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeThemeSwitcher;
  await el.updateComplete;
  return el;
};
const options = (el: AcmeThemeSwitcher) => [...el.shadowRoot!.querySelectorAll(".option")] as HTMLElement[];
const radios = (el: AcmeThemeSwitcher) => [...el.shadowRoot!.querySelectorAll("input")] as HTMLInputElement[];

describe("acme-theme-switcher", () => {
  test("a fieldset with a hidden legend and three radios system, light, dark under round labels", async () => {
    themeStore.setState(() => "auto");
    const el = await mount(`<acme-theme-switcher></acme-theme-switcher>`);
    const root = el.shadowRoot!.querySelector("fieldset.switcher")!;
    expect(root.querySelector("legend.legend")!.textContent).toBe("Select a display theme:");
    expect(root.hasAttribute("data-small")).toBe(false);
    const rs = radios(el);
    expect(rs.map((r) => r.getAttribute("aria-label"))).toEqual(["system", "light", "dark"]);
    expect(rs.every((r) => r.type === "radio")).toBe(true);
    for (const r of rs) {
      const label = r.nextElementSibling as HTMLLabelElement;
      expect(label.classList.contains("control")).toBe(true);
      expect(label.getAttribute("for")).toBe(r.id);
      expect(label.querySelector(".sr")!.textContent).toBe(r.value);
      expect(label.querySelector(".icon svg")).not.toBeNull();
    }
    expect(rs[0].checked).toBe(true);
    expect(options(el)[0].hasAttribute("data-checked")).toBe(true);
    expect(options(el)[1].hasAttribute("data-checked")).toBe(false);
  });

  test("small marks the fieldset and the labels with data-small", async () => {
    const el = await mount(`<acme-theme-switcher small></acme-theme-switcher>`);
    expect(el.shadowRoot!.querySelector("fieldset")!.hasAttribute("data-small")).toBe(true);
    expect([...el.shadowRoot!.querySelectorAll("label")].every((l) => l.hasAttribute("data-small"))).toBe(true);
  });

  test("disabled disables every radio and marks every option", async () => {
    const el = await mount(`<acme-theme-switcher disabled></acme-theme-switcher>`);
    expect(radios(el).every((r) => r.disabled)).toBe(true);
    expect(options(el).every((o) => o.hasAttribute("data-disabled"))).toBe(true);
  });

  test("choosing a radio writes the theme store and data-theme on the root; the store drives the checked radio back", async () => {
    themeStore.setState(() => "auto");
    const el = await mount(`<acme-theme-switcher></acme-theme-switcher>`);
    let heard = "";
    el.addEventListener("acme-change", (e) => {
      heard = (e as CustomEvent).detail.theme;
    });
    const dark = radios(el)[2];
    dark.checked = true;
    dark.dispatchEvent(new Event("change"));
    await el.updateComplete;
    expect(themeStore.state).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(heard).toBe("dark");
    expect(options(el)[2].hasAttribute("data-checked")).toBe(true);
    themeStore.setState(() => "light");
    await el.updateComplete;
    expect(radios(el)[1].checked).toBe(true);
    expect(options(el)[1].hasAttribute("data-checked")).toBe(true);
    expect(options(el)[2].hasAttribute("data-checked")).toBe(false);
    themeStore.setState(() => "auto");
    await el.updateComplete;
    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
  });
});
