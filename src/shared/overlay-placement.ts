import { autoUpdate, computePosition, type ComputePositionConfig, type ComputePositionReturn, type ReferenceElement } from "@floating-ui/dom";
import type { ReactiveController, ReactiveControllerHost } from "lit";

export type OverlayPlacementOptions = {
  configuration(): Partial<ComputePositionConfig>;
  apply(result: ComputePositionReturn): void;
  error(error: unknown): void;
};

/** Owns geometry observation and rejects results from obsolete requests or surfaces. */
export class OverlayPlacement implements ReactiveController {
  private cleanup?: () => void;
  private epoch = 0;
  private request = 0;
  private reference?: ReferenceElement;
  private floating?: HTMLElement;
  private frame?: { view: Window; id: number };
  constructor(
    host: ReactiveControllerHost,
    private options: OverlayPlacementOptions,
  ) {
    host.addController(this);
  }
  start(reference: ReferenceElement, floating: HTMLElement): void {
    this.stop();
    const context = "contextElement" in reference ? reference.contextElement : "isConnected" in reference ? reference : undefined;
    if (!floating.isConnected || (context && !context.isConnected)) throw new Error("Placement requires connected reference and floating elements");
    this.reference = reference;
    this.floating = floating;
    try {
      this.cleanup = autoUpdate(reference, floating, this.refresh);
    } catch (error) {
      this.stop();
      throw error;
    }
  }
  refresh = (): void => {
    if (this.frame) return;
    const view = this.floating?.ownerDocument.defaultView;
    if (!view) return;
    this.request++;
    this.frame = {
      view,
      id: view.requestAnimationFrame(() => {
        this.frame = undefined;
        this.measure();
      }),
    };
  };
  private measure(): void {
    const reference = this.reference,
      floating = this.floating;
    if (!reference || !floating) return;
    const context = "contextElement" in reference ? reference.contextElement : "isConnected" in reference ? reference : undefined;
    if (!floating.isConnected || (context && !context.isConnected)) {
      this.stop();
      return;
    }
    const epoch = this.epoch,
      request = ++this.request,
      document = floating.ownerDocument;
    void computePosition(reference, floating, this.options.configuration())
      .then((result) => {
        if (this.epoch === epoch && this.request === request && floating.isConnected && floating.ownerDocument === document) this.options.apply(result);
      })
      .catch((error) => {
        if (this.epoch === epoch && this.request === request) this.options.error(error);
      });
  }
  stop(): void {
    if (this.frame) this.frame.view.cancelAnimationFrame(this.frame.id);
    this.frame = undefined;
    this.epoch++;
    this.cleanup?.();
    this.cleanup = undefined;
    this.reference = undefined;
    this.floating = undefined;
  }
  hostDisconnected(): void {
    this.stop();
  }
}
