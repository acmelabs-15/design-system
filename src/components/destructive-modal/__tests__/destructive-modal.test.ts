import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeInput } from "../../input/input";
import { type AcmeModal, deepActive } from "../../modal/modal";
import type { AcmeDestructiveModal } from "../destructive-modal";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
/** Every pending update of the element and of the modal it composes. */
const flush = async (el: AcmeDestructiveModal) => {
  do {
    await el.updateComplete;
    await modal(el).updateComplete;
  } while (el.isUpdatePending || modal(el).isUpdatePending);
};
const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.querySelector("acme-destructive-modal") as AcmeDestructiveModal;
  await flush(el);
  return el;
};
const shadow = (el: AcmeDestructiveModal) => el.shadowRoot!;
const modal = (el: AcmeDestructiveModal) => shadow(el).querySelector("acme-modal") as AcmeModal;
const panel = (el: AcmeDestructiveModal) => modal(el).shadowRoot!.querySelector(".modal") as HTMLElement;
const input = (el: AcmeDestructiveModal) => shadow(el).querySelector("acme-input") as AcmeInput;
const buttons = (el: AcmeDestructiveModal) => Array.from(shadow(el).querySelectorAll("acme-button")) as (HTMLElement & { disabled: boolean; loading: boolean; variant: string; size: string })[];
const confirmButton = (el: AcmeDestructiveModal) => buttons(el)[1];
/** Types into the verification field the way the user does: the inner input's value and its input event. */
const type = async (el: AcmeDestructiveModal, text: string) => {
  const field = input(el).input;
  field.value = text;
  field.dispatchEvent(new Event("input", { bubbles: true }));
  await flush(el);
};
const open = async (el: AcmeDestructiveModal) => {
  el.show();
  await flush(el);
};
const closeAndSettle = async (el: AcmeDestructiveModal) => {
  el.close();
  await flush(el);
  await wait(400);
};

const DEFAULT = `<acme-destructive-modal heading="Delete Project" confirm-label="Delete Project" verification-label="project name" verification-phrase="my-project" irreversible-description="Deleting my-project cannot be undone."><b>my-project</b> and all its deployments will be permanently deleted.</acme-destructive-modal>`;

