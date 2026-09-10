// Application state on TanStack Store, which is signal-based underneath: the theme and the toast
// queue live here, and elements read them with `TanStackStoreSelector` (re-exported as
// `StoreSelector`), re-rendering only when their selection changes.
//
// An element's OWN state is also a TanStack Store, created per instance, the way TanStack Form
// creates one per form and per field. It lives in the element rather than here, because it is not
// shared. See notes/decisions/state-on-tanstack-store.md for the pattern and its traps.
import { createStore, TanStackStoreSelector } from "@tanstack/lit-store";
import type { TemplateResult } from "lit";

export { batch, createStore } from "@tanstack/lit-store";
export const StoreSelector = TanStackStoreSelector;

export type Theme = "auto" | "light" | "dark";
const THEME_KEY = "theme-pref";
const isTheme = (v: unknown): v is Theme => v === "auto" || v === "light" || v === "dark";
/** The theme remembered from an earlier visit, else the one the page set on its root, else auto. */
const initialTheme = (): Theme => {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (isTheme(saved)) return saved;
  } catch {}
  const set = typeof document !== "undefined" ? document.documentElement.dataset.theme : undefined;
  return isTheme(set) ? set : "auto";
};
/**
 * "auto" follows prefers-color-scheme; "light" and "dark" set data-theme on the root element.
 * Every change lands on the root as `data-theme` (none for auto) and is remembered for the next visit.
 */
export const themeStore = createStore<Theme>(initialTheme());
const paintTheme = (v: Theme) => {
  const root = document.documentElement;
  if (v === "auto") delete root.dataset.theme;
  else root.dataset.theme = v;
  try {
    localStorage.setItem(THEME_KEY, v);
  } catch {}
};
if (typeof document !== "undefined") {
  if (themeStore.state !== "auto") paintTheme(themeStore.state);
  themeStore.subscribe(() => paintTheme(themeStore.state));
}

/** A toast's tone: the plain surface, or the filled success (blue), error (red) and warning (amber) boxes. */
export type ToastType = "" | "success" | "error" | "warning";
/** What a toast shows: a string, a DOM node, or a Lit template. */
export type ToastText = string | Node | TemplateResult;
/** A block above the message, 128px tall unless `height` sizes it. */
export type ToastVisual = ToastText | { height: number; content: ToastText };
export type ToastOptions = {
  text: ToastText;
  /** One toast per key: a second message with a key already shown is dropped. */
  key?: string;
  type?: ToastType;
  /** The label of the action button; the row of cancel and action replaces the dismiss control. */
  action?: string;
  onAction?: () => void;
  /** Renders the action as a link. */
  actionHref?: string;
  /** The label of the cancel button (Dismiss). */
  cancelAction?: string;
  onCancelAction?: () => void;
  /** Adds an undo control before the dismiss control. */
  onUndoAction?: () => void;
  /** The toast stays until dismissed; `false` with an action restores the timer. */
  preserve?: boolean;
  /** Milliseconds before the toast hides itself (3500). */
  timeout?: number;
  /** Focuses the cancel button (or the action) once shown. */
  autoFocus?: boolean;
  /** Drops the dismiss control; the text spans the row. */
  hideX?: boolean;
  /** The text spans the row. */
  fullWidth?: boolean;
  /** Drops the padding. */
  fullBleed?: boolean;
  /** Clips the content to the box. */
  overflowHidden?: boolean;
  visual?: ToastVisual;
  /** Called as the toast leaves; `dismissed` is true when the dismiss control closed it. */
  onRemove?: (dismissed: boolean) => void;
  /** Hides the toast 300ms after it is set. */
  shouldHide?: boolean;
};
/** A toast in the queue: its options, its key, and its measured height once the viewport has shown it. */
export type ToastItem = ToastOptions & { key: string; height?: number };
/** A viewport that renders a queue (`<acme-toaster>`): the queue tells it to render again when the queue's viewports change. */
export type ToastViewport = { requestUpdate(): void };
/**
 * A queue of toasts and the methods that fill it. `message(text | options)` adds one (an
 * explicit `key` shows once); `success`, `error` and `warning` set the type (and a default text);
 * `setMessage` replaces the queue with one toast; `setHiding` hides every toast; `removeToast`
 * takes one by index, `removeToastByKey` by key (or keys); `clear` empties it. `loaded` is true
 * while a viewport renders the queue; `current` is the queue itself. The viewports register
 * with `attach` and `detach`: the first one renders the queue, the next takes over when it leaves.
 */
