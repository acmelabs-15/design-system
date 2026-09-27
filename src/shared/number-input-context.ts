import { createContext } from "@lit/context";
import type { ReadonlyAtom } from "@tanstack/lit-store";

export type NumberActionState = Readonly<{ disabled: boolean; canIncrement: boolean; canDecrement: boolean; size: "small" | "medium" | "large"; incrementLabel: string; decrementLabel: string }>;
export interface NumberInputPart {
  readonly host: HTMLElement;
  currentOwner(): NumberInputOwner | undefined;
  reconnect(): void;
}
export interface NumberInputOwner {
  readonly state: ReadonlyAtom<NumberActionState>;
  register(part: NumberInputPart): void;
  unregister(part: NumberInputPart): void;
  step(direction: 1 | -1): void;
  press(event: PointerEvent, direction: 1 | -1): void;
  release(target: HTMLElement): void;
}
export const numberInputContext = createContext<NumberInputOwner>(Symbol("acme-number-input-owner"));

const parts = new WeakMap<Element, NumberInputPart>();
const boundaries = new WeakSet<Element>();
export const registerNumberInputPart = (part: NumberInputPart): void => {
  parts.set(part.host, part);
};
export const numberInputPartFor = (element: Element): NumberInputPart | undefined => parts.get(element);
export const registerNumberInputBoundary = (element: Element): void => {
  boundaries.add(element);
};
export const isNumberInputBoundary = (element: Element): boolean => boundaries.has(element);
