import { createAtom, createStore } from "@tanstack/lit-store";
import { html, LitElement, type PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import { atomState } from "../../atom-state";
import { StoreSelector } from "../../store-connection";

export const publicShared = createAtom(1);

export class PublicAtomProbe extends LitElement {
  @atomState() @property({ type: Boolean, reflect: true, useDefault: true, noAccessor: true }) open = false;
  @atomState() @property({ type: Number, reflect: true, useDefault: true, noAccessor: true }) count = 0;
  @atomState() @property({ type: String, reflect: true, useDefault: true, noAccessor: true }) value = "initial";
  @atomState(publicShared) @property({ type: Number, reflect: true, useDefault: true, noAccessor: true }) declare shared: number;

  derived = createStore(() => JSON.stringify({ open: this.open, count: this.count, value: this.value, shared: this.shared }));
  selector = new StoreSelector(this, () => this.derived);
  changed: PropertyKey[] = [];
  previous = new Map<PropertyKey, unknown>();
  allowUpdate = true;

  shouldUpdate() {
    return this.allowUpdate;
  }
  updated(changes: PropertyValues) {
    this.changed = [...changes.keys()];
    this.previous = new Map(changes);
  }
  render() {
    return html`<span>${this.derived.get()}</span>`;
  }
}
