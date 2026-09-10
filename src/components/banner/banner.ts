import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { Places } from "../../shared/places";
import { bannerCss } from "./banner.styles";
import { bannerMobileCss } from "./banner-mobile.styles";
import "../button/button";
import { atomState } from "../../shared/atom-state";

/** The viewport width from which the wide row shows and the mobile button hides, as the styles have it. */
const WIDE = "(min-width: 961px)";

/** The arrow after the button's label: a 16-box filled chevron. */
const arrow = html`<svg slot="end" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" style="color:currentColor"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="m6.75 3.94.53.53 2.82 2.82a1 1 0 0 1 0 1.42l-2.82 2.82-.53.53L5.69 11l.53-.53L8.69 8 6.22 5.53 5.69 5z"></path></svg>`;

/**
 * Banner: a prominent message across the full width of its container, with one call to action.
 * From the wide breakpoint (961px) it is a centred row: an optional start place, the message (16/24
 * gray-900; a `<b>` inside is 600 gray-1000) and a small secondary rounded link button with an
 * arrow, labelled by `button`. Below it the row hides and one such button holds the whole message
 * (or the `mobile` slot's copy) as its label, centred at its fit width; the start place moves into it.
 * Slots: default (the message), `start` (an icon before the message), `mobile` (shorter copy for
 * the mobile button). Parts: `banner` (the wide row), `mobile` (the mobile button).
 */
@customElement("acme-banner")
export class AcmeBanner extends AcmeElement {
  static styles = [sharedCss, bannerCss, bannerMobileCss];
  /** The action button's label. */
  @property() button = "";
  /** The action button's link. */
  @property() href = "";
  /** Whether the viewport is at or past the wide breakpoint: decides where the slots render. */
  @atomState() private wide = true;
  private places = new Places(this, { places: ["start"] });
  @atomState() private hasMobile = false;
  private media?: MediaQueryList;
  private onMedia = (e: MediaQueryListEvent) => {
    this.wide = e.matches;
  };

  connectedCallback() {
    super.connectedCallback();
    this.hasMobile = !!this.querySelector('[slot="mobile"]');
    if (typeof matchMedia !== "undefined") {
      this.media = matchMedia(WIDE);
      this.wide = this.media.matches;
      this.media.addEventListener("change", this.onMedia);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.media?.removeEventListener("change", this.onMedia);
    this.media = undefined;
  }

  firstUpdated() {
    // A parser that connects the element before its children (happy-dom does) misses them at connect.
    this.hasMobile ||= !!this.querySelector('[slot="mobile"]');
  }

  /** `mobile` is a slot of this element's own, not one of the two places, so it keeps its own flag. */
  private mobileSlotted = (e: Event) => {
    this.hasMobile = (e.target as HTMLSlotElement).assignedNodes({ flatten: true }).some((n) => n.nodeType === 1 || (n.textContent ?? "").trim());
  };

  render() {
    // One slot renders in one place: the message and the start place sit in the row when the viewport is
    // wide, in the mobile button when it is not. The mobile copy, when slotted, is that button's label.
    const message = html`<slot></slot>`;
    const mobileCopy = html`<slot name="mobile" @slotchange=${this.mobileSlotted}></slot>`;
    const start = (inButton: boolean) => html`<slot name="start" slot=${inButton ? "start" : nothing} @slotchange=${this.places.read}></slot>`;
    const startInButton = !this.wide && this.places.has("start");
    const messageInButton = !this.wide && !this.hasMobile;
    return html`<acme-button class="mobile" part="mobile" block href=${this.href} variant="secondary" size="small" shape="rounded" shadow>
        ${startInButton ? start(true) : nothing}${mobileCopy}${messageInButton ? message : nothing}${arrow}
      </acme-button>
      <div class="banner" part="banner">
        ${startInButton ? nothing : start(false)}
        <p class="text">${messageInButton ? nothing : message}</p>
        <acme-button class="action" href=${this.href} variant="secondary" size="small" shape="rounded" shadow>${this.button}${arrow}</acme-button>
      </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-banner": AcmeBanner;
  }
}
