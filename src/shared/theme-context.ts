import { ContextEvent, ContextProvider, ContextRoot, createContext } from "@lit/context";
import { batch, createAtom, type ReadonlyAtom } from "@tanstack/lit-store";
import type { ReactiveController, ReactiveControllerHost } from "lit";
import { acquireSystemAppearance, type SystemAppearanceBinding } from "./system-appearance";
import { createThemeScope, type EffectiveThemeScope, type ResolvedAppearance, type ThemeScope } from "./theme-scope";

export type ThemeSource = ReadonlyAtom<EffectiveThemeScope>;
type Host = HTMLElement & ReactiveControllerHost;
type Root = Document | ShadowRoot;
const themeContext = createContext<ThemeSource>(Symbol("acme-theme-source"));
const documents = new WeakMap<Document, ThemeDocument>();

type Location = { roots: Set<Root>; ancestors: Set<Node> };
function locationFor(target: HTMLElement): Location {
  const roots = new Set<Root>([target.ownerDocument]);
  const visited = new Set<Node>();
  let node: Node | null = target;
  while (node && !visited.has(node)) {
    visited.add(node);
    if (node.nodeType === 9) {
      roots.add(node as Document);
    }
    if (node.nodeType === 11 && "host" in node) {
      roots.add(node as ShadowRoot);
      node = (node as ShadowRoot).host;
    } else {
      node = (node as Element).assignedSlot ?? node.parentNode;
    }
  }
  const rendered = (target as HTMLElement & { renderRoot?: Node }).renderRoot ?? target.shadowRoot;
  if (rendered?.nodeType === 11 && "host" in rendered) {
    roots.add(rendered as ShadowRoot);
  }
  return { roots, ancestors: visited };
}

class ThemeDocument {
  readonly bindings = new Set<ThemeBinding>();
  readonly system: SystemAppearanceBinding;
  private readonly contextRoot = new ContextRoot();
  private readonly roots = new Map<Root, { observer: MutationObserver; users: number }>();
  private readonly locations = new Map<ThemeBinding, Location>();
  private readonly ancestors = new Map<Node, number>();
  private queued = false;
  private disposed = false;
  constructor(readonly document: Document) {
    this.system = acquireSystemAppearance(document);
    this.contextRoot.attach(document.documentElement);
    document.addEventListener("context-provider", this.providerAvailable, true);
  }
  private providerAvailable = (event: Event): void => {
    if ("context" in event && event.context === themeContext) {
      this.invalidate();
    }
  };
  private changed = (records: MutationRecord[]): void => {
    if (records.some((record) => record.type === "attributes" || [...record.addedNodes, ...record.removedNodes].some((node) => this.affectsBinding(node)))) {
      this.invalidate();
    }
  };
  private affectsBinding(node: Node): boolean {
    if (node.nodeType === 1 && ((node as Element).localName === "slot" || (node as Element).querySelector("slot"))) {
      return true;
    }
    return this.ancestors.has(node);
  }
  invalidate = (): void => {
    if (this.queued || this.disposed) {
      return;
    }
    this.queued = true;
    queueMicrotask(() => {
      this.queued = false;
      if (this.disposed) {
        return;
      }
      batch(() => {
        for (const binding of [...this.bindings]) {
          binding.refresh();
        }
      });
    });
  };
  reconcileRoots(binding: ThemeBinding): void {
    if (this.disposed) {
      return;
    }
    const previous = this.locations.get(binding);
    const next = locationFor(binding.target);
    for (const node of previous?.ancestors ?? []) {
      if (!next.ancestors.has(node)) {
        this.removeAncestor(node);
      }
    }
    for (const node of next.ancestors) {
      if (!previous?.ancestors.has(node)) {
        this.ancestors.set(node, (this.ancestors.get(node) ?? 0) + 1);
      }
    }
    for (const root of previous?.roots ?? []) {
      if (!next.roots.has(root)) {
        this.removeRoot(root);
      }
    }
    const Observer = this.document.defaultView?.MutationObserver;
    if (Observer) {
      for (const root of next.roots) {
        if (!previous?.roots.has(root)) {
          const existing = this.roots.get(root);
          if (existing) {
            existing.users++;
          } else {
            const observer = new Observer(this.changed);
            observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ["slot", "name"] });
            root.addEventListener("slotchange", this.invalidate, true);
            this.roots.set(root, { observer, users: 1 });
          }
        }
      }
    }
    this.locations.set(binding, next);
  }
  private removeAncestor(node: Node): void {
    const remaining = (this.ancestors.get(node) ?? 0) - 1;
    if (remaining > 0) {
      this.ancestors.set(node, remaining);
    } else {
      this.ancestors.delete(node);
    }
  }
  private removeRoot(root: Root): void {
    const existing = this.roots.get(root);
    if (!existing || --existing.users > 0) {
      return;
    }
    existing.observer.disconnect();
    root.removeEventListener("slotchange", this.invalidate, true);
    this.roots.delete(root);
  }
  remove(binding: ThemeBinding): void {
    this.bindings.delete(binding);
    const previous = this.locations.get(binding);
    if (previous) {
      for (const root of previous.roots) {
        this.removeRoot(root);
      }
      for (const node of previous.ancestors) {
        this.removeAncestor(node);
      }
      this.locations.delete(binding);
    }
    if (this.bindings.size) {
      return;
    }
    this.disposed = true;
    this.contextRoot.detach(this.document.documentElement);
    this.document.removeEventListener("context-provider", this.providerAvailable, true);
    for (const [root, { observer }] of this.roots) {
      observer.disconnect();
      root.removeEventListener("slotchange", this.invalidate, true);
    }
    this.roots.clear();
    this.system.release();
    documents.delete(this.document);
  }
}

