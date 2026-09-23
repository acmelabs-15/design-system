import { html } from "lit";
import { property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { AcmeElement, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { CommandBinding, type CommandPart } from "../../shared/command-context";
import { commandGroupStructureCss } from "../../generated/components/command-group/command-group-structure.styles";
/** A named, contiguous group of command actions.
 * @slot - Direct Command Item children.
 * @slot heading - Heading content in place of heading text.
 * @csspart group - The result group.
 * @csspart heading - The visual heading.
 */
export class AcmeCommandGroup extends AcmeElement {
  static shadowRootOptions = { ...AcmeElement.shadowRootOptions, slotAssignment: "manual" as const };
  static styles = [sharedCss, commandGroupStructureCss];
  @atomState() @property({ noAccessor: true, useDefault: true }) heading = "";
  @atomState() private projected: readonly CommandPart[] = [];
  @atomState() private headingText = "";
  private readonly binding = new CommandBinding(this, {
    kind: "group",
    value: () => "",
    label: () => this.headingText || this.heading,
    keywords: () => [],
    disabled: () => false,
    project: (parts) => {
      if (parts.length !== this.projected.length || parts.some((part, i) => part !== this.projected[i])) this.projected = Object.freeze([...parts]);
    },
  });
  private readonly internals = this.attachInternals();
  private observer?: MutationObserver;
  private read = () => {
    const text = [...this.children]
      .filter((child) => child.getAttribute("slot") === "heading")
      .map((child) => child.textContent ?? "")
      .join(" ")
      .trim();
    if (text !== this.headingText) this.headingText = text;
  };
  connectedCallback() {
    super.connectedCallback();
    this.read();
    this.observer = new MutationObserver(this.read);
    this.observer.observe(this, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["slot"] });
  }
  disconnectedCallback() {
    this.observer?.disconnect();
    this.observer = undefined;
    super.disconnectedCallback();
  }
  protected updated() {
    this.internals.role = "group";
    this.internals.ariaLabel = this.headingText || this.heading || null;
    for (const slot of this.renderRoot.querySelectorAll("slot")) {
      const index = slot.getAttribute("data-item");
      const nodes =
        index === null
          ? [...this.children].filter((child) => child.getAttribute("slot") === "heading")
          : [this.projected[Number(index)]?.host].filter((node): node is NonNullable<typeof node> => !!node);
      const previous = slot.assignedNodes();
      if (nodes.length !== previous.length || nodes.some((node, i) => node !== previous[i])) slot.assign(...nodes);
    }
  }
  render() {
    return html`<div part="group"><div part="heading" aria-hidden="true" ?hidden=${!this.headingText && !this.heading}><slot name="heading">${this.heading}</slot></div>${repeat(
      this.projected,
      (part) => part.host,
      (_part, index) => html`<slot data-item=${index}></slot>`,
    )}</div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-command-group": AcmeCommandGroup;
  }
}
