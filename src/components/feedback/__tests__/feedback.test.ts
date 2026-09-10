import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeFeedback } from "../feedback";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeFeedback;
  await el.updateComplete;
  return el;
};
const sr = (el: AcmeFeedback) => el.shadowRoot!;
const q = <T extends Element = HTMLElement>(el: AcmeFeedback, sel: string) => sr(el).querySelector(sel) as T | null;

describe("acme-feedback", () => {
  test("the trigger is a small secondary button that owns a dialog; prefix and suffix decorate it", async () => {
    const el = await mount(`<acme-feedback label="vercel" dry-run><svg slot="prefix"></svg></acme-feedback>`);
    const t = q(el, "acme-button.trigger")!;
    expect(t.getAttribute("size")).toBe("small");
    expect(t.getAttribute("variant")).toBe("secondary");
    expect(t.getAttribute("aria-haspopup")).toBe("dialog");
    expect(t.getAttribute("aria-expanded")).toBe("false");
    expect(t.getAttribute("data-state")).toBe("closed");
    expect(t.textContent).toContain("Feedback");
    expect(t.querySelector("slot[name=prefix][slot=prefix]")).not.toBeNull();
    expect(t.querySelector("slot[name=suffix]")).toBeNull();
    expect(q(el, ".panel")).toBeNull();
    const suffixed = await mount(`<acme-feedback button-text="Report"><svg slot="suffix"></svg></acme-feedback>`);
    expect(q(suffixed, "acme-button.trigger")!.querySelector("slot[name=suffix][slot=suffix]")).not.toBeNull();
    expect(q(suffixed, "acme-button.trigger")!.textContent).toContain("Report");
  });

  test("the trigger opens a fixed 340px card: form with textarea, hint, four emotion radios and Send; it closes on Escape and returns focus", async () => {
    const el = await mount(`<acme-feedback label="vercel" dry-run></acme-feedback>`);
    let opened = 0;
    el.addEventListener("acme-open", () => opened++);
    q(el, "acme-button.trigger")!.click();
    await el.updateComplete;
    expect(el.open).toBe(true);
    expect(opened).toBe(1);
    const panel = q(el, ".panel")!;
    expect(panel.style.position).toBe("fixed");
    expect(panel.style.zIndex).toBe("101");
    const box = q(el, ".box")!;
    expect(box.getAttribute("role")).toBe("dialog");
    expect(box.getAttribute("data-state")).toBe("open");
    expect(box.id).toBe(q(el, "acme-button.trigger")!.getAttribute("aria-controls") ?? "");
    expect(q(el, ".phase")!.getAttribute("data-phase")).toBe("entered");
    expect(q(el, "form .fields acme-textarea")!.getAttribute("placeholder")).toBe("Your feedback...");
    expect(q(el, ".fields .hint")!.textContent).toContain("supported.");
    expect(sr(el).querySelectorAll(".foot .emojis .emoji[role=radio]").length).toBe(4);
    expect(q(el, ".foot .emoji")!.getAttribute("aria-label")).toBe("Select Hate it emoji");
    expect(q(el, ".foot acme-button[type=submit]")!.textContent).toContain("Send");
    expect(q(el, ".head")).toBeNull();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await el.updateComplete;
    expect(el.open).toBe(false);
    expect(q(el, ".box")!.getAttribute("data-state")).toBe("closed");
    expect(q(el, "acme-button.trigger")!.getAttribute("aria-expanded")).toBe("false");
    expect(q(el, "acme-button.trigger")!.shadowRoot!.activeElement?.tagName).toBe("BUTTON");
  });

  test("an element that starts open mounts its card; show-topics and show-email add the select and the email field first", async () => {
    const el = await mount(`<acme-feedback label="vercel" show-topics show-email open></acme-feedback>`);
    expect(q(el, ".box[role=dialog]")).not.toBeNull();
    const fields = [...sr(el).querySelectorAll(".fields > *")].map((n) => n.tagName.toLowerCase());
    expect(fields).toEqual(["acme-select", "acme-input", "acme-textarea", "div"]);
    const select = q<HTMLSelectElement>(el, "acme-select")!;
    expect(select.getAttribute("placeholder")).toBe("Select a topic...");
    expect((select as unknown as { options: string[] }).options.length).toBe(11);
    expect(q(el, "acme-input")!.getAttribute("type")).toBe("email");
  });

  test("Send validates topic, email, note and emotion in that order and shows the message under the textarea", async () => {
    const el = await mount(`<acme-feedback label="vercel" show-topics open></acme-feedback>`);
    const form = q<HTMLFormElement>(el, "form")!;
    form.dispatchEvent(new Event("submit", { cancelable: true }));
    await el.updateComplete;
    expect(q(el, ".fields .error[data-phase=entered] .error-inner p")!.textContent).toBe("Please select a topic");
    q(el, "acme-select")!.dispatchEvent(new CustomEvent("acme-change", { detail: { value: "Billing" } }));
    form.dispatchEvent(new Event("submit", { cancelable: true }));
    await el.updateComplete;
    expect(q(el, ".error p")!.textContent).toBe("Please enter your feedback");
    q(el, "acme-textarea")!.dispatchEvent(new CustomEvent("acme-input", { detail: { value: "Great docs" } }));
    form.dispatchEvent(new Event("submit", { cancelable: true }));
    await el.updateComplete;
    expect(q(el, ".error p")!.textContent).toBe("Please select an emoji");
  });

  test("a dry run submits at once: acme-submit carries the payload, the form leaves and the thank-you view shows in a 195px card", async () => {
    const el = await mount(`<acme-feedback label="vercel" plan-name="pro" dry-run metadata='{"userId":"user_12345","nested":{"a":1}}' open></acme-feedback>`);
    const emojis = sr(el).querySelectorAll<HTMLElement>(".foot .emoji");
    emojis[3].click();
    await el.updateComplete;
    expect(emojis[3].getAttribute("aria-checked")).toBe("true");
    expect(emojis[0].getAttribute("aria-checked")).toBe("false");
    q(el, "acme-textarea")!.dispatchEvent(new CustomEvent("acme-input", { detail: { value: "Great docs" } }));
    let detail: Record<string, unknown> | undefined;
    el.addEventListener("acme-submit", (e) => {
      detail = (e as CustomEvent).detail;
    });
    q<HTMLFormElement>(el, "form")!.dispatchEvent(new Event("submit", { cancelable: true }));
    await el.updateComplete;
    expect(detail).toMatchObject({ label: "vercel", plan: "pro", note: "Great docs", emotion: "f929", topic: "", userId: "user_12345", nested: '{"a":1}' });
    expect(String(detail!.ua)).toContain("front production + ");
    expect(q(el, ".panel")!.classList.contains("sent")).toBe(true);
    expect(q(el, ".phase")!.getAttribute("data-phase")).toBe("exiting");
    expect(q(el, ".done .received")!.textContent).toBe("Your feedback has been received!");
    expect(q(el, ".done .thanks")!.textContent).toBe("Thank you for your help.");
    q(el, ".phase")!.dispatchEvent(new Event("transitionend"));
    await el.updateComplete;
    expect(q(el, ".phase")).toBeNull();
  });

  test("type=inline renders the pill: copy, four radios, the form hidden in a 48px box; a face grows it into the 336px card, the same face closes it", async () => {
    const el = await mount(`<acme-feedback type="inline" label="vercel" copy="How did the import go?" dry-run></acme-feedback>`);
    expect(q(el, ".panel.inline")).not.toBeNull();
    expect(q(el, ".head .copy")!.textContent).toBe("How did the import go?");
    expect(sr(el).querySelectorAll(".head .emojis .emoji[role=radio]").length).toBe(4);
    const box = q(el, ".box")!;
    expect(box.getAttribute("style")).toBe("height:48px;width:274px;border-radius:30px");
    expect(q(el, ".foot")!.getAttribute("style")).toBe("justify-content:flex-end");
    expect(q(el, ".foot .emojis")).toBeNull();
    const face = sr(el).querySelectorAll<HTMLElement>(".head .emoji")[2];
    face.click();
    await el.updateComplete;
    expect(el.open).toBe(true);
    expect(face.getAttribute("aria-checked")).toBe("true");
    expect(box.getAttribute("style")).toBe("height:243px;width:336px;border-radius:12px");
    face.click();
    await el.updateComplete;
    expect(el.open).toBe(false);
    expect(face.getAttribute("aria-checked")).toBe("false");
    expect(box.getAttribute("style")).toBe("height:48px;width:274px;border-radius:30px");
  });

  test("inline: full-width fills the row, upwards keeps the row 48px and shifts the card; a message adds 28px; the thank-you fills 75%", async () => {
    const full = await mount(`<acme-feedback type="inline" full-width show-topics show-email open></acme-feedback>`);
    expect(q(full, ".panel")!.classList.contains("full")).toBe(true);
    expect(q(full, ".box")!.getAttribute("style")).toBe("height:341px;width:336px;border-radius:12px");
    q<HTMLFormElement>(full, "form")!.dispatchEvent(new Event("submit", { cancelable: true }));
    await full.updateComplete;
    expect(q(full, ".box")!.getAttribute("style")).toBe("height:369px;width:336px;border-radius:12px");
    const up = await mount(`<acme-feedback type="inline" upwards show-topics dry-run></acme-feedback>`);
    expect(q(up, ".panel")!.classList.contains("up")).toBe(true);
    expect(q(up, ".box")!.getAttribute("style")).toBe("height:48px;width:274px;border-radius:30px");
    up.open = true;
    await up.updateComplete;
    expect(q(up, ".box")!.getAttribute("style")).toBe("height:295px;width:336px;border-radius:12px;transform:translateY(-200px)");
    q<HTMLFormElement>(up, "form")!.dispatchEvent(new Event("submit", { cancelable: true }));
    await up.updateComplete;
    expect(q(up, ".done")!.getAttribute("style")).toBe("height:75%;padding-top:48px");
    expect(q(up, ".box")!.getAttribute("style")).toBe("height:295px;width:336px;border-radius:12px;transform:translateY(-200px)");
  });

  test("the emotion radios carry the interaction states as attributes", async () => {
    const el = await mount(`<acme-feedback type="inline"></acme-feedback>`);
    const face = q(el, ".head .emoji")!;
    face.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" }));
    expect(face.getAttribute("data-hover")).toBe("true");
    face.dispatchEvent(new PointerEvent("pointerleave", { pointerType: "mouse" }));
    expect(face.hasAttribute("data-hover")).toBe(false);
  });
});
