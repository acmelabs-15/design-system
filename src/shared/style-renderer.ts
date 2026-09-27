import type { ReactiveController, ReactiveElement } from "lit";
import { readBreakpoints, useBreakpoints } from "./breakpoints";
import type { ResponsiveBreakpoints, ResponsiveRange } from "./responsive";
import { createResponsiveStylePlan, type ResponsiveStyleBlock } from "./responsive-style-plan";
import type { StyleDisplayMode, StyleInputKey, StyleSupports } from "./style-input-schema";

export type ResponsiveStyleTarget = "window" | "container";
export type ResponsiveStyleRule = Readonly<{
  property: string;
  target: "host" | "host-and-root" | "root";
  selector: string;
  template: string;
}>;
export type ResponsiveStyleDelivery = Readonly<{
  version: 1;
  rootDisplay: string;
  layoutDisplay: Readonly<Record<"flex" | "grid", string>>;
  containerProbe: Readonly<{ property: string; baseline: string; found: string }>;
  rules: Readonly<Record<StyleInputKey, ResponsiveStyleRule>>;
}>;
export type ResponsiveStyleRendererState = Readonly<{
  inputs: readonly (readonly [StyleInputKey, unknown])[];
  target?: ResponsiveStyleTarget;
  container?: string;
}>;
export type ResponsiveStyleDiagnostic = Readonly<{ code: "unresolved-responsive-container"; container?: string }>;

type BreakpointSource = Readonly<{ read(): ResponsiveBreakpoints; use(): ResponsiveBreakpoints }>;
type RendererOptions = Readonly<{
  root(): ShadowRoot | undefined;
  state(): ResponsiveStyleRendererState;
  displayModes?: readonly StyleDisplayMode[];
  layout?: "flex" | "grid";
  diagnostic?: (diagnostic: ResponsiveStyleDiagnostic) => void;
  supports?: (document: Document, property: string, value: string) => boolean;
  breakpoints?: BreakpointSource;
}>;
type AppliedStyle = { root?: ShadowRoot; document?: Document; sheet?: CSSStyleSheet; node?: HTMLStyleElement; text: string };

const defaultBreakpoints: BreakpointSource = { read: readBreakpoints, use: useBreakpoints };
const baseline = (range: ResponsiveRange) => range.min === 0 && range.max === undefined;
const deliveredRules = new WeakMap<object, Map<string, ResponsiveStyleRule>>();

function nativeSupports(document: Document, property: string, value: string): boolean {
  const css = document.defaultView?.CSS;
  if (css && typeof css.supports === "function") {
    return css.supports(property, value);
  }
  const style = document.createElement("div").style;
  style.setProperty(property, value);
  return style.getPropertyValue(property) !== "";
}

function query(range: ResponsiveRange): string {
  return [...(range.min > 0 ? [`(width >= ${range.min}rem)`] : []), ...(range.max === undefined ? [] : [`(width < ${range.max}rem)`])].join(" and ");
}

function escapeContainerName(document: Document, name: string | undefined): string | undefined {
  const value = name?.trim();
  if (!value) {
    return undefined;
  }
  if (/\s/.test(value) || /^(?:none|and|not|or|default|inherit|initial|revert|revert-layer|unset)$/i.test(value)) {
    throw new TypeError("Responsive container must be one CSS container name");
  }
  const css = document.defaultView?.CSS;
  if (css && typeof css.supports === "function" && !css.supports("container-name", value)) {
    throw new TypeError(`Invalid responsive container name: ${value}`);
  }
  if (css && typeof css.escape === "function") {
    return css.escape(value);
  }
  if (!/^-?[a-zA-Z_][a-zA-Z0-9_-]*$/.test(value)) {
    throw new TypeError(`Invalid responsive container name: ${value}`);
  }
  return value;
}

function rulesByProperty(delivery: ResponsiveStyleDelivery): Map<string, ResponsiveStyleRule> {
  const cached = deliveredRules.get(delivery);
  if (cached) {
    return cached;
  }
  if (delivery.version !== 1) {
    throw new TypeError("Unsupported responsive style delivery");
  }
  const result = new Map<string, ResponsiveStyleRule>();
  for (const rule of Object.values(delivery.rules)) {
    if (rule.template !== `${rule.selector}{${rule.property}:initial;}`) {
      throw new TypeError(`Invalid responsive style rule template: ${rule.property}`);
    }
    if (result.has(rule.property)) {
      throw new TypeError(`Duplicate responsive style property: ${rule.property}`);
    }
    result.set(rule.property, rule);
  }
  deliveredRules.set(delivery, result);
  return result;
}

