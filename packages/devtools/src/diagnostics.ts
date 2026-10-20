import type { ReactiveController, ReactiveControllerHost } from "lit";

export interface ComponentContract {
  properties: readonly string[];
  attributes: readonly string[];
  events: readonly string[];
  states: readonly string[];
  cssProperties: readonly string[];
}
export interface DiagnosticMetadata {
  version: string;
  contracts: readonly ComponentContract[];
  tags: Readonly<Record<string, number>>;
  tokens: readonly string[];
}
export type SafeValue = null | string | number | boolean | SafeValue[] | { [key: string]: SafeValue };
export interface ComponentSnapshot {
  id: number;
  tag: string;
  version: string;
  inputs: Record<string, SafeValue>;
  attributes: Record<string, SafeValue>;
  states: Record<string, boolean>;
  theme: { appearance: "light" | "dark"; values: Record<string, string> };
}
export interface PublicEventSnapshot {
  componentId: number;
  tag: string;
  type: string;
  time: number;
  detail: SafeValue;
}
export interface DiagnosticSnapshot {
  version: string;
  components: ComponentSnapshot[];
  events: PublicEventSnapshot[];
}
export interface DiagnosticOptions {
  root: Element;
  eventLimit?: number;
  includeSensitiveValues?: boolean;
}
type Host = HTMLElement & ReactiveControllerHost;
const sensitiveKey = /password|passwd|secret|token|credential|authorization|api[-_]?key|private[-_]?key|file/i;
const valueKey = /^(?:(?:default)?(?:value|values|text|content)|validationMessage)$/i;

/** Copy bounded data without invoking nested getters or retaining application objects. */
export function safeValue(value: unknown, includeSensitiveValues = false, key = "", depth = 0, seen = new WeakSet<object>()): SafeValue {
  if (!includeSensitiveValues && sensitiveKey.test(key)) {
    return "[redacted]";
  }
  if (value === null || typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    return value.length > 500 ? value.slice(0, 500) + "…" : value;
  }
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : String(value);
  }
  if (value === undefined) {
    return "[undefined]";
  }
  if (typeof value !== "object") {
    return `[${typeof value}]`;
  }
  if ("nodeType" in value) {
    return "[DOM node]";
  }
  if (typeof Blob !== "undefined" && value instanceof Blob) {
    return "[file]";
  }
  if (typeof ValidityState !== "undefined" && value instanceof ValidityState) {
    return {
      badInput: value.badInput,
      customError: value.customError,
      patternMismatch: value.patternMismatch,
      rangeOverflow: value.rangeOverflow,
      rangeUnderflow: value.rangeUnderflow,
      stepMismatch: value.stepMismatch,
      tooLong: value.tooLong,
      tooShort: value.tooShort,
      typeMismatch: value.typeMismatch,
      valid: value.valid,
      valueMissing: value.valueMissing,
    };
  }
  if (depth >= 3) {
    return "[depth limit]";
  }
  if (seen.has(value)) {
    return "[circular]";
  }
  seen.add(value);
  const descriptors = Object.getOwnPropertyDescriptors(value);
  if (Array.isArray(value)) {
    return Object.keys(descriptors)
      .filter((name) => /^\d+$/.test(name))
      .slice(0, 20)
      .map((name) => safeValue(descriptors[name]?.value, includeSensitiveValues, key, depth + 1, seen));
  }
  const result: Record<string, SafeValue> = Object.create(null);
  for (const [name, descriptor] of Object.entries(descriptors)
    .filter(([, descriptor]) => descriptor.enumerable)
    .slice(0, 30)) {
    result[name] = "value" in descriptor ? safeValue(descriptor.value, includeSensitiveValues, name, depth + 1, seen) : "[accessor]";
  }
  return result;
}

