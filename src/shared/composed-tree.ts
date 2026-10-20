/** Tests ownership through slots and shadow roots, including top-layer descendants. */
export function composedParent(node: Node): Node | null {
  return (node.nodeType === 1 ? (node as Element).assignedSlot : null) ?? node.parentNode ?? (node.nodeType === 11 && "host" in node ? (node as ShadowRoot).host : null);
}
export function composedContains(parent: Node, node: Node): boolean {
  let current: Node | null = node;
  while (current) {
    if (current === parent) {
      return true;
    }
    current = composedParent(current);
  }
  return false;
}
export function deepActiveElement(document: Document): Element | null {
  let element = document.activeElement;
  while (element?.shadowRoot?.activeElement) {
    element = element.shadowRoot.activeElement;
  }
  return element;
}
