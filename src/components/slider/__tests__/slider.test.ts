import { expect, test } from "bun:test";
import "../../../all";

const mount = async (markup = "<acme-slider></acme-slider>") => {
  const box = document.createElement("div");
  box.innerHTML = markup;
  document.body.append(box);
  const slider = box.querySelector("acme-slider")!;
  await slider.updateComplete;
  return { slider, box };
};
test("Slider owns an immutable numeric array and separates reset defaults", async () => {
  const { slider, box } = await mount();
  try {
    expect(slider.value).toEqual([0]);
    const value = [20, 60];
    slider.value = value;
    value[0] = 90;
    expect(slider.value).toEqual([20, 60]);
    expect(Object.isFrozen(slider.value)).toBe(true);
    slider.defaultValue = [10, 80];
    slider.value = [30, 70];
    slider.formResetCallback();
    expect(slider.value).toEqual([10, 80]);
    expect(Array.from(slider.labels)).toEqual([]);
  } finally {
    box.remove();
  }
});
test("Slider publishes live and committed keyboard edits once, keeping thumb order and gaps", async () => {
  const { slider, box } = await mount('<acme-slider value="[40,60]" min-steps-between-values="5"></acme-slider>');
  try {
    const seen: string[] = [];
    for (const name of ["acme-input", "acme-change", "acme-commit"]) {
      slider.addEventListener(name, (e) => seen.push(name));
    }
    const input = slider.shadowRoot!.querySelector("input")!;
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true, cancelable: true }));
    expect(slider.value).toEqual([55, 60]);
    expect(seen).toEqual(["acme-input", "acme-change"]);
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }));
    expect(seen).toHaveLength(2);
  } finally {
    box.remove();
  }
});
test("Slider rejects malformed values and supports restoration without user events", async () => {
  const { slider, box } = await mount();
  try {
    expect(() => {
      slider.value = 20 as never;
    }).toThrow();
    expect(() => {
      slider.value = [NaN];
    }).toThrow();
    expect(() => {
      slider.value = [];
    }).toThrow();
    expect(() => {
      slider.value = [80, 20];
    }).toThrow();
    let events = 0;
    slider.addEventListener("acme-change", () => events++);
    slider.formStateRestoreCallback("[10,90]", "restore");
    expect(slider.value).toEqual([10, 90]);
    expect(events).toBe(0);
    expect(() => {
      slider.step = 0;
    }).toThrow();
  } finally {
    box.remove();
  }
});

test("bounds and value assignment preserve authored values in either attribute order", async () => {
  for (const attrs of ['value="[300]" min="200" max="400"', 'max="400" min="200" value="[300]"', 'min="200" value="[300]" max="400"']) {
    const { slider, box } = await mount(`<acme-slider ${attrs}></acme-slider>`);
    try {
      expect(slider.value).toEqual([300]);
      expect(slider.validity.valid).toBe(true);
      expect(slider.shadowRoot!.querySelector("input")!.valueAsNumber).toBe(300);
    } finally {
      box.remove();
    }
  }
});
test("staged properties recover after transient invalid bounds without replacing the supplied value", async () => {
  const { slider, box } = await mount();
  try {
    slider.value = [300];
    expect(slider.value).toEqual([300]);
    expect(slider.validity.rangeOverflow).toBe(true);
    expect(slider.shadowRoot!.querySelector("input")!.valueAsNumber).toBe(100);
    slider.min = 200;
    expect(slider.validity.customError).toBe(true);
    slider.max = 400;
    expect(slider.value).toEqual([300]);
    expect(slider.validity.valid).toBe(true);
    expect(slider.shadowRoot!.querySelector("input")!.valueAsNumber).toBe(300);
    slider.step = 40;
    expect(slider.validity.stepMismatch).toBe(true);
    slider.step = 20;
    expect(slider.validity.valid).toBe(true);
  } finally {
    box.remove();
  }
});

test("large steps and finite overflow stop at legal endpoints", async () => {
  const { slider, box } = await mount('<acme-slider step="20" value="[40]"></acme-slider>');
  try {
    const input = slider.shadowRoot!.querySelector("input")!;
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", shiftKey: true, bubbles: true, cancelable: true }));
    expect(slider.value).toEqual([20]);
    slider.max = Number.MAX_VALUE;
    slider.step = Number.MAX_VALUE;
    slider.value = [Number.MAX_VALUE];
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true, cancelable: true }));
    expect(slider.value).toEqual([Number.MAX_VALUE]);
  } finally {
    box.remove();
  }
});
test("removing thumb labels restores default names", () => {
  const slider = document.createElement("acme-slider");
  slider.setAttribute("thumb-labels", '["Custom"]');
  expect(slider.thumbLabels).toEqual(["Custom"]);
  slider.removeAttribute("thumb-labels");
  expect(slider.thumbLabels).toEqual([]);
});
