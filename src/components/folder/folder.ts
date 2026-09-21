import { folderStructureCss } from "../../generated/components/folder/folder-structure.styles";
import { html, nothing } from "lit";
import { property, query } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { Interaction } from "../../shared/interaction";
import { folderCss } from "../../generated/components/folder/folder.styles";

/**
 * Folder row of a file tree. A 28px full-width toggle button holds one indent guide per folder
 * level above, the folder icon (open or closed) and the mono name; open, the folder renders its
 * rows (`acme-folder` and `acme-file` elements in the default slot), closed it renders none.
 * Closed by default; `default-open` starts open and `open` is the live state (set it to drive the
 * folder). A click flips `open` and fires `acme-toggle` (`detail.open`, `detail.name`). `label`
 * shows in place of `name` (the `label` slot holds rich content); the row's tooltip is that text.
 */

export class AcmeFolder extends AcmeElement {
  static styles = [sharedCss, folderCss, folderStructureCss];
  /** The folder's name: its text and tooltip. */
  @property() name = "";
  /** Shown in place of `name` when set. */
  @property() label = "";
  /** Starts open. */
  @property({ type: Boolean, attribute: "default-open" }) defaultOpen = false;
  /** Whether the folder shows its rows; reflects. */
  @property({ type: Boolean, reflect: true }) open = false;
  /** Folder levels above this row: one indent guide each. */
  @atomState() private depth = 0;
  @query(".toggle") private toggle!: HTMLElement;
  private interaction = new Interaction(this);

  connectedCallback() {
    super.connectedCallback();
    let depth = 0;
    for (let p = this.parentElement; p; p = p.parentElement) if (p.localName === "acme-folder") depth++;
    this.depth = depth;
  }

  willUpdate(changed: Map<string, unknown>) {
    if (changed.has("defaultOpen") && this.defaultOpen) this.open = true;
  }

  updated() {
    this.interaction.attach(this.toggle);
  }

  private onClick = () => {
    this.open = !this.open;
    this.dispatchEvent(new CustomEvent("acme-toggle", { detail: { name: this.name, open: this.open }, bubbles: true, composed: true }));
  };

  render() {
    const text = this.label || this.name;
    return html`<li class=${this.cls("folder", { open: this.open })} title=${text} part="folder">
      <button class="toggle" type="button" style="width:calc(100% + 8px)" @click=${this.onClick} part="toggle">
        ${Array.from({ length: this.depth }, () => html`<span class="indent"></span>`)}<span class="icon">${this.open ? html`<acme-folder-open-icon size="16px"></acme-folder-open-icon>` : html`<acme-folder-icon size="16px"></acme-folder-icon>`}</span><span class="name">${text}<slot name="label"></slot></span>
      </button>
      ${this.open ? html`<ul class="group" part="group"><slot></slot></ul>` : nothing}
    </li>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-folder": AcmeFolder;
  }
}
