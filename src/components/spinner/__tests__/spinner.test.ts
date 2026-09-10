import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeSpinner } from "../spinner";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeSpinner;
  await el.updateComplete;
  return el;
};
const root = (el: AcmeSpinner) => el.shadowRoot!.querySelector(".spinner") as HTMLElement;

describe("acme-spinner", () => {
  test("default size renders ten blades, the status role and the hidden text", async () => {
    const el = await mount(`<acme-spinner></acme-spinner>`);
    const r = root(el);
    expect(r.className.trim()).toBe("spinner");
    expect(r.getAttribute("role")).toBe("status");
    expect(r.getAttribute("aria-label")).toBe("Loading");
    expect(r.querySelectorAll(".blade").length).toBe(10);
    expect(r.querySelector(".sr")?.textContent).toBe("Loading...");
    expect(el.dataset.glyph).toBe("circular");
  });

  test("blade count, cycle and delays follow the size", async () => {
    const cases: [string, string, number, number, number][] = [
      ["sm", "sm", 8, 1000, -875],
      ["lg", "lg", 12, 1200, -1100],
      ["2xl", "x2", 15, 1200, -1120],
      ["4xl", "x4", 18, 1300, -1228],
    ];
    for (const [size, cls, n, dur, first] of cases) {
      const r = root(await mount(`<acme-spinner size="${size}"></acme-spinner>`));
      expect(r.className.trim()).toBe(`spinner ${cls}`);
      const blades = r.querySelectorAll<HTMLElement>(".blade");
      expect(blades.length).toBe(n);
      const style = blades[0].getAttribute("style") ?? "";
      expect(style).toContain(`--animation-delay:${first}ms`);
      expect(style).toContain(`--animation-duration:${dur}ms`);
      expect(style).toContain("transform:rotate(0deg) translate(146%)");
      expect(blades[blades.length - 1].getAttribute("style")).toContain("--animation-delay:0ms");
      expect(blades[1].getAttribute("style")).toContain(`rotate(${360 / n}deg)`);
    }
  });

  test("color lands on the root as an inline colour", async () => {
    const r = root(await mount(`<acme-spinner color="var(--ds-red-700)"></acme-spinner>`));
    expect(r.getAttribute("style")).toBe("color:var(--ds-red-700)");
  });
});
