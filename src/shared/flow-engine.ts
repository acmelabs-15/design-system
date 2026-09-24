import ELK from "elkjs/lib/elk-api.js";
import type { ElkNode } from "elkjs/lib/elk-api.js";
export interface FlowEngine {
  layout(graph: ElkNode): Promise<ElkNode>;
  dispose(): void;
}
/** Creates only a real browser worker; the layout kernel never runs on the UI thread. */
export async function createFlowEngine(document: Document, workerUrl: string | undefined, signal: AbortSignal, failed: (error: Error) => void): Promise<FlowEngine> {
  const view = document.defaultView;
  if (!view) throw new Error("Flow Diagram requires a live document");
  const source = workerUrl ? new URL(workerUrl, document.baseURI) : new URL("./elk-worker.js", import.meta.url);
  let objectUrl: string | undefined, worker: Worker | undefined;
  try {
    if (source.origin !== new URL(document.baseURI).origin) {
      const response = await view.fetch(source, { signal, credentials: "omit" });
      if (!response.ok) throw new Error(`Layout worker asset returned ${response.status}`);
      const content = await response.text();
      signal.throwIfAborted();
      objectUrl = view.URL.createObjectURL(new view.Blob([content], { type: "text/javascript" }));
    }
    signal.throwIfAborted();
    worker = new view.Worker(objectUrl ?? source.href, { name: "acme-flow-layout" });
    const failure = (event: Event) => {
      event.preventDefault();
      failed(new Error("Flow layout worker failed"));
    };
    worker.addEventListener("error", failure);
    worker.addEventListener("messageerror", failure);
    const instance = new ELK({ algorithms: ["layered"], workerFactory: () => worker! });
    let disposed = false;
    return {
      layout: (graph) => instance.layout(graph),
      dispose() {
        if (disposed) return;
        disposed = true;
        worker!.removeEventListener("error", failure);
        worker!.removeEventListener("messageerror", failure);
        instance.terminateWorker();
        if (objectUrl) view.URL.revokeObjectURL(objectUrl);
      },
    };
  } catch (error) {
    worker?.terminate();
    if (objectUrl) view.URL.revokeObjectURL(objectUrl);
    throw error;
  }
}
