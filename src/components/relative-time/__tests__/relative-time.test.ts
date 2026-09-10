import { describe, expect, test } from "bun:test";
import "../../../index";
import { AcmeRelativeTime } from "../relative-time";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeRelativeTime;
  await el.updateComplete;
  return el;
};
const sr = (el: AcmeRelativeTime) => el.shadowRoot!;
const card = (el: AcmeRelativeTime) => sr(el).querySelector("acme-context-card") as HTMLElement & Record<string, unknown>;
/** 2026-09-09T08:15:30Z. */
const MOMENT = Date.UTC(2026, 8, 9, 8, 15, 30);

describe("acme-relative-time", () => {
  test("the short age names whole days, hours or minutes, or Just now, and is empty without a moment", () => {
    const s = (ms: number) => AcmeRelativeTime.shortAge(MOMENT - ms, MOMENT);
    expect(s(10e3)).toBe("Just now");
    expect(s(60e3)).toBe("1 minute ago");
    expect(s(2 * 60e3 + 30e3)).toBe("2 minutes ago");
    expect(s(5 * 36e5)).toBe("5 hours ago");
    expect(s(24 * 36e5)).toBe("1 day ago");
    expect(s(10 * 864e5 + 5 * 36e5)).toBe("10 days ago");
    expect(AcmeRelativeTime.shortAge(0, MOMENT)).toBe("");
  });

  test("the full age names up to three units, largest first, with zero units kept after the first", () => {
    const l = (ms: number) => AcmeRelativeTime.longAge(MOMENT - ms, MOMENT);
    expect(l(0)).toBe("Just now");
    expect(l(51e3)).toBe("51 seconds ago");
    expect(l(36e5 + 2 * 6e4 + 3e3)).toBe("1 hour, 2 minutes, 3 seconds ago");
    expect(l(2 * 864e5 + 5e3)).toBe("2 days, 0 hours, 0 minutes ago");
    expect(l(400 * 864e5)).toBe("1 year, 1 month, 4 days ago");
    // A moment ahead reads as its distance too.
    expect(AcmeRelativeTime.longAge(MOMENT + 90e3, MOMENT)).toBe("1 minute, 30 seconds ago");
  });

  test("a zone reads as its abbreviation, the long date and the clock time", () => {
    expect(AcmeRelativeTime.inZone(MOMENT, "UTC")).toEqual({ abbr: "UTC", date: "September 9, 2026", time: "08:15:30 AM" });
    const ny = AcmeRelativeTime.inZone(MOMENT, "America/New_York");
    expect(ny.abbr).toBe("EDT");
    expect(ny.time).toBe("04:15:30 AM");
    expect(AcmeRelativeTime.inZone(Date.UTC(2026, 0, 1, 13, 0, 0), "UTC").time).toBe("01:00:00 PM");
  });

  test("without a moment the slotted content stands alone; with one, a context card wraps it", async () => {
    const bare = await mount(`<acme-relative-time><span>Pending</span></acme-relative-time>`);
    expect(sr(bare).querySelector("acme-context-card")).toBeNull();
    expect(sr(bare).querySelector("slot")).not.toBeNull();
    const el = await mount(`<acme-relative-time date="${MOMENT}"><acme-button>Hover Me</acme-button></acme-relative-time>`);
    const c = card(el);
    expect(c).not.toBeNull();
    // The consumer's trigger reaches the card through the element's slot; the short age stays its fallback.
    const slot = sr(el).querySelector("slot:not([name])") as HTMLSlotElement;
    expect(slot.assignedElements()[0]?.localName).toBe("acme-button");
    expect(slot.querySelector(".time")).not.toBeNull();
  });

  test("the card's content is the full age over the UTC row and the local row", async () => {
    const el = await mount(`<acme-relative-time date="${MOMENT}"></acme-relative-time>`);
    const content = sr(el).querySelector(".content") as HTMLElement;
    expect(content.getAttribute("slot")).toBe("content");
    expect(content.querySelector(".ago > .age")!.textContent).toMatch(/ ago$|^Just now$/);
    const rows = content.querySelectorAll(".rows > .row");
    expect(rows.length).toBe(2);
    expect(rows[0].querySelector(".place > .chip > .abbr")!.textContent).toBe("UTC");
    expect(rows[0].querySelector(".place > .date")!.textContent).toBe("September 9, 2026");
    expect(rows[0].querySelector(".clock")!.textContent).toBe("08:15:30 AM");
    expect(rows[1].querySelector(".abbr")!.textContent).not.toBe("");
    // With nothing slotted the short age is the trigger.
    expect(sr(el).querySelector(".time")!.textContent).toMatch(/ ago$|^Just now$/);
  });

  test("side, align, offsets, the open bits and the trigger switch reach the composed card", async () => {
    const el = await mount(
      `<acme-relative-time date="${MOMENT}" side="top" align="end" side-offset="8" align-offset="2" shown="1" disable-triggers hide no-padding ignore-card-pointer-events inactive-timeout-ms="100"></acme-relative-time>`,
    );
    const c = card(el);
    expect(c.side).toBe("top");
    expect(c.align).toBe("end");
    expect(c.sideOffset).toBe(8);
    expect(c.alignOffset).toBe(2);
    expect(c.shown).toBe(1);
    expect(c.disableTriggers).toBe(true);
    expect(c.hide).toBe(true);
    expect(c.noPadding).toBe(true);
    expect(c.ignoreCardPointerEvents).toBe(true);
    expect(c.inactiveTimeoutMs).toBe(100);
    const plain = await mount(`<acme-relative-time date="${MOMENT}"></acme-relative-time>`);
    expect(card(plain).side).toBe("right");
    expect(card(plain).align).toBe("center");
    expect(card(plain).sideOffset).toBe(16);
  });

  test("the host is an inline flex item that never grows", async () => {
    const el = await mount(`<acme-relative-time date="${MOMENT}"></acme-relative-time>`);
    const text = (AcmeRelativeTime.styles as unknown as { cssText: string }[]).map((s) => s.cssText).join("\n");
    expect(text).toMatch(/:host\s*\{[^}]*display:\s*inline-flex/);
    expect(text).toMatch(/:host\s*\{[^}]*flex:\s*0 auto/);
    expect(el.isConnected).toBe(true);
  });
});
