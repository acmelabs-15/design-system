/** Happy DOM lacks ElementInternals. This test-only boundary permits DOM unit tests;
 * real association, submission, labels, validity and focus require the native browser fixtures.
 */
export function installTestInternals(): void {
  if (HTMLElement.prototype.attachInternals) {
    return;
  }
  const attached = new WeakSet<HTMLElement>();
  Object.defineProperty(HTMLElement.prototype, "attachInternals", {
    configurable: true,
    writable: true,
    value: function (this: HTMLElement) {
      if (attached.has(this)) {
        throw new DOMException("Internals already attached", "NotSupportedError");
      }
      attached.add(this);
      const host = this;
      let flags: ValidityStateFlags = {},
        message = "";
      return {
        setFormValue(_value: unknown, _state?: unknown) {},
        setValidity(next: ValidityStateFlags, nextMessage = "") {
          flags = { ...next };
          message = nextMessage;
        },
        get validity() {
          return { ...flags, valid: !Object.values(flags).some(Boolean) };
        },
        get validationMessage() {
          return message;
        },
        get willValidate() {
          return !host.hasAttribute("disabled") && !host.hasAttribute("readonly");
        },
        get form() {
          const id = host.getAttribute("form");
          return id ? host.ownerDocument.getElementById(id) : host.closest("form");
        },
        get labels() {
          return [...host.ownerDocument.querySelectorAll("label")].filter((label) => (label.htmlFor ? label.htmlFor === host.id : label.contains(host)));
        },
        checkValidity() {
          return !Object.values(flags).some(Boolean);
        },
        reportValidity() {
          return !Object.values(flags).some(Boolean);
        },
      };
    },
  });
}
