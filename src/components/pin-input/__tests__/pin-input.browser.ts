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
export async function pinInputSlotRegression() {
  const app = document.createElement("div");
  app.attachShadow({ mode: "open" }).innerHTML =
    '<acme-pin-input count="1" value=\'["1"]\'><slot name="left"></slot></acme-pin-input><acme-pin-input count="1" value=\'["2"]\'><slot name="right"></slot></acme-pin-input><slot name="orphan"></slot>';
  app.innerHTML = '<acme-pin-input-field index="0" slot="left"></acme-pin-input-field>';
  const settle = async () => {
    for (let i = 0; i < 3; i++) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  };
  document.body.append(app);
  try {
    await settle();
    const left = app.shadowRoot!.querySelectorAll("acme-pin-input")[0]!;
    const right = app.shadowRoot!.querySelectorAll("acme-pin-input")[1]!;
    const field = app.querySelector("acme-pin-input-field")!;
    const input = field.shadowRoot!.querySelector("input")!;
    field.slot = "right";
    await settle();
    expect(input.value).toBe("2");
    input.value = "3";
    input.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true, inputType: "insertText", data: "3" }));
    expect([left.value, right.value]).toEqual([["1"], ["3"]]);
    field.slot = "orphan";
    await settle();
    expect(input.disabled).toBe(true);
    expect(input.value).toBe("");
    field.slot = "left";
    await settle();
    expect(input.value).toBe("1");
    input.value = "4";
    input.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true, inputType: "insertText", data: "4" }));
    expect([left.value, right.value]).toEqual([["4"], ["3"]]);
  } finally {
    app.remove();
  }
}
