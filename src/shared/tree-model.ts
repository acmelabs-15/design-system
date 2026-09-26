import { isPlainRecord } from "./plain-record";

export type TreeNode = Readonly<{ id: string; label: string; children?: readonly TreeNode[]; disabled?: boolean; href?: string }>;
export type TreeEntry = Readonly<{ node: TreeNode; parent?: string; level: number; position: number; size: number }>;
export function copyTreeNodes(value: readonly TreeNode[]): readonly TreeNode[] {
  const ids = new Set<string>();
  const visit = (nodes: readonly TreeNode[]): readonly TreeNode[] => {
    if (!Array.isArray(nodes)) {
      throw new TypeError("Tree items and children require arrays");
    }
    return Object.freeze(
      nodes.map((node) => {
        if (!isPlainRecord(node)) {
          throw new TypeError("Tree nodes require plain records");
        }
        for (const key of ["id", "label", "children", "disabled", "href"]) {
          const descriptor = Object.getOwnPropertyDescriptor(node, key);
          if (descriptor && !("value" in descriptor)) {
            throw new TypeError("Tree nodes require data properties");
          }
        }
        if (typeof node.id !== "string" || !node.id.trim() || ids.has(node.id) || typeof node.label !== "string" || !node.label.trim()) {
          throw new TypeError("Tree nodes require unique IDs and labels");
        }
        if ((node.disabled !== undefined && typeof node.disabled !== "boolean") || (node.href !== undefined && typeof node.href !== "string")) {
          throw new TypeError("Invalid Tree node fields");
        }
        ids.add(node.id);
        return Object.freeze({
          id: node.id,
          label: node.label,
          ...(node.disabled !== undefined ? { disabled: node.disabled } : {}),
          ...(node.href !== undefined ? { href: node.href } : {}),
          ...(node.children !== undefined ? { children: visit(node.children as readonly TreeNode[]) } : {}),
        });
      }),
    );
  };
  return visit(value);
}
export function treeEntries(nodes: readonly TreeNode[]): readonly TreeEntry[] {
  const result: TreeEntry[] = [];
  const visit = (items: readonly TreeNode[], parent?: string, level = 1) => {
    items.forEach((node, index) => {
      result.push({ node, parent, level, position: index + 1, size: items.length });
      if (node.children) {
        visit(node.children, node.id, level + 1);
      }
    });
  };
  visit(nodes);
  return result;
}
export function visibleTreeEntries(entries: readonly TreeEntry[], expanded: readonly string[]): readonly TreeEntry[] {
  const open = new Set(expanded),
    visible = new Set<string>();
  return entries.filter((entry) => {
    const included = !entry.parent || (visible.has(entry.parent) && open.has(entry.parent));
    if (included) {
      visible.add(entry.node.id);
    }
    return included;
  });
}
export function treeKeys(value: readonly string[]): readonly string[] {
  if (!Array.isArray(value) || value.some((key) => typeof key !== "string" || !key.trim())) {
    throw new TypeError("Tree expanded requires nonempty identifiers");
  }
  return Object.freeze([...new Set(value)]);
}
