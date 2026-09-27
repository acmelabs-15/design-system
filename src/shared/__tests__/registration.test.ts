import { expect, test } from "bun:test";
import { registerElement } from "../registration";

const registry = () => {
  const definitions = new Map<string, CustomElementConstructor>();
  return { get: (name: string) => definitions.get(name), define: (name: string, constructor: CustomElementConstructor) => definitions.set(name, constructor) } as unknown as CustomElementRegistry;
};

test("registration is repeatable and preserves a compatible application subclass", () => {
  class Component {}
  class Application extends Component {}
  const base = Component as unknown as CustomElementConstructor;
  const derived = Application as unknown as CustomElementConstructor;
  const target = registry();
  registerElement(target, "acme-example", base);
  registerElement(target, "acme-example", base);
  expect(target.get("acme-example")).toBe(base);
  const local = registry();
  local.define("acme-example", derived);
  registerElement(local, "acme-example", base);
  expect(local.get("acme-example")).toBe(derived);
});

test("registration rejects unrelated constructors without replacing them", () => {
  class Component {}
  class Other {}
  const target = registry();
  const other = Other as unknown as CustomElementConstructor;
  target.define("acme-example", other);
  expect(() => registerElement(target, "acme-example", Component as unknown as CustomElementConstructor)).toThrow("Conflicting custom element registration: acme-example");
  expect(target.get("acme-example")).toBe(other);
});
