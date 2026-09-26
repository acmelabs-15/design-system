import { describe, expect, test } from "bun:test";
import { html, LitElement } from "lit";
import type { ResponsiveInput } from "../responsive";
import { StyleInputController } from "../style-input-controller";
import { styleInputSchema } from "../style-input-schema";

const properties = ["padding", "paddingInline", "backgroundColor"] as const;
type Key = (typeof properties)[number];
class CaptureHost extends LitElement {
  static properties = { labelText: { attribute: "label-text" } };
  static deferred = false;
  static get observedAttributes() {
    return [...super.observedAttributes, ...properties.map((key) => styleInputSchema[key].attribute)];
  }
  controller?: StyleInputController<Key>;
  labelText = "";
  diagnostics: unknown[] = [];
  beforeAttribute?: (name: string, oldValue: string | null, value: string | null) => void;
  constructor() {
    super();
    if (!(this.constructor as typeof CaptureHost).deferred) {
      this.initialize();
    }
  }
  initialize() {
    this.controller = new StyleInputController(this, properties, {
      supports: (_property, value) => /^\d+px$/.test(value) || ["red", "blue"].includes(value),
      diagnostic: (value) => this.diagnostics.push(value),
    });
  }
  get padding(): ResponsiveInput<string | number> {
    return this.controller?.get("padding");
  }
  set padding(value: ResponsiveInput<string | number>) {
    this.controller!.set("padding", value);
  }
  get paddingInline(): ResponsiveInput<string | number> {
    return this.controller?.get("paddingInline");
  }
  set paddingInline(value: ResponsiveInput<string | number>) {
    this.controller!.set("paddingInline", value);
  }
  get backgroundColor(): ResponsiveInput<string> {
    return this.controller?.get("backgroundColor");
  }
  set backgroundColor(value: ResponsiveInput<string>) {
    this.controller!.set("backgroundColor", value);
  }
  attributeChangedCallback(name: string, oldValue: string | null, value: string | null) {
    this.beforeAttribute?.(name, oldValue, value);
    if (!this.controller?.attributeChanged(name, oldValue, value)) {
      super.attributeChangedCallback(name, oldValue, value);
    }
  }
  render() {
    return html`${JSON.stringify(this.controller?.entries.get())}`;
  }
}
class DeferredCaptureHost extends CaptureHost {
  static deferred = true;
}
customElements.define("style-capture-test", CaptureHost);
customElements.define("style-capture-deferred-test", DeferredCaptureHost);
const ready = () => document.createElement("style-capture-test") as CaptureHost;
const deferred = () => document.createElement("style-capture-deferred-test") as DeferredCaptureHost;
const order = (host: CaptureHost) => host.controller!.entries.get().map(([key]) => key);
const initializeWithQueuedAttributes = (host: CaptureHost) => {
  const initial = [...host.attributes].map((attribute) => [attribute.name, attribute.value] as const);
  host.initialize();
  // Unit model of native upgrade reactions; the same cases also run in real browser upgrades.
  for (const [name, value] of initial) {
    host.attributeChangedCallback(name, null, value);
  }
};