describe("acme-destructive-modal", () => {
  test("composes a closed 480px modal; open renders the heading, the description, the band, the prompt with the phrase and the gated buttons", async () => {
    const el = await mount(DEFAULT);
    expect(panel(el)).toBeNull();
    expect(modal(el).width).toBe(480);
    await open(el);
    expect(panel(el).style.width).toBe("480px");
    expect(modal(el).shadowRoot!.querySelector(".header .title")?.textContent).toContain("Delete Project");
    // The description reaches the modal's subtitle through the forwarded slot.
    const subtitle = modal(el).shadowRoot!.querySelector(".subtitle slot[name=subtitle]") as HTMLSlotElement;
    expect(
      subtitle
        .assignedNodes({ flatten: true })
        .map((n) => n.textContent)
        .join(""),
    ).toContain("and all its deployments");
    const note = shadow(el).querySelector(".stack > acme-note") as HTMLElement & { variant: string; fill: boolean };
    expect(note.variant).toBe("error");
    expect(note.fill).toBe(true);
    expect(note.textContent).toContain("cannot be undone");
    expect(shadow(el).querySelector(".stack").className.trim()).toBe("stack irreversible");
    const prompt = shadow(el).querySelector(".field > label.prompt") as HTMLLabelElement;
    expect(prompt.textContent).toContain("To confirm, type the project name");
    expect(prompt.querySelector("b.phrase")?.textContent).toBe("my-project");
    expect(prompt.querySelector("b.phrase")?.getAttribute("translate")).toBe("no");
    expect(prompt.getAttribute("for")).toBe(input(el).id);
    expect(input(el).getAttribute("aria-label")).toBe("To confirm, type the project name “my-project”");
    expect(shadow(el).querySelector(".stack > acme-error")).toBeNull();
    const [cancel, confirm] = buttons(el);
    expect(cancel.getAttribute("slot")).toBe("actions");
    expect(cancel.variant).toBe("secondary");
    expect(cancel.textContent).toBe("Cancel");
    expect(cancel.disabled).toBe(false);
    expect(confirm.variant).toBe("error");
    expect(confirm.textContent).toBe("Delete Project");
    expect(confirm.disabled).toBe(true);
    await closeAndSettle(el);
  });

  test("the verification input gets focus on open", async () => {
    const el = await mount(DEFAULT);
    await open(el);
    await wait(0);
    expect(deepActive()).toBe(input(el).input);
    await closeAndSettle(el);
  });

  test("the confirm enables only while the typed text equals the phrase; a click or Enter in the input dispatches acme-confirm and keeps the modal open", async () => {
    const el = await mount(DEFAULT);
    const confirms: number[] = [];
    el.addEventListener("acme-confirm", () => confirms.push(1));
    await open(el);
    await type(el, "my-projec");
    expect(confirmButton(el).disabled).toBe(true);
    input(el).dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, composed: true }));
    expect(confirms.length).toBe(0);
    await type(el, "my-project");
    expect(confirmButton(el).disabled).toBe(false);
    confirmButton(el).shadowRoot!.querySelector("button")!.click();
    expect(confirms.length).toBe(1);
    input(el).dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, composed: true }));
    expect(confirms.length).toBe(2);
    expect(el.open).toBe(true);
    await type(el, "My-project");
    expect(confirmButton(el).disabled).toBe(true);
    await closeAndSettle(el);
  });

  test("a wrong non-empty value reads as invalid once the input has been left; the message names the label", async () => {
    const el = await mount(DEFAULT);
    await open(el);
    await type(el, "wrong");
    expect(input(el).error).toBe("");
    input(el).dispatchEvent(new FocusEvent("focusout", { bubbles: true, composed: true }));
    await flush(el);
    expect(input(el).error).toBe("The project name must match exactly.");
    await type(el, "");
    expect(input(el).error).toBe("");
    await type(el, "my-project");
    expect(input(el).error).toBe("");
    await closeAndSettle(el);
    const bare = await mount(`<acme-destructive-modal heading="Disable" verification-phrase="disable">Desc</acme-destructive-modal>`);
    await open(bare);
    await type(bare, "x");
    input(bare).dispatchEvent(new FocusEvent("focusout", { bubbles: true, composed: true }));
    await flush(bare);
    expect(input(bare).error).toBe("Doesn’t match.");
    await closeAndSettle(bare);
  });

  test("loading disables the input and both buttons and spins the confirm; a confirm while loading is ignored", async () => {
    const el = await mount(DEFAULT.replace("<acme-destructive-modal", "<acme-destructive-modal loading"));
    const confirms: number[] = [];
    el.addEventListener("acme-confirm", () => confirms.push(1));
    await open(el);
    expect(input(el).disabled).toBe(true);
    const [cancel, confirm] = buttons(el);
    expect(cancel.disabled).toBe(true);
    expect(confirm.disabled).toBe(true);
    expect(confirm.loading).toBe(true);
    expect(shadow(el).querySelector(".stack").className).toContain("loading");
    await type(el, "my-project");
    input(el).dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, composed: true }));
    expect(confirms.length).toBe(0);
    await closeAndSettle(el);
  });

  test("error renders the inline error line under the field, as a string or an Error", async () => {
    const el = await mount(DEFAULT.replace("<acme-destructive-modal", `<acme-destructive-modal error="Couldn’t delete project. Try again."`));
    await open(el);
    const line = shadow(el).querySelector(".stack > .field + acme-error") as HTMLElement;
    expect(line.textContent).toContain("Try again");
    expect(shadow(el).querySelector(".stack").className).toContain("errored");
    el.error = new Error("Network down");
    await flush(el);
    expect(shadow(el).querySelector(".stack > acme-error")?.textContent).toContain("Network down");
    el.error = null;
    await flush(el);
    expect(shadow(el).querySelector(".stack > acme-error")).toBeNull();
    await closeAndSettle(el);
  });

  test("a reversible action has no band; the confirm label falls back to the heading; cancel and confirm labels and variant follow their attributes", async () => {
    const el = await mount(
      `<acme-destructive-modal heading="Disable Deployment Protection" verification-phrase="disable deployment protection" cancel-label="Keep" confirm-variant="warning">Anyone will be able to view your deployments.</acme-destructive-modal>`,
    );
    await open(el);
    expect(shadow(el).querySelector("acme-note")).toBeNull();
    expect(shadow(el).querySelector(".stack").className.trim()).toBe("stack");
    const [cancel, confirm] = buttons(el);
    expect(cancel.textContent).toBe("Keep");
    expect(confirm.textContent).toBe("Disable Deployment Protection");
    expect(confirm.variant).toBe("warning");
    expect(shadow(el).querySelector(".prompt")?.textContent).toContain("To confirm, type “");
    await closeAndSettle(el);
  });

  test("Cancel, Escape and a press outside dispatch a cancelable acme-cancel with its reason and close; the modal's own dismiss event stays inside", async () => {
    const el = await mount(DEFAULT);
    const reasons: string[] = [];
    const leaked: string[] = [];
    el.addEventListener("acme-cancel", (e) => reasons.push((e as CustomEvent).detail.reason));
    document.addEventListener("acme-dismiss", () => leaked.push("dismiss"));
    await open(el);
    buttons(el)[0].shadowRoot!.querySelector("button")!.click();
    await flush(el);
    expect(reasons).toEqual(["cancel"]);
    expect(el.open).toBe(false);
    expect(modal(el).open).toBe(false);
    await wait(400);
    await open(el);
    modal(el)
      .shadowRoot!.querySelector("dialog")!
      .dispatchEvent(new Event("cancel", { cancelable: true }));
    await flush(el);
    expect(reasons).toEqual(["cancel", "escape"]);
    expect(el.open).toBe(false);
    await wait(400);
    await open(el);
    modal(el)
      .shadowRoot!.querySelector("dialog")!
      .dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    await flush(el);
    expect(reasons).toEqual(["cancel", "escape", "outside"]);
    expect(leaked).toEqual([]);
    await wait(400);
    // A prevented cancel keeps it open.
    el.addEventListener("acme-cancel", (e) => e.preventDefault(), { once: true });
    await open(el);
    buttons(el)[0].shadowRoot!.querySelector("button")!.click();
    await flush(el);
    expect(el.open).toBe(true);
    await closeAndSettle(el);
  });

  test("the typed text resets on close, so the gate is shut again on the next open", async () => {
    const el = await mount(DEFAULT);
    await open(el);
    await type(el, "my-project");
    expect(confirmButton(el).disabled).toBe(false);
    await closeAndSettle(el);
    await open(el);
    expect(input(el).value).toBe("");
    expect(confirmButton(el).disabled).toBe(true);
    await closeAndSettle(el);
  });

  test("the actions are small buttons of the composed modal", async () => {
    const el = await mount(DEFAULT);
    await open(el);
    await wait(0);
    await flush(el);
    for (const b of buttons(el)) expect(b.size).toBe("small");
    await closeAndSettle(el);
  });
});
