import { createAtom } from "@tanstack/lit-store";
import { html, nothing, svg } from "lit";
import { property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { styleMap } from "lit/directives/style-map.js";
import { AcmeElement, boolish, sharedCss } from "../../base";
import { flowDiagramCss } from "../../generated/components/flow-diagram/flow-diagram.styles";
import { atomState } from "../../shared/atom-state";
import { flowNodes, flowEdges, validateFlowGraph, type FlowNode, type FlowEdge } from "../../shared/flow-data";
import { fitFlowViewport, zoomFlowViewport, roundedFlowPath, flowArrow, type FlowViewport, type FlowPoint } from "../../shared/flow-geometry";
import { createFlowGraph, flowScene, type FlowScene, type FlowSize } from "../../shared/flow-graph";
import { FlowLayout } from "../../shared/flow-layout";
import { flowDiagramConfiguration } from "../../shared/flow-configuration";
import { flowNodePartFor, type FlowNodePart } from "../../shared/flow-node-binding";
import { SpringValue } from "../../shared/spring-value";
import { readMotionSpring } from "../../shared/motion-spring";
import { message, messageCatalogs } from "../../shared/messages";
import { StoreSelector } from "../../shared/store-connection";

export type { FlowNode, FlowEdge, FlowPort } from "../../shared/flow-data";
/** Automatically routed read-only diagram with stable authored node content.
 * @slot - Flow Node parts keyed by node-id.
 * @csspart root - Diagram and relationship disclosure.
 * @csspart viewport - Clipped interactive canvas.
 * @csspart background - Pan and zoom gesture surface.
 * @csspart node - Default node surface.
 * @csspart edge - Routed connection path.
 * @csspart edge-label - Connection label.
 * @csspart controls - Fit and zoom controls.
 * @fires {CustomEvent<{viewport:{x:number,y:number,zoom:number}}>} acme-change - User viewport change.
 * @fires {CustomEvent<{action:"node",id:string}>} acme-request - Explicit node activation.
 * @fires {CustomEvent<{code:"layout",message:string}>} acme-error - Layout failure.
 */
export class AcmeFlowDiagram extends AcmeElement {
  static styles = [sharedCss, flowDiagramCss];
  @atomState() private nodeData: readonly FlowNode[] = Object.freeze([]);
  /** @default [] */
  @property({ noAccessor: true, type: Array, useDefault: true }) get nodes() {
    return this.nodeData;
  }
  set nodes(value: readonly FlowNode[]) {
    const old = this.nodeData;
    this.nodeData = flowNodes(value);
    this.requestUpdate("nodes", old);
  }
  @atomState() private edgeData: readonly FlowEdge[] = Object.freeze([]);
  /** @default [] */
  @property({ noAccessor: true, type: Array, useDefault: true }) get edges() {
    return this.edgeData;
  }
  set edges(value: readonly FlowEdge[]) {
    const old = this.edgeData;
    this.edgeData = flowEdges(value);
    this.requestUpdate("edges", old);
  }
  @atomState() private axis: "right" | "down" = "right";
  /** @default "right" */
  @property({ noAccessor: true, useDefault: true }) get direction() {
    return this.axis;
  }
  set direction(value: "right" | "down") {
    if (value !== "right" && value !== "down") {
      throw new TypeError("Invalid Flow direction");
    }
    const old = this.axis;
    this.axis = value;
    this.requestUpdate("direction", old);
  }
  @atomState() private viewport: FlowViewport = Object.freeze({ x: 0, y: 0, zoom: 1 });
  /** @default 1 */
  @property({ noAccessor: true, type: Number, useDefault: true }) get zoom() {
    return this.viewport.zoom;
  }
  set zoom(value: number) {
    this.zoomTo(value);
  }
  @atomState() private minimum = 0.25;
  /** @default .25 */
  @property({ noAccessor: true, type: Number, attribute: "min-zoom", useDefault: true }) get minZoom() {
    return this.minimum;
  }
  set minZoom(value: number) {
    positive(value);
    const old = this.minimum;
    this.minimum = value;
    this.requestUpdate("minZoom", old);
  }
  @atomState() private maximum = 2;
  /** @default 2 */
  @property({ noAccessor: true, type: Number, attribute: "max-zoom", useDefault: true }) get maxZoom() {
    return this.maximum;
  }
  set maxZoom(value: number) {
    positive(value);
    const old = this.maximum;
    this.maximum = value;
    this.requestUpdate("maxZoom", old);
  }
  @atomState() @property({ noAccessor: true, converter: boolish, attribute: "fit-on-load", useDefault: true }) fitOnLoad = true;
  @atomState() private scene?: FlowScene;
  @atomState() private failure = "";
  @atomState() private busy = false;
  @atomState() private authored: readonly FlowNodePart[] = [];
  private readonly drawing = createAtom(() => {
    const scene = this.scene,
      boxes = scene ? [...scene.nodes.values()] : [];
    return scene?.edges.map((edge) => ({ ...edge, paths: edge.sections.map((points) => ({ path: roundedFlowPath(points, 8, boxes), arrow: flowArrow(points, 6) })) })) ?? [];
  });
  private readonly relationships = createAtom(() => {
    const outgoing = new Map<string, FlowEdge[]>();
    for (const edge of this.edges) {
      const list = outgoing.get(edge.source) ?? [];
      list.push(edge);
      outgoing.set(edge.source, list);
    }
    return outgoing;
  });
  private readonly engine = new FlowLayout();
  private readonly messages = new StoreSelector(this, () => messageCatalogs);
  private readonly configuration = new StoreSelector(this, () => flowDiagramConfiguration);
  private readonly motionX = new SpringValue(
    this,
    () => this.viewport.x,
    () => readMotionSpring(this, "standard", "spatial", "fast"),
  );
  private readonly motionY = new SpringValue(
    this,
    () => this.viewport.y,
    () => readMotionSpring(this, "standard", "spatial", "fast"),
  );
  private readonly motionZoom = new SpringValue(
    this,
    () => this.viewport.zoom,
    () => readMotionSpring(this, "standard", "spatial", "fast"),
  );
  private frame?: number;
  private focusFrame?: number;
  private version = 0;
  private signature = "";
  private fitted = false;
  private resize?: ResizeObserver;
  private watch?: MutationObserver;
  private observed = new Set<Element>();
  private pointers = new Map<number, FlowPoint>();
  private get canvas() {
    return this.renderRoot?.querySelector<HTMLElement>("[part=viewport]");
  }
  private get background() {
    return this.renderRoot?.querySelector<HTMLElement>("[part=background]");
  }
  private text(key: string, fallback: string) {
    return message(this.themeContext.scope.effective.get().locale, "flow." + key, fallback);
  }
  private limits() {
    if (this.minZoom > this.maxZoom) {
      throw new RangeError("Flow minZoom must not exceed maxZoom");
    }
    return { min: this.minZoom, max: this.maxZoom };
  }
  private center() {
    return { x: (this.canvas?.clientWidth ?? 0) / 2, y: (this.canvas?.clientHeight ?? 0) / 2 };
  }
  private setViewport(value: FlowViewport, animate = true) {
    if (value.x === this.viewport.x && value.y === this.viewport.y && value.zoom === this.zoom) {
      return;
    }
    this.viewport = Object.freeze(value);
    if (!animate) {
      this.motionX.jump();
      this.motionY.jump();
      this.motionZoom.jump();
    }
  }
  /** Fits the current complete graph within the canvas. */
  fit() {
    if (!this.scene || !this.canvas) {
      return;
    }
    const { min, max } = this.limits();
    this.setViewport(fitFlowViewport({ width: this.canvas.clientWidth, height: this.canvas.clientHeight }, this.scene, min, max, 20));
  }
  /** Zooms around the canvas centre, within the configured limits. */
  zoomTo(scale: number) {
    positive(scale);
    const { min, max } = this.limits();
    this.setViewport(zoomFlowViewport(this.viewport, Math.max(min, Math.min(max, scale)), this.center()));
  }
  /** Sets the translated viewport position in canvas pixels. */
  panTo(point: FlowPoint) {
    if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y)) {
      throw new RangeError("Flow pan coordinates must be finite");
    }
    this.setViewport({ ...this.viewport, x: point.x, y: point.y });
  }
  private emitChange = () => this.dispatchEvent(new CustomEvent("acme-change", { detail: Object.freeze({ viewport: this.viewport }), bubbles: true, composed: true }));
  private userFit = () => {
    this.fit();
    this.emitChange();
  };
  private userZoom = (scale: number) => {
    this.zoomTo(scale);
    this.emitChange();
  };
  private activate = (id: string) => {
    if (this.nodes.some((node) => node.id === id)) {
      this.dispatchEvent(new CustomEvent("acme-request", { detail: Object.freeze({ action: "node", id }), bubbles: true, composed: true, cancelable: true }));
    }
  };
  private scan = () => {
    const slot = this.renderRoot?.querySelector<HTMLSlotElement>("slot");
    const next = (slot?.assignedElements({ flatten: true }) ?? []).flatMap((element) => {
      const part = flowNodePartFor(element);
      return part ? [part] : [];
    });
    if (next.length !== this.authored.length || next.some((part, index) => part !== this.authored[index])) {
      for (const part of this.authored) {
        if (!next.includes(part)) {
          part.update(undefined, undefined, undefined);
        }
      }
      this.authored = next;
    }
    this.applyNodes();
    this.schedule();
  };
  private applyNodes() {
    const definitions = new Map(this.nodes.map((node) => [node.id, node]));
    for (const part of this.authored) {
      part.update(definitions.get(part.id()), this.scene?.nodes.get(part.id()), this.activate);
    }
  }
  private schedule = () => {
    if (!this.isConnected || this.frame !== undefined) {
      return;
    }
    this.frame = this.ownerDocument.defaultView!.requestAnimationFrame(() => {
      this.frame = undefined;
      void this.runLayout(false).catch(() => {
        /* Layout code owns failure reporting and cancellation. */
      });
    });
  };
  private targets() {
    return [
      ...this.authored.map((part) => part.host),
      ...this.renderRoot.querySelectorAll<HTMLElement>("[data-flow-fallback]"),
      ...this.renderRoot.querySelectorAll<HTMLElement>("[data-flow-measure]"),
    ];
  }
  private measure() {
    const sizes = new Map<string, FlowSize>(),
      labels = new Map<string, FlowSize>();
    for (const part of this.authored) {
      const id = part.id();

      sizes.set(id, { width: part.host.offsetWidth, height: part.host.offsetHeight });
    }
    for (const element of this.renderRoot.querySelectorAll<HTMLElement>("[data-flow-fallback]")) {
      sizes.set(element.dataset.flowFallback!, { width: element.offsetWidth, height: element.offsetHeight });
    }
    for (const element of this.renderRoot.querySelectorAll<HTMLElement>("[data-flow-measure]")) {
      labels.set(element.dataset.flowMeasure!, { width: element.offsetWidth, height: element.offsetHeight });
    }
    return { sizes, labels };
  }
  /** Recomputes measured positions and routes; obsolete requests reject with AbortError. */
  async layout(): Promise<void> {
    await this.updateComplete;
    return this.runLayout(true);
  }
  private async runLayout(force: boolean) {
    if (!this.isConnected) {
      throw new DOMException("Flow Diagram is disconnected", "AbortError");
    }
    this.applyNodes();
    await Promise.all(this.authored.map((part) => (part.host as AcmeElement).updateComplete));
    if (!this.isConnected) {
      throw new DOMException("Flow Diagram is disconnected", "AbortError");
    }
    let version = this.version;
    let started = false;
    try {
      const { sizes, labels } = this.measure(),
        nodes = this.nodes,
        edges = this.edges,
        css = this.ownerDocument.defaultView!.getComputedStyle(this);
      const space = (name: string, fallback: number) => {
        const value = Number.parseFloat(css.getPropertyValue(name));
        return Number.isFinite(value) && value >= 0 ? value : fallback;
      };
      const spacing = { node: space("--acme-flow-node-gap", 40), layer: space("--acme-flow-layer-gap", 60), edge: space("--acme-flow-edge-gap", 14), padding: 20 },
        workerUrl = flowDiagramConfiguration.get().workerUrl;
      const signature = JSON.stringify([nodes, edges, [...sizes], [...labels], this.direction, css.direction, spacing, workerUrl, this.authored.map((part) => part.id()), this.minZoom, this.maxZoom]);
      if (!force && signature === this.signature) {
        return;
      }
      this.signature = signature;
      version = ++this.version;
      started = true;
      this.engine.cancel();
      this.busy = true;
      this.failure = "";
      const limits = this.limits();
      if (this.zoom < limits.min || this.zoom > limits.max) {
        this.zoomTo(this.zoom);
      }
      validateFlowGraph(nodes, edges);
      const customIds = this.authored.map((part) => part.id());
      if (new Set(customIds).size !== customIds.length) {
        throw new TypeError("Flow Node IDs must be unique");
      }
      const declaredIds = new Set(nodes.map((node) => node.id));
      if (customIds.some((id) => !declaredIds.has(id))) {
        throw new TypeError("Flow Node must reference a declared node");
      }
      if (!nodes.length) {
        this.engine.dispose();
        this.scene = undefined;
        this.fitted = false;
        return;
      }
      const graph = createFlowGraph(nodes, edges, sizes, labels, this.direction, css.direction === "rtl", spacing);
      const result = await this.engine.layout(graph, this.ownerDocument, workerUrl);
      if (version !== this.version || !this.isConnected) {
        throw new DOMException("Flow layout superseded", "AbortError");
      }
      this.scene = flowScene(result, nodes, edges);
      this.applyNodes();
      if (!this.fitted && this.fitOnLoad) {
        this.fit();
        this.motionX.jump();
        this.motionY.jump();
        this.motionZoom.jump();
      }
      this.fitted = true;
    } catch (error) {
      if (version === this.version && !(error instanceof DOMException && error.name === "AbortError")) {
        this.engine.dispose();
        this.scene = undefined;
        this.applyNodes();
        this.failure = error instanceof Error ? error.message : String(error);
        this.dispatchEvent(new CustomEvent("acme-error", { detail: Object.freeze({ code: "layout", message: this.failure }), bubbles: true, composed: true }));
      }
      throw error;
    } finally {
      if (started && version === this.version) {
        this.busy = false;
      }
    }
  }
  private point(event: PointerEvent | WheelEvent) {
    const box = this.canvas!.getBoundingClientRect();
    return { x: event.clientX - box.left, y: event.clientY - box.top };
  }
  private revealFocus = (event: FocusEvent) => {
    const target = event.composedPath()[0];
    if (!(target instanceof this.ownerDocument.defaultView!.HTMLElement) || target === this.background) {
      return;
    }
    if (this.focusFrame !== undefined) {
      this.ownerDocument.defaultView!.cancelAnimationFrame(this.focusFrame);
    }
    this.focusFrame = this.ownerDocument.defaultView!.requestAnimationFrame(() => {
      this.focusFrame = undefined;
      if (!this.isConnected || !this.canvas || !target.isConnected) {
        return;
      }
      this.canvas.scrollLeft = 0;
      this.canvas.scrollTop = 0;
      const outer = this.canvas.getBoundingClientRect(),
        inner = target.getBoundingClientRect();
      const x = inner.left < outer.left + 12 ? outer.left + 12 - inner.left : inner.right > outer.right - 12 ? outer.right - 12 - inner.right : 0;
      const y = inner.top < outer.top + 12 ? outer.top + 12 - inner.top : inner.bottom > outer.bottom - 12 ? outer.bottom - 12 - inner.bottom : 0;
      if (x || y) {
        this.setViewport({ x: this.motionX.value + x, y: this.motionY.value + y, zoom: this.motionZoom.value }, false);
      }
    });
  };
  private pointerDown = (event: PointerEvent) => {
    if (event.button !== 0 || event.target !== this.background || this.pointers.size >= 2) {
      return;
    }
    event.preventDefault();
    this.background!.setPointerCapture(event.pointerId);
    this.pointers.set(event.pointerId, this.point(event));
    this.motionX.jump();
    this.motionY.jump();
    this.motionZoom.jump();
  };
  private pointerMove = (event: PointerEvent) => {
    const old = this.pointers.get(event.pointerId);
    if (!old) {
      return;
    }
    const point = this.point(event);
    if (this.pointers.size === 1) {
      this.setViewport({ ...this.viewport, x: this.viewport.x + point.x - old.x, y: this.viewport.y + point.y - old.y }, false);
    } else {
      const other = [...this.pointers].find(([id]) => id !== event.pointerId)![1];
      const from = Math.hypot(old.x - other.x, old.y - other.y),
        to = Math.hypot(point.x - other.x, point.y - other.y);
      if (from > 0) {
        const { min, max } = this.limits(),
          before = { x: (old.x + other.x) / 2, y: (old.y + other.y) / 2 },
          after = { x: (point.x + other.x) / 2, y: (point.y + other.y) / 2 };
        const next = zoomFlowViewport(this.viewport, Math.max(min, Math.min(max, (this.zoom * to) / from)), before);
        this.setViewport({ ...next, x: next.x + after.x - before.x, y: next.y + after.y - before.y }, false);
      }
    }
    this.pointers.set(event.pointerId, point);
    this.emitChange();
  };
  private pointerEnd = (event: PointerEvent) => {
    this.pointers.delete(event.pointerId);
  };
  private wheel = (event: WheelEvent) => {
    if (!(event.ctrlKey || event.metaKey) || event.target !== this.background) {
      return;
    }
    event.preventDefault();
    const { min, max } = this.limits();
    this.setViewport(zoomFlowViewport(this.viewport, Math.max(min, Math.min(max, this.zoom * Math.exp(-event.deltaY * 0.005))), this.point(event)), false);
    this.emitChange();
  };
  private key = (event: KeyboardEvent) => {
    if (event.target !== this.background || event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }
    switch (event.key) {
      case "ArrowLeft":
        this.panTo({ x: this.viewport.x + 40, y: this.viewport.y });
        break;
      case "ArrowRight":
        this.panTo({ x: this.viewport.x - 40, y: this.viewport.y });
        break;
      case "ArrowUp":
        this.panTo({ x: this.viewport.x, y: this.viewport.y + 40 });
        break;
      case "ArrowDown":
        this.panTo({ x: this.viewport.x, y: this.viewport.y - 40 });
        break;
      case "+":
      case "=":
        this.zoomTo(this.zoom * 1.2);
        break;
      case "-":
        this.zoomTo(this.zoom / 1.2);
        break;
      case "Home":
        this.fit();
        break;
      default:
        return;
    }
    event.preventDefault();
    this.emitChange();
  };
  protected willUpdate() {
    this.motionX.update();
    this.motionY.update();
    this.motionZoom.update();
  }
  protected updated() {
    this.applyNodes();
    const targets = new Set<Element>([...(this.canvas ? [this.canvas] : []), ...this.targets()]);
    for (const old of this.observed) {
      if (!targets.has(old)) {
        this.resize?.unobserve(old);
      }
    }
    for (const target of targets) {
      if (!this.observed.has(target)) {
        this.resize?.observe(target);
      }
    }
    this.observed = targets;
    this.schedule();
  }
  connectedCallback() {
    super.connectedCallback();
    const view = this.ownerDocument.defaultView!;
    this.resize = new view.ResizeObserver(this.schedule);
    this.watch = new view.MutationObserver(this.scan);
    this.watch.observe(this, { subtree: true, childList: true, attributes: true, attributeFilter: ["node-id", "slot"], characterData: true });
    this.addEventListener("slotchange", this.scan);
    this.ownerDocument.fonts?.addEventListener("loadingdone", this.schedule);
    this.requestUpdate();
  }
  disconnectedCallback() {
    ++this.version;
    this.engine.dispose();
    if (this.frame !== undefined) {
      this.ownerDocument.defaultView!.cancelAnimationFrame(this.frame);
    }
    this.frame = undefined;
    if (this.focusFrame !== undefined) {
      this.ownerDocument.defaultView!.cancelAnimationFrame(this.focusFrame);
    }
    this.focusFrame = undefined;
    this.resize?.disconnect();
    this.observed.clear();
    this.watch?.disconnect();
    this.removeEventListener("slotchange", this.scan);
    this.ownerDocument.fonts?.removeEventListener("loadingdone", this.schedule);
    this.pointers.clear();
    this.signature = "";
    super.disconnectedCallback();
  }
  render() {
    const custom = new Set(this.authored.map((part) => part.id())),
      lookup = new Map(this.nodes.map((node) => [node.id, node.label]));
    return html`<div part="root"><div part="controls"><acme-button size="small" variant="secondary" ?disabled=${!this.scene} @click=${this.userFit}>${this.text("fit", "Fit")}</acme-button><acme-button size="small" variant="secondary" ?disabled=${this.zoom <= this.minZoom} @click=${() => this.userZoom(this.zoom / 1.2)}>${this.text("zoomOut", "Zoom out")}</acme-button><acme-button size="small" variant="secondary" ?disabled=${this.zoom >= this.maxZoom} @click=${() => this.userZoom(this.zoom * 1.2)}>${this.text("zoomIn", "Zoom in")}</acme-button><span>${new Intl.NumberFormat(this.themeContext.scope.effective.get().locale, { style: "percent", maximumFractionDigits: 0 }).format(this.zoom)}</span></div><div part="viewport" aria-busy=${String(this.busy)} @focusin=${this.revealFocus}><div part="background" tabindex="0" role="group" aria-label=${this.text("canvas", "Diagram canvas. Drag to pan. Use arrow keys to pan, plus or minus to zoom, and Home to fit.")} @pointerdown=${this.pointerDown} @pointermove=${this.pointerMove} @pointerup=${this.pointerEnd} @pointercancel=${this.pointerEnd} @lostpointercapture=${this.pointerEnd} @wheel=${this.wheel} @keydown=${this.key}></div><div class="scene" style=${styleMap({ transform: `translate(${this.motionX.value}px,${this.motionY.value}px) scale(${Math.max(0.0001, this.motionZoom.value)})` })}><svg width=${this.scene?.width ?? 0} height=${this.scene?.height ?? 0} aria-hidden="true">${this.drawing.get().map((edge) => edge.paths.map((route, index) => svg`<path part="edge" data-edge=${edge.id} d=${route.path}></path>${index === edge.paths.length - 1 ? svg`<path class="arrow" data-arrow=${edge.id} d=${route.arrow}></path>` : nothing}`))}</svg>${this.scene?.edges.flatMap((edge) => edge.labels.map((label) => html`<span part="edge-label" aria-hidden="true" style=${styleMap({ left: label.x + "px", top: label.y + "px" })}>${label.text}</span>`))}<slot @slotchange=${this.scan}></slot>${repeat(
      this.nodes.filter((node) => !custom.has(node.id)),
      (node) => node.id,
      (node) => {
        const box = this.scene?.nodes.get(node.id);
        return html`<article part="node" class="fallback" data-flow-fallback=${node.id} style=${styleMap({
          left: (box?.x ?? 0) + "px",
          top: (box?.y ?? 0) + "px",
          width: node.width ? node.width + "px" : undefined,
          minWidth: node.width ? node.width + "px" : undefined,
          maxWidth: node.width ? node.width + "px" : undefined,
          height: node.height ? node.height + "px" : undefined,
          visibility: box ? "visible" : "hidden",
        })}><button type="button" @click=${() => this.activate(node.id)}>${node.label}</button></article>`;
      },
    )}</div>${!this.nodes.length ? html`<div class="empty">${this.text("empty", "No nodes")}</div>` : nothing}${this.edges.filter((edge) => edge.label).map((edge) => html`<span part="edge-label" class="measure" data-flow-measure=${edge.id} aria-hidden="true">${edge.label}</span>`)}</div><div class="status" role="status">${
      this.failure
        ? html`${this.text("error", "Could not lay out this diagram.")} <acme-button size="small" variant="secondary" @click=${() =>
            void this.layout().catch(() => {
              /* Layout code owns failure reporting and cancellation. */
            })}>${this.text("retry", "Retry")}</acme-button>`
        : this.busy
          ? this.text("loading", "Arranging diagram…")
          : nothing
    }</div><acme-collapsible><acme-collapsible-trigger>${this.text("relationships", "View relationships")}</acme-collapsible-trigger><acme-collapsible-content><ul>${this.nodes.map(
      (node) =>
        html`<li>${node.label}${
          this.relationships.get().has(node.id)
            ? html`<ul>${this.relationships
                .get()
                .get(node.id)!
                .map((edge) => html`<li>${edge.label ? edge.label + ": " : ""}${lookup.get(edge.target) ?? edge.target}</li>`)}</ul>`
            : nothing
        }</li>`,
    )}</ul></acme-collapsible-content></acme-collapsible></div>`;
  }
}
function positive(value: number) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new RangeError("Flow zoom must be positive and finite");
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-flow-diagram": AcmeFlowDiagram;
  }
}
