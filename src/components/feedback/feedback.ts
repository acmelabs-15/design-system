import { autoUpdate, computePosition, flip, offset, shift } from "@floating-ui/dom";
import { css, html, nothing, svg } from "lit";
import { customElement, property, query, queryAll } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { Interaction } from "../../shared/interaction";
import { reduced } from "../../shared/overlay";
import { feedbackCss } from "./feedback.styles";
import "../button/button";
import "../input/input";
import "../select/select";
import "../textarea/textarea";
import { atomState } from "../../shared/atom-state";

export type FeedbackVariant = "" | "inline";
export type FeedbackButtonVariant = "default" | "secondary" | "tertiary";
/** What a submission carries: the metadata, then the page, the note, the emotion code, the plan, the label, the topic and the client. */
export type FeedbackPayload = Record<string, unknown> & { url: string; note: string; email: string; emotion: string; plan: string; label: string; topic: string; ua: string };

/** The four emotions, worst first: the code sent, the name read to assistive tech, and the face (16px paths). */
const FACES: { code: string; name: string; paths: ReturnType<typeof svg> }[] = [
  {
    code: "f62d",
    name: "Hate it",
    paths: svg`<path fill="var(--ds-blue-700)" fill-rule="evenodd" clip-rule="evenodd" d="M4 9v7h1.5V9zm8 0v7h-1.5V9z"/><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M1.5 8A6.5 6.5 0 1 1 13 12.15v2.1A7.99 7.99 0 0 0 8 0a8 8 0 0 0-5 14.25v-2.1A6.5 6.5 0 0 1 1.5 8M8 14.5q.78 0 1.5-.17v1.53a8 8 0 0 1-3 0v-1.53q.72.17 1.5.17M3.79 8.37a2.04 2.04 0 0 1 2.92 0L7.8 7.32a3.54 3.54 0 0 0-5.08 0zm6.96-.62c-.57 0-1.1.23-1.46.62L8.2 7.32a3.54 3.54 0 0 1 5.08 0L12.2 8.37a2 2 0 0 0-1.46-.62M6.25 12h3.5a1.75 1.75 0 1 0-3.5 0"/>`,
  },
  {
    code: "f615",
    name: "Not great",
    paths: svg`<path fill="currentColor" d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0m0 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13m0 7.88c1.47 0 2.76.75 3.52 1.88l.35.52-1.04.7-.34-.52a3 3 0 0 0-4.97 0l-.35.51-1.04-.7.35-.51A4.2 4.2 0 0 1 8 9.38M5.75 5.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5m4.5 0a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5"/>`,
  },
  {
    code: "f600",
    name: "It's okay",
    paths: svg`<path fill="currentColor" d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0m0 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13m3.87 8.83-.35.52a4.24 4.24 0 0 1-7.04 0l-.35-.51 1.04-.7.35.52a3 3 0 0 0 4.97 0l.34-.53zM5.75 5.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5m4.5 0a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5"/>`,
  },
  {
    code: "f929",
    name: "Love it!",
    paths: svg`<path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M14.5 8a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-11.5.97h-.62v.63c0 1.87 1.93 3.26 4.12 3.26s4.13-1.38 4.13-3.26v-.63H4.5M8 11.61c-1.4 0-2.36-.66-2.72-1.38h5.44c-.36.72-1.31 1.38-2.72 1.38"/><path fill="var(--ds-amber-800)" fill-rule="evenodd" clip-rule="evenodd" d="M6.15 4.92 5.37 3.5 4.6 4.92l-1.6.3 1.12 1.17L3.9 8l1.47-.7 1.46.7-.2-1.6 1.11-1.18zm5.25 0-.78-1.42-.77 1.42-1.6.3 1.12 1.17L9.16 8l1.47-.7 1.46.7-.2-1.6L13 5.21z"/>`,
  },
];
/** The fixed list of topics behind `show-topics`. */
const TOPICS = [
  "AI",
  "Accounts and Access Controls",
  "Billing",
  "CDN (Firewall, Caching)",
  "CI/CD (Builds, Deployments, Environment Variables)",
  "Dashboard Interface (Navigation, UI Issues)",
  "Domains",
  "Frameworks",
  "Marketplace and Integrations",
  "Observability (Observability, Logs, Monitoring)",
  "Storage",
];
const CHECK = svg`<path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.47-1.47.53-.53L11 4.94l-.53.53L6.5 9.44l-.97-.97L5 7.94 3.94 9l.53.53 1.5 1.5c.3.3.77.3 1.06 0z"/>`;
const MARKDOWN = svg`<path clip-rule="evenodd" fill-rule="evenodd" fill="var(--ds-gray-700)" d="M19.5 1.25H2.5C1.80964 1.25 1.25 1.80964 1.25 2.5V11.5C1.25 12.1904 1.80964 12.75 2.5 12.75H19.5C20.1904 12.75 20.75 12.1904 20.75 11.5V2.5C20.75 1.80964 20.1904 1.25 19.5 1.25ZM2.5 0C1.11929 0 0 1.11929 0 2.5V11.5C0 12.8807 1.11929 14 2.5 14H19.5C20.8807 14 22 12.8807 22 11.5V2.5C22 1.11929 20.8807 0 19.5 0H2.5ZM3 3.5H4H4.25H4.6899L4.98715 3.82428L7 6.02011L9.01285 3.82428L9.3101 3.5H9.75H10H11V4.5V10.5H9V6.79807L7.73715 8.17572L7 8.97989L6.26285 8.17572L5 6.79807V10.5H3V4.5V3.5ZM15 7V3.5H17V7H19.5L17 9.5L16 10.5L15 9.5L12.5 7H15Z"/>`;

