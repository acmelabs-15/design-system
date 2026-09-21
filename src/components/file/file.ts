import { fileStructureCss } from "../../generated/components/file/file-structure.styles";
import { html, nothing } from "lit";
import { property, query } from "lit/decorators.js";
import { AcmeElement, boolish, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { Interaction } from "../../shared/interaction";
import { fileCss } from "../../generated/components/file/file.styles";

/** The file kinds, each with its own 14px icon. */
export type FileType = "file" | "lambda" | "edge-function" | "middleware";

const fileIcons = {
  file: html`<acme-description-icon size="14px"></acme-description-icon>`,
  lambda: html`<acme-function-icon size="14px"></acme-function-icon>`,
  "edge-function": html`<acme-bolt-icon size="14px"></acme-bolt-icon>`,
  middleware: html`<acme-layers-icon size="14px"></acme-layers-icon>`,
};

/**
 * File row of a file tree. A 28px line with one indent guide per folder level above and a
 * full-width link holding the kind's 14px icon and the mono name. `href` makes the link navigate;
 * without it the row is a plain anchor. `active` marks the current file: semibold name, gray-1000
 * icon. `type` picks the icon (file, lambda, edge-function, middleware); `show-icon="false"` hides
 * it. `label` shows in place of `name` (the `label` slot holds rich content); the row's tooltip is
 * that text. A click bubbles out as a plain `click` event.
 */

export class AcmeFile extends AcmeElement {
  static styles = [sharedCss, fileCss, fileStructureCss];
  /** The file's name: its text and tooltip. */
  @property() name = "";
  /** Shown in place of `name` when set. */
  @property() label = "";
  /** The link's target; without it the row does not navigate. */
  @property() href = "";
  /** The current file: semibold name, gray-1000 icon. */
  @property({ type: Boolean, reflect: true }) active = false;
  /** The icon: file, lambda, edge-function or middleware. */
  @property() type: FileType = "file";
  /** `show-icon="false"` hides the icon. */
  @property({ attribute: "show-icon", converter: boolish }) showIcon = true;
  /** Folder levels above this row: one indent guide each. */
  @atomState() private depth = 0;
  @query(".link") private link!: HTMLElement;
  private interaction = new Interaction(this);

  connectedCallback() {
    super.connectedCallback();
    let depth = 0;
    for (let p = this.parentElement; p; p = p.parentElement) if (p.localName === "acme-folder") depth++;
    this.depth = depth;
  }

  updated() {
    this.interaction.attach(this.link);
  }

  render() {
    const text = this.label || this.name;
    return html`<li class=${this.cls("file", { active: this.active })} title=${text} part="file">${Array.from({ length: this.depth }, () => html`<span class="indent"></span>`)}<a class="link" href=${this.href || nothing} style="width:calc(100% + 8px)" part="link">${this.showIcon ? html`<span class="icon">${Object.hasOwn(fileIcons, this.type) ? fileIcons[this.type] : fileIcons.file}</span>` : nothing}<span class="name">${text}<slot name="label"></slot></span></a></li>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-file": AcmeFile;
  }
}
