import { createContext } from "@lit/context";
import type { ReadonlyAtom } from "@tanstack/lit-store";

export interface PinFieldPart {
  readonly host: HTMLElement;
  readonly control: HTMLInputElement;
  index(): number | undefined;
  currentOwner(): PinInputOwner | undefined;
  reconnect(): void;
}
export type PinPresentation = Readonly<{
  count: number;
  value: readonly string[];
  size: "small" | "medium" | "large";
  disabled: boolean;
  invalid: boolean;
  complete: boolean;
  locale?: string;
  labelTemplate: string;
}>;
export interface PinInputOwner {
  readonly state: ReadonlyAtom<PinPresentation>;
  register(part: PinFieldPart): void;
  unregister(part: PinFieldPart): void;
  synchronize(): void;
  submit(): void;
}
export const pinInputContext = createContext<PinInputOwner>(Symbol("acme-pin-input-owner"));

const parts = new WeakMap<Element, PinFieldPart>();
const boundaries = new WeakSet<Element>();
export const registerPinFieldPart = (part: PinFieldPart): void => {
  parts.set(part.host, part);
};
export const pinFieldPartFor = (element: Element): PinFieldPart | undefined => parts.get(element);
export const registerPinInputBoundary = (element: Element): void => {
  boundaries.add(element);
};
export const isPinInputBoundary = (element: Element): boolean => boundaries.has(element);