/** Serializes a validated plan using declaration templates produced from the common schema. */
export function serializeResponsiveStylePlan(
  plan: readonly ResponsiveStyleBlock[],
  delivery: ResponsiveStyleDelivery,
  options: Readonly<{ document: Document; target: ResponsiveStyleTarget; container?: string; layout?: "flex" | "grid" }>,
): string {
  const templates = rulesByProperty(delivery);
  const container = options.target === "container" ? escapeContainerName(options.document, options.container) : undefined;
  const scratch = options.document.createElement("div").style;
  let output = "";
  for (const block of plan) {
    let declarations = "";
    for (const declaration of block.declarations) {
      const template = templates.get(declaration.property);
      if (!template || template.target !== declaration.target) {
        throw new TypeError(`Responsive style delivery does not match ${declaration.property}`);
      }
      scratch.removeProperty(template.property);
      const outerDisplay =
        options.layout && declaration.property === "display" && declaration.value !== "none" ? (declaration.value.startsWith("inline-") ? "inline-block" : "block") : declaration.value;
      scratch.setProperty(template.property, outerDisplay);
      const value = scratch.getPropertyValue(template.property);
      if (!value) {
        continue;
      }
      declarations += template.template.replace(/initial(?=;})/, () => value);
    }
    if (!declarations) {
      continue;
    }
    if (baseline(block.range)) {
      output += declarations;
    } else {
      const condition = query(block.range);
      output += options.target === "container" ? `@container${container ? ` ${container}` : ""} ${condition}{${declarations}}` : `@media ${condition}{${declarations}}`;
    }
  }
  // The inner box follows the host's selected display; it must not query the host as a different container.
  if (plan.some((block) => block.declarations.some((declaration) => declaration.target === "host-and-root"))) {
    output += options.layout ? delivery.layoutDisplay[options.layout] : delivery.rootDisplay;
  }
  if (options.target === "container" && plan.some((block) => !baseline(block.range))) {
    output += delivery.containerProbe.baseline + `@container${container ? ` ${container}` : ""} (width >= 0px){${delivery.containerProbe.found}}`;
  }
  return output;
}

function composedParent(element: Element): Element | null {
  if (element.assignedSlot) {
    return element.assignedSlot;
  }
  if (element.parentElement) {
    return element.parentElement;
  }
  const root = element.getRootNode();
  return root.nodeType === 11 && "host" in root ? (root as ShadowRoot).host : null;
}

function containerTokens(style: CSSStyleDeclaration, property: "container-name" | "container-type"): string[] {
  const camel = property === "container-name" ? "containerName" : "containerType";
  const value = ((style as unknown as Record<string, string>)[camel] || style.getPropertyValue(property)).trim();
  return value ? value.split(/\s+/) : [];
}

/** Inspects containers reachable through public DOM APIs; native CSS remains the matching oracle. */
export function findResponsiveContainer(host: Element, name?: string): Element | undefined {
  const wanted = name?.trim();
  const view = host.ownerDocument.defaultView;
  for (let candidate = composedParent(host); candidate; candidate = composedParent(candidate)) {
    const computed = view?.getComputedStyle(candidate);
    const inline = (candidate as HTMLElement).style;
    const display = (computed?.display || inline.display).trim();
    if (display === "none" || display === "contents") {
      continue;
    }
    const types = containerTokens(computed ?? inline, "container-type");
    if (!types.some((type) => type === "size" || type === "inline-size")) {
      continue;
    }
    if (!wanted) {
      return candidate;
    }
    const names = containerTokens(computed ?? inline, "container-name");
    if (names.includes(wanted)) {
      return candidate;
    }
  }
}

function removeSheet(root: ShadowRoot, sheet: CSSStyleSheet | undefined): void {
  if (!sheet || !("adoptedStyleSheets" in root) || !root.adoptedStyleSheets.includes(sheet)) {
    return;
  }
  root.adoptedStyleSheets = root.adoptedStyleSheets.filter((candidate) => candidate !== sheet);
}

