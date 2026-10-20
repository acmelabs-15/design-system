import { expect, test } from "bun:test";
import "../../../all";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.querySelector("acme-input")!;
  await el.updateComplete;
  return el;
};
test("Input carries canonical value, constraints and Field presentation to one native target", async () => {
  const el = await mount('<acme-input aria-label="Email" type="email" required invalid size="large" placeholder="Address" value="first"></acme-input>');
  const input = el.shadowRoot!.querySelector("input")!;
  expect(input.type).toBe("email");
  expect(input.required).toBe(true);
  expect(input.placeholder).toBe("Address");
  expect(input.getAttribute("aria-label")).toBe("Email");
  expect(input.getAttribute("aria-invalid")).toBe("true");
  el.value = "next";
  expect(input.value).toBe("next");
  expect(el.defaultValue).toBe("first");
  el.formResetCallback();
  expect(el.value).toBe("first");
});
test("all four affix positions retain independent author content", async () => {
  const el = await mount('<acme-input><span slot="start">Inside</span><button slot="start-addon">Outside</button><span slot="end">End</span><button slot="end-addon">Action</button></acme-input>');
  for (const name of ["start", "start-addon", "end", "end-addon"]) {
    expect(el.shadowRoot!.querySelector(`slot[name="${name}"]`)).not.toBeNull();
  }
  expect(el.querySelectorAll("button")).toHaveLength(2);
  expect(el.shadowRoot!.querySelector("[aria-hidden]")).toBeNull();
});
test("user input and commit have distinct events, programmatic writes stay silent", async () => {
  const el = await mount("<acme-input clearable></acme-input>");
  const seen: unknown[] = [];
  for (const event of ["acme-input", "acme-change"]) {
    el.addEventListener(event, (e) => seen.push([event, (e as CustomEvent).detail.value]));
  }
  el.value = "silent";
  expect(seen).toEqual([]);
  const input = el.shadowRoot!.querySelector("input")!;
  input.value = "edit";
  input.dispatchEvent(new Event("input"));
  expect(seen).toEqual([["acme-input", "edit"]]);
  input.dispatchEvent(new Event("change"));
  expect(seen).toEqual([
    ["acme-input", "edit"],
    ["acme-change", "edit"],
  ]);
  seen.length = 0;
  el.clear();
  expect(seen).toEqual([
    ["acme-input", ""],
    ["acme-change", ""],
  ]);
  el.clear();
  expect(seen).toHaveLength(2);
});
test("disabled and readonly block clear without overwriting current state", async () => {
  const el = await mount('<acme-input value="keep" disabled></acme-input>');
  el.clear();
  expect(el.value).toBe("keep");
  el.disabled = false;
  el.readOnly = true;
  el.clear();
  expect(el.value).toBe("keep");
  el.readOnly = false;
  el.clear();
  expect(el.value).toBe("");
});
test("type and string constraints reject unsupported API values", async () => {
  const el = await mount("<acme-input></acme-input>");
  expect(() => {
    el.type = "number" as never;
  }).toThrow();
  expect(() => {
    el.minLength = -2;
  }).toThrow();
  expect(() => {
    el.maxLength = 1.5;
  }).toThrow();
  el.pattern = "[A-Z]+";
  expect(el.shadowRoot!.querySelector("input")!.pattern).toBe("[A-Z]+");
  el.pattern = "";
  expect(el.shadowRoot!.querySelector("input")!.hasAttribute("pattern")).toBe(false);
});

test("removing type restores native text behavior", async () => {
  const el = await mount('<acme-input type="email"></acme-input>');
  el.removeAttribute("type");
  expect(el.type).toBe("text");
  expect(el.shadowRoot!.querySelector("input")!.type).toBe("text");
});
