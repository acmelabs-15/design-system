import type { RenderOptions } from "lit";

type RegistryNode = Node & { customElementRegistry?: CustomElementRegistry | null; customElements?: CustomElementRegistry };
type PolyfilledRoot = ShadowRoot & { importNode?: (node: Node, deep?: boolean) => Node };

/** Keep owned rendering in the host's registry and current document. */
export function scopedRenderRoot(host: HTMLElement, options: ShadowRootInit): { root: ShadowRoot; creationScope: NonNullable<RenderOptions["creationScope"]> } {
  const native = "customElementRegistry" in host;
  const registry = native ? (host as RegistryNode).customElementRegistry : (host.getRootNode() as RegistryNode).customElements;
  const root = host.shadowRoot ?? host.attachShadow({ ...options, ...(registry ? (native ? { customElementRegistry: registry } : { customElements: registry }) : {}) });
  const polyfilled = root as PolyfilledRoot;
  const creationScope: NonNullable<RenderOptions["creationScope"]> = {
    importNode(node, deep = false) {
      if (!native && polyfilled.importNode) {
        return polyfilled.importNode(node, deep);
      }
      const selected = (root as RegistryNode).customElementRegistry;
      return selected ? root.ownerDocument.importNode(node, { customElementRegistry: selected, selfOnly: !deep }) : root.ownerDocument.importNode(node, deep);
    },
  };
  return { root, creationScope };
}

/** Create owned custom content in the same registry as the component. */
export function createScopedElement<K extends keyof HTMLElementTagNameMap>(host: HTMLElement, name: K): HTMLElementTagNameMap[K] {
  const owner = host.ownerDocument;
  if ("customElementRegistry" in host) {
    const registry = (host as RegistryNode).customElementRegistry;
    if (registry) {
      const inert = owner.createElement("template").content.ownerDocument.createElement(name);
      return owner.importNode(inert, { customElementRegistry: registry, selfOnly: true });
    }
    return owner.createElement(name);
  }
  const scope = (host.shadowRoot ?? host.getRootNode()) as RegistryNode & { createElement?: (name: K) => HTMLElementTagNameMap[K] };
  if (scope.customElements && scope.createElement) {
    return scope.createElement(name);
  }
  return owner.createElement(name);
}
