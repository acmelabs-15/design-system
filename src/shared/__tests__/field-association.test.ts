import { expect, test } from "bun:test";
import { FieldAssociation, FieldRegistry, type FieldDescription } from "../field-association";

const description: FieldDescription = { label: "Email", help: "Use your work address", error: "Enter an address", invalid: false, required: true, disabled: false };
test("a Field associates one logical control and disables ambiguous associations", () => {
  const warnings: string[] = [];
  const field = new FieldRegistry((message) => warnings.push(message));
  let first: FieldDescription | undefined,
    second: FieldDescription | undefined,
    activations = 0;
  field.set(description);
  const releaseFirst = field.register({
    associate: (value) => {
      first = value;
    },
    activate: () => activations++,
  });
  expect(first?.label).toBe("Email");
  field.activate();
  expect(activations).toBe(1);
  const releaseSecond = field.register({
    associate: (value) => {
      second = value;
    },
    activate: () => activations++,
  });
  expect(first).toBeUndefined();
  expect(second).toBeUndefined();
  expect(warnings.length).toBe(1);
  field.activate();
  expect(activations).toBe(1);
  releaseSecond();
  expect(first?.required).toBe(true);
  field.set({ ...description, disabled: true });
  field.activate();
  expect(activations).toBe(1);
  releaseFirst();
  releaseFirst();
  expect(first).toBeUndefined();
});

test("association supplies semantic defaults without competing DOM attribute writes", () => {
  const host = document.createElement("div"),
    root = host.attachShadow({ mode: "open" }),
    input = document.createElement("input");
  input.setAttribute("aria-describedby", "external-help");
  root.append(input);
  document.body.append(host);
  const association = new FieldAssociation();
  association.update({ ...description, label: "<b>Email</b>" });
  association.attach(input);
  const defaults = association.defaults;
  expect(defaults.labelledByElements?.[0].textContent).toBe("<b>Email</b>");
  expect(defaults.labelledByElements?.[0].children.length).toBe(0);
  expect(defaults.describedByElements).toHaveLength(1);
  expect(input.getAttribute("aria-describedby")).toBe("external-help");
  expect(input.hasAttribute("aria-labelledby")).toBe(false);
  association.update({ ...description, invalid: true });
  expect(association.defaults.describedByElements).toHaveLength(2);
  association.detach();
  expect(input.getAttribute("aria-describedby")).toBe("external-help");
  expect(root.querySelectorAll("span")).toHaveLength(0);
  host.remove();
});
test("moving a target rehomes stable owned references", () => {
  const host = document.createElement("div"),
    other = document.createElement("div"),
    a = host.attachShadow({ mode: "open" }),
    b = other.attachShadow({ mode: "open" }),
    input = document.createElement("input");
  document.body.append(host, other);
  a.append(input);
  const association = new FieldAssociation();
  association.update(description);
  association.attach(input);
  const id = association.defaults.labelledByElements![0].id;
  b.append(input);
  association.attach(input);
  expect(association.defaults.labelledByElements![0].id).toBe(id);
  expect(a.querySelector("span")).toBeNull();
  expect(association.defaults.labelledByElements![0].getRootNode()).toBe(b);
  association.detach();
  host.remove();
  other.remove();
});

test("moving one control to another Field releases the old owner safely", () => {
  const first = new FieldRegistry(),
    second = new FieldRegistry();
  first.set(description);
  second.set({ ...description, label: "New label" });
  let current: FieldDescription | undefined;
  const participant = {
    associate: (value: FieldDescription | undefined) => {
      current = value;
    },
    activate: () => {},
  };
  const old = first.register(participant);
  second.register(participant);
  expect(current?.label).toBe("New label");
  old();
  first.clear();
  expect(current?.label).toBe("New label");
  second.clear();
  expect(current).toBeUndefined();
});