describe("style input capture", () => {
  test("captures actual attribute order and composes ordinary observed attributes", () => {
    const host = deferred();
    host.setAttribute("padding-inline", "2");
    host.setAttribute("padding", "4");
    host.setAttribute("label-text", "ordinary");
    initializeWithQueuedAttributes(host);
    expect(order(host)).toEqual(["paddingInline", "padding"]);
    expect(host.padding).toBe(4);
    expect(host.labelText).toBe("ordinary");
    expect(CaptureHost.observedAttributes).toEqual(["label-text", "padding", "padding-inline", "background-color"]);
    expect(CaptureHost.elementProperties.has("padding")).toBe(false);
  });

  test("captures non-enumerable own data properties in their creation order before connection", () => {
    const host = deferred();
    Object.defineProperty(host, "paddingInline", { value: 2, configurable: true, enumerable: false });
    Object.defineProperty(host, "padding", { value: 4, configurable: true, enumerable: true });
    host.initialize();
    expect(host.isConnected).toBe(false);
    expect(order(host)).toEqual(["paddingInline", "padding"]);
    expect(host.paddingInline).toBe(2);
    expect(host.padding).toBe(4);
    expect(Object.hasOwn(host, "padding")).toBe(false);
    expect(Object.hasOwn(host, "paddingInline")).toBe(false);
  });

  test("rejects own accessors without invoking them or deleting other inputs", () => {
    const host = deferred();
    Object.defineProperty(host, "padding", { value: 4, configurable: true });
    let reads = 0;
    Object.defineProperty(host, "paddingInline", { configurable: true, get: () => ++reads });
    expect(() => host.initialize()).toThrow("configurable data properties");
    expect(reads).toBe(0);
    expect(Object.hasOwn(host, "padding")).toBe(true);
  });

  test("rejects non-configurable own inputs and conflicting Lit property metadata", () => {
    const host = deferred();
    Object.defineProperty(host, "padding", { value: 4 });
    expect(() => host.initialize()).toThrow("configurable data properties");
    class RegisteredStyle extends DeferredCaptureHost {
      static properties = { ...CaptureHost.properties, padding: {} };
    }
    customElements.define("style-capture-wrong-metadata", RegisteredStyle);
    const wrong = document.createElement("style-capture-wrong-metadata") as RegisteredStyle;
    expect(() => wrong.initialize()).toThrow("outside Lit property metadata");
  });

  test("initial attribute replay does not replace early property values", () => {
    const host = deferred();
    host.setAttribute("padding-inline", "1");
    host.setAttribute("padding", "2");
    Object.defineProperty(host, "paddingInline", { value: 3, configurable: true });
    Object.defineProperty(host, "padding", { value: 4, configurable: true });
    initializeWithQueuedAttributes(host);
    expect(host.controller!.entries.get()).toEqual([
      ["paddingInline", 3],
      ["padding", 4],
    ]);
  });

  test("same-text writes and removal/re-addition before connection remain real changes", () => {
    const host = deferred();
    host.setAttribute("padding-inline", "1");
    host.setAttribute("padding", "2");
    initializeWithQueuedAttributes(host);
    host.padding = 4;
    host.setAttribute("padding", "2");
    expect(host.padding).toBe(2);
    host.removeAttribute("padding-inline");
    expect(host.paddingInline).toBeUndefined();
    host.setAttribute("padding-inline", "1");
    expect(order(host)).toEqual(["padding", "paddingInline"]);
    expect(host.paddingInline).toBe(1);
  });

  test("reentrant attribute changes cannot discard other pending initial callbacks", () => {
    const host = deferred();
    host.setAttribute("padding-inline", "1");
    host.setAttribute("padding", "2");
    Object.defineProperty(host, "paddingInline", { value: 3, configurable: true });
    Object.defineProperty(host, "padding", { value: 4, configurable: true });
    host.beforeAttribute = (name, oldValue) => {
      if (name === "padding-inline" && oldValue === null) {
        host.setAttribute("padding", "6");
      }
    };
    initializeWithQueuedAttributes(host);
    expect(host.controller!.entries.get()).toEqual([
      ["paddingInline", 3],
      ["padding", 6],
    ]);
  });

  test("direct updates retain position; undefined removes it and re-addition appends", () => {
    const host = ready();
    host.paddingInline = 2;
    host.padding = 4;
    const changes: unknown[] = [];
    const subscription = host.controller!.entries.subscribe((value) => changes.push(value));
    host.paddingInline = 2;
    expect(changes).toEqual([]);
    host.paddingInline = 1;
    expect(order(host)).toEqual(["paddingInline", "padding"]);
    host.paddingInline = undefined;
    host.paddingInline = 2;
    expect(order(host)).toEqual(["padding", "paddingInline"]);
    subscription.unsubscribe();
  });

  test("invalid HTML clears its override and reports a diagnostic while unrelated values survive", () => {
    const host = ready();
    host.backgroundColor = "red";
    host.padding = 2;
    host.setAttribute("padding", "{bad");
    expect(host.padding).toBeUndefined();
    expect(host.backgroundColor).toBe("red");
    expect(host.diagnostics).toEqual([{ property: "padding", attribute: "padding", code: "invalid-responsive-attribute", reason: "syntax" }]);
    host.setAttribute("padding", "0");
    expect(host.padding).toBe(0);
    host.setAttribute("padding", "");
    expect(host.padding).toBeUndefined();
  });

  test("keeps responsive authored shape and owns copies rather than viewport results", () => {
    const host = ready();
    const value = { compact: 1, medium: 2 };
    host.padding = value;
    value.medium = 4;
    expect(host.padding).toEqual({ compact: 1, medium: 2 });
    host.setAttribute("padding-inline", "[0,null,4]");
    expect(host.paddingInline).toEqual([0, null, 4]);
    expect(Object.isFrozen(host.padding)).toBe(true);
  });

  test("disconnected attributes and properties update canonical state and render on reconnect", async () => {
    const host = ready();
    document.body.append(host);
    await host.updateComplete;
    host.remove();
    host.setAttribute("padding-inline", "2");
    host.padding = 4;
    expect(host.controller!.entries.get()).toEqual([
      ["paddingInline", 2],
      ["padding", 4],
    ]);
    document.body.append(host);
    await host.updateComplete;
    expect(host.shadowRoot?.textContent).toBe(
      JSON.stringify([
        ["paddingInline", 2],
        ["padding", 4],
      ]),
    );
    host.remove();
  });
});
