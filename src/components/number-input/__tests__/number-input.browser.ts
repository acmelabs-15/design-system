const expect = (actual: unknown) => ({
  toEqual(expected: unknown) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
    }
  },
  toBe(expected: unknown) {
    if (actual !== expected) {
      throw new Error(`Expected ${expected}, received ${actual}`);
    }
  },
});
export async function numberInputSlotRegression() {
  const app = document.createElement("div");
  app.attachShadow({ mode: "open" }).innerHTML =
    '<acme-number-input id="left" value="1"><slot name="left"></slot></acme-number-input><acme-number-input id="right" value="10"><slot name="right"></slot></acme-number-input><slot name="orphan"></slot>';
  app.innerHTML = '<acme-number-input-increment slot="left"></acme-number-input-increment><acme-number-input-decrement slot="left"></acme-number-input-decrement>';
  const settle = async () => {
    for (let i = 0; i < 3; i++) {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    }
  };
  document.body.append(app);
  try {
    await settle();
    const left = app.shadowRoot!.querySelectorAll("acme-number-input")[0]!;
    const right = app.shadowRoot!.querySelectorAll("acme-number-input")[1]!;
    const increment = app.querySelector("acme-number-input-increment")!;
    const decrement = app.querySelector("acme-number-input-decrement")!;
    increment.slot = decrement.slot = "right";
    await settle();
    increment.click();
    expect([left.value, right.value]).toEqual(["1", "11"]);
    decrement.click();
    expect([left.value, right.value]).toEqual(["1", "10"]);
    increment.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, composed: true, button: 0, pointerId: 1, isPrimary: true }));
    expect([left.value, right.value]).toEqual(["1", "11"]);
    increment.slot = decrement.slot = "orphan";
    await settle();
    for (const part of [increment, decrement]) {
      expect(part.shadowRoot!.querySelector("button")!.disabled).toBe(true);
    }
    await new Promise((resolve) => {
      setTimeout(resolve, 400);
    });
    expect([left.value, right.value]).toEqual(["1", "11"]);
    increment.slot = decrement.slot = "left";
    await settle();
    increment.click();
    expect([left.value, right.value]).toEqual(["2", "11"]);
  } finally {
    app.remove();
  }
}
