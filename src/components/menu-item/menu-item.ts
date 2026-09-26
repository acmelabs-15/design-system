import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { MenuConnection, menuOwnerFor } from "../../shared/menu-context";
import { Places } from "../../shared/places";
import type { AcmeMenu } from "../menu/menu";
import { menuItemStructureCss } from "../../generated/components/menu-item/menu-item-structure.styles";

let sequence = 0;
/** An action, checkbox or radio choice in a menu.
 * @slot - The visible label.
 * @slot start - Decorative leading content.
 * @slot end - Decorative trailing content.
 * @slot description - Supporting text.
 * @slot submenu - A nested Menu.
 * @fires {CustomEvent<{action:"select";value:string}>} acme-request - An action is selected.
 * @fires {CustomEvent<{value:string;checked:boolean}>} acme-change - A checked state changes.
 * @csspart root - The native menu action.
 */
export class AcmeMenuItem extends AcmeSemanticElement {
  static styles = [sharedCss, menuItemStructureCss];
  @atomState() @property({ noAccessor: true }) value = "";
  @atomState() @property({ noAccessor: true }) type: "action" | "checkbox" | "radio" = "action";
  @atomState() @property({ noAccessor: true, type: Boolean, reflect: true }) disabled = false;
  @atomState() @property({ noAccessor: true, type: Boolean, reflect: true }) checked = false;
  @atomState() @property({ noAccessor: true }) name = "";
  @atomState() @property({ noAccessor: true }) href = "";
  @atomState() @property({ noAccessor: true }) target = "";
  @atomState() @property({ noAccessor: true }) rel = "";
  @atomState() @property({ noAccessor: true, attribute: "text-value" }) textValue = "";
  @atomState() private highlighted = false;
  private readonly menu = new MenuConnection(this, "item");
  private readonly places = new Places(this, { places: ["start", "end", "description", "submenu"] });
  private readonly uid = `acme-menu-item-${++sequence}`;
  private hoverTimer?: ReturnType<typeof setTimeout>;
  private cancelHover = () => {
    clearTimeout(this.hoverTimer);
    this.hoverTimer = undefined;
  };
  get label() {
    return (
      this.textValue ||
      Array.from(this.childNodes)
        .filter((node) => node.nodeType !== 1 || !(node as Element).hasAttribute("slot"))
        .map((node) => node.textContent ?? "")
        .join(" ")
        .trim()
    );
  }
  get submenu(): AcmeMenu | undefined {
    return Array.from(this.children).find((node) => node.localName === "acme-menu" && node.getAttribute("slot") === "submenu") as AcmeMenu | undefined;
  }
  highlight(value: boolean) {
    if (this.highlighted !== value) {
      this.highlighted = value;
    }
  }
  focus(options?: FocusOptions) {
    this.semanticTarget?.focus(options);
  }
  click() {
    this.semanticTarget?.click();
  }
  private activate = (event: MouseEvent) => {
    if (!this.menu.owner?.state.get().open || this.disabled || !this.value || (this.type === "radio" && !this.name)) {
      event.preventDefault();
      return;
    }
    if (event.defaultPrevented) {
      return;
    }
    if (this.submenu) {
      event.preventDefault();
      menuOwnerFor(this.submenu)?.openFromTrigger();
      return;
    }
    this.menu.owner?.select(this);
  };
  constructor() {
    super();
    this.addEventListener("pointerenter", (event) => {
      this.cancelHover();
      if (event.pointerType === "mouse" && !this.disabled && this.submenu && this.menu.owner?.state.get().open) {
        this.hoverTimer = setTimeout(() => {
          this.hoverTimer = undefined;
          if (this.isConnected && !this.disabled && this.menu.owner?.state.get().open && this.submenu) {
            menuOwnerFor(this.submenu)?.openFromTrigger();
          }
        }, 400);
      }
    });
    this.addEventListener("pointerleave", this.cancelHover);
    this.addEventListener("focusin", (event) => {
      if (this.owns(event)) {
        this.menu.owner?.focusItem(this);
      }
    });
    this.addEventListener("pointermove", (event) => {
      if (this.owns(event)) {
        this.menu.owner?.hover(this, event);
      }
    });
    this.addEventListener("keydown", (event) => {
      if (!this.owns(event) || event.defaultPrevented || event.isComposing) {
        return;
      }
      const forward = this.ownerDocument.defaultView!.getComputedStyle(this).direction === "rtl" ? "ArrowLeft" : "ArrowRight";
      if (this.submenu && event.key === forward && !this.disabled) {
        event.preventDefault();
        event.stopPropagation();
        menuOwnerFor(this.submenu)?.openFromTrigger();
      }
    });
  }
  private owns(event: Event): boolean {
    return event.composedPath().find((node) => node instanceof AcmeMenuItem) === this;
  }
  protected get semanticDefaults() {
    const label = this.renderRoot?.querySelector<HTMLElement>(`#${this.uid}`);
    const description = this.places?.has("description") ? this.renderRoot?.querySelector<HTMLElement>(`#${this.uid}-description`) : undefined;
    return {
      role: this.type === "action" ? "menuitem" : this.type === "checkbox" ? "menuitemcheckbox" : "menuitemradio",
      labelledByElements: label ? [label] : undefined,
      describedByElements: description ? [description] : undefined,
    };
  }
  protected updated() {
    if (this.disabled) {
      this.cancelHover();
    }
    const root = this.semanticTarget;
    if (!root) {
      return;
    }
    if (this.type === "action") {
      root.removeAttribute("aria-checked");
    } else {
      root.setAttribute("aria-checked", String(this.checked));
    }
    root.setAttribute("aria-disabled", String(this.disabled));
    if (this.submenu) {
      root.setAttribute("aria-haspopup", "menu");
      root.setAttribute("aria-expanded", String(this.submenu.open));
    } else {
      root.removeAttribute("aria-haspopup");
      root.removeAttribute("aria-expanded");
    }
  }
  disconnectedCallback() {
    this.cancelHover();
    super.disconnectedCallback();
  }
  render() {
    const body = html`<span class="start" aria-hidden="true"><slot name="start" @slotchange=${this.places.read}></slot>${this.type !== "action" ? html`<span class="mark" ?data-checked=${this.checked}><acme-check-icon size="16px"></acme-check-icon></span>` : nothing}</span><span class="body"><span id=${this.uid}><slot></slot></span><span class="description" id=${this.uid + "-description"} ?hidden=${!this.places.has("description")}><slot name="description" @slotchange=${this.places.read}></slot></span></span><span class="end" aria-hidden="true"><slot name="end" @slotchange=${this.places.read}>${this.submenu ? html`<acme-chevron-right-icon class="arrow" size="16px"></acme-chevron-right-icon>` : nothing}</slot></span>`;
    const action =
      this.href && this.type === "action" && !this.submenu
        ? html`<a part="root" class="item" tabindex="-1" href=${this.disabled ? nothing : this.href} target=${this.target || nothing} rel=${this.rel || (this.target === "_blank" ? "noopener noreferrer" : nothing)} ?data-highlighted=${this.highlighted} @click=${this.activate} @auxclick=${this.activate}>${body}</a>`
        : html`<button part="root" class="item" type="button" tabindex="-1" ?data-highlighted=${this.highlighted} @click=${this.activate}>${body}</button>`;
    return html`${action}<slot name="submenu" @slotchange=${() => {
      this.places.read();
      this.requestUpdate();
    }}></slot>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-menu-item": AcmeMenuItem;
  }
}