function applyStyle(applied: AppliedStyle, root: ShadowRoot, text: string): void {
  const document = root.ownerDocument;
  const view = document.defaultView as (Window & { CSSStyleSheet?: typeof CSSStyleSheet; ShadyCSS?: { nativeShadow?: boolean }; litNonce?: string }) | null;
  const Sheet = view?.CSSStyleSheet;
  const native = (view?.ShadyCSS === undefined || view.ShadyCSS.nativeShadow) && Sheet && typeof Sheet.prototype.replaceSync === "function" && "adoptedStyleSheets" in root;
  if (!text) {
    removeSheet(applied.root ?? root, applied.sheet);
    applied.node?.remove();
    Object.assign(applied, { root, document, sheet: undefined, node: undefined, text: "" });
    return;
  }
  if (native) {
    applied.node?.remove();
    applied.node = undefined;
    const changedDocument = applied.document !== document || !(applied.sheet instanceof Sheet);
    if (changedDocument) {
      if (applied.root) {
        removeSheet(applied.root, applied.sheet);
      }
      applied.sheet = new Sheet();
      applied.text = "";
    }
    if (applied.text !== text) {
      applied.sheet!.replaceSync(text);
      applied.text = text;
    }
    const current = root.adoptedStyleSheets.filter((sheet) => sheet !== applied.sheet);
    if (!root.adoptedStyleSheets.includes(applied.sheet!)) {
      root.adoptedStyleSheets = [...current, applied.sheet!];
    }
  } else {
    if (applied.root) {
      removeSheet(applied.root, applied.sheet);
    }
    applied.sheet = undefined;
    let node = applied.node;
    if (node && node.ownerDocument !== document) {
      node.remove();
      node = undefined;
    }
    node ??= document.createElement("style");
    if (view?.litNonce !== undefined) {
      node.nonce = view.litNonce;
    } else {
      node.removeAttribute("nonce");
    }
    if (node.textContent !== text) {
      node.textContent = text;
    }
    if (node.parentNode !== root) {
      root.append(node);
    }
    applied.node = node;
    applied.text = text;
  }
  applied.root = root;
  applied.document = document;
}

/** Owns one per-instance responsive stylesheet while the host retains canonical inputs. */
export class ResponsiveStyleRenderer implements ReactiveController {
  private readonly applied: AppliedStyle = { text: "" };
  private readonly displayModes?: readonly StyleDisplayMode[];
  private readonly breakpoints: BreakpointSource;
  private lockedBreakpoints?: ResponsiveBreakpoints;
  private missing?: string;

  constructor(
    private readonly host: ReactiveElement,
    private readonly delivery: ResponsiveStyleDelivery,
    private readonly options: RendererOptions,
  ) {
    this.displayModes = options.displayModes && Object.freeze([...options.displayModes]);
    this.breakpoints = options.breakpoints ?? defaultBreakpoints;
    rulesByProperty(delivery);
    host.addController(this);
  }

  hostConnected(): void {
    this.host.requestUpdate();
  }

  hostUpdate(): void {
    this.update();
  }

  update(): void {
    const root = this.options.root();
    if (!root) {
      return;
    }
    const state = this.options.state();
    const target = state.target ?? "window";
    if (target !== "window" && target !== "container") {
      throw new TypeError(`Unknown responsive target: ${target}`);
    }
    const document = root.ownerDocument;
    const supports: StyleSupports = (property, value) => (this.options.supports ? this.options.supports(document, property, value) : nativeSupports(document, property, value));
    const widths = this.lockedBreakpoints ?? this.breakpoints.read();
    let plan = createResponsiveStylePlan(state.inputs, { supports, displayModes: this.displayModes, breakpoints: widths });
    const hasQueries = plan.some((block) => !baseline(block.range));
    if (hasQueries && !this.lockedBreakpoints) {
      this.lockedBreakpoints = this.breakpoints.use();
      if (this.lockedBreakpoints !== widths) {
        plan = createResponsiveStylePlan(state.inputs, { supports, displayModes: this.displayModes, breakpoints: this.lockedBreakpoints });
      }
    }
    const text = serializeResponsiveStylePlan(plan, this.delivery, { document, target, container: state.container, layout: this.options.layout });
    applyStyle(this.applied, root, text);

    if (target === "container" && hasQueries && this.options.diagnostic) {
      if (!this.host.isConnected) {
        return;
      }
      const name = state.container?.trim() || undefined;
      const signature = name ?? "<nearest>";
      const resolution = document.defaultView?.getComputedStyle(this.host).getPropertyValue(this.delivery.containerProbe.property).trim();
      const resolved = resolution === "1" || (!resolution && !!findResponsiveContainer(this.host, name));
      if (!resolved) {
        if (this.missing !== signature) {
          this.options.diagnostic?.(Object.freeze({ code: "unresolved-responsive-container", ...(name ? { container: name } : {}) }));
        }
        this.missing = signature;
        return;
      }
    }
    this.missing = undefined;
  }

  adopted(): void {
    this.update();
  }
}
