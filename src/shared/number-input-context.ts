import { createContext } from "@lit/context";
import type { ReadonlyAtom } from "@tanstack/lit-store";
export type NumberActionState = Readonly<{ disabled: boolean; canIncrement: boolean; canDecrement: boolean; size: "small" | "medium" | "large"; incrementLabel: string; decrementLabel: string }>;
export interface NumberInputOwner {
  readonly state: ReadonlyAtom<NumberActionState>;
  step(direction: 1 | -1): void;
  press(event: PointerEvent, direction: 1 | -1): void;
  release(target: HTMLElement): void;
}
export const numberInputContext = createContext<NumberInputOwner>(Symbol("acme-number-input-owner"));
