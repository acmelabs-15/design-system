import { createAtom, type ReadonlyAtom } from "@tanstack/lit-store";

export type FieldDescription = Readonly<{
  label: string;
  help: string;
  error: string;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
}>;
export interface FieldParticipant {
  associate(field: FieldDescription | undefined): void;
  activate(): void;
}

/** One Field labels one logical control. Composite controls register their root once. */
export class FieldRegistry {
  private readonly members = new Map<FieldParticipant, symbol>();
  private readonly description = createAtom<{ value: FieldDescription | undefined }>({ value: undefined });
  readonly state: ReadonlyAtom<FieldDescription | undefined> = createAtom(() => this.description.get().value);
  constructor(private diagnostic: (message: string) => void = (message) => console.warn(message)) {}
  set(description: FieldDescription): void {
    this.description.set({ value: Object.freeze({ ...description }) });
    this.publish();
  }
  register(participant: FieldParticipant): () => void {
    if (this.members.has(participant)) throw new Error("The control is already registered with this Field");
    const registration = Symbol();
    this.members.set(participant, registration);
    if (this.members.size === 2) this.diagnostic("A Field requires one logical control. Use separate Fields or a Fieldset for multiple controls.");
    this.publish();
    let active = true;
    return () => {
      if (!active) return;
      active = false;
      if (this.members.get(participant) !== registration) return;
      this.members.delete(participant);
      participant.associate(undefined);
      this.publish();
    };
  }
  activate(): void {
    if (this.members.size !== 1 || this.description.get().value?.disabled) return;
    this.members.keys().next().value?.activate();
  }
  private publish(): void {
    const description = this.members.size === 1 ? this.description.get().value : undefined;
    for (const participant of this.members.keys()) participant.associate(description);
  }
  clear(): void {
    for (const participant of this.members.keys()) participant.associate(undefined);
    this.members.clear();
  }
}

let nextId = 0;
/** Mirrors Field text into the control's own root so native ID references resolve. */
export class FieldAssociation {
  private target?: HTMLElement;
  private mirrors?: { label: HTMLSpanElement; help: HTMLSpanElement; error: HTMLSpanElement };
  private description?: FieldDescription;
  private readonly prefix = `acme-field-${++nextId}`;

  attach(target: HTMLElement): void {
    if (this.target === target && this.mirrors?.label.getRootNode() === target.getRootNode()) return;
    this.detach();
    this.target = target;
    const root = target.getRootNode();
    if (root.nodeType !== 9 && root.nodeType !== 11) throw new Error("Field association requires a control in a document or shadow root");
    const parent = root.nodeType === 9 ? target.ownerDocument.body : root;
    this.mirrors = Object.fromEntries(
      ["label", "help", "error"].map((name) => {
        const mirror = target.ownerDocument.createElement("span");
        mirror.id = `${this.prefix}-${name}`;
        mirror.hidden = true;
        parent.appendChild(mirror);
        return [name, mirror];
      }),
    ) as NonNullable<typeof this.mirrors>;
    this.paint();
  }
  update(description: FieldDescription | undefined): void {
    this.description = description;
    this.paint();
  }
  private reference(attribute: string, id: string, included: boolean): void {
    if (!this.target) return;
    const values = new Set((this.target.getAttribute(attribute) ?? "").split(/\s+/).filter(Boolean));
    if (included) values.add(id);
    else values.delete(id);
    if (values.size) this.target.setAttribute(attribute, [...values].join(" "));
    else this.target.removeAttribute(attribute);
  }
  private paint(): void {
    if (!this.mirrors) return;
    for (const name of ["label", "help", "error"] as const) {
      const text = name === "error" && !this.description?.invalid ? "" : (this.description?.[name] ?? "");
      const mirror = this.mirrors[name];
      mirror.textContent = text;
      this.reference(name === "label" ? "aria-labelledby" : "aria-describedby", mirror.id, !!text);
    }
  }
  detach(): void {
    if (this.mirrors)
      for (const name of ["label", "help", "error"] as const) {
        this.reference(name === "label" ? "aria-labelledby" : "aria-describedby", this.mirrors[name].id, false);
        this.mirrors[name].remove();
      }
    this.mirrors = undefined;
    this.target = undefined;
  }
}