/** Space between the trigger and the card. */
const CARD_GAP = 8;
/** The first field takes focus this long after the card opens. */
const FOCUS_MS = 150;
/** The thank-you view stays this long before the card closes. */
const THANKS_MS = 4000;
/** The fields reset this long after the card closes. */
const RESET_MS = 150;
/** A leaving subtree keeps its box at most this long after its exit transition starts. */
const EXIT_MS = 400;
/** The card's fade-out. */
const FADE_OUT_MS = 200;
/** A document event that opens every feedback card on the page. */
const SHOW_EVENT = "show-feedback";

type Phase = "entered" | "exiting" | null;

/**
 * Feedback: a note plus an emotion. A small secondary "Feedback" button opens a 340px card 8px
 * under it (`aria-haspopup="dialog"`): a textarea, a markdown hint, and a footer with four
 * emotion radios and a Send button. `variant="inline"` renders the "Was this helpful?" pill with the
 * four faces instead; a face grows the pill into the card (336px wide) in place, `upwards` keeps the
 * row 48px high and shifts the card up, `full-width` fills the row. `show-topics` adds a topic
 * select and `show-email` an email field above the textarea. Send validates (topic, email, note,
 * emotion) and shows the message under the textarea; a dry run skips both the checks and the
 * request. Success swaps the form for a check and two lines, then the card closes after 4s (later
 * while the pointer rests on it) and the fields reset. Escape closes, ⌘Enter sends, a click
 * outside closes, focus returns to the trigger. The default slot is unused; `prefix` and `suffix`
 * decorate the trigger. Fires `acme-open`, `acme-close` and `acme-submit` (the payload).
 */
