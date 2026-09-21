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

test("association owns only its mirror references and uses text rather than markup", () => {
  const host = document.createElement("div");
  const root = host.attachShadow({ mode: "open" });
  const input = document.createElement("input");
  input.setAttribute("aria-describedby", "external-help");
  root.append(input);
  document.body.append(host);
  const association = new FieldAssociation();
  association.update({ ...description, label: "<b>Email</b>" });
  association.attach(input);
  const label = root.getElementById(input.getAttribute("aria-labelledby")!)!;
  expect(label.textContent).toBe("<b>Email</b>");
  expect(label.children.length).toBe(0);
  expect(input.getAttribute("aria-describedby")!.split(" ").length).toBe(2);
  association.update({ ...description, invalid: true });
  expect(input.getAttribute("aria-describedby")!.split(" ").length).toBe(3);
  input.setAttribute("aria-describedby", `${input.getAttribute("aria-describedby")} later-help`);
  association.update(description);
  expect(input.getAttribute("aria-describedby")!.split(" ").length).toBe(3);
  association.detach();
  expect(input.getAttribute("aria-describedby")).toBe("external-help later-help");
  expect(input.hasAttribute("aria-labelledby")).toBe(false);
  expect(root.querySelectorAll("span").length).toBe(0);
  host.remove();
});

test("moving a target rehomes stable mirror IDs into its new root", () => {
  const host = document.createElement("div"),
    other = document.createElement("div");
  const root = host.attachShadow({ mode: "open" }),
    otherRoot = other.attachShadow({ mode: "open" });
  const input = document.createElement("input");
  root.append(input);
  document.body.append(host, other);
  const association = new FieldAssociation();
  association.update(description);
  association.attach(input);
  const id = input.getAttribute("aria-labelledby");
  otherRoot.append(input);
  association.attach(input);
  expect(input.getAttribute("aria-labelledby")).toBe(id);
  expect(root.querySelector("span")).toBeNull();
  expect(otherRoot.getElementById(id!)?.textContent).toBe("Email");
  association.detach();
  host.remove();
  other.remove();
});
