type Cleanup = () => void;
/** Owns one authored example mount and the resources returned by its setup function. */
export class ExampleController {
  private cleanup?: Cleanup;
  private preview: HTMLElement;
  private disposed = false;
  private readonly resetButton: HTMLElement | null;
  constructor(
    private host: HTMLElement,
    private helpers: Readonly<Record<string, unknown>>,
  ) {
    this.preview = host.querySelector<HTMLElement>(".preview")!;
    if (!this.preview) {
      throw new Error("Example preview is missing");
    }
    this.resetButton = host.querySelector("[data-example-reset]");
    this.resetButton?.addEventListener("click", this.reset);
    this.mount();
  }
  private fail(error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const output = this.host.querySelector<HTMLElement>("[data-example-error]");
    if (output) {
      output.textContent = message;
      output.hidden = false;
    }
    this.host.dispatchEvent(new CustomEvent("acme-error", { bubbles: true, composed: true, detail: Object.freeze({ code: "example", message }) }));
  }
  private mount() {
    const output = this.host.querySelector<HTMLElement>("[data-example-error]");
    if (output) {
      output.textContent = "";
      output.hidden = true;
    }
    if (!this.host.dataset.script) {
      return;
    }
    try {
      const result = new Function("root", ...Object.keys(this.helpers), this.host.dataset.script ?? "")(this.preview, ...Object.values(this.helpers));
      if (result !== undefined && typeof result !== "function") {
        throw new TypeError("Example setup must return a cleanup function or undefined");
      }
      this.cleanup = result;
    } catch (error) {
      this.fail(error);
    }
  }
  private stop(): boolean {
    const cleanup = this.cleanup;
    this.cleanup = undefined;
    try {
      cleanup?.();
      return true;
    } catch (error) {
      this.fail(error);
      return false;
    }
  }
  readonly reset = () => {
    if (this.disposed) {
      return;
    }
    const stopped = this.stop();
    const template = this.host.querySelector<HTMLTemplateElement>("template[data-example-markup]");
    const preview = this.preview.ownerDocument.createElement("div");
    preview.className = "preview";
    if (template) {
      preview.append(template.content.cloneNode(true));
    }
    this.preview.replaceWith(preview);
    this.preview = preview;
    if (stopped) {
      this.mount();
    }
  };
  dispose() {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    this.resetButton?.removeEventListener("click", this.reset);
    this.stop();
  }
}
