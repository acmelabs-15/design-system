import { createContext } from "@lit/context";
import type { ReadonlyAtom } from "@tanstack/lit-store";
export interface PinFieldPart {
  readonly host: HTMLElement;
  readonly control: HTMLInputElement;
  index(): number | undefined;
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
