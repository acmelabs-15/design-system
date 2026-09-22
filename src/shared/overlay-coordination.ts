export type OverlayDismissReason = "escape" | "outside";
export type OverlayRegistration = Readonly<{
  surface: HTMLElement;
  anchor?: HTMLElement;
  closeOnEscape(): boolean;
  closeOnOutside(): boolean;
  dismiss(reason: OverlayDismissReason): void;
  ownerRemoved?(): void;
}>;
type Session = { registration: OverlayRegistration; inside: WeakSet<Event>; parent?: Session; release(): void };
type Coordination = { sessions: Session[]; dispose(): void };
const documents = new WeakMap<Document, Coordination>();

function composedContains(parent: HTMLElement, node: Node): boolean {
  let current: Node | null = node;
  while (current) {
    if (current === parent) return true;
    current = (current.nodeType === 1 ? (current as Element).assignedSlot : null) ?? current.parentNode ?? (current.nodeType === 11 && "host" in current ? (current as ShadowRoot).host : null);
  }
  return false;
}

function contains(registration: OverlayRegistration, event: Event): boolean {
  const path = event.composedPath();
  if (registration.surface.localName === "dialog" && path[0] === registration.surface && "clientX" in event) {
    const { clientX, clientY } = event as PointerEvent;
    const rect = registration.surface.getBoundingClientRect();
    return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
  }
  return path.includes(registration.surface) || (!!registration.anchor && path.includes(registration.anchor));
}
const isInside = (session: Session, event: Event) => session.inside.has(event) || contains(session.registration, event);
function createCoordination(document: Document): Coordination {
  const sessions: Session[] = [];
  let press: { session: Session; pointerId: number } | undefined;
  const top = () => sessions.at(-1);
  const keydown = (event: KeyboardEvent) => {
    const session = top();
    if (!session || event.key !== "Escape" || event.defaultPrevented || event.isComposing) return;
    // Keep native dialog cancellation from also dismissing the surface below this one.
    event.preventDefault();
    if (session.registration.closeOnEscape()) session.registration.dismiss("escape");
  };
  const pointerdown = (event: PointerEvent) => {
    const session = top();
    press = session && event.isPrimary && event.button === 0 && !isInside(session, event) ? { session, pointerId: event.pointerId } : undefined;
  };
  const pointerup = (event: PointerEvent) => {
    const start = press;
    if (!start || event.pointerId !== start.pointerId) return;
    press = undefined;
    if (top() === start.session && !isInside(start.session, event) && start.session.registration.closeOnOutside()) start.session.registration.dismiss("outside");
  };
  const pointercancel = () => {
    press = undefined;
  };
  document.addEventListener("keydown", keydown);
  document.addEventListener("pointerdown", pointerdown);
  document.addEventListener("pointerup", pointerup);
  document.addEventListener("pointercancel", pointercancel, true);
  return {
    sessions,
    dispose() {
      document.removeEventListener("keydown", keydown);
      document.removeEventListener("pointerdown", pointerdown);
      document.removeEventListener("pointerup", pointerup);
      document.removeEventListener("pointercancel", pointercancel, true);
      press = undefined;
    },
  };
}

/** Routes one gesture to the topmost owned surface in its actual document. */
export function coordinateOverlay(registration: OverlayRegistration): () => void {
  const document = registration.surface.ownerDocument;
  let coordination = documents.get(document);
  if (!coordination) {
    coordination = createCoordination(document);
    documents.set(document, coordination);
  }
  const parent = [...coordination.sessions].reverse().find((session) => composedContains(session.registration.surface, registration.anchor ?? registration.surface));
  const session: Session = { registration, inside: new WeakSet<Event>(), parent, release() {} };
  const roots = new Set([registration.surface.getRootNode(), registration.anchor?.getRootNode()].filter((root): root is Node => !!root));
  const captureInside = (event: Event) => {
    if (contains(registration, event)) session.inside.add(event);
  };
  for (const root of roots) {
    root.addEventListener("pointerdown", captureInside, true);
    root.addEventListener("pointerup", captureInside, true);
  }
  const observer = new MutationObserver(() => {
    if (
      registration.surface.isConnected &&
      registration.surface.ownerDocument === document &&
      (!registration.anchor || (registration.anchor.isConnected && registration.anchor.ownerDocument === document))
    )
      return;
    try {
      registration.ownerRemoved?.();
    } finally {
      session.release();
    }
  });
  observer.observe(document, { childList: true, subtree: true });
  for (const root of roots) if (root !== document) observer.observe(root, { childList: true, subtree: true });
  coordination.sessions.push(session);
  let active = true;
  session.release = () => {
    if (!active) return;
    active = false;
    observer.disconnect();
    const errors: unknown[] = [];
    for (const child of [...coordination.sessions].reverse()) {
      if (child.parent !== session) continue;
      try {
        child.registration.ownerRemoved?.();
      } catch (error) {
        errors.push(error);
      }
      try {
        child.release();
      } catch (error) {
        errors.push(error);
      }
    }
    for (const root of roots) {
      root.removeEventListener("pointerdown", captureInside, true);
      root.removeEventListener("pointerup", captureInside, true);
    }
    const index = coordination.sessions.indexOf(session);
    if (index !== -1) coordination.sessions.splice(index, 1);
    if (!coordination.sessions.length) {
      coordination.dispose();
      documents.delete(document);
    }
    if (errors.length) throw new AggregateError(errors, "Overlay child cleanup failed");
  };
  return session.release;
}