/** Opt-in Lit controller adapter; only generated public contracts are read. */
export class DiagnosticObserver {
  private readonly hosts = new Map<Host, { contract: ComponentContract; controller: ReactiveController; listeners: (() => void)[] }>();
  private readonly ids = new WeakMap<Element, number>();
  private nextId = 1;
  private readonly ancestorControllers = new Map<Host, ReactiveController>();
  private readonly observers = new Map<Node, MutationObserver>();
  private readonly subscribers = new Set<(snapshot: DiagnosticSnapshot) => void>();
  private active = false;
  private queued = false;
  private excluded?: Element;
  private events: PublicEventSnapshot[] = [];
  private snapshot: DiagnosticSnapshot;
  private readonly eventLimit: number;
  constructor(
    private readonly metadata: DiagnosticMetadata,
    private readonly options: DiagnosticOptions,
  ) {
    this.eventLimit = options.eventLimit ?? 100;
    if (!Number.isInteger(this.eventLimit) || this.eventLimit < 0 || this.eventLimit > 1000) {
      throw new TypeError("eventLimit must be an integer from 0 to 1000");
    }
    if (!options.root?.ownerDocument) {
      throw new TypeError("An explicit Element root is required");
    }
    this.snapshot = { version: metadata.version, components: [], events: [] };
  }
  subscribe(listener: (snapshot: DiagnosticSnapshot) => void): () => void {
    this.subscribers.add(listener);
    listener(this.getSnapshot());
    return () => {
      this.subscribers.delete(listener);
    };
  }
  getSnapshot(): DiagnosticSnapshot {
    return structuredClone(this.snapshot);
  }
  start(excluded?: Element): void {
    if (this.active) {
      return;
    }
    this.active = true;
    this.excluded = excluded;
    this.refresh();
  }
  stop(): void {
    this.active = false;
    for (const observer of this.observers.values()) {
      observer.disconnect();
    }
    this.observers.clear();
    for (const [host, controller] of this.ancestorControllers) {
      host.removeController(controller);
    }
    this.ancestorControllers.clear();
    for (const host of [...this.hosts.keys()]) {
      this.release(host);
    }
    this.events = [];
    this.snapshot = { version: this.metadata.version, components: [], events: [] };
    this.publish();
  }
  private queue = (): void => {
    if (!this.active || this.queued) {
      return;
    }
    this.queued = true;
    queueMicrotask(() => {
      this.queued = false;
      if (this.active) {
        this.refresh();
      }
    });
  };
  private scan(): { elements: Host[]; roots: Set<Node> } {
    const elements: Host[] = [],
      roots = new Set<Node>([this.options.root]);
    const visit = (element: Element) => {
      if (element === this.excluded) {
        return;
      }
      if (
        element.isConnected &&
        this.metadata.tags[element.localName] !== undefined &&
        typeof (element as Host).addController === "function" &&
        typeof (element as Host).removeController === "function"
      ) {
        elements.push(element as Host);
      }
      if (element.shadowRoot) {
        roots.add(element.shadowRoot);
        for (const child of element.shadowRoot.children) {
          visit(child);
        }
      }
      for (const child of element.children) {
        visit(child);
      }
    };
    visit(this.options.root);
    return { elements, roots };
  }
  private refresh(): void {
    const { elements, roots } = this.scan(),
      current = new Set(elements);
    const ancestors = new Set<Element>();
    let parent: Node | null = this.options.root.parentNode;
    while (parent) {
      if (parent.nodeType === 1) {
        ancestors.add(parent as Element);
      }
      parent = parent.parentNode ?? (parent.nodeType === 11 && "host" in parent ? (parent as ShadowRoot).host : null);
    }
    for (const [host, controller] of this.ancestorControllers) {
      if (!ancestors.has(host)) {
        host.removeController(controller);
        this.ancestorControllers.delete(host);
      }
    }
    for (const ancestor of ancestors) {
      roots.add(ancestor);
      const host = ancestor as Host;
      if (typeof host.addController === "function" && typeof host.removeController === "function" && !this.ancestorControllers.has(host)) {
        const controller: ReactiveController = { hostUpdated: this.queue, hostDisconnected: this.queue };
        this.ancestorControllers.set(host, controller);
        host.addController(controller);
      }
    }
    for (const [root, observer] of this.observers) {
      if (!roots.has(root)) {
        observer.disconnect();
        this.observers.delete(root);
      }
    }
    const Observer = this.options.root.ownerDocument.defaultView!.MutationObserver;
    for (const root of roots) {
      if (!this.observers.has(root)) {
        const observer = new Observer((records) => {
          if (
            records.some((record) => {
              if (this.excluded?.contains(record.target)) {
                return false;
              }
              if (record.type === "childList") {
                return true;
              }
              const target = record.target as Element;
              const name = record.attributeName;
              if (!name || record.oldValue === target.getAttribute(name)) {
                return false;
              }
              if (ancestors.has(target)) {
                return ["class", "style", "dir", "lang"].includes(name) || name.startsWith("data-acme-");
              }
              return this.hosts.has(target as Host) && (["class", "style", "data-dark"].includes(name) || this.hosts.get(target as Host)!.contract.attributes.includes(name));
            })
          ) {
            this.queue();
          }
        });
        observer.observe(root, ancestors.has(root as Element) ? { attributes: true, attributeOldValue: true } : { subtree: true, childList: true, attributes: true, attributeOldValue: true });
        this.observers.set(root, observer);
      }
    }
    for (const host of this.hosts.keys()) {
      if (!current.has(host)) {
        this.release(host);
      }
    }
    for (const host of elements) {
      if (!this.hosts.has(host)) {
        this.attach(host);
      }
    }
    const snapshot: DiagnosticSnapshot = {
      version: this.metadata.version,
      components: elements.map((host) => this.read(host)),
      events: this.events.slice(),
    };
    if (JSON.stringify(snapshot) !== JSON.stringify(this.snapshot)) {
      this.snapshot = snapshot;
      this.publish();
    }
  }
  private attach(host: Host): void {
    const contract = this.metadata.contracts[this.metadata.tags[host.localName]!]!;
    if (!this.ids.has(host)) {
      this.ids.set(host, this.nextId++);
    }
    const controller: ReactiveController = {
      hostUpdated: this.queue,
      hostDisconnected: () => {
        this.release(host);
        this.queue();
      },
    };
    const listeners: (() => void)[] = [];
    this.hosts.set(host, { contract, controller, listeners });
    host.addController(controller);
    for (const type of contract.events) {
      const listener = (event: Event) => {
        const origin = event.composedPath().find((node) => this.hosts.has(node as Host));
        if (origin !== host || !this.active || !this.eventLimit) {
          return;
        }
        const detail = this.isSensitive(host) && !this.options.includeSensitiveValues ? "[redacted]" : safeValue((event as CustomEvent).detail, this.options.includeSensitiveValues);
        this.events.push({ componentId: this.ids.get(host)!, tag: host.localName, type, time: Date.now(), detail });
        this.events = this.events.slice(-this.eventLimit);
        this.queue();
      };
      host.addEventListener(type, listener, true);
      listeners.push(() => host.removeEventListener(type, listener, true));
    }
  }
  private release(host: Host): void {
    const entry = this.hosts.get(host);
    if (!entry) {
      return;
    }
    host.removeController(entry.controller);
    for (const remove of entry.listeners) {
      remove();
    }
    this.hosts.delete(host);
  }
  private isSensitive(host: Host): boolean {
    const properties = this.hosts.get(host)?.contract.properties ?? [];
    const read = (name: string) => {
      try {
        return properties.includes(name) ? String((host as unknown as Record<string, unknown>)[name] ?? "") : (host.getAttribute(name) ?? "");
      } catch {
        return "";
      }
    };
    return sensitiveKey.test(host.localName) || ["password", "file"].includes(read("type")) || sensitiveKey.test(read("name")) || sensitiveKey.test(read("autocomplete"));
  }
  private read(host: Host): ComponentSnapshot {
    const contract = this.hosts.get(host)!.contract,
      inputs: Record<string, SafeValue> = {},
      attributes: Record<string, SafeValue> = {},
      states: Record<string, boolean> = {},
      values: Record<string, string> = {};
    const sensitive = this.isSensitive(host) && !this.options.includeSensitiveValues;
    for (const name of contract.properties) {
      if (sensitive && valueKey.test(name)) {
        inputs[name] = "[redacted]";
        continue;
      }
      try {
        inputs[name] = safeValue((host as unknown as Record<string, unknown>)[name], this.options.includeSensitiveValues, name);
      } catch {
        inputs[name] = "[unavailable]";
      }
    }
    for (const name of contract.attributes) {
      if (host.hasAttribute(name)) {
        attributes[name] = sensitive && valueKey.test(name) ? "[redacted]" : safeValue(host.getAttribute(name), this.options.includeSensitiveValues, name);
      }
    }
    for (const name of contract.states) {
      try {
        states[name] = host.matches(`:state(${name})`);
      } catch {
        states[name] = false;
      }
    }
    const css = host.ownerDocument.defaultView!.getComputedStyle(host);
    for (const name of new Set([...this.metadata.tokens, ...contract.cssProperties])) {
      values[name] = css.getPropertyValue(name).trim();
    }
    return {
      id: this.ids.get(host)!,
      tag: host.localName,
      version: this.metadata.version,
      inputs,
      attributes,
      states,
      theme: { appearance: host.hasAttribute("data-dark") ? "dark" : "light", values },
    };
  }
  private publish(): void {
    for (const listener of this.subscribers) {
      listener(this.getSnapshot());
    }
  }
}