@customElement("acme-feedback")
export class AcmeFeedback extends AcmeElement {
  static styles = [
    sharedCss,
    feedbackCss,
    css`
      :host {
        display: inline-flex;
        position: relative;
      }
      :host([variant="inline"]) {
        display: block;
      }
    `,
  ];
  /** The source the submission names. */
  @property() label = "";
  /** The trigger's text. */
  @property({ attribute: "button-text" }) buttonText = "Feedback";
  /** The trigger's variant: `secondary` (default), `default` or `tertiary`. */
  @property({ attribute: "button-variant" }) buttonVariant: FeedbackButtonVariant = "secondary";
  /** The trigger's HTML type. */
  @property({ attribute: "button-type" }) buttonType: "button" | "submit" | "reset" = "button";
  /** The prompt beside the faces of the inline pill. */
  @property() copy = "Was this helpful?";
  /** `inline` renders the pill instead of the trigger. */
  @property({ reflect: true }) variant: FeedbackVariant = "";
  /** The inline card opens upward: the row keeps its height and the card shifts up. */
  @property({ type: Boolean }) upwards = false;
  /** The inline pill fills its row. */
  @property({ type: Boolean, attribute: "full-width" }) fullWidth = false;
  /** Adds the topic select above the textarea. */
  @property({ type: Boolean, attribute: "show-topics" }) showTopics = false;
  /** Adds the email field above the textarea. */
  @property({ type: Boolean, attribute: "show-email" }) showEmail = false;
  /** A known email, sent instead of the field's value. */
  @property() email = "";
  /** The plan the submission names. */
  @property({ attribute: "plan-name" }) planName = "";
  /** The site the submission names in its client string. */
  @property({ attribute: "site-type" }) siteType = "front";
  /** Key-value context sent with the submission, as JSON. */
  @property({ type: Object }) metadata: Record<string, unknown> = {};
  /** Skips the checks and the request: the thank-you shows at once. */
  @property({ type: Boolean, attribute: "dry-run" }) dryRun = false;
  /** Where a submission is posted, as JSON. */
  @property() endpoint = "/api/feedback";
  /** The card is open (the trigger's card, or the inline pill grown into the card). */
  @property({ type: Boolean, reflect: true }) open = false;
  @atomState() private emotion = "";
  @atomState() private note = "";
  @atomState() private emailValue = "";
  @atomState() private topic = "";
  @atomState() private message = "";
  @atomState() private sending = false;
  @atomState() private sent = false;
  @atomState() private hasPrefix = false;
  @atomState() private hasSuffix = false;
  /** The card of the trigger variant: mounted and open, fading out, or gone. */
  @atomState() private card: "open" | "closed" | null = null;
  @atomState() private formPhase: Phase = "entered";
  @atomState() private errorPhase: Phase = null;
  /** The last message, kept while the error block leaves. */
  private lastMessage = "";
  private hovered = false;
  private pendingClose = false;
  private uid = `feedback-${Math.random().toString(36).slice(2, 8)}`;
  private stopAutoUpdate?: () => void;
  private timers = new Set<ReturnType<typeof setTimeout>>();
  @query(".trigger") private trigger?: HTMLElement;
  @query(".panel:not(.inline)") private floating?: HTMLElement;
  @query(".box") private box?: HTMLElement;
  @query(".phase") private phaseEl?: HTMLElement;
  @query(".error") private errorEl?: HTMLElement;
  @queryAll(".emoji") private emojiButtons!: NodeListOf<HTMLElement>;
  /** One controller per emotion radio: its hover and focus land as attributes on the button. */
  private emojiInteractions = FACES.map(() => new Interaction(this));

  connectedCallback() {
    super.connectedCallback();
    this.hasPrefix = !!this.querySelector('[slot="prefix"]');
    this.hasSuffix = !!this.querySelector('[slot="suffix"]');
    document.addEventListener("pointerdown", this.onOutside);
    document.addEventListener("keydown", this.onDocumentKey);
    document.addEventListener(SHOW_EVENT, this.onShow);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("pointerdown", this.onOutside);
    document.removeEventListener("keydown", this.onDocumentKey);
    document.removeEventListener(SHOW_EVENT, this.onShow);
    this.stopAutoUpdate?.();
    this.stopAutoUpdate = undefined;
    for (const t of this.timers) clearTimeout(t);
    this.timers.clear();
  }

  firstUpdated() {
    this.hasPrefix ||= !!this.querySelector('[slot="prefix"]');
    this.hasSuffix ||= !!this.querySelector('[slot="suffix"]');
  }

  private later(fn: () => void, ms: number) {
    const t = setTimeout(() => {
      this.timers.delete(t);
      fn();
    }, ms);
    this.timers.add(t);
  }

  private onShow = () => {
    this.open = true;
  };

