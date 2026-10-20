import { isFocusable, type FocusableElement } from "tabbable";
import { deepActiveElement } from "./composed-tree";

/** Focuses a visible control without guessing its disabled or display state. */
export function focusAvailable(target: FocusableElement | undefined): boolean {
  if (!target || !isFocusable(target, { getShadowRoot: true })) {
    return false;
  }
  target.focus({ preventScroll: true });
  return deepActiveElement(target.ownerDocument) === target;
}

const recoveries = new WeakMap<HTMLElement, () => void>();
/** Provides a temporary, named focus destination when a section loses its controls. */
export function focusSection(section: HTMLElement, labels: Element[] = []): () => void {
  recoveries.get(section)?.();
  const tabindex = section.getAttribute("tabindex");
  const role = section.getAttribute("role");
  const previousLabels = section.ariaLabelledByElements;
  const addLabels = !section.hasAttribute("aria-label") && previousLabels === null && labels.length > 0;
  section.tabIndex = -1;
  if (role === null) {
    section.setAttribute("role", "group");
  }
  if (addLabels) {
    section.ariaLabelledByElements = labels;
  }
  const cleanup = () => {
    section.removeEventListener("blur", cleanup);
    if (section.getAttribute("tabindex") === "-1") {
      if (tabindex === null) {
        section.removeAttribute("tabindex");
      } else {
        section.setAttribute("tabindex", tabindex);
      }
    }
    if (role === null && section.getAttribute("role") === "group") {
      section.removeAttribute("role");
    }
    if (addLabels && section.ariaLabelledByElements?.every((label, i) => label === labels[i])) {
      section.ariaLabelledByElements = previousLabels;
    }
    recoveries.delete(section);
  };
  recoveries.set(section, cleanup);
  section.addEventListener("blur", cleanup, { once: true });
  section.focus({ preventScroll: true });
  if (deepActiveElement(section.ownerDocument) !== section) {
    cleanup();
  }
  return cleanup;
}
