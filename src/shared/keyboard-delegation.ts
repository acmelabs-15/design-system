/** Cooperative boundary for collections embedded in a Toolbar. */
const toolbars = new WeakMap<Element, HTMLElement>();
const collections = new WeakMap<Element, () => readonly HTMLElement[]>();
const delegated = new WeakMap<KeyboardEvent, HTMLElement>();
export function registerToolbarKeyboardOwner(host: Element, root: HTMLElement): () => void {
  toolbars.set(host, root);
  return () => {
    if (toolbars.get(host) === root) toolbars.delete(host);
  };
}
export function registerKeyboardCollection(host: Element, targets: () => readonly HTMLElement[]): () => void {
  collections.set(host, targets);
  return () => {
    if (collections.get(host) === targets) collections.delete(host);
  };
}
export const keyboardCollection = (host: Element) => collections.get(host);
export const delegatedKeyboardOwner = (event: KeyboardEvent) => delegated.get(event);
export function toolbarKeyboardOwner(host: Element): HTMLElement | undefined {
  for (
    let node: Node | null = host;
    node;
    node = (node.nodeType === 1 ? (node as Element).assignedSlot : null) ?? node.parentNode ?? (node.nodeType === 11 && "host" in node ? (node as ShadowRoot).host : null)
  ) {
    if (node.nodeType !== 1) continue;
    const element = node as HTMLElement;
    const registered = toolbars.get(element);
    if (registered) return registered;
    if (element.getAttribute("role") === "toolbar") return element;
  }
  return undefined;
}
export function delegateToolbarKey(event: KeyboardEvent, host: Element): boolean {
  const owner = toolbarKeyboardOwner(host);
  if (!owner) return false;
  event.preventDefault();
  delegated.set(event, owner);
  return true;
}
