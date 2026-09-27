import { nothing, render, type ReactiveController, type ReactiveElement, type RootPart, type TemplateResult } from "lit";

export type ContentRenderer = () => TemplateResult | typeof nothing;
export type ContentMount = Readonly<{
  container: HTMLElement;
  getSnapshot: () => boolean;
  subscribe: (listener: () => void) => () => void;
}>;
const contentMounts = new WeakMap<Element, Map<string, ContentMount>>();
/** Renderer adapters observe the component's mount decision and own the target's children. */
export function getContentMount(host: Element, slot = ""): ContentMount {
  const mount = contentMounts.get(host)?.get(slot);
  if (!mount) {
    throw new TypeError("The element does not provide this content mount");
  }
  return mount;
}
/** Controls only content created from an inert template or an explicit Lit renderer. */
export class OwnedContent implements ReactiveController {
  readonly container: HTMLElement;
  private template?: HTMLTemplateElement;
  private fragment?: DocumentFragment;
  private part?: RootPart;
  private observer?: MutationObserver;
  private templateObserver?: MutationObserver;
  private warned = false;
  private mounted = false;
  private readonly listeners = new Set<() => void>();
  constructor(
    private host: ReactiveElement,
    private options: { slot?: string; marker?: string; diagnostic?: string } = {},
  ) {
    this.container = host.ownerDocument.createElement("div");
    this.container.setAttribute(options.marker ?? "data-acme-owned-content", "");
    if (options.slot) {
      this.container.slot = options.slot;
    }
    let mounts = contentMounts.get(host);
    if (!mounts) {
      contentMounts.set(host, (mounts = new Map()));
    }
    const slot = options.slot ?? "";
    if (mounts.has(slot)) {
      throw new TypeError("Duplicate owned content slot");
    }
    mounts.set(slot, {
      container: this.container,
      getSnapshot: () => this.mounted,
      subscribe: (listener) => {
        this.listeners.add(listener);
        host.requestUpdate();
        return () => {
          this.listeners.delete(listener);
          host.requestUpdate();
        };
      },
    });
    host.addController(this);
  }
  hostConnected() {
    this.part?.setConnected(true);
    this.observer = new MutationObserver(() => this.host.requestUpdate());
    this.observer.observe(this.host, { childList: true });
    this.watchTemplate();
  }
  hostDisconnected() {
    this.observer?.disconnect();
    this.observer = undefined;
    this.templateObserver?.disconnect();
    this.templateObserver = undefined;
    this.part?.setConnected(false);
  }
  private watchTemplate() {
    this.templateObserver?.disconnect();
    this.templateObserver = undefined;
    if (!this.template || !this.host.isConnected) {
      return;
    }
    this.templateObserver = new MutationObserver(() => {
      this.fragment = undefined;
      this.host.requestUpdate();
    });
    this.templateObserver.observe(this.template.content, { childList: true, subtree: true, attributes: true, characterData: true });
  }
  render(mounted: boolean, renderer?: ContentRenderer, mountingRequested = false): boolean {
    const slot = this.options.slot ?? "";
    const nodes = [...this.host.childNodes].filter(
      (node) => node !== this.container && (node.nodeType === 1 ? ((node as Element).getAttribute("slot") ?? "") === slot : node.nodeType === 3 && !slot && !!node.textContent?.trim()),
    );
    const external = this.listeners.size > 0 && nodes.length === 0;
    const externalMounted = mounted && (this.listeners.size === 0 || external);
    if (this.mounted !== externalMounted) {
      this.mounted = externalMounted;
      for (const listener of this.listeners) {
        listener();
      }
    }
    if (external) {
      if (this.container.parentNode !== this.host) {
        this.host.append(this.container);
      }
      return true;
    }
    const template = nodes.length === 1 && nodes[0].nodeType === 1 && (nodes[0] as Element).localName === "template" ? (nodes[0] as HTMLTemplateElement) : undefined;
    if (template !== this.template) {
      this.template = template;
      this.fragment = undefined;
      this.watchTemplate();
    }
    const managed = !!template || (nodes.length === 0 && !!renderer);
    if (managed) {
      if (this.container.parentNode !== this.host) {
        this.host.append(this.container);
      }
      let value: TemplateResult | DocumentFragment | typeof nothing = nothing;
      if (mounted) {
        if (template) {
          this.fragment ??= template.content.cloneNode(true) as DocumentFragment;
          value = this.fragment;
        } else {
          value = renderer!();
        }
      } else {
        this.fragment = undefined;
      }
      this.part = render(value, this.container, { host: this.host, creationScope: this.host.ownerDocument, isConnected: this.host.isConnected });
    } else {
      if (this.container.parentNode === this.host) {
        if (this.part) {
          this.part = render(nothing, this.container);
        }
        this.container.remove();
      }
      if (nodes.length && mountingRequested && !this.warned) {
        this.warned = true;
        console.warn(this.host.localName, { code: this.options.diagnostic ?? "content-mounting-needs-template" });
      }
    }
    return managed;
  }
}
