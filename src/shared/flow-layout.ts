import type { ElkNode } from "elkjs/lib/elk-api.js";
import type { FlowEngine } from "./flow-engine";
function abortable<T>(work: Promise<T>, signal: AbortSignal): Promise<T> {
  if (signal.aborted) return Promise.reject(signal.reason);
  return new Promise((resolve, reject) => {
    const abort = () => reject(signal.reason);
    signal.addEventListener("abort", abort, { once: true });
    work.then(
      (value) => {
        signal.removeEventListener("abort", abort);
        resolve(value);
      },
      (error) => {
        signal.removeEventListener("abort", abort);
        reject(error);
      },
    );
  });
}
/** Rejects obsolete requests and owns the lifetime of a separately loaded engine. */
export class FlowLayout {
  private engine?: FlowEngine;
  private document?: Document;
  private url?: string;
  private pending?: AbortController;
  async layout(graph: ElkNode, document: Document, workerUrl?: string): Promise<ElkNode> {
    this.cancel();
    const abort = new AbortController();
    this.pending = abort;
    const operation = (async () => {
      const { createFlowEngine } = await import("./flow-engine");
      abort.signal.throwIfAborted();
      if (this.engine && (this.document !== document || this.url !== workerUrl)) {
        this.engine.dispose();
        this.engine = undefined;
      }
      if (!this.engine) {
        const engine = await createFlowEngine(document, workerUrl, abort.signal, (error) => {
          this.pending?.abort(error);
          this.engine?.dispose();
          this.engine = undefined;
        });
        if (abort.signal.aborted) {
          engine.dispose();
          throw abort.signal.reason;
        }
        this.engine = engine;
        this.document = document;
        this.url = workerUrl;
      }
      return this.engine.layout(graph);
    })();
    try {
      return await abortable(operation, abort.signal);
    } finally {
      if (this.pending === abort) this.pending = undefined;
    }
  }
  cancel() {
    if (!this.pending) return;
    this.pending.abort(new DOMException("Flow layout superseded", "AbortError"));
    this.pending = undefined;
    this.engine?.dispose();
    this.engine = undefined;
  }
  dispose() {
    this.cancel();
    this.engine?.dispose();
    this.engine = undefined;
    this.document = undefined;
    this.url = undefined;
  }
}
