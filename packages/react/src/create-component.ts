import * as React from "react";
import { createComponent as createLitComponent, type EventName } from "@lit/react";
import { createPortal } from "react-dom";
import { applyReactStyleInputs, getContentMount, hasStyleInput } from "@acmelabs/design-system/react-support";

export type ComponentProps<Element extends HTMLElement, Inputs extends keyof Element, AdditionalProps> =
  Omit<React.HTMLAttributes<Element>, Inputs | keyof AdditionalProps> & Partial<Pick<Element, Inputs>> & AdditionalProps;

type Options<Element extends HTMLElement> = {
  tagName: string;
  elementClass: new () => Element;
  displayName: string;
  events: Record<string, EventName>;
  nativeRoot?: string;
  nativeContentTarget?: (element: Element) => HTMLElement;
  contentSlots?: Readonly<Record<string, string>>;
  inputs: readonly string[];
  defaults: Readonly<Record<string, unknown>>;
  attributes: Readonly<Record<string, "boolean" | "string">>;
};

function ContentOutlet({ element, slot, renderer }: { element: HTMLElement; slot: string; renderer: () => React.ReactNode }) {
  const mount = getContentMount(element, slot);
  const mounted = React.useSyncExternalStore(mount.subscribe, mount.getSnapshot);
  return createPortal(mounted ? renderer() : null, mount.container);
}

/** Projects manifest inputs into the existing element and owns renderer event subscriptions. */
export function createComponent<Element extends HTMLElement, Props extends { children?: React.ReactNode }>(options: Options<Element>) {
  const Component = createLitComponent<HTMLElement>({ react: React, tagName: options.tagName, elementClass: options.elementClass, displayName: options.displayName });
  const inputKeys = new Set(options.inputs);
  const Wrapper = React.forwardRef<Element, Props>((props, ref) => {
    const element = React.useRef<Element | null>(null);
    const [connected, setConnected] = React.useState<Element | null>(null);
    const owner = React.useRef({});
    const previousInputs = React.useRef<ReadonlySet<string>>(new Set());
    const previousAttributes = React.useRef<ReadonlySet<string>>(new Set());
    const setRef = React.useCallback((node: Element | null) => {
      element.current = node;
      if (options.nativeContentTarget || options.contentSlots) setConnected(node);
    }, []);
    React.useLayoutEffect(() => {
      const target = element.current;
      if (!target) return;
      const listeners: [string, EventListener][] = [];
      for (const [property, type] of Object.entries(options.events)) {
        const callback = (props as Record<string, unknown>)[property];
        if (callback == null) continue;
        if (typeof callback !== "function") throw new TypeError(property + " requires an event callback");
        const listener = callback as EventListener;
        target.addEventListener(type, listener);
        listeners.push([type, listener]);
      }
      return () => { for (const [type, listener] of listeners) target.removeEventListener(type, listener); };
    });
    React.useLayoutEffect(() => {
      const target = element.current;
      if (!target) return;
      const current = new Set<string>();
      const attributes = new Set<string>();
      for (const [key, type] of Object.entries(options.attributes)) {
        if (!Object.hasOwn(props, key)) continue;
        attributes.add(key);
        const value = (props as Record<string, unknown>)[key];
        if (value == null || (type === "boolean" && !value)) target.removeAttribute(key);
        else target.setAttribute(key, type === "boolean" ? "" : String(value));
      }
      for (const key of previousAttributes.current) if (!attributes.has(key)) target.removeAttribute(key);
      previousAttributes.current = attributes;
      for (const [key, value] of Object.entries(props)) {
        if (!inputKeys.has(key) || hasStyleInput(target, key)) continue;
        current.add(key);
        Reflect.set(target, key, value === undefined ? structuredClone(options.defaults[key]) : value);
      }
      for (const key of previousInputs.current) if (!current.has(key)) Reflect.set(target, key, structuredClone(options.defaults[key]));
      previousInputs.current = current;
      applyReactStyleInputs(target, owner.current, props);
    });
    React.useImperativeHandle(ref, () => element.current!, []);
    const forwarded = { ...props } as Record<string, unknown>;
    for (const key of inputKeys) delete forwarded[key];
    for (const key of Object.keys(options.events)) delete forwarded[key];
    for (const key of Object.keys(options.attributes)) delete forwarded[key];
    const outlets: React.ReactNode[] = [];
    for (const [property, slot] of Object.entries(options.contentSlots ?? {})) {
      const renderer = forwarded[property] as (() => React.ReactNode) | undefined;
      delete forwarded[property];
      if (connected && renderer) outlets.push(React.createElement(ContentOutlet, { key: property, element: connected, slot, renderer }));
    }
    let children = options.nativeRoot
      ? React.createElement(options.nativeRoot, { "data-acme-native-root": options.nativeRoot }, props.children)
      : props.children;
    if (options.nativeContentTarget) {
      const all = React.Children.toArray(props.children);
      const named = (child: React.ReactNode) => React.isValidElement<{ slot?: string }>(child) && !!child.props.slot;
      children = all.filter(named);
      if (connected) outlets.push(createPortal(all.filter(child => !named(child)), options.nativeContentTarget(connected), "native-content"));
    }
    return React.createElement(React.Fragment, null, React.createElement(Component, { ...forwarded, ref: setRef }, children), ...outlets);
  });
  Wrapper.displayName = options.displayName;
  return Wrapper;
}
