import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmePhone } from "../phone";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmePhone;
  await el.updateComplete;
  return el;
};
const frame = (el: AcmePhone) => el.shadowRoot!.querySelector(".frame") as HTMLElement;

describe("acme-phone", () => {
  test("renders the shell parts: screen with content, island, home indicator and four side keys", async () => {
    const el = await mount(`<acme-phone></acme-phone>`);
    const f = frame(el);
    expect(f.className.trim()).toBe("frame");
    expect(f.querySelector(".screen > .content > slot")).not.toBeNull();
    expect(f.querySelector(".island")).not.toBeNull();
    expect(f.querySelector(".home")).not.toBeNull();
    for (const k of [".mute", ".vol-up", ".vol-down", ".power"]) expect(f.querySelector(k)).not.toBeNull();
    // No address: no gradient and no navigation bar.
    expect(f.querySelector(".shade")).toBeNull();
    expect(f.querySelector(".bar")).toBeNull();
  });

  test("an address adds the gradient and the bar, and shows the address without scheme, www. and trailing slash", async () => {
    const el = await mount(`<acme-phone address="https://www.example.com/"></acme-phone>`);
    const f = frame(el);
    expect(f.querySelector(".screen > .shade")).not.toBeNull();
    const bar = f.querySelector(".bar")!;
    expect(bar.querySelector(".back svg.icon")).not.toBeNull();
    expect(bar.querySelector(".more svg.icon")).not.toBeNull();
    expect(bar.querySelector(".address .text")!.textContent).toBe("example.com");
  });

  test("variant light marks the frame; notch=false leaves the island out", async () => {
    const light = await mount(`<acme-phone variant="light" address="https://example.com"></acme-phone>`);
    expect(frame(light).className.trim()).toBe("frame light");
    const plain = await mount(`<acme-phone notch="false" address="https://example.com"></acme-phone>`);
    expect(plain.notch).toBe(false);
    expect(frame(plain).querySelector(".island")).toBeNull();
    expect(frame(plain).querySelector(".bar")).not.toBeNull();
  });

  test("slotted content lands on the screen canvas", async () => {
    const el = await mount(`<acme-phone><img alt="Dashboard on a phone" src="data:,"></acme-phone>`);
    const slot = frame(el).querySelector(".content > slot") as HTMLSlotElement;
    expect(slot.assignedElements().length).toBe(1);
    expect(slot.assignedElements()[0].tagName).toBe("IMG");
  });
});
