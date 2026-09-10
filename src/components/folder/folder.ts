import { css, html, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { Interaction } from "../../shared/interaction";
import { folderCss } from "./folder.styles";

/** 24-box stroke glyphs: the closed folder and the open one, 16px. */
const FOLDER_CLOSED = "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z";
const FOLDER_OPEN = "M6 14l1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2";
const glyph = (d: string) =>
  html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d=${d}></path></svg>`;

/**
 * Folder row of a file tree. A 28px full-width toggle button holds one indent guide per folder
 * level above, the folder icon (open or closed) and the mono name; open, the folder renders its
 * rows (`acme-folder` and `acme-file` elements in the default slot), closed it renders none.
 * Closed by default; `default-open` starts open and `open` is the live state (set it to drive the
 * folder). A click flips `open` and fires `acme-toggle` (`detail.open`, `detail.name`). `label`
 * shows in place of `name` (the `label` slot holds rich content); the row's tooltip is that text.
 */
@customElement("acme-folder")
export class AcmeFolder extends AcmeElement {
  static styles = [
    sharedCss,
    folderCss,
    css`
      :host {
        display: block;
      }
    `,
  ];
  /** The folder's name: its text and tooltip. */
  @property() name = "";
  /** Shown in place of `name` when set. */
  @property() label = "";
  /** Starts open. */
  @property({ type: Boolean, attribute: "default-open" }) defaultOpen = false;
  /** Whether the folder shows its rows; reflects. */
  @property({ type: Boolean, reflect: true }) open = false;
  /** Folder levels above this row: one indent guide each. */
  @state() private depth = 0;
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
        ${Array.from({ length: this.depth }, () => html`<span class="indent"></span>`)}<span class="icon">${glyph(this.open ? FOLDER_OPEN : FOLDER_CLOSED)}</span><span class="name">${text}<slot name="label"></slot></span>
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
