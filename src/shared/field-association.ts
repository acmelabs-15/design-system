import { createAtom, type ReadonlyAtom } from "@tanstack/lit-store";

export type FieldDescription = Readonly<{
  label: string;
  help: string;
  error: string;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
  labelElements?: readonly Element[];
  helpElements?: readonly Element[];
  errorElements?: readonly Element[];
}>;
export interface FieldParticipant {
  associate(field: FieldDescription | undefined): void;
  activate(): void;
}

const registrations = new WeakMap<FieldParticipant, { registry: FieldRegistry; release(): void }>();

export const releaseFieldParticipant = (participant: FieldParticipant) => registrations.get(participant)?.release();

/** One Field labels one logical control. Composite controls register their root once. */
export class FieldRegistry {
  private readonly members = new Map<FieldParticipant, symbol>();
  private readonly description = createAtom<{ value: FieldDescription | undefined }>({ value: undefined });
  readonly state: ReadonlyAtom<FieldDescription | undefined> = createAtom(() => this.description.get().value);
  constructor(private diagnostic: (message: string) => void = (message) => console.warn(message)) {}
  set(description: FieldDescription): void {
    const previous = this.description.get().value;
    if (
      previous &&
      [...new Set([...Object.keys(previous), ...Object.keys(description)])].every((key) => {
        const a = previous[key as keyof FieldDescription],
          b = description[key as keyof FieldDescription];
        return Array.isArray(a) && Array.isArray(b) ? a.length === b.length && a.every((item, index) => item === b[index]) : a === b;
      })
    ) {
      return;
    }
    this.description.set({
      value: Object.freeze({
        ...description,
        ...(description.labelElements ? { labelElements: Object.freeze([...description.labelElements]) } : {}),
        ...(description.helpElements ? { helpElements: Object.freeze([...description.helpElements]) } : {}),
        ...(description.errorElements ? { errorElements: Object.freeze([...description.errorElements]) } : {}),
      }),
    });
    this.publish();
  }
  register(participant: FieldParticipant): () => void {
    if (this.members.has(participant)) {
      throw new Error("The control is already registered with this Field");
    }
    registrations.get(participant)?.release();
    const registration = Symbol("field-registration");
    this.members.set(participant, registration);
    if (this.members.size === 2) {
      this.diagnostic("A Field requires one logical control. Use separate Fields or a Fieldset for multiple controls.");
    }
    this.publish();
    let active = true;
    const release = () => {
      if (!active) {
        return;
      }
      active = false;
      if (this.members.get(participant) !== registration) {
        return;
      }
      this.members.delete(participant);
      participant.associate(undefined);
      this.publish();
    };
    registrations.set(participant, { registry: this, release });
    return release;
  }
  has(participant: FieldParticipant): boolean {
    return this.members.has(participant);
  }
  activate(): void {
    if (this.members.size !== 1 || this.description.get().value?.disabled) {
      return;
    }
    this.members.keys().next().value?.activate();
  }
  private publish(): void {
    const description = this.members.size === 1 ? this.description.get().value : undefined;
    for (const participant of this.members.keys()) {
      participant.associate(description);
    }
  }
  clear(): void {
    for (const participant of [...this.members.keys()]) {
      const entry = registrations.get(participant);
      if (entry?.registry === this) {
        entry.release();
      }
    }
    this.members.clear();
  }
}

let nextId = 0;
/** Owns Field text mirrors and exposes references to the semantic owner. */
export class FieldAssociation {
  private target?: HTMLElement;
  private mirrors?: { label: HTMLSpanElement; help: HTMLSpanElement; error: HTMLSpanElement };
  private description?: FieldDescription;
  private readonly prefix = `acme-field-${++nextId}`;

  attach(target: HTMLElement): void {
    if (this.target === target && this.mirrors?.label.getRootNode() === target.getRootNode()) {
      return;
    }
    this.detach();
    this.target = target;
    const root = target.getRootNode();
    if (root.nodeType !== 9 && root.nodeType !== 11) {
      throw new Error("Field association requires a control in a document or shadow root");
    }
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
  get defaults() {
    if (!this.mirrors) {
      return {};
    }
    const roots = new Set<Node>();
    for (let root: Node | undefined = this.target?.getRootNode(); root; root = "host" in root ? (root as ShadowRoot).host.getRootNode() : undefined) {
      roots.add(root);
    }
    const references = (name: "label" | "help" | "error") => {
      const elements = this.description?.[(name + "Elements") as "labelElements" | "helpElements" | "errorElements"];
      return elements?.length && elements.every((element) => roots.has(element.getRootNode())) ? [...elements] : this.description?.[name] ? [this.mirrors![name]] : [];
    };
    return { labelledByElements: references("label"), describedByElements: [...references("help"), ...(this.description?.invalid ? references("error") : [])] };
  }
  private paint(): void {
    if (!this.mirrors) {
      return;
    }
    for (const name of ["label", "help", "error"] as const) {
      const text = name === "error" && !this.description?.invalid ? "" : (this.description?.[name] ?? "");
      const mirror = this.mirrors[name];
      mirror.textContent = text;
    }
  }
  detach(): void {
    if (this.mirrors) {
      for (const name of ["label", "help", "error"] as const) {
        this.mirrors[name].remove();
      }
    }
    this.mirrors = undefined;
    this.target = undefined;
  }
}
