import { describe, expect, test } from "bun:test";
import "../../../index";

describe("acme-modal-inset", () => {
  test("renders its slot, reflects last, and marks an inset no div follows", async () => {
    document.body.innerHTML = `<div><acme-modal-inset id="a"><p>Inside</p></acme-modal-inset><div>After</div><acme-modal-inset id="b" last><p>End</p></acme-modal-inset></div>`;
    const a = document.getElementById("a") as HTMLElement & { updateComplete: Promise<boolean> };
    const b = document.getElementById("b") as HTMLElement & { updateComplete: Promise<boolean> };
    await a.updateComplete;
    await b.updateComplete;
    expect(a.shadowRoot!.querySelector("slot")).not.toBeNull();
    expect(a.hasAttribute("data-last-of-type")).toBe(false);
    expect(b.hasAttribute("last")).toBe(true);
    expect(b.hasAttribute("data-last-of-type")).toBe(true);
  });
});
