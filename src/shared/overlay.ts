/** Reads the motion preference in the surface's document. */
export const reduced = (document?: Document): boolean => {
  const view = document?.defaultView ?? globalThis.window;
  return typeof view?.matchMedia === "function" && view.matchMedia("(prefers-reduced-motion: reduce)").matches;
};
