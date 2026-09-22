import { createAtom, type ReadonlyAtom } from "@tanstack/lit-store";
import type { ReactiveController, ReactiveElement } from "lit";
import { FieldAssociation, releaseFieldParticipant, type FieldDescription, type FieldParticipant } from "./field-association";
export const fieldControlChange = "acme-internal-field-control";
export interface RegisteredFieldControl extends FieldParticipant {
  host: HTMLElement;
  eligible(): boolean;
  refresh?(): void;
}
const controls = new WeakMap<Element, RegisteredFieldControl>();
export const fieldControlFor = (element: Element) => controls.get(element);
/** Connects a value owner's Field metadata to that owner's semantic target. */
export class FieldControl implements ReactiveController {
  private readonly current = createAtom<{ description?: FieldDescription }>({});
  readonly description: ReadonlyAtom<FieldDescription | undefined> = createAtom(() => this.current.get().description);
  readonly association = new FieldAssociation();
  private target?: HTMLElement;
  readonly participant: RegisteredFieldControl;
  constructor(
    private host: ReactiveElement,
    private options: { target(): HTMLElement | undefined; eligible(): boolean; activate(): void; changed(description: FieldDescription | undefined): void },
  ) {
    this.participant = {
      host,
      eligible: () => options.eligible(),
      activate: () => options.activate(),
      associate: (description) => {
        if (this.current.get().description === description) return;
        this.current.set({ description });
        this.association.update(description);
        const target = this.options.target();
        if (description && target) this.association.attach(target);
        else this.association.detach();
        options.changed(description);
        this.host.requestUpdate();
      },
    };
    controls.set(host, this.participant);
    host.addController(this);
  }
  private notify() {
    if (this.host.isConnected) this.host.dispatchEvent(new Event(fieldControlChange, { bubbles: true, composed: true }));
  }
  hostConnected() {
    this.target = undefined;
    this.notify();
  }
  hostUpdated() {
    const target = this.options.target();
    if (target !== this.target) {
      this.target = target;
      this.association.detach();
      if (target && this.current.get().description) this.association.attach(target);
      this.host.requestUpdate();
      this.notify();
    }
  }
  hostDisconnected() {
    releaseFieldParticipant(this.participant);
    this.association.detach();
    this.target = undefined;
    this.participant.associate(undefined);
  }
}
