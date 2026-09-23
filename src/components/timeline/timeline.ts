import { ContextProvider } from "@lit/context";
import { createAtom } from "@tanstack/lit-store";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { sharedCss } from "../../base";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { atomState } from "../../shared/atom-state";
import { StoreSelector } from "../../shared/store-connection";
import { ComposedParticipants } from "../../shared/composed-participants";
import { timelineContext, timelineMemberFor, isTimelineBoundary, registerTimelineBoundary, type TimelineMember, type TimelineOwner } from "../../shared/timeline-context";
import { timelineCss } from "../../generated/components/timeline/timeline.styles";
/** Ordered descriptive history, with author-owned dates and content.
 * @slot - Timeline Items, in reading order.
 * @csspart root - The native ordered list.
 */
export class AcmeTimeline extends AcmeSemanticElement {
  static styles = [sharedCss, timelineCss];
  @atomState() private axis: "vertical" | "horizontal" = "vertical";
  /** @default "vertical" */
  @property({ noAccessor: true, useDefault: true }) get orientation(): "vertical" | "horizontal" {
    return this.axis;
  }
  set orientation(value: "vertical" | "horizontal") {
    if (!["vertical", "horizontal"].includes(value)) throw new TypeError("Invalid Timeline orientation");
    const previous = this.axis;
    this.axis = value;
    this.requestUpdate("orientation", previous);
  }
  private readonly members = createAtom<readonly TimelineMember[]>([]);
  private readonly revision = createAtom(0);
  private readonly view = createAtom(() => {
    this.revision.get();
    return {
      orientation: this.orientation,
      members: [...this.members.get()].filter((member) => !member.host.hidden).sort((a, b) => (a.host.compareDocumentPosition(b.host) & Node.DOCUMENT_POSITION_PRECEDING ? 1 : -1)),
    };
  });
  private readonly owner: TimelineOwner = {
    view: this.view,
    register: (member) => {
      this.members.set((members) => [...members, member]);
      return () => this.members.set((members) => members.filter((m) => m !== member));
    },
  };
  private readonly provider = new ContextProvider(this, { context: timelineContext, initialValue: this.owner });
  private readonly updates = new StoreSelector(this, () => this.view);
  private readonly participants = new ComposedParticipants(this, {
    owner: this.owner,
    parts: () => this.members.get(),
    find: timelineMemberFor,
    boundary: isTimelineBoundary,
    slots: () => [...this.renderRoot.querySelectorAll("slot")],
    changed: () => this.revision.set((value) => value + 1),
  });
  constructor() {
    super();
    registerTimelineBoundary(this);
  }
  protected get semanticDefaults() {
    return { role: "list" };
  }
  render() {
    return html`<ol part="root" data-orientation=${this.orientation}><slot></slot></ol>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-timeline": AcmeTimeline;
  }
}
