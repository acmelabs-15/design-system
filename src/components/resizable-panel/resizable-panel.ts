import { html } from "lit";
import { property } from "lit/decorators.js";
import { sharedCss } from "../../base";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { atomState } from "../../shared/atom-state";
import { optionalString } from "../../shared/attributes";
import { ResizablePartBinding } from "../../shared/resizable-context";
import { SpringValue } from "../../shared/spring-value";
import { readMotionSpring } from "../../shared/motion-spring";
import { composedContains, deepActiveElement } from "../../shared/composed-tree";
import { resizablePanelCss } from "../../generated/components/resizable-panel/resizable-panel.styles";
/** A keyed pane whose content stays mounted when collapsed.
 * @slot - Author-owned pane content and scrolling/layout components.
 * @csspart panel - The content wrapper.
 */
export class AcmeResizablePanel extends AcmeSemanticElement {
  static styles = [sharedCss, resizablePanelCss];
  /** Required stable identity within this layout. */
  @atomState() @property({ noAccessor: true, converter: optionalString }) value?: string;
  /** Minimum open share of pane space, in percent. */
  @atomState() @property({ noAccessor: true, type: Number, attribute: "min-size", useDefault: true }) minSize = 0;
  /** Maximum share of pane space, in percent. */
  @atomState() @property({ noAccessor: true, type: Number, attribute: "max-size", useDefault: true }) maxSize = 100;
  /** Preferred initial percentage when root sizes are omitted. */
  @atomState() @property({ noAccessor: true, attribute: "default-size", converter: { fromAttribute: (v: string | null) => (v === null ? undefined : Number(v)) } }) defaultSize?: number;
  /** Allows this pane to collapse and reopen. */
  @atomState() @property({ noAccessor: true, type: Boolean }) collapsible = false;
  /** Percentage retained while collapsed; content remains inert. */
  @atomState() @property({ noAccessor: true, type: Number, attribute: "collapsed-size", useDefault: true }) collapsedSize = 0;
  @atomState() private requestedCollapsed = false;
  @property({ noAccessor: true, type: Boolean }) get collapsed(): boolean {
    const state = this.binding?.current?.state.get();
    return state && this.value && Object.hasOwn(state.layout.sizes, this.value) ? state.layout.collapsed.includes(this.value) : this.requestedCollapsed;
  }
  set collapsed(value: boolean) {
    const previous = this.collapsed;
    this.requestedCollapsed = Boolean(value);
    this.binding?.current?.collapse(this.binding.record, this.requestedCollapsed);
    this.requestUpdate("collapsed", previous);
  }
  private readonly binding = new ResizablePartBinding(this, {
    kind: "panel",
    element: () => this.renderRoot?.querySelector<HTMLElement>("[part~=panel]") ?? undefined,
    definition: () => ({ value: this.value ?? "", minSize: this.minSize, maxSize: this.maxSize, defaultSize: this.defaultSize, collapsible: this.collapsible, collapsedSize: this.collapsedSize }),
    initialCollapsed: () => this.requestedCollapsed,
  });
  private get share(): number | undefined {
    const sizes = this.binding.current?.state.get().layout.sizes;
    return sizes && this.value && Object.hasOwn(sizes, this.value) ? sizes[this.value] : undefined;
  }
  private readonly motion = new SpringValue(
    this,
    () => this.share ?? 0,
    () => readMotionSpring(this, "standard", "spatial", "fast"),
  );
  private laidOut = false;
  private visualTarget?: number;
  private visualRange = { min: 0, max: 100 };
  protected get semanticDefaults() {
    return { role: "group" };
  }
  protected willUpdate() {
    const share = this.share,
      state = this.binding.current?.state.get();
    if (share !== undefined) {
      if (!this.laidOut || !state?.animate || state.dragging) {
        this.visualRange = { min: share, max: share };
        this.motion.jump();
      } else {
        if (share !== this.visualTarget) {
          const from = Math.max(this.visualRange.min, Math.min(this.visualRange.max, this.motion.value));
          this.visualRange = { min: Math.min(from, share), max: Math.max(from, share) };
        }
        this.motion.update();
      }
      this.visualTarget = share;
      this.laidOut = true;
    }
    const active = deepActiveElement(this.ownerDocument);
    if ((this.collapsed || share === 0) && active && composedContains(this, active)) {
      this.binding.current?.recover(this.binding.record);
    }
  }
  protected updated() {
    if (this.share === undefined) {
      this.style.removeProperty("--_resize-share");
    } else {
      this.style.setProperty("--_resize-share", String(Math.max(this.visualRange.min, Math.min(this.visualRange.max, this.motion.value))));
    }
    this.toggleAttribute("data-collapsed", this.collapsed);
    this.toggleAttribute("data-resizing", !!this.binding.current?.state.get().dragging);
  }
  disconnectedCallback() {
    this.laidOut = false;
    super.disconnectedCallback();
  }
  render() {
    return html`<div part="root panel" ?inert=${this.collapsed || this.share === 0} ?hidden=${this.collapsed}><slot></slot></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-resizable-panel": AcmeResizablePanel;
  }
}
