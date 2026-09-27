import { isPlainRecord } from "./plain-record";

export type JsonNode = Readonly<{
  path: string;
  parent?: string;
  key?: string;
  level: number;
  position: number;
  size: number;
  kind: string;
  text: string;
  label: string;
  identity: unknown;
  children: readonly string[];
}>;
export type JsonModel = Readonly<{ nodes: readonly JsonNode[]; byPath: ReadonlyMap<string, JsonNode> }>;
const childPath = (path: string, key: string) => path + "/" + key.replaceAll("~", "~0").replaceAll("/", "~1");
/** Snapshots own enumerable data properties without reading accessors or calling toJSON. */
export function inspectJson(value: unknown): JsonModel {
  type Mutable = { -readonly [K in keyof JsonNode]: JsonNode[K] };
  const nodes: Mutable[] = [],
    byPath = new Map<string, JsonNode>(),
    ancestors = new WeakSet<object>();
  type Frame = { value: unknown; path: string; parent?: string; key?: string; level: number; position: number; size: number; accessor?: boolean } | { exit: object };
  const stack: Frame[] = [{ value, path: "", level: 1, position: 1, size: 1 }];
  while (stack.length) {
    const frame = stack.pop()!;
    if ("exit" in frame) {
      ancestors.delete(frame.exit);
      continue;
    }
    const node: Mutable = {
      path: frame.path,
      parent: frame.parent,
      key: frame.key,
      level: frame.level,
      position: frame.position,
      size: frame.size,
      kind: typeof frame.value,
      text: "",
      label: "",
      identity: frame.value,
      children: [],
    };
    const current = frame.value;
    let entries: [string, PropertyDescriptor][] = [];
    if (frame.accessor) {
      node.kind = "accessor";
      node.text = "[Accessor]";
    } else if (current === null) {
      node.kind = "null";
      node.text = "null";
    } else if (typeof current === "object") {
      if (ancestors.has(current)) {
        node.kind = "circular";
        node.text = "[Circular]";
      } else {
        try {
          const array = Array.isArray(current);
          if (!array && !isPlainRecord(current)) {
            node.kind = "unsupported";
            node.text = "[Non-JSON object]";
          } else {
            const descriptors = Object.getOwnPropertyDescriptors(current as object);
            entries = Object.entries(descriptors).filter(([, descriptor]) => descriptor.enumerable);
            node.kind = array ? "array" : "object";
            node.text = array ? "[" + descriptors.length.value + " items]" : "{" + entries.length + " properties}";
            ancestors.add(current);
            stack.push({ exit: current });
          }
        } catch {
          node.kind = "unsupported";
          node.text = "[Uninspectable object]";
        }
      }
    } else if (typeof current === "string") {
      node.text = JSON.stringify(current);
    } else if (typeof current === "number") {
      node.text = Number.isFinite(current) ? String(current) : "[" + String(current) + "]";
    } else if (typeof current === "boolean") {
      node.text = String(current);
    } else if (typeof current === "undefined") {
      node.text = "undefined";
    } else if (typeof current === "bigint") {
      node.text = String(current) + "n";
    } else if (typeof current === "function") {
      node.text = "[Function]";
    } else {
      node.text = "[Symbol]";
    }
    node.children = Object.freeze(entries.map(([key]) => childPath(frame.path, key)));
    node.label = (frame.key === undefined ? "" : frame.key + ": ") + node.text;
    const frozen = Object.freeze(node);
    nodes.push(frozen);
    byPath.set(frame.path, frozen);
    for (let index = entries.length - 1; index >= 0; index--) {
      const [key, descriptor] = entries[index];
      stack.push({
        value: "value" in descriptor ? descriptor.value : undefined,
        accessor: !("value" in descriptor),
        path: childPath(frame.path, key),
        parent: frame.path,
        key,
        level: frame.level + 1,
        position: index + 1,
        size: entries.length,
      });
    }
  }
  return Object.freeze({ nodes: Object.freeze(nodes), byPath });
}
export function jsonNodeOpen(node: JsonNode, overrides: ReadonlyMap<string, boolean>, depth: number): boolean {
  return !!node.children.length && (overrides.get(node.path) ?? node.level <= depth);
}
export function visibleJsonNodes(model: JsonModel, overrides: ReadonlyMap<string, boolean>, depth: number): readonly JsonNode[] {
  const included = new Set<string>();
  return model.nodes.filter((node) => {
    if (node.parent !== undefined && (!included.has(node.parent) || !jsonNodeOpen(model.byPath.get(node.parent)!, overrides, depth))) {
      return false;
    }
    included.add(node.path);
    return true;
  });
}
/** Plain text matches literally; native regex inputs are copied without mutating lastIndex. */
export function jsonHighlight(value: string | RegExp | undefined): RegExp | undefined {
  if (value === undefined || value === "") {
    return undefined;
  }
  if (typeof value === "string") {
    return new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "giu");
  }
  const source = Object.getOwnPropertyDescriptor(RegExp.prototype, "source")!.get!.call(value);
  let flags = "g";
  for (const [property, flag] of [
    ["sticky", "y"],
    ["hasIndices", "d"],
    ["ignoreCase", "i"],
    ["multiline", "m"],
    ["dotAll", "s"],
    ["unicode", "u"],
    ["unicodeSets", "v"],
  ] as const) {
    const getter = Object.getOwnPropertyDescriptor(RegExp.prototype, property)?.get;
    if (getter?.call(value)) {
      flags += flag;
    }
  }
  return new RegExp(source, flags);
}
