import type { ReactiveController, ReactiveElement } from "lit";
import { AcmeSemanticElement } from "./semantic-element";

let nextId = 0;
/** Adds one owned same-scope description while retaining application descriptions. */
export class TargetDescription implements ReactiveController {
  private references(target: HTMLElement): readonly Element[] {
    const reference = target.ariaDescribedByElements;
    if (reference) {
      return reference;
    }
    const root = target.getRootNode() as Document | ShadowRoot;
    return (target.getAttribute("aria-describedby") ?? "")
      .split(/\s+/)
      .filter(Boolean)
      .flatMap((id) => {
        const element = root.getElementById?.(id);
        return element ? [element] : [];
      });
  }
  private target?: HTMLElement;
  private mirror?: HTMLSpanElement;
  private originalAttribute: string | null = null;
  private applied: readonly Element[] = [];
  constructor(host: ReactiveElement) {
    host.addController(this);
  }
  private semanticTarget(target: HTMLElement): HTMLElement {
    const root = target.getRootNode();
    return root instanceof ShadowRoot && root.host instanceof AcmeSemanticElement ? root.host : target;
  }
  update(target: HTMLElement | undefined, text: string) {
    if (!target || !text) {
      this.detach();
      return;
    }
    target = this.semanticTarget(target);
    if (target !== this.target || this.mirror?.getRootNode() !== target.getRootNode()) {
      this.detach();
      const root = target.getRootNode();
      if (root.nodeType !== 9 && root.nodeType !== 11) {
        return;
      }
      this.target = target;
      this.originalAttribute = target.getAttribute("aria-describedby");
      this.mirror = target.ownerDocument.createElement("span");
      this.mirror.id = `acme-help-description-${++nextId}`;
      this.mirror.hidden = true;
      (root.nodeType === 9 ? target.ownerDocument.body : root).appendChild(this.mirror);
    }
    if (this.mirror!.textContent !== text) {
      this.mirror!.textContent = text;
    }
    const current = this.references(target);
    const next = [...current.filter((element) => element !== this.mirror), this.mirror!];
    if (next.length !== current.length || next.some((element, index) => element !== current[index])) {
      target.ariaDescribedByElements = next;
    }
    this.applied = next;
  }
  detach() {
    if (this.target && this.mirror) {
      const current = this.references(this.target);
      const unchanged = current.length === this.applied.length && current.every((element, index) => element === this.applied[index]);
      if (unchanged && this.originalAttribute !== null) {
        this.target.setAttribute("aria-describedby", this.originalAttribute);
      } else if (current.includes(this.mirror)) {
        const next = current.filter((element) => element !== this.mirror);
        this.target.ariaDescribedByElements = next.length ? next : null;
      }
    }
    this.mirror?.remove();
    this.mirror = undefined;
    this.target = undefined;
    this.applied = [];
  }
  hostDisconnected() {
    this.detach();
  }
}
