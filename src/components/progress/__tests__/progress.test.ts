import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeProgress } from "../progress";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeProgress;
  await el.updateComplete;
  return el;
};
const root = (el: AcmeProgress) => el.shadowRoot!.querySelector(".progress") as HTMLElement;
const bar = (el: AcmeProgress) => root(el).querySelector("progress.bar") as HTMLProgressElement;

describe("acme-progress", () => {
  test("renders a native progress bar with value and max inside the sized wrapper", async () => {
    const el = await mount(`<acme-progress max="40" value="30" aria-label="Upload"></acme-progress>`);
    const b = bar(el);
    expect(b.getAttribute("max")).toBe("40");
    expect(b.getAttribute("value")).toBe("30");
    expect(b.getAttribute("aria-label")).toBe("Upload");
    expect(root(el).className.trim()).toBe("progress");
    expect(el.style.width).toBe("100%");
    expect(root(el).style.width).toBe("100%");
    expect(root(el).style.height).toBe("10px");
    expect(b.style.getPropertyValue("--fg")).toBe("var(--ds-gray-1000)");
  });

  test("type sets the bar colour; height sizes the wrapper and the bar; width lands on the host, the wrapper fills it", async () => {
    const el = await mount(`<acme-progress type="success" value="60" height="50" width="200"></acme-progress>`);
    expect(bar(el).style.getPropertyValue("--fg")).toBe("var(--ds-blue-700)");
    expect(root(el).style.height).toBe("50px");
    expect(bar(el).style.height).toBe("50px");
    expect(el.style.width).toBe("200px");
    expect(root(el).style.width).toBe("100%");
    el.width = "50%";
    await el.updateComplete;
    expect(el.style.width).toBe("50%");
  });

  test("stops draw a tick with a tooltip trigger at each value and square the bar", async () => {
    const el = await mount(`<acme-progress value="30" stops='[{"value":10,"tooltip":"10%"},{"value":20,"tooltip":"20%"}]'></acme-progress>`);
    expect(root(el).classList.contains("with-stops")).toBe(true);
    const stops = root(el).querySelectorAll(".stop");
    expect(stops.length).toBe(2);
    expect(stops[1].getAttribute("style")).toContain("left:calc(20% - 7px)");
    const tip = stops[0].querySelector("acme-tooltip.trigger") as HTMLElement;
    expect(tip.getAttribute("text")).toBe("10%");
    expect(tip.querySelector(".hit")!.getAttribute("aria-label")).toBe("10%");
    expect(stops[0].querySelector(".lines > .line + .line-bg")).not.toBeNull();
  });

  test("colors pick the highest threshold at or under the value", async () => {
    const el = await mount(`<acme-progress value="0" colors='{"0":"black","25":"red","50":"orange"}'></acme-progress>`);
    const fg = () => bar(el).style.getPropertyValue("--fg");
    expect(fg()).toBe("black");
    el.value = 30;
    await el.updateComplete;
    expect(fg()).toBe("red");
    el.value = 50;
    await el.updateComplete;
    expect(fg()).toBe("orange");
  });
});
