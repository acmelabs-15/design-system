import { createAtom, type ReadonlyAtom } from "@tanstack/lit-store";
import { isPlainRecord } from "./plain-record";
import { ToastTimers } from "./toast-timers";
export type ToastVariant = "default" | "success" | "warning" | "error";
export type ToastRecord = Readonly<{
  id: string;
  heading?: string;
  description: string;
  variant: ToastVariant;
  duration: number;
  action?: Readonly<{ id: string; label: string }>;
  dismissible: boolean;
}>;
export type ToastInput = Readonly<{
  id?: string;
  heading?: string;
  description: string;
  variant?: ToastVariant;
  duration?: number;
  action?: Readonly<{ id: string; label: string }>;
  dismissible?: boolean;
}>;
export type ToastPatch = Partial<Omit<ToastInput, "id">>;
export type ToastDismissReason = "timeout" | "close" | "escape" | "swipe" | "programmatic" | "clear";
export interface ToastStore {
  readonly state: ReadonlyAtom<readonly ToastRecord[]>;
  add(record: ToastInput): string;
  update(id: string, patch: ToastPatch): void;
  dismiss(id: string): void;
  clear(): void;
}
export type ToastEntry = Readonly<{ record: ToastRecord; status: "open" | "closing"; version: number; revision: number; reason?: ToastDismissReason }>;
type Dismissal = Readonly<{ id: string; reason: ToastDismissReason }>;
export interface ToastRuntime {
  readonly entries: ReadonlyAtom<readonly ToastEntry[]>;
  readonly owner: ReadonlyAtom<object | undefined>;
  attachViewport(owner: object): () => void;
  attachToast(owner: object): () => void;
  pause(reason: object): void;
  resume(reason: object): void;
  dismiss(id: string, reason: ToastDismissReason): void;
  finish(id: string, version: number): void;
  subscribeDismiss(listener: (detail: Dismissal) => void): () => void;
  claimAnnouncement(id: string, content: string): boolean;
}
const runtimes = new WeakMap<ToastStore, ToastRuntime>();
let storeSequence = 0;
export function toastRuntime(store: ToastStore): ToastRuntime {
  const runtime = runtimes.get(store);
  if (!runtime) throw new TypeError("Use a store created by createToastStore");
  return runtime;
}
function recordData(value: unknown, keys: readonly string[]): Record<string, unknown> {
  if (!isPlainRecord(value)) throw new TypeError("Toast data requires a plain record");
  for (const key of Reflect.ownKeys(value)) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key)!;
    if (typeof key !== "string" || !keys.includes(key) || !descriptor.enumerable || !("value" in descriptor)) throw new TypeError("Toast records require supported data fields");
  }
  return value;
}
const fields = ["id", "heading", "description", "variant", "duration", "action", "dismissible"] as const;
function snapshot(input: ToastInput, id: string): ToastRecord {
  recordData(input, fields);
  if (typeof id !== "string" || !id.trim() || typeof input.description !== "string" || (input.heading !== undefined && typeof input.heading !== "string"))
    throw new TypeError("Toast identity and content require strings");
  const variant = input.variant ?? "default",
    duration = input.duration ?? 5000,
    dismissible = input.dismissible ?? true;
  if (!["default", "success", "warning", "error"].includes(variant) || !Number.isFinite(duration) || duration < 0 || typeof dismissible !== "boolean")
    throw new TypeError("Invalid Toast variant, duration or dismissible value");
  let action: ToastRecord["action"];
  if (input.action !== undefined) {
    const data = recordData(input.action, ["id", "label"]);
    if (typeof data.id !== "string" || !data.id.trim() || typeof data.label !== "string" || !data.label.trim()) throw new TypeError("Toast actions require an identifier and label");
    action = Object.freeze({ id: data.id, label: data.label });
  }
  return Object.freeze({ id, heading: input.heading, description: input.description, variant, duration, action, dismissible });
}
/** Creates an isolated notification store. Timers run only while a presentation is connected. */
export function createToastStore(): ToastStore {
  const entries = createAtom<readonly ToastEntry[]>(Object.freeze([]));
  const viewers = createAtom<readonly object[]>([]);
  const owner = createAtom(() => viewers.get()[0]);
  const state = createAtom(() =>
    Object.freeze(
      entries
        .get()
        .filter((entry) => entry.status === "open")
        .map((entry) => entry.record),
    ),
  );
  const listeners = new Set<(detail: Dismissal) => void>();
  const announced = new Map<string, string>();
  const presentations = new Set<object>();
  const absent = {};
  let sequence = 0,
    version = 0;
  const prefix = ++storeSequence;
  const timers = new ToastTimers((id) => dismiss(id, "timeout"));
  timers.pause(absent);
  function finish(id: string, life: number) {
    entries.set((rows) => Object.freeze(rows.filter((entry) => entry.record.id !== id || entry.version !== life || entry.status !== "closing")));
  }
  function dismiss(id: string, reason: ToastDismissReason) {
    const entry = entries.get().find((entry) => entry.record.id === id);
    if (!entry || entry.status === "closing") return;
    timers.cancel(id);
    announced.delete(id);
    entries.set((rows) => Object.freeze(rows.map((item) => (item === entry ? Object.freeze({ ...item, status: "closing" as const, reason }) : item))));
    const detail = Object.freeze({ id, reason });
    for (const listener of [...listeners]) listener(detail);
    if (!presentations.size) finish(id, entry.version);
  }
  function attach(presenter: object) {
    presentations.add(presenter);
    timers.resume(absent);
    return () => {
      presentations.delete(presenter);
      if (!presentations.size) {
        timers.pause(absent);
        entries.set((rows) => Object.freeze(rows.filter((entry) => entry.status === "open")));
      }
    };
  }
  const store: ToastStore = Object.freeze({
    state,
    add(input: ToastInput) {
      recordData(input, fields);
      let id = input.id;
      if (id === undefined) {
        do id = `toast-${prefix}-${++sequence}`;
        while (entries.get().some((entry) => entry.record.id === id));
      }
      const previous = entries.get().find((entry) => entry.record.id === id);
      const record = snapshot(previous && previous.status === "open" ? { ...previous.record, ...input } : input, id);
      const entry = Object.freeze({ record, status: "open" as const, version: ++version, revision: (previous?.revision ?? -1) + 1 });
      entries.set((rows) => Object.freeze(previous && previous.status === "open" ? rows.map((item) => (item === previous ? entry : item)) : [entry, ...rows.filter((item) => item.record.id !== id)]));
      timers.start(id, record.duration);
      return id;
    },
    update(id: string, patch: ToastPatch) {
      recordData(
        patch,
        fields.filter((field) => field !== "id"),
      );
      const previous = entries.get().find((entry) => entry.record.id === id);
      if (!previous || previous.status === "closing") return;
      const record = snapshot({ ...previous.record, ...patch }, id);
      entries.set((rows) => Object.freeze(rows.map((entry) => (entry === previous ? Object.freeze({ ...entry, record, revision: entry.revision + 1 }) : entry))));
      if (Object.hasOwn(patch, "duration")) timers.start(id, record.duration);
    },
    dismiss: (id: string) => dismiss(id, "programmatic"),
    clear() {
      for (const entry of [...entries.get()]) dismiss(entry.record.id, "clear");
    },
  });
  const runtime: ToastRuntime = {
    entries,
    owner,
    attachViewport(viewer) {
      viewers.set((list) => [...list, viewer]);
      const release = attach(viewer);
      return () => {
        viewers.set((list) => list.filter((item) => item !== viewer));
        release();
      };
    },
    attachToast: attach,
    pause: (reason) => timers.pause(reason),
    resume: (reason) => timers.resume(reason),
    dismiss,
    finish,
    subscribeDismiss(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    claimAnnouncement(id, content) {
      if (announced.get(id) === content) return false;
      announced.set(id, content);
      return true;
    },
  };
  runtimes.set(store, runtime);
  return store;
}
