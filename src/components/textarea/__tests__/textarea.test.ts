import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeTextarea } from "../textarea";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.querySelector("acme-textarea") as AcmeTextarea;
  await el.updateComplete;
  return el;
};

describe("acme-textarea", () => {
  test("renders a label root around the wrapper and the textarea; aria-label, placeholder, value and min-height reach it", async () => {
    const el = await mount(`<acme-textarea aria-label="Default" placeholder="Write" value="Lorem" min-height="100"></acme-textarea>`);
    const sr = el.shadowRoot!;
    expect(sr.querySelector("label.field > .wrap > textarea")).not.toBeNull();
    const ta = sr.querySelector("textarea") as HTMLTextAreaElement;
    expect(ta.getAttribute("aria-label")).toBe("Default");
    expect(ta.placeholder).toBe("Write");
    expect(ta.value).toBe("Lorem");
    expect(ta.getAttribute("style")).toBe("min-height:100px");
    expect(sr.querySelector(".wrap")!.className.trim()).toBe("wrap");
  });
  test("error paints aria-invalid, the message under the wrapper and the size class", async () => {
    const el = await mount(`<acme-textarea error="There has been an error." size="large"></acme-textarea>`);
    const sr = el.shadowRoot!;
    expect(sr.querySelector("textarea")!.getAttribute("aria-invalid")).toBe("true");
    expect(sr.querySelector(".wrap")!.className.trim()).toBe("wrap lg error");
    const err = sr.querySelector(".field > acme-error") as HTMLElement;
    expect(err.textContent).toBe("There has been an error.");
    expect(err.getAttribute("size")).toBe("large");
  });
  test("disabled, readonly and rows reach the textarea; input events carry the value", async () => {
    const el = await mount(`<acme-textarea disabled readonly rows="5"></acme-textarea>`);
    const ta = el.shadowRoot!.querySelector("textarea") as HTMLTextAreaElement;
    expect(ta.disabled).toBe(true);
    expect(ta.readOnly).toBe(true);
    expect(ta.getAttribute("rows")).toBe("5");
    let got = "";
    el.addEventListener("acme-input", (e) => {
      got = (e as CustomEvent).detail.value;
    });
    ta.value = "x";
    ta.dispatchEvent(new Event("input", { bubbles: true }));
    expect(got).toBe("x");
    expect(el.value).toBe("x");
  });
});
