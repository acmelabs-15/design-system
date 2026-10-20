import { html } from "lit";
import { sharedCss } from "../../base";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { TimelineBinding } from "../../shared/timeline-context";
import { timelineItemCss } from "../../generated/components/timeline-item/timeline-item.styles";
/** One descriptive event in a Timeline.
 * @slot - Rich event content.
 * @slot indicator - Decorative event marker.
 * @slot date - Authored date or time content.
 * @slot heading - The event heading at an author-chosen level.
 * @slot description - Supporting event description.
 * @csspart item - The native list item.
 * @csspart indicator - The decorative marker.
 * @csspart connector - The decorative connection to the following event.
 * @csspart content - The content column.
 * @csspart date - Date content.
 * @csspart heading - Heading content.
 * @csspart description - Supporting text.
 */
export class AcmeTimelineItem extends AcmeSemanticElement {
  static styles = [sharedCss, timelineItemCss];
  private readonly binding = new TimelineBinding(this);
  protected get semanticTarget() {
    return this.renderRoot?.querySelector<HTMLElement>("[part=item]") ?? undefined;
  }
  render() {
    const view = this.binding.current?.view.get();
    const last = view?.members.at(-1) === this.binding.record;
    return html`<li part="item" data-orientation=${view?.orientation ?? "vertical"}><span part="indicator" aria-hidden="true"><slot name="indicator"><span class="dot"></span></slot></span><span part="connector" aria-hidden="true" ?hidden=${last || !view}></span><div part="content"><div part="date"><slot name="date"></slot></div><div part="heading"><slot name="heading"></slot></div><div part="description"><slot name="description"></slot></div><slot></slot></div></li>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-timeline-item": AcmeTimelineItem;
  }
}
