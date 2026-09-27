/** Register one constructor without replacing a compatible application subclass. */
export function registerElement(registry: CustomElementRegistry, name: string, constructor: CustomElementConstructor): void {
  const existing = registry.get(name);
  if (!existing) {
    registry.define(name, constructor);
  } else if (existing !== constructor && !Object.prototype.isPrototypeOf.call(constructor.prototype, existing.prototype)) {
    throw new TypeError(`Conflicting custom element registration: ${name}`);
  }
}
