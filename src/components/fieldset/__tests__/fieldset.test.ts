import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeButton } from "../../button/button";
import type { AcmeFieldset } from "../fieldset";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeFieldset;
  await el.updateComplete;
  await el.updateComplete;
  return el;
};
const sr = (el: AcmeFieldset) => el.shadowRoot!;
const assigned = (slot: Element | null) => (slot as HTMLSlotElement | null)?.assignedNodes() ?? [];

describe("acme-fieldset", () => {
  test("renders the card, the content with title and subtitle, and a footer of status and actions", async () => {
    const el = await mount(
      `<acme-fieldset heading="Account Settings"><span slot="subtitle">Manage</span><span slot="status">Need help?</span><acme-button slot="actions">Save Changes</acme-button></acme-fieldset>`,
    );
    const root = sr(el).querySelector(".fieldset") as HTMLElement;
    expect(root.className.trim()).toBe("fieldset");
    expect(sr(el).querySelector(".content > .title")!.textContent).toContain("Account Settings");
    expect(sr(el).querySelector(".content > .subtitle > slot[name=subtitle]")).not.toBeNull();
    expect(assigned(sr(el).querySelector("slot[name=subtitle]"))[0]).toBe(el.querySelector("[slot=subtitle]")!);
    expect(sr(el).querySelector("footer.footer > .status > slot[name=status]")).not.toBeNull();
    expect(sr(el).querySelector(".content > slot:not([name])")).toBeNull();
  });

  test("each action takes a wrapper of its own, in order, and is small unless sized", async () => {
    const el = await mount(
      `<acme-fieldset heading="Privacy Policy"><span slot="status">Last updated</span><acme-button slot="actions" variant="secondary">Decline</acme-button><acme-button slot="actions" size="large">Accept</acme-button></acme-fieldset>`,
    );
    const wrappers = sr(el).querySelectorAll(".footer > .actions > .action");
    expect(wrappers.length).toBe(2);
    const buttons = el.querySelectorAll<AcmeButton>("acme-button");
    expect(assigned(wrappers[0].querySelector("slot"))[0]).toBe(buttons[0]);
    expect(assigned(wrappers[1].querySelector("slot"))[0]).toBe(buttons[1]);
    expect(buttons[0].size).toBe("small");
    expect(buttons[1].size).toBe("large");
  });

  test("no footer without status, actions or footer text; footer text slots straight into the footer", async () => {
    const none = await mount(`<acme-fieldset heading="Account Information"><span slot="subtitle">x</span></acme-fieldset>`);
    expect(sr(none).querySelector(".footer")).toBeNull();
    const el = await mount(`<acme-fieldset heading="Transfer Project" disabled highlight><span slot="subtitle">x</span><span slot="footer">You need additional permissions.</span></acme-fieldset>`);
    expect(sr(el).querySelector(".fieldset")!.className).toContain("highlight");
    expect(assigned(sr(el).querySelector("footer.footer > slot[name=footer]"))[0]).toBe(el.querySelector("[slot=footer]")!);
  });

  test("disabled marks the root and renders the wall first in the content, before the title", async () => {
    const el = await mount(`<acme-fieldset heading="API Access" disabled><span slot="subtitle">x</span></acme-fieldset>`);
    expect(sr(el).querySelector(".fieldset")!.className).toContain("disabled");
    const content = sr(el).querySelector(".content")!;
    expect(content.firstElementChild!.tagName).toBe("ACME-DISABLED-WALL");
    expect(content.children[1].className).toBe("title");
    el.disabled = false;
    await el.updateComplete;
    expect(content.querySelector("acme-disabled-wall")).toBeNull();
  });

  test("type maps to a root modifier; error and warning text sit in their own rows", async () => {
    const el = await mount(`<acme-fieldset variant="error" heading="Payment Failed"><span slot="error">Failed</span><span slot="warning">Careful</span></acme-fieldset>`);
    expect(sr(el).querySelector(".fieldset")!.className).toContain("error");
    expect(sr(el).querySelector(".content > .row > .error > slot[name=error]")).not.toBeNull();
    expect(sr(el).querySelector(".content > .row > .warning > slot[name=warning]")).not.toBeNull();
    const w = await mount(`<acme-fieldset variant="warning"></acme-fieldset>`);
    expect(sr(w).querySelector(".fieldset")!.className).toContain("warning");
    expect(sr(w).querySelector(".title")).toBeNull();
  });

  test("the default slot renders only with content, so the subtitle is the content's last child otherwise", async () => {
    const bare = await mount(`<acme-fieldset><span slot="subtitle">Only a subtitle</span></acme-fieldset>`);
    expect(sr(bare).querySelector(".content")!.lastElementChild!.className).toBe("subtitle");
    const el = await mount(`<acme-fieldset heading="Advanced" disabled><span slot="subtitle">x</span><div><p>Gated</p><acme-disabled-wall></acme-disabled-wall></div></acme-fieldset>`);
    const slot = sr(el).querySelector(".content > slot:not([name])");
    expect(slot).not.toBeNull();
    expect(assigned(slot)[0]).toBe(el.querySelector("div")!);
  });

  test("children added later reach their slots", async () => {
    const el = await mount(`<acme-fieldset heading="Security"></acme-fieldset>`);
    expect(sr(el).querySelector(".footer")).toBeNull();
    const status = document.createElement("span");
    status.slot = "status";
    status.textContent = "Last password change: 30 days ago";
    el.append(status);
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(assigned(sr(el).querySelector("footer.footer > .status > slot[name=status]"))[0]).toBe(status);
  });
});

describe("acme-disabled-wall", () => {
  test("renders the overlay, hidden from assistive technology", async () => {
    document.body.innerHTML = `<acme-disabled-wall></acme-disabled-wall>`;
    const el = document.body.firstElementChild as HTMLElement & { updateComplete: Promise<boolean> };
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".wall[aria-hidden=true][part=wall]")).not.toBeNull();
    expect(el.shadowRoot!.querySelector("slot")).toBeNull();
  });
});
