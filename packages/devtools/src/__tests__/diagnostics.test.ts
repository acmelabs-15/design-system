import { expect, test } from "bun:test";
import { LitElement, html } from "lit";
import { DiagnosticObserver, safeValue, type DiagnosticMetadata } from "../diagnostics";
class DiagnosticFixture extends LitElement {
  static properties = { value: {}, type: {}, name: {}, privateValue: {} };
  declare value: string;
  declare type: string;
  declare name: string;
  declare privateValue: string;
  constructor() {
    super();
    this.value = "initial";
    this.type = "text";
    this.name = "label";
    this.privateValue = "not public";
  }
  render() {
    return html`<span>${this.value}</span>`;
  }
}
if (!customElements.get("acme-diagnostic-fixture")) customElements.define("acme-diagnostic-fixture", DiagnosticFixture);
const metadata: DiagnosticMetadata = {
  version: "0.2.0",
  contracts: [
    {
      properties: ["value", "type", "name"],
      attributes: ["value", "name"],
      events: ["acme-change"],
      states: [],
      cssProperties: [],
    },
  ],
  tags: { "acme-diagnostic-fixture": 0 },
  tokens: [],
};
const tick = async () => {
  await new Promise((resolve) => setTimeout(resolve, 0));
};
test("public property snapshots update without changing component state or reading undeclared fields", async () => {
  const root = document.createElement("div"),
    host = document.createElement("acme-diagnostic-fixture") as DiagnosticFixture;
  root.append(host);
  document.body.append(root);
  await host.updateComplete;
  const observer = new DiagnosticObserver(metadata, { root });
  observer.start();
  expect(observer.getSnapshot().components[0]!.inputs).toEqual({ value: "initial", type: "text", name: "label" });
  host.value = "changed";
  await host.updateComplete;
  await tick();
  expect(observer.getSnapshot().components[0]!.inputs.value).toBe("changed");
  expect(host.value).toBe("changed");
  expect(host.privateValue).toBe("not public");
  observer.stop();
  expect(observer.getSnapshot().components).toHaveLength(0);
  root.remove();
});
test("root scoping, stable event identity, bounded events and detach/reconnect cleanup", async () => {
  const root = document.createElement("div"),
    host = document.createElement("acme-diagnostic-fixture") as DiagnosticFixture,
    outside = document.createElement("acme-diagnostic-fixture");
  root.append(host);
  document.body.append(root, outside);
  await host.updateComplete;
  const observer = new DiagnosticObserver(metadata, { root, eventLimit: 2 });
  observer.start();
  const identity = observer.getSnapshot().components[0]!.id;
  for (let index = 0; index < 4; index++)
    host.dispatchEvent(new CustomEvent("acme-change", { detail: { value: index }, bubbles: true, composed: true }));
  outside.dispatchEvent(
    new CustomEvent("acme-change", { detail: { value: "outside" }, bubbles: true, composed: true }),
  );
  await tick();
  expect(observer.getSnapshot().events.map((event) => event.detail)).toEqual([{ value: 2 }, { value: 3 }]);
  expect(observer.getSnapshot().events.every((event) => event.componentId === identity)).toBe(true);
  host.remove();
  await tick();
  expect(observer.getSnapshot().components).toHaveLength(0);
  host.dispatchEvent(new CustomEvent("acme-change", { detail: "detached" }));
  await tick();
  expect(observer.getSnapshot().events).toHaveLength(2);
  root.append(host);
  await host.updateComplete;
  await tick();
  expect(observer.getSnapshot().components[0]!.id).toBe(identity);
  observer.stop();
  host.dispatchEvent(new CustomEvent("acme-change", { detail: "stopped" }));
  await tick();
  expect(observer.getSnapshot().events).toHaveLength(0);
  observer.start();
  await tick();
  expect(observer.getSnapshot().components).toHaveLength(1);
  observer.stop();
  root.remove();
  outside.remove();
});
test("sensitive property-only values and event payloads are redacted before retention", async () => {
  const root = document.createElement("div"),
    host = document.createElement("acme-diagnostic-fixture") as DiagnosticFixture;
  host.type = "password";
  host.value = "hidden";
  root.append(host);
  document.body.append(root);
  await host.updateComplete;
  const observer = new DiagnosticObserver(metadata, { root });
  observer.start();
  host.dispatchEvent(new CustomEvent("acme-change", { detail: { value: "hidden" } }));
  await tick();
  expect(observer.getSnapshot().components[0]!.inputs.value).toBe("[redacted]");
  expect(observer.getSnapshot().events[0]!.detail).toBe("[redacted]");
  expect(JSON.stringify(observer.getSnapshot())).not.toContain("hidden");
  observer.stop();
  const explicit = new DiagnosticObserver(metadata, { root, includeSensitiveValues: true });
  explicit.start();
  expect(explicit.getSnapshot().components[0]!.inputs.value).toBe("hidden");
  explicit.stop();
  root.remove();
});
test("safe snapshots bound data and omit getters, nodes, nested secrets and cycles", () => {
  let reads = 0;
  const value = {
    password: "hidden",
    visible: "shown",
    get dangerous() {
      reads++;
      return "leak";
    },
    node: document.body,
  };
  expect(safeValue(value)).toEqual({
    password: "[redacted]",
    visible: "shown",
    dangerous: "[accessor]",
    node: "[DOM node]",
  });
  expect(reads).toBe(0);
  const cycle: Record<string, unknown> = {};
  cycle.self = cycle;
  expect(safeValue(cycle)).toEqual({ self: "[circular]" });
  expect((safeValue("x".repeat(1000)) as string).length).toBe(501);
  expect((safeValue(Array.from({ length: 100 }, (_, index) => index)) as unknown[]).length).toBe(20);
  expect(() => new DiagnosticObserver(metadata, { root: document.body, eventLimit: 1001 })).toThrow();
});
test("public theme updates on an ancestor invalidate only scoped component snapshots", async () => {
  const ancestor = document.createElement("acme-diagnostic-fixture") as DiagnosticFixture,
    root = document.createElement("div"),
    host = document.createElement("acme-diagnostic-fixture") as DiagnosticFixture;
  root.append(host);
  ancestor.append(root);
  document.body.append(ancestor);
  await Promise.all([host.updateComplete, ancestor.updateComplete]);
  const observer = new DiagnosticObserver(metadata, { root });
  observer.start();
  let publications = 0;
  const unsubscribe = observer.subscribe(() => publications++);
  host.setAttribute("data-dark", "");
  ancestor.value = "theme update";
  await ancestor.updateComplete;
  await tick();
  expect(observer.getSnapshot().components).toHaveLength(1);
  expect(observer.getSnapshot().components[0]!.theme.appearance).toBe("dark");
  expect(publications).toBeGreaterThan(1);
  unsubscribe();
  observer.stop();
  ancestor.remove();
});
test("public getter synchronization does not create an internal-attribute observation loop", async () => {
  const root = document.createElement("div"),
    host = document.createElement("acme-diagnostic-fixture") as DiagnosticFixture;
  root.append(host);
  document.body.append(root);
  await host.updateComplete;
  let reads = 0;
  Object.defineProperty(host, "synchronized", {
    get() {
      reads++;
      if (reads > 10) throw new Error("Observation loop");
      host.shadowRoot!.querySelector("span")!.setAttribute("data-native-validity", "valid");
      return "valid";
    },
  });
  const local = { ...metadata, contracts: [{ ...metadata.contracts[0]!, properties: ["synchronized"] }] };
  const observer = new DiagnosticObserver(local, { root });
  observer.start();
  await tick();
  expect(reads).toBe(1);
  expect(observer.getSnapshot().components[0]!.inputs.synchronized).toBe("valid");
  host.shadowRoot!.querySelector("span")!.setAttribute("data-native-validity", "changed");
  await tick();
  expect(reads).toBe(1);
  observer.stop();
  root.remove();
});