  private onOutside = (e: Event) => {
    if (this.open && !e.composedPath().includes(this)) this.open = false;
  };

  private onDocumentKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") this.open = false;
  };

  private onCardKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" && e.metaKey) this.submit();
    if (this.variant === "inline" && e.key === "Escape") this.open = false;
  };

  /** Focus returns to the trigger: the control inside the composed button (the host itself takes no focus). */
  private focusTrigger() {
    (this.trigger?.shadowRoot?.querySelector("button, a") as HTMLElement | null)?.focus();
  }

  /** Focuses the first field: the topic select, the email field, then the textarea. */
  private focusField() {
    const root = this.shadowRoot!;
    const select = root.querySelector("acme-select")?.shadowRoot?.querySelector("select") as HTMLElement | null;
    const target = select ?? (root.querySelector("acme-input, acme-textarea") as HTMLElement | null);
    target?.focus();
  }

  private reset() {
    this.note = "";
    this.emailValue = "";
    this.topic = "";
    this.emotion = "";
    this.sent = false;
    this.message = "";
    this.pendingClose = false;
  }

  private payload(): FeedbackPayload {
    const meta: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(this.metadata)) {
      if (v === undefined || !k.trim()) continue;
      if (v === null || typeof v === "string" || typeof v === "number" || typeof v === "boolean") meta[k] = v;
      else
        try {
          meta[k] = JSON.stringify(v);
        } catch {
          meta[k] = String(v);
        }
    }
    return {
      ...meta,
      url: window.location.toString(),
      note: this.note,
      email: this.email || this.emailValue,
      emotion: this.emotion,
      plan: this.planName,
      label: this.label,
      topic: this.topic,
      ua: `${this.siteType} production + ${navigator.userAgent} (${navigator.language || "unknown language"})`,
    };
  }

  private succeed(payload: FeedbackPayload) {
    this.sent = true;
    this.sending = false;
    this.note = "";
    this.emailValue = "";
    this.topic = "";
    this.dispatchEvent(new CustomEvent<FeedbackPayload>("acme-submit", { detail: payload, bubbles: true, composed: true }));
    this.later(() => {
      if (document.hidden || this.hovered) this.pendingClose = true;
      else this.close();
    }, THANKS_MS);
  }

  private close() {
    this.open = false;
    this.later(() => this.reset(), RESET_MS);
  }

  private submit = async (e?: Event) => {
    e?.preventDefault();
    if (this.dryRun) {
      this.succeed(this.payload());
      return;
    }
    const fail = (m: string) => {
      this.message = m;
    };
    if (this.showTopics && !this.topic) return fail("Please select a topic");
    if (this.showEmail && !(this.email || this.emailValue)) return fail("Please enter your email");
    if (!this.note) return fail("Please enter your feedback");
    if (!this.emotion) return fail("Please select an emoji");
    this.sending = true;
    this.message = "";
    const payload = this.payload();
    try {
      const res = await fetch(this.endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(`Feedback request failed (${res.status})`);
      this.succeed(payload);
    } catch (err) {
      this.message = err instanceof Error ? err.message : "An error occurred while submitting feedback";
    } finally {
      this.sending = false;
    }
  };

  private pick(code: string) {
    if (this.variant === "inline") {
      const wasOpen = this.open;
      this.open = true;
      if (!wasOpen) this.later(() => this.focusField(), FOCUS_MS);
      if (this.emotion === code) {
        this.emotion = "";
        if (wasOpen) this.open = false;
        return;
      }
      this.emotion = code;
    } else this.emotion = this.emotion === code ? "" : code;
  }

  /** A subtree leaves: its exit rules apply until its transition ends, then it is gone. */
  private leave(el: HTMLElement | undefined, done: () => void, ms: number) {
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      el?.removeEventListener("transitionend", finish);
      el?.removeEventListener("animationend", finish);
      done();
    };
    el?.addEventListener("transitionend", finish, { once: true });
    el?.addEventListener("animationend", finish, { once: true });
    this.later(finish, ms);
  }

  /** Anchors the card under the trigger, centered, 8px away, in the viewport; it flips and shifts to stay in view. */
  private place = async () => {
    if (!this.floating || !this.trigger) return;
    const { x, y, placement } = await computePosition(this.trigger, this.floating, { placement: "bottom", strategy: "fixed", middleware: [offset(CARD_GAP), flip(), shift({ padding: 8 })] });
    Object.assign(this.floating.style, { left: `${x}px`, top: `${y}px` });
    this.box?.setAttribute("data-side", placement.split("-")[0]);
  };

  willUpdate(ch: Map<string, unknown>) {
    if (ch.has("message")) {
      if (this.message) {
        this.lastMessage = this.message;
        this.errorPhase = "entered";
      } else if (this.errorPhase === "entered") {
        this.errorPhase = "exiting";
        this.leave(
          this.errorEl,
          () => {
            if (this.errorPhase === "exiting") this.errorPhase = null;
          },
          EXIT_MS,
        );
      }
    }
    if (ch.has("sent")) {
      if (this.sent && this.formPhase === "entered") {
        this.formPhase = "exiting";
        this.leave(
          this.phaseEl,
          () => {
            if (this.formPhase === "exiting") this.formPhase = null;
          },
          EXIT_MS,
        );
      } else if (!this.sent) this.formPhase = "entered";
    }
    if (ch.has("open")) {
      // An element that starts open mounts its card without the open event.
      const initial = ch.get("open") === undefined;
      if (this.open) {
        if (this.variant !== "inline") {
          this.sent = false;
          this.message = "";
          this.pendingClose = false;
          this.emotion = "";
          this.card = "open";
          this.later(() => this.focusField(), FOCUS_MS);
        }
        if (!initial) this.dispatchEvent(new CustomEvent("acme-open", { bubbles: true, composed: true }));
      } else if (!initial) {
        this.emotion = "";
        if (this.card === "open") {
          this.card = "closed";
          this.leave(
            this.box,
            () => {
              if (this.card === "closed") this.card = null;
            },
            FADE_OUT_MS,
          );
          this.focusTrigger();
        }
        this.dispatchEvent(new CustomEvent("acme-close", { bubbles: true, composed: true }));
      }
    }
  }

  updated(ch: Map<string, unknown>) {
    if (ch.has("card")) {
      this.stopAutoUpdate?.();
      this.stopAutoUpdate = undefined;
      if (this.card && this.floating && this.trigger) this.stopAutoUpdate = autoUpdate(this.trigger, this.floating, this.place);
    }
    const buttons = this.emojiButtons;
    this.emojiInteractions.forEach((it, i) => {
      it.attach(buttons[i]);
    });
  }

  private onHover = (over: boolean) => {
    this.hovered = over;
    if (!over && this.pendingClose) this.close();
  };

  private faces() {
    return FACES.map(
      ({ code, name, paths }) =>
        html`<button class="emoji" type="button" role="radio" aria-checked=${String(this.emotion === code)} aria-label=${`Select ${name} emoji`} @click=${() => this.pick(code)}><svg viewBox="0 0 16 16" height="16" width="16" style="color:currentColor" aria-hidden="true">${paths}</svg></button>`,
    );
  }

  private form(inline: boolean) {
    const fields = html`<div class="fields">
      ${
        this.showTopics
          ? html`<acme-select aria-label="Product topic selection" placeholder="Select a topic..." .options=${TOPICS} .value=${this.topic} @acme-change=${(e: CustomEvent<{ value: string }>) => {
              this.topic = e.detail.value;
            }}></acme-select>`
          : nothing
      }
      ${
        this.showEmail
          ? html`<acme-input aria-label="E-mail" type="email" placeholder="Email Address" .value=${this.emailValue} @acme-input=${(e: CustomEvent<{ value: string }>) => {
              this.emailValue = e.detail.value;
            }}></acme-input>`
          : nothing
      }
      <acme-textarea placeholder="Your feedback..." aria-label="Your feedback" .value=${this.note} @acme-input=${(e: CustomEvent<{ value: string }>) => {
        this.note = e.detail.value;
      }} @focusin=${() => {
        if (inline) this.open = true;
      }}></acme-textarea>
      ${this.errorPhase ? html`<div class="error" data-phase=${this.errorPhase} data-enter=${reduced() ? nothing : "animate"}><div class="error-inner"><p style=${inline ? "display:block" : "padding-top:4px;display:block"}>${this.lastMessage}</p></div></div>` : nothing}
      <div class="hint"><svg fill="none" height="14" viewBox="0 0 22 14" width="22" aria-hidden="true">${MARKDOWN}</svg>supported.</div>
    </div>`;
    const send = html`<acme-button size="small" type="submit" ?loading=${this.sending}>Send</acme-button>`;
    return html`<div class="phase" data-phase=${this.formPhase ?? "exiting"} @keydown=${this.onCardKey}>
      <form @submit=${this.submit}>
        ${fields}
        ${inline ? html`<div class="foot" style="justify-content:flex-end">${send}</div>` : html`<div class="foot"><span class="emojis">${this.faces()}</span>${send}</div>`}
      </form>
    </div>`;
  }

  private done(inline: boolean) {
    return html`<div class="done" style=${inline ? "height:75%;padding-top:48px" : nothing}>
      <svg viewBox="0 0 16 16" height="32" width="32" style="color:var(--ds-green-900)" aria-hidden="true">${CHECK}</svg>
      <p class="received">Your feedback has been received!</p>
      <p class="thanks">Thank you for your help.</p>
    </div>`;
  }

  /** The inline card's box: the pill at rest, the card when open (28px taller with a message; shifted up when it opens upward). */
  private inlineStyle() {
    if (!this.open) return this.fullWidth ? "height:48px;border-radius:30px" : "height:48px;width:274px;border-radius:30px";
    const h = this.showEmail && this.showTopics ? 341 : this.showEmail || this.showTopics ? 293 : 243;
    if (this.upwards) return `height:${h + 2}px;width:336px;border-radius:12px;transform:translateY(${this.message ? -100 : -200}px)`;
    return `height:${this.message ? h + 28 : h}px;width:336px;border-radius:12px`;
  }

  render() {
    const inline = this.variant === "inline";
    const body = (isInline: boolean) => html`${this.formPhase ? this.form(isInline) : nothing}${this.sent ? this.done(isInline) : nothing}`;
    if (inline)
      return html`<div class=${this.cls("panel", { inline: true, full: this.fullWidth, up: this.upwards })} part="panel">
        <div class="box" style=${this.inlineStyle()} part="card">
          <div class="head"><p class="copy">${this.copy}</p><span class="emojis">${this.faces()}</span></div>
          ${body(true)}
        </div>
      </div>`;
    return html`<acme-button
        class="trigger"
        size="small"
        variant=${this.buttonVariant}
        type=${this.buttonType}
        style="width:var(--navbar-secondary-button-width)"
        aria-haspopup="dialog"
        aria-expanded=${String(this.open)}
        aria-controls=${this.uid}
        data-state=${this.open ? "open" : "closed"}
        @click=${() => {
          this.open = !this.open;
        }}
        part="trigger"
        >${this.hasPrefix ? html`<slot name="prefix" slot="prefix"></slot>` : nothing}${this.buttonText}${this.hasSuffix ? html`<slot name="suffix" slot="suffix"></slot>` : nothing}</acme-button
      >${
        this.card
          ? html`<div class=${this.cls("panel", { sent: this.sent })} style="position:fixed;left:0;top:0;min-width:max-content;z-index:101" part="panel">
              <div
                class="box"
                role="dialog"
                id=${this.uid}
                tabindex="-1"
                data-state=${this.card}
                data-side="bottom"
                data-align="center"
                @keydown=${this.onCardKey}
                @mouseenter=${() => this.onHover(true)}
                @mousemove=${() => this.onHover(true)}
                @mouseleave=${() => this.onHover(false)}
                part="card"
              >
                ${body(false)}
              </div>
            </div>`
          : nothing
      }`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-feedback": AcmeFeedback;
  }
}
