import { expect, test } from "bun:test";
import "../../../all";

const mount = async () => {
  const c = document.createElement("acme-number-input");
  document.body.append(c);
  await c.updateComplete;
  return c;
};
test("Number Input preserves editable partials and uses decimal arithmetic", async () => {
  const c = await mount();
  c.value = "-";
  expect(Number.isNaN(c.valueAsNumber)).toBe(true);
  c.value = ".1";
  c.step = 0.2;
  c.increment();
  expect(c.valueAsNumber).toBe(0.3);
  c.value = "0";
  c.step = Number.MIN_VALUE;
  c.increment();
  expect(c.valueAsNumber).toBe(Number.MIN_VALUE);
  c.remove();
});
test("format configuration preserves current amount and owns its options", async () => {
  const c = await mount();
  c.locale = "de-DE";
  c.value = "1.234,5";
  c.locale = "en-US";
  expect(c.value).toBe("1,234.5");
  expect(c.valueAsNumber).toBe(1234.5);
  const options = { style: "currency" as const, currency: "USD" };
  c.formatOptions = options;
  options.currency = "EUR";
  expect(c.formatOptions.currency).toBe("USD");
  expect(Object.isFrozen(c.formatOptions)).toBe(true);
  expect(() => {
    c.formatOptions = { notation: "compact" } as never;
  }).toThrow();
  expect(c.valueAsNumber).toBe(1234.5);
  c.remove();
});
test("optional constraints restore defaults and reject invalid numeric configuration", async () => {
  const c = await mount();
  c.setAttribute("min", "1");
  c.setAttribute("max", "10");
  c.setAttribute("step", ".2");
  for (const attribute of ["min", "max", "step"]) {
    c.removeAttribute(attribute);
  }
  expect(c.min).toBe(Number.MIN_SAFE_INTEGER);
  expect(c.max).toBe(Number.MAX_SAFE_INTEGER);
  expect(c.step).toBe(1);
  expect(() => {
    c.step = 0;
  }).toThrow();
  expect(() => {
    c.min = Infinity;
  }).toThrow();
  c.formatOptions = { style: "percent" };
  expect(c.step).toBe(0.01);
  c.largeStep = 5;
  expect(c.largeStep).toBe(5);
  c.largeStep = undefined;
  expect(c.largeStep).toBe(0.1);
  c.remove();
});

test("derived modifier steps retain decimal precision", async () => {
  const c = await mount();
  c.step = 0.14;
  expect(c.largeStep).toBe(1.4);
  c.step = 0.7;
  expect(c.smallStep).toBe(0.07);
  c.remove();
});

test("Number Input actions transfer ownership on DOM moves and reconnect", async () => {
  const app = document.createElement("div");
  app.innerHTML = '<acme-number-input id="left" value="1"></acme-number-input><acme-number-input id="right" value="10"></acme-number-input>';
  const parts = document.createElement("div");
  parts.innerHTML = "<acme-number-input-increment></acme-number-input-increment><acme-number-input-decrement></acme-number-input-decrement>";
  app.querySelector("acme-number-input")!.append(...parts.children);
  const settle = async () => {
    for (let i = 0; i < 3; i++) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  };
  document.body.append(app);
  try {
    await settle();
    const left = app.querySelectorAll("acme-number-input")[0]!;
    const right = app.querySelectorAll("acme-number-input")[1]!;
    const increment = app.querySelector("acme-number-input-increment")!;
    const decrement = app.querySelector("acme-number-input-decrement")!;
    increment.removeAttribute("slot");
    decrement.removeAttribute("slot");
    right.append(increment, decrement);
    await settle();
    increment.click();
    expect([left.value, right.value]).toEqual(["1", "11"]);
    decrement.click();
    expect([left.value, right.value]).toEqual(["1", "10"]);
    app.append(increment, decrement);
    await settle();
    for (const part of [increment, decrement]) {
      expect(part.shadowRoot!.querySelector("button")!.disabled).toBe(true);
    }
  } finally {
    app.remove();
  }
});
