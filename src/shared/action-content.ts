import { html, nothing, type TemplateResult } from "lit";
import type { ButtonSize } from "./action-element";

type Content = Readonly<{
  loading: boolean;
  size: ButtonSize;
  start: boolean;
  end: boolean;
  label?: TemplateResult;
  leading?: TemplateResult;
  trailing?: TemplateResult;
  replaceStart?: boolean;
  exposeParts?: boolean;
}>;
/** Common labelled action slots. The family supplies any built-in artwork. */
export function actionContent(options: Content): TemplateResult {
  const part = (name: string) => (options.exposeParts === false ? nothing : name);
  const start = html`<slot name="start" ?hidden=${options.loading || options.replaceStart}></slot>`,
    end = html`<slot name="end"></slot>`;
  const leading = options.loading
    ? html`<acme-spinner exportparts=${options.exposeParts === false ? nothing : "root:spinner"} size=${options.size === "large" ? "large" : options.size === "medium" ? "medium" : "small"}></acme-spinner>`
    : options.start && !options.replaceStart
      ? nothing
      : options.leading;
  return html`${options.loading || options.start || leading ? html`<span class="start" part=${part("start")}>${leading}${start}</span>` : start}<span class="label" part=${part("label")}>${options.label ?? html`<slot></slot>`}</span>${options.end || options.trailing ? html`<span class="end" part=${part("end")}>${end}${options.end ? nothing : options.trailing}</span>` : end}`;
}
