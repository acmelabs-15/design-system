import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeGauge } from "../gauge";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeGauge;
  await el.updateComplete;
  return el;
};
const root = (el: AcmeGauge) => el.shadowRoot!.querySelector(".gauge") as HTMLElement;
const circles = (el: AcmeGauge) => ({ secondary: root(el).querySelector("circle.secondary") as SVGElement, primary: root(el).querySelector("circle.primary") as SVGElement });

describe("acme-gauge", () => {
  test("is a progressbar with the ring variables on the root and two arcs sized by the value", async () => {
    const el = await mount(`<acme-gauge size="small" value="50"></acme-gauge>`);
    const g = root(el);
    expect(g.getAttribute("role")).toBe("progressbar");
    expect(g.getAttribute("aria-valuenow")).toBe("50");
    expect(g.style.getPropertyValue("--gap-percent")).toBe("6");
    expect(g.style.getPropertyValue("--offset-factor")).toBe("0");
    const ring = g.querySelector("svg.ring") as SVGElement;
    expect(ring.getAttribute("width")).toBe("32");
    const { secondary, primary } = circles(el);
    expect(primary.getAttribute("stroke-width")).toBe("10");
    expect(primary.style.getPropertyValue("--stroke-percent")).toBe("50");
    expect(secondary.style.getPropertyValue("--stroke-percent")).toBe("38");
    expect(g.querySelector(".label")).toBeNull();
    expect(g.querySelector(".icon")).toBeNull();
  });

  test("tiny uses the thick stroke and the wide gap; 100 hides the secondary arc with no gap", async () => {
    const tiny = await mount(`<acme-gauge size="tiny" value="50"></acme-gauge>`);
    expect(circles(tiny).primary.getAttribute("stroke-width")).toBe("15");
    expect(root(tiny).style.getPropertyValue("--gap-percent")).toBe("9");
    const full = await mount(`<acme-gauge size="small" value="100"></acme-gauge>`);
    expect(root(full).style.getPropertyValue("--gap-percent")).toBe("0");
    expect(circles(full).secondary.style.opacity).toBe("0");
    expect(circles(full).primary.style.getPropertyValue("--stroke-percent")).toBe("100");
  });

  test("the primary colour follows the threshold scale or the colors map", async () => {
    expect(circles(await mount(`<acme-gauge value="14"></acme-gauge>`)).primary.getAttribute("stroke")).toBe("var(--ds-red-800)");
    expect(circles(await mount(`<acme-gauge value="68"></acme-gauge>`)).primary.getAttribute("stroke")).toBe("var(--ds-green-700)");
    const c = circles(await mount(`<acme-gauge value="50" colors='{"primary":"var(--ds-blue-700)","secondary":"var(--ds-blue-300)"}'></acme-gauge>`));
    expect(c.primary.getAttribute("stroke")).toBe("var(--ds-blue-700)");
    expect(c.secondary.getAttribute("stroke")).toBe("var(--ds-blue-300)");
  });

  test("equal arc priority splits the gap between both arcs", async () => {
    const el = await mount(`<acme-gauge size="medium" arc-priority="equal" value="50"></acme-gauge>`);
    expect(root(el).style.getPropertyValue("--offset-factor")).toBe("0.5");
    expect(circles(el).primary.style.getPropertyValue("--stroke-percent")).toBe("45");
    expect(circles(el).secondary.style.getPropertyValue("--stroke-percent")).toBe("45");
  });

  test("show-value prints the number at the size's type, and nothing for tiny", async () => {
    const md = await mount(`<acme-gauge show-value size="medium" value="80"></acme-gauge>`);
    const p = root(md).querySelector(".label > p.value") as HTMLElement;
    expect(p.textContent).toBe("80");
    expect(p.style.fontSize).toBe("18px");
    const tiny = await mount(`<acme-gauge show-value size="tiny" value="80"></acme-gauge>`);
    expect(root(tiny).querySelector(".label")).not.toBeNull();
    expect(root(tiny).querySelector(".label > p")).toBeNull();
  });

  test("indeterminate drops the value announcement and shows the icon", async () => {
    const el = await mount(`<acme-gauge indeterminate size="large" value="25"></acme-gauge>`);
    const g = root(el);
    expect(g.classList.contains("indeterminate")).toBe(true);
    expect(g.hasAttribute("aria-valuenow")).toBe(false);
    expect((g.querySelector("svg.icon") as SVGElement).getAttribute("width")).toBe("64");
  });
});
