import { css, html, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { AcmeElement, boolish, paths, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { Interaction } from "../../shared/interaction";
import { fileCss } from "./file.styles";

/** The file kinds, each with its own 14px icon. */
export type FileType = "file" | "lambda" | "edge-function" | "middleware";

/** 24-box stroke glyphs per kind: the page, the lambda, the bolt of an edge function, the layers of a middleware. */
const GLYPHS: Record<FileType, string> = {
  file: paths.file,
  lambda: "M6 4h2a2 2 0 0 1 1.8 1.1L18 20M12.5 11.5 8 20",
  "edge-function": paths.bolt,
  middleware: paths.layers,
};
const glyph = (d: string) =>
  html`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d=${d}></path></svg>`;

/**
 * File row of a file tree. A 28px line with one indent guide per folder level above and a
 * full-width link holding the kind's 14px icon and the mono name. `href` makes the link navigate;
 * without it the row is a plain anchor. `active` marks the current file: semibold name, gray-1000
 * icon. `type` picks the icon (file, lambda, edge-function, middleware); `show-icon="false"` hides
 * it. `label` shows in place of `name` (the `label` slot holds rich content); the row's tooltip is
 * that text. A click bubbles out as a plain `click` event.
 */
@customElement("acme-file")
export class AcmeFile extends AcmeElement {
  static styles = [
    sharedCss,
    fileCss,
    css`
      :host {
        display: block;
      }
    `,
  ];
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
    return html`<li class=${this.cls("file", { active: this.active })} title=${text} part="file">${Array.from({ length: this.depth }, () => html`<span class="indent"></span>`)}<a class="link" href=${this.href || nothing} style="width:calc(100% + 8px)" part="link">${this.showIcon ? html`<span class="icon">${glyph(GLYPHS[this.type] ?? paths.file)}</span>` : nothing}<span class="name">${text}<slot name="label"></slot></span></a></li>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-file": AcmeFile;
  }
}
