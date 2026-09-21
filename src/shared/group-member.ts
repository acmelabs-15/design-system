import { createAtom, type ReadonlyAtom } from "@tanstack/lit-store";
import type { ReactiveController, ReactiveElement } from "lit";
import type { AppearanceDefaults, InheritedAppearance, AppearanceDiagnostic } from "./inherited-appearance";
import { ResponsiveStyleRenderer } from "./style-renderer";
import { responsiveStyleDelivery } from "../generated/responsive-styles";
import type { StyleInputKey } from "./style-input-schema";
import { StoreSelector } from "./store-connection";
export { groupMemberCss as groupMemberStyles } from "../generated/shared/group-member.styles";

export const groupParticipantChange = "acme-internal-group-participant";
export type GroupEdges = Readonly<{ top: boolean; right: boolean; bottom: boolean; left: boolean }>;
export type GroupBorders = Readonly<{ top: number; right: number; bottom: number; left: number }>;
export type GroupMemberLayout = Readonly<{
  joined: boolean;
  grow: boolean;
  vertical: boolean;
  rtl: boolean;
  first: boolean;
  last: boolean;
  overlap: number;
  frame: GroupEdges;
}>;
type Options = {
  surface(): HTMLElement | undefined;
  appearance?: Pick<InheritedAppearance<string, string>, "setProvider" | "diagnostics">;
  restingBorders?(): GroupBorders;
  emphasized?(): boolean;
};
const members = new WeakMap<Element, GroupMemberController>();
export const groupParticipant = (element: Element): GroupMemberController | undefined => members.get(element);
const flags = [
  "data-acme-group-surface",
  "data-acme-group-emphasized",
  "data-acme-group-cut-tl",
  "data-acme-group-cut-tr",
  "data-acme-group-cut-br",
  "data-acme-group-cut-bl",
  "data-acme-group-frame-top",
  "data-acme-group-frame-right",
  "data-acme-group-frame-bottom",
  "data-acme-group-frame-left",
] as const;

/** Explicit participation: the component supplies its actual styled surface and appearance receiver. */
export class GroupMemberController implements ReactiveController {
  private owner?: object;
  private defaults?: ReadonlyAtom<AppearanceDefaults>;
  private readonly current = createAtom<{ layout?: GroupMemberLayout }>({});
  readonly layout = createAtom(() => this.current.get().layout);
  private previousSurface?: HTMLElement;
  private connected = false;
  private diagnosticSubscription?: { unsubscribe(): void };
  private readonly renderer: ResponsiveStyleRenderer;
  constructor(
    readonly host: ReactiveElement,
    private options: Options,
  ) {
    if (members.has(host)) throw new Error("A component can register one Group participant");
    members.set(host, this);
    host.addController(this);
    new StoreSelector(host, () => this.layout);
    this.renderer = new ResponsiveStyleRenderer(host, responsiveStyleDelivery, {
      root: () => (host.renderRoot?.nodeType === 11 ? (host.renderRoot as ShadowRoot) : undefined),
      state: () => ({ inputs: this.styles() }),
    });
  }
  get surface(): HTMLElement | undefined {
    return this.options.surface();
  }
  borders(): GroupBorders {
    if (this.options.restingBorders) return this.options.restingBorders();
    const surface = this.surface,
      style = surface?.ownerDocument.defaultView?.getComputedStyle(surface);
    const number = (value: string | undefined) => Math.max(0, Number.parseFloat(value ?? "0") || 0);
    return { top: number(style?.borderTopWidth), right: number(style?.borderRightWidth), bottom: number(style?.borderBottomWidth), left: number(style?.borderLeftWidth) };
  }
  provide(owner: object, source: ReadonlyAtom<AppearanceDefaults>): void {
    if (this.owner === owner && this.defaults === source) return;
    if (this.owner !== owner) this.clearLayout();
    this.owner = owner;
    this.defaults = source;
    this.options.appearance?.setProvider(source);
  }
  release(owner: object): void {
    if (this.owner !== owner) return;
    this.owner = undefined;
    this.defaults = undefined;
    this.options.appearance?.setProvider(undefined);
    this.clearLayout();
  }
  present(owner: object, layout: GroupMemberLayout): void {
    if (this.owner !== owner) return;
    if (JSON.stringify(this.layout.get()) === JSON.stringify(layout)) return;
    this.current.set(Object.freeze({ layout: Object.freeze({ ...layout, frame: Object.freeze({ ...layout.frame }) }) }));
    this.paint();
    this.renderer.update();
  }
  private clearLayout(): void {
    this.current.set(Object.freeze({}));
    this.paint();
    this.renderer?.update();
  }
  private styles(): readonly (readonly [StyleInputKey, unknown])[] {
    const layout = this.layout.get();
    if (!layout) return [];
    const entries: (readonly [StyleInputKey, unknown])[] = [];
    if (layout.grow) entries.push(["flexGrow", 1], ["flexBasis", "0px"]);
    if (layout.joined) entries.push([layout.vertical ? "marginBlockStart" : "marginInlineStart", `${-layout.overlap}px`]);
    return entries;
  }
  private clearSurface(surface: HTMLElement): void {
    for (const flag of flags) surface.removeAttribute(flag);
  }
  private paint(): void {
    const surface = this.surface,
      layout = this.layout.get();
    if (this.previousSurface && this.previousSurface !== surface) this.clearSurface(this.previousSurface);
    this.previousSurface = surface;
    this.host.toggleAttribute("data-acme-group-member", !!this.owner);
    this.host.toggleAttribute("data-acme-group-joined", !!layout?.joined);
    const emphasized = !!layout?.joined && !!this.options.emphasized?.();
    this.host.toggleAttribute("data-acme-group-emphasized", emphasized);
    if (!surface) return;
    if (!layout?.joined) {
      this.clearSurface(surface);
      return;
    }
    surface.toggleAttribute("data-acme-group-surface", true);
    surface.toggleAttribute("data-acme-group-emphasized", emphasized);
    const cut = { tl: false, tr: false, br: false, bl: false };
    if (layout.vertical) {
      if (!layout.first) cut.tl = cut.tr = true;
      if (!layout.last) cut.bl = cut.br = true;
    } else if (layout.rtl) {
      if (!layout.first) cut.tr = cut.br = true;
      if (!layout.last) cut.tl = cut.bl = true;
    } else {
      if (!layout.first) cut.tl = cut.bl = true;
      if (!layout.last) cut.tr = cut.br = true;
    }
    for (const [corner, value] of Object.entries(cut)) surface.toggleAttribute(`data-acme-group-cut-${corner}`, value);
    for (const [side, value] of Object.entries(layout.frame)) surface.toggleAttribute(`data-acme-group-frame-${side}`, value);
  }
  private signal(): void {
    if (this.connected) this.host.dispatchEvent(new Event(groupParticipantChange, { bubbles: true, composed: true }));
  }
  private report = (diagnostics: readonly AppearanceDiagnostic[]): void => {
    for (const diagnostic of diagnostics) console.warn(this.host.localName, diagnostic);
  };
  hostConnected(): void {
    this.connected = true;
    this.diagnosticSubscription = this.options.appearance?.diagnostics.subscribe(this.report);
    if (this.options.appearance) this.report(this.options.appearance.diagnostics.get());
    this.signal();
  }
  hostUpdated(): void {
    this.paint();
    this.signal();
  }
  hostDisconnected(): void {
    this.connected = false;
    this.diagnosticSubscription?.unsubscribe();
    this.diagnosticSubscription = undefined;
    if (this.owner) this.release(this.owner);
  }
}
