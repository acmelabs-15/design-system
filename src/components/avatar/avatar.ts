import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { keyed } from "lit/directives/keyed.js";
import { AcmeElement, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { StoreSelector } from "../../shared/store-connection";
import { message, messageCatalogs } from "../../shared/messages";
import { optionalString } from "../../shared/attributes";
import { ResponsiveStyleRenderer } from "../../shared/style-renderer";
import { responsiveStyleDelivery } from "../../generated/responsive-styles";
import { avatarStructureCss } from "../../generated/components/avatar/avatar-structure.styles";
export type AvatarSize = "tiny" | "small" | "medium" | "large";
/** One entity image with a named or decorative fallback.
 * @slot fallback - Content used when an image is absent or unavailable.
 * @slot badge - Optional corner content.
 * @csspart root - The avatar surface.
 * @csspart image - The native image.
 * @csspart fallback - The fallback content.
 * @csspart badge - The corner content.
 * @fires {CustomEvent<Record<string,never>>} acme-load - The current image loaded.
 * @fires {CustomEvent<{code:"image";message:string}>} acme-error - The current image failed to load.
 */
export class AcmeAvatar extends AcmeElement {
  static styles = [sharedCss, avatarStructureCss];
  @atomState() private source = "";
  @atomState() private status: "idle" | "loading" | "loaded" | "error" = "idle";
  private generation = 0;
  /** @default "" */
  @property({ noAccessor: true, useDefault: true }) get src() {
    return this.source;
  }
  set src(value: string) {
    const next = value ?? "";
    if (next === this.source) return;
    const previous = this.source;
    this.source = next;
    this.generation++;
    this.status = next ? "loading" : "idle";
    this.requestUpdate("src", previous);
  }
  @atomState() @property({ noAccessor: true, useDefault: true }) label = "";
  @atomState() @property({ noAccessor: true, useDefault: true }) initials = "";
  @atomState() @property({ noAccessor: true, useDefault: true }) size: AvatarSize = "medium";
  @atomState() @property({ noAccessor: true, useDefault: true }) shape: "circle" | "square" = "circle";
  @atomState() @property({ noAccessor: true, type: Boolean }) loading = false;
  @atomState() @property({ noAccessor: true, converter: optionalString }) width?: string;
  private readonly localeChanges = new StoreSelector(this, () => this.themeContext.scope.effective);
  private readonly messages = new StoreSelector(this, () => messageCatalogs);
  private readonly dimensions = new ResponsiveStyleRenderer(this, responsiveStyleDelivery, {
    root: () => (this.renderRoot?.nodeType === 11 ? (this.renderRoot as ShadowRoot) : undefined),
    state: () => ({ inputs: [["width", this.width]] }),
  });
  private complete(image: HTMLImageElement, source: string, generation: number, loaded: boolean) {
    if (!this.isConnected || source !== this.src || generation !== this.generation || image !== this.renderRoot.querySelector("img")) return;
    const state = loaded ? "loaded" : "error";
    if (this.status === state) return;
    this.status = state;
    this.dispatchEvent(
      loaded
        ? new CustomEvent("acme-load", { detail: {}, bubbles: true, composed: true })
        : new CustomEvent("acme-error", {
            detail: { code: "image", message: message(this.themeContext.scope.effective.get().locale, "avatar.error", "Could not load image") },
            bubbles: true,
            composed: true,
          }),
    );
  }
  private derivedInitials() {
    if (this.initials) return this.initials;
    const locale = this.themeContext.scope.effective.get().locale;
    const words = [...new Intl.Segmenter(locale, { granularity: "word" }).segment(this.label)].filter((word) => word.isWordLike).map((word) => word.segment);
    const selected = words.length > 1 ? [words[0], words.at(-1)!] : words;
    const graphemes = new Intl.Segmenter(locale, { granularity: "grapheme" });
    return selected
      .map((word) => graphemes.segment(word)[Symbol.iterator]().next().value?.segment ?? "")
      .join("")
      .toLocaleUpperCase(locale);
  }
  protected willUpdate() {
    this.setAttribute("data-avatar-size", this.size);
  }
  protected updated() {
    const image = this.renderRoot.querySelector("img");
    if (image?.complete && this.status === "loading") this.complete(image, this.src, this.generation, image.naturalWidth > 0);
  }
  connectedCallback() {
    super.connectedCallback();
    this.requestUpdate();
  }
  adoptedCallback() {
    super.adoptedCallback();
    this.dimensions.adopted();
  }
  render() {
    const source = this.src,
      generation = this.generation,
      loaded = this.status === "loaded" && !this.loading;
    return html`<span class="avatar" part="root" data-shape=${this.shape} data-state=${this.loading ? "loading" : this.status} role=${this.label ? "img" : nothing} aria-label=${this.label || nothing} aria-hidden=${this.label ? nothing : "true"} aria-busy=${this.loading || this.status === "loading" ? "true" : nothing}>
      ${source ? keyed(generation, html`<img part="image" src=${source} alt="" aria-hidden="true" ?hidden=${!loaded} @load=${(event: Event) => this.complete(event.currentTarget as HTMLImageElement, source, generation, true)} @error=${(event: Event) => this.complete(event.currentTarget as HTMLImageElement, source, generation, false)}>`) : nothing}
      <span class="fallback" part="fallback" ?hidden=${loaded} aria-hidden="true"><slot name="fallback">${this.derivedInitials() || html`<acme-person-icon></acme-person-icon>`}</slot></span>
    </span><span class="badge" part="badge"><slot name="badge"></slot></span>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-avatar": AcmeAvatar;
  }
}
