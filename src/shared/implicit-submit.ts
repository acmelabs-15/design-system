const textControls = new WeakSet<Element>();
const blockingTypes = new Set(["text", "search", "url", "tel", "email", "password", "date", "month", "week", "time", "datetime-local", "number"]);
/** Registers a form-associated single-line control for implicit submission counting. */
export function registerTextControl(control: Element): void {
  textControls.add(control);
}
/** Applies the native default-submitter rule after the inner input's default action. */
export function submitImplicitly(form: HTMLFormElement): void {
  const root = form.getRootNode() as Document | ShadowRoot;
  const submitter = Array.from(root.querySelectorAll<HTMLInputElement | HTMLButtonElement>("button,input")).find(
    (element) => element.form === form && (element.type === "submit" || element.type === "image"),
  );
  if (submitter) {
    if (!submitter.matches(":disabled")) submitter.click();
    return;
  }
  const fields = Array.from(form.elements).filter((element) => textControls.has(element) || (element.localName === "input" && blockingTypes.has((element as HTMLInputElement).type)));
  if (fields.length <= 1) form.ownerDocument.defaultView!.HTMLFormElement.prototype.requestSubmit.call(form);
}
