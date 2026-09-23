import { html, render } from "lit";
import { AcmeSlider } from "../slider";
customElements.define("acme-slider", AcmeSlider);
const settle = async () => {
  for (let i = 0; i < 3; i++) await new Promise(requestAnimationFrame);
};
export async function sliderNativeContracts() {
  const results: { name: string; ok: boolean }[] = [];
  const check = (name: string, ok: boolean) => {
    results.push({ name, ok });
  };
  const form = document.createElement("form");
  form.innerHTML = '<label for="amount">Amount</label><acme-slider id="amount" name="amount" value="[20,60]" thumb-labels=\'["Low","High"]\'></acme-slider><button>Next</button>';
  document.body.append(form);
  const slider = form.querySelector("acme-slider")!;
  await settle();
  check("native associated labels retain NodeList", slider.labels instanceof NodeList && slider.labels.length === 1);
  slider.value = [30, 70];
  check("immediate repeated FormData", JSON.stringify(new FormData(form).getAll("amount")) === '["30","70"]');
  const value = slider.value;
  check("immutable value snapshot", Object.isFrozen(value));
  const events: string[] = [];
  for (const type of ["acme-input", "acme-change"])
    slider.addEventListener(type, (e) => {
      events.push(type);
      check("form current inside " + type, JSON.stringify(new FormData(form).getAll("amount")) === JSON.stringify((e as CustomEvent).detail.value.map(String)));
    });
  const first = slider.shadowRoot!.querySelector("input")!;
  first.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true, cancelable: true }));
  check("key emits one live and one completion", events.join("|") === "acme-input|acme-change" && slider.value[0] === 31);
  form.reset();
  check("native form reset default", JSON.stringify(slider.value) === "[20,60]");
  slider.formStateRestoreCallback("[25,75]", "restore");
  check("restoration", JSON.stringify(slider.value) === "[25,75]");
  slider.value = [10, 110];
  await settle();
  const inputs = [...slider.shadowRoot!.querySelectorAll("input")];
  check("supplied invalid values retained and invalid", slider.value[1] === 110 && slider.validity.rangeOverflow && new FormData(form).getAll("amount")[1] === "110");
  check("native displayed and announced values project into bounds", inputs[1]!.valueAsNumber === 100 && inputs[1]!.getAttribute("aria-valuenow") === "100");
  slider.value = [300];
  slider.min = 200;
  check("transient impossible config is invalid", slider.validity.customError);
  slider.max = 400;
  check("staged properties recover exact value and submission", slider.value[0] === 300 && slider.validity.valid && new FormData(form).get("amount") === "300");
  await settle();
  check("projected thumb recovers", slider.shadowRoot!.querySelector("input")!.valueAsNumber === 300);
  for (const attrs of ['value="[300]" min="200" max="400"', 'max="400" min="200" value="[300]"']) {
    const box = document.createElement("div");
    box.innerHTML = `<acme-slider ${attrs}></acme-slider>`;
    document.body.append(box);
    await settle();
    const c = box.querySelector("acme-slider")!;
    check("attribute order " + attrs, c.value[0] === 300 && c.validity.valid && c.shadowRoot!.querySelector("input")!.valueAsNumber === 300);
    box.remove();
  }
  const lit = document.createElement("div");
  document.body.append(lit);
  render(html`<acme-slider .value=${[300]} .min=${200} .max=${400}></acme-slider>`, lit);
  await settle();
  const staged = lit.querySelector("acme-slider")!;
  check("Lit value-first bindings recover", staged.value[0] === 300 && staged.validity.valid);
  lit.remove();
  slider.value = [300];
  slider.setCustomValidity("Choose a different amount");
  check("custom validity reaches the native slider", !slider.validity.valid && slider.shadowRoot!.querySelector("input")!.getAttribute("aria-invalid") === "true");
  slider.setCustomValidity("");
  check("clearing custom validity updates the native slider", slider.validity.valid && slider.shadowRoot!.querySelector("input")!.getAttribute("aria-invalid") === "false");
  const control = slider.shadowRoot!.querySelector("input")!;
  events.length = 0;
  control.value = "301";
  control.dispatchEvent(new Event("input", { bubbles: true }));
  control.dispatchEvent(new Event("change", { bubbles: true }));
  control.dispatchEvent(new Event("change", { bubbles: true }));
  check("native completion clears its edit baseline", events.filter((type) => type === "acme-change").length === 1);
  slider.value = [300];
  const fieldset = document.createElement("fieldset");
  form.prepend(fieldset);
  fieldset.append(slider);
  fieldset.disabled = true;
  check("fieldset immediate omission", new FormData(form).getAll("amount").length === 0 && !slider.disabled);
  check("fieldset native disabled", slider.shadowRoot!.querySelector("input")!.disabled);
  fieldset.disabled = false;
  check("fieldset reenables", new FormData(form).get("amount") === "300");
  slider.value = [240, 320, 360];
  slider.minStepsBetweenValues = 2;
  slider.step = 10;
  await settle();
  check("three distinct native thumbs", slider.shadowRoot!.querySelectorAll("input").length === 3);
  check("gap native bounds", slider.shadowRoot!.querySelectorAll("input")[1]!.getAttribute("aria-valuemax") === "340");
  slider.thumbLabels = ["First", "Middle", "Last"];
  await settle();
  check(
    "distinct authored names",
    Array.from(slider.shadowRoot!.querySelectorAll("input"))
      .map((x) => x.getAttribute("aria-label"))
      .join("|") === "First|Middle|Last",
  );
  slider.formatValue = (value) => value + " units";
  await settle();
  check("formatted accessible value", slider.shadowRoot!.querySelector("input")!.getAttribute("aria-valuetext") === "240 units");
  form.remove();
  const fixture = document.createElement("div");
  fixture.innerHTML = '<acme-slider id="interactive" aria-label="Interactive" value="[20]" style="width:400px"></acme-slider><input id="after" aria-label="After" />';
  document.body.append(fixture);
  await settle();
  (window as any).__slider = { fixture, slider: fixture.querySelector("acme-slider"), events: [], pointer: undefined };
  for (const type of ["acme-input", "acme-change"])
    (window as any).__slider.slider.addEventListener(type, (e: CustomEvent) => {
      (window as any).__slider.events.push({ type, value: [...e.detail.value] });
    });
  fixture.addEventListener("pointerdown", (e) => ((window as any).__slider.pointer = (e as PointerEvent).pointerId), true);
  return results;
}
(window as any).__results = await sliderNativeContracts();
