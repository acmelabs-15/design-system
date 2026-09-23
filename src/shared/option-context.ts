import { createContext } from "@lit/context";
import type { ReadonlyAtom } from "@tanstack/lit-store";
export interface OptionPart {
  readonly host: HTMLElement;
  value(): string | undefined;
  text(): string;
  section(): string;
  disabled(): boolean;
  currentOwner(): OptionOwner | undefined;
  reconnect(): void;
}
export type OptionPresentation = Readonly<{ selected: boolean; highlighted: boolean; disabled: boolean; hidden: boolean }>;
export interface OptionOwner {
  readonly revision: ReadonlyAtom<unknown>;
  register(part: OptionPart): () => void;
  presentation(part: OptionPart): OptionPresentation;
  choose(part: OptionPart): void;
  highlight(part: OptionPart): void;
}
export const optionContext = createContext<OptionOwner>(Symbol("acme-option-owner"));
const parts = new WeakMap<Element, OptionPart>();
const boundaries = new WeakSet<Element>();
export const registerOptionPart = (part: OptionPart): void => {
  parts.set(part.host, part);
};
export const optionPartFor = (element: Element): OptionPart | undefined => parts.get(element);
export const registerOptionBoundary = (element: Element): void => {
  boundaries.add(element);
};
export const isOptionBoundary = (element: Element): boolean => boundaries.has(element);