export type ToastQueue = {
  store: ReturnType<typeof createStore<ToastItem[]>>;
  message(m: ToastOptions | string): void;
  /** `message` with the text apart from its options: `toasts.show("Copied", { type: "success" })`. */
  show(text: ToastText, options?: Omit<ToastOptions, "text">): void;
  success(m?: ToastOptions | string): void;
  error(m?: ToastOptions | string): void;
  warning(m?: ToastOptions | string): void;
  setMessage(m: ToastOptions | string): void;
  setHiding(): void;
  removeToast(index: number): void;
  removeToastByKey(key: string | string[]): void;
  clear(): void;
  readonly loaded: boolean;
  readonly current: ToastQueue;
  /** Records a toast's height once the viewport has measured it. */
  setHeight(key: string, height: number): void;
  attach(viewport: ToastViewport): void;
  detach(viewport: ToastViewport): void;
  /** Whether this viewport is the one that renders the queue (the first attached). */
  renders(viewport: ToastViewport): boolean;
};

let seq = 0;
/** A queue of its own: the shared `toasts` is one; a viewport given another renders that one instead. */
export const createToastQueue = (): ToastQueue => {
  const store = createStore<ToastItem[]>([]);
  const viewports: ToastViewport[] = [];
  const opts = (m: ToastOptions | string | undefined, fallback: string): ToastOptions => (m === undefined ? { text: fallback } : typeof m === "string" ? { text: m } : m);
  const queue: ToastQueue = {
    store,
    message(m) {
      const o = opts(m, "");
      const key = o.key ?? `toast-${++seq}`;
      store.setState((q) => (q.some((t) => t.key === key) ? q : [...q, { ...o, key }]));
    },
    show: (text, options) => queue.message({ ...options, text }),
    success: (m) => queue.message({ ...opts(m, "Success!"), type: "success" }),
    error: (m) => queue.message({ ...opts(m, "An error occurred."), type: "error" }),
    warning: (m) => queue.message({ ...opts(m, "Warning!"), type: "warning" }),
    setMessage(m) {
      const o = opts(m, "");
      store.setState(() => [{ ...o, key: o.key ?? `toast-${++seq}` }]);
    },
    setHiding: () => store.setState((q) => q.map((t) => ({ ...t, shouldHide: true }))),
    removeToast: (index) => store.setState((q) => q.filter((_, i) => i !== index)),
    removeToastByKey(key) {
      const keys = Array.isArray(key) ? key : [key];
      store.setState((q) => q.filter((t) => !keys.includes(t.key)));
    },
    clear: () => store.setState(() => []),
    get loaded() {
      return viewports.length > 0;
    },
    get current() {
      return queue;
    },
    setHeight: (key, height) => store.setState((q) => q.map((t) => (t.key === key ? { ...t, height } : t))),
    attach(v) {
      if (!viewports.includes(v)) viewports.push(v);
    },
    detach(v) {
      const i = viewports.indexOf(v);
      if (i < 0) return;
      viewports.splice(i, 1);
      if (i === 0) viewports[0]?.requestUpdate();
    },
    renders: (v) => viewports[0] === v,
  };
  return queue;
};

/** The shared toast queue: `toasts.error("Failed to copy to clipboard")` from anywhere; the page's `<acme-toaster>` renders it. */
export const toasts = createToastQueue();
