/** Tests ownership through slots and shadow roots, including top-layer descendants. */
export function composedContains(parent: Node, node: Node): boolean {
  let current: Node | null = node;
  while (current) {
    if (current === parent) return true;
    current = (current.nodeType === 1 ? (current as Element).assignedSlot : null) ?? current.parentNode ?? (current.nodeType === 11 && "host" in current ? (current as ShadowRoot).host : null);
  }
  return false;
}
export function deepActiveElement(document: Document): Element | null {
  let element = document.activeElement;
  while (element?.shadowRoot?.activeElement) element = element.shadowRoot.activeElement;
  return element;
}