class ThemeBinding {
  readonly scope: ThemeScope;
  readonly parentSource: ReadonlyAtom<ThemeSource | undefined>;
  private readonly parent = createAtom<{ source?: ThemeSource }>({});
  private document?: ThemeDocument;
  private unsubscribe?: () => void;
  private active = false;
  private suppliedSource?: ThemeSource;
  setSource(source: ThemeSource | undefined): void {
    if (source === this.suppliedSource) {
      return;
    }
    this.suppliedSource = source;
    this.refresh();
  }
  constructor(
    readonly target: HTMLElement,
    private readonly connectedLifetime = false,
  ) {
    const initial: ResolvedAppearance = target.ownerDocument.defaultView?.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    this.scope = createThemeScope({ systemAppearance: createAtom<ResolvedAppearance>(initial) });
    this.parentSource = createAtom(() => this.parent.get().source);
  }
  private receive = (source: ThemeSource, dispose?: () => void): void => {
    if (this.suppliedSource || !this.active || !this.target.isConnected) {
      dispose?.();
      return;
    }
    if (dispose !== this.unsubscribe) {
      this.unsubscribe?.();
    }
    this.unsubscribe = dispose;
    batch(() => {
      this.parent.set({ source });
      this.scope.setParent(source);
    });
  };
  connect(): void {
    this.active = true;
    this.refresh();
  }
  refresh = (): void => {
    if (!this.active) {
      return;
    }
    if (this.connectedLifetime && !this.target.isConnected) {
      this.disconnect();
      return;
    }
    if (this.document?.document !== this.target.ownerDocument) {
      this.unsubscribe?.();
      this.unsubscribe = undefined;
      this.document?.remove(this);
      let document = documents.get(this.target.ownerDocument);
      if (!document) {
        document = new ThemeDocument(this.target.ownerDocument);
        documents.set(this.target.ownerDocument, document);
      }
      this.document = document;
      document.bindings.add(this);
    }
    const document = this.document!;
    batch(() => {
      this.unsubscribe?.();
      this.unsubscribe = undefined;
      this.parent.set({});
      this.scope.setParent(this.suppliedSource);
      this.scope.setSystemAppearance(document.system.appearance);
      // A supplied complete scope is a new root boundary, not an omitted inherited setting.
      if (!this.suppliedSource && this.target.isConnected) {
        this.target.dispatchEvent(new ContextEvent(themeContext, this.target, this.receive, true));
      }
    });
    document.reconcileRoots(this);
  };
  disconnect(): void {
    if (!this.active) {
      return;
    }
    this.active = false;
    this.unsubscribe?.();
    this.unsubscribe = undefined;
    const appearance = this.document?.system.appearance.get() ?? this.scope.effective.get().resolvedAppearance;
    const snapshot = this.scope.effective.get();
    batch(() => {
      this.parent.set({});
      this.scope.setParent(this.connectedLifetime ? createAtom(() => snapshot) : undefined);
      this.scope.setSystemAppearance(createAtom<ResolvedAppearance>(appearance));
    });
    this.document?.remove(this);
    this.document = undefined;
  }
  rootsChanged(): void {
    this.document?.reconcileRoots(this);
  }
  providerAdded(): void {
    this.document?.invalidate();
  }
}

export type ThemeContextBinding = Readonly<{ scope: ThemeScope; parentSource: ReadonlyAtom<ThemeSource | undefined>; refresh(): void; release(): void }>;

/** Follows a connected opener until release or detachment, then retains its final resolved scope. */
export function bindThemeContext(opener: HTMLElement): ThemeContextBinding {
  if (!opener.isConnected) {
    throw new TypeError("Theme opener must be connected");
  }
  const binding = new ThemeBinding(opener, true);
  binding.connect();
  return Object.freeze({ scope: binding.scope, parentSource: binding.parentSource, refresh: binding.refresh, release: () => binding.disconnect() });
}

/** Connects one host's canonical theme model to nearest-provider discovery. */
export class ThemeContextController implements ReactiveController {
  readonly scope: ThemeScope;
  readonly parentSource: ReadonlyAtom<ThemeSource | undefined>;
  private readonly binding: ThemeBinding;
  private provider?: ContextProvider<typeof themeContext>;
  constructor(
    private readonly host: Host,
    options: Readonly<{ provide?: boolean }> = {},
  ) {
    this.binding = new ThemeBinding(host);
    this.scope = this.binding.scope;
    this.parentSource = this.binding.parentSource;
    host.addController(this);
    if (options.provide) {
      this.provide();
    }
  }
  provide(): void {
    if (this.provider) {
      return;
    }
    this.provider = new ContextProvider(this.host, { context: themeContext, initialValue: this.scope.effective });
    this.binding.providerAdded();
  }
  /** Supplies a complete scope for an owned surface; undefined resumes DOM inheritance. */
  setSource(source: ThemeSource | undefined): void {
    this.binding.setSource(source);
    this.host.requestUpdate();
  }
  hostConnected(): void {
    this.binding.connect();
  }
  hostDisconnected(): void {
    this.binding.disconnect();
    this.provider?.clearCallbacks();
  }
  hostUpdated(): void {
    this.binding.rootsChanged();
  }
  adopted(): void {
    this.binding.refresh();
  }
  refresh(): void {
    this.binding.refresh();
  }
}
