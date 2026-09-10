// Derives an element's style module from the reference spec. A mapping under tools/geist/maps
// names the spec page, the component tag in the example code, the marker attribute of the
// rendered root, our root selector, how each prop value maps to one of our modifier selectors,
// and how the root's children map to our child selectors. The generator labels every rendered
// root with the props its JSX carried, assigns each class to the widest group of roots that all
// carry it (the base, one prop value, or a pair of values), and writes the exact declarations
// those classes resolve to, per state, into <name>.styles.ts. Nothing is typed by hand.
// Run: bun tools/geist/gen.ts [name ...]   (default: every mapping in tools/geist/maps)
import fs from "node:fs";
import path from "node:path";
import { formatGenerated } from "../../scripts/format-generated";
import { atoms, type Decl, loadReference, parseDecls, serialize, simplify, twProperty } from "./simplify";
import { allRules, keyframesOf, resolve } from "./tw";

/**
 * Reference state → ours. A key is one selector token as the reference CSS writes it on the
 * element (`:hover`, `:focus-visible`, `:has(:focus)`, `[data-geist-input-suffix]`); a value is our
 * token in its place. A value starting with `^` lands on the root instead (a child whose hover is
 * the root's hover); one starting with `@` lands on the host (`:last-child` → `@:last-child`: a
 * row's place among its siblings is the host's in ours). A `null` value drops the rule (a reference state our DOM never enters). A
 * state the reference reaches through a sibling `.peer` (`peer-checked:`) or a `.group` ancestor
 * always lands on the root, translated token by token, `:not()` included.
 */
export type StateMap = Record<string, string | null>;
export type ChildMap = {
  /** Our selector for this child, relative to the root (e.g. ".label"); empty when another element's map styles it (a slotted component): nothing is emitted for it here. */
  ours: string;
  /** Picks the child among the parent's direct children (an index, or a predicate). */
  pick: number | ((child: SpecNode, index: number, siblings: SpecNode[]) => boolean);
  /** Every child the predicate accepts is this part (a list of items), not only the first. */
  all?: boolean;
  /** Nested children of this child. */
  children?: ChildMap[];
  /** The child is another component (its own mapping covers its inside); do not report its children. */
  leaf?: boolean;
  /** This child's own state tokens; unset inherits the map's. */
  states?: StateMap;
  /**
   * The child is an instance of another mapped element (its mapping name): the classes that
   * element's roots carry are its own and are skipped here. `name/ours/…` names a mapped child of
   * that element by its `ours` path (`textarea/textarea`: the field inside the wrapper): the
   * classes that child carries in the element's own spec are skipped instead, so a class the
   * parent adds to it (a height) is all that is emitted, on its `part`.
   */
  extends?: string;
  /**
   * The child's box is a part of that element's shadow tree: its own rules render as `:where(tag)::part(name)`; its children are found under the tag.
   * With no `ours`, the child is a part of the composed ancestor it sits in (a box inside its shadow tree, `acme-radio::part(dot)`): its rules
   * render on that ancestor's tag, and an ancestor state (a `group` on the box's parent) lands on the same tag.
   */
  part?: string;
  /** The child is slotted light DOM (an element of ours, `acme-grid-cell`, listed in the map's `slotted`): its rules reach it through the slot. */
  slotted?: boolean;
  /**
   * Root props the reference sets on this node (a `disabled` content, a `highlight` footer): where
   * two props' groups cover a class of this child alike (the examples set both together), the
   * class groups by these props first.
   */
  owns?: string[];
};
export type GeistMap = {
  page: string;
  /** JSX tag(s) whose instances are the rendered roots, in document order; the first is the primary. */
  component: string | string[];
  /** Attribute that marks the rendered root (e.g. "data-geist-button"), or a predicate. */
  root: string | ((n: SpecNode) => boolean);
  /** Roots nest in the reference (a folder inside a folder): the root search continues inside a root. */
  nested?: boolean;
  /**
   * Rendered roots per component instance, when one instance renders several (the two links of a
   * pagination, the tabs of a tab list): each root takes the instance's props. A number holds for
   * every example; a record sets it per example heading (a list the code writes once inside a `.map()`).
   */
  perInstance?: number | Record<string, number>;
  /** Our root selector. `":host"` is the host itself; a selector ending on `::slotted(tag)` is slotted light DOM of ours (a composed element the consumer slots in), whose modifier and state go inside `::slotted()`. */
  ours: string;
  /** Prop defaults: a root without the prop counts as this value. */
  defaults?: Record<string, string>;
  /** Props the JSX does not carry, read off the rendered root (e.g. whether an optional child is present) or its ancestors in the spec (the outermost first, the root's parent last). */
  derive?: Record<string, (node: SpecNode, props: Record<string, string>, ancestors: SpecNode[]) => string>;
  /** prop -> raw JSX value -> the value `props` names; `*` catches every other raw value (an icon element, a state variable). */
  values?: Record<string, Record<string, string>>;
  /**
   * prop -> where a component instance gets it from besides its own JSX: `"Tag"` fills a missing
   * prop from the nearest enclosing Tag (context); `"Tag >"` takes the direct parent Tag's value,
   * present or not, over the instance's own (a parent that clones its children with its props).
   */
  inherit?: Record<string, string>;
  /** prop -> value -> our modifier selector appended to `ours`; a default value maps to `ours` itself. */
  props?: Record<string, Record<string, string>>;
  /** The root's state tokens (see {@link StateMap}); children inherit them unless they carry their own. */
  states?: StateMap;
  /**
   * A named group class on a mapped ancestor below the root (`group/row` on the row above a
   * toggle) lands its state (`group-hover/row:`) on that ancestor's own segment of the selector,
   * nearest first; the element sets the state attribute on that ancestor. Unset, every group state
   * is the root's, where the element mirrors it.
   */
  groupOnAncestor?: boolean;
  children?: ChildMap[];
  /** Examples to skip (heading). */
  skip?: string[];
  /** Marker classes on the root that carry no styles. */
  ignore?: string[];
  /**
   * Slotted light-DOM content in our element (a descendant rule reaches it through the slot): a list
   * of tags, or a map from the reference's child compound (a tag, or an attribute like
   * `[data-slot=icon]`) to ours inside `::slotted()` (e.g. `[slot=icon]`).
   */
  slotted?: string[] | Record<string, string>;
  /**
   * The root is an instance of another mapped element (the name of its mapping): every class that
   * element's roots carry is its own and is skipped here, as are the root's children, so only the
   * classes this element adds are emitted. `name/ours/…` names a mapped child of that element (a
   * slotted element of ours, `grid/acme-grid-cell`): that element ships the child's own rules, and
   * this mapping emits the rules into the child's tree (`.cell > div`), on `ours: ":host"`.
   */
  extends?: string;
  /** The root is a part of the composed element in our shadow tree: rules render as `ours:where(mod)::part(name)`; an attribute state lands on the composed element's tag before the part, a descendant rule (a child of ours slotted into it) on the tag alone, as a child part's do. */
  part?: string;
  /** The root is a pseudo-element of our element (`::backdrop`, a native dialog's backdrop): rules render as `ours:where(mod)<state>::backdrop`. */
  pseudo?: string;
  /** The element directory the module is written into when it differs from the mapping's name (a second mapping of one element, for an alternate root). */
  element?: string;
  /**
   * Animations the reference starts from an inline style the element writes at runtime (a rule's
   * `animation` is found on its own): their `@keyframes` ship in the module.
   */
  keyframes?: string[];
  /** Reference asset URLs the rules name in `url()` → the house-hosted copy (under `assets/`, shipped with the package): the module points at ours. */
  assets?: Record<string, string>;
  /**
   * Reference class names that descendant rules name in their tails (`.pre .lineNumber`) → ours on
   * that descendant; a keyframes name (a CSS-module animation) is renamed the same way. A key may be
   * an attribute token (`[data-tree-indent]`), renamed to our class (`indent`) on that descendant.
   */
  classes?: Record<string, string>;
  /** Example heading → the index (or indices) of the JSX instances that rendered, where the code writes the component in several branches (a state switch) and renders one, or writes instances a closed parent never mounts. */
  instances?: Record<string, number | number[]>;
  /**
   * A reference ancestor above the root: the composed element the root is slotted into (the tree
   * around a folder), found by the predicate on the nearest ancestor that satisfies it. Its
   * descendant rules that reach a node of this element's own tree (`[&_[data-tree-indent]]:w-[23px]`
   * on the tree, a rule on the indent spans below) cross a shadow boundary the ancestor's module
   * cannot, so they are emitted here, re-rooted on `ours` (the ancestor is always there in our DOM).
   * Only the classes every such ancestor carries are taken; a rule without a tail is the ancestor's
   * own box. The ancestor's mapping lists the tails under `crossing`.
   */
  outer?: (n: SpecNode) => boolean;
  /**
   * Descendant compounds (`[data-tree-indent]`) whose rules from this root cross into a composed
   * child's shadow tree (the guides inside the rows of a tree), where no rule of this module
   * reaches: left out here and reported; the child's mapping emits them through `outer`.
   */
  crossing?: string[];
  /**
   * Reference ancestor compounds that qualify a descendant's rule (`.systemDebug .block`), as the
   * sheet writes them → the root state that stands for the ancestor in ours (`:where([data-debug])`,
   * an attribute the element keeps in step with its context; `:where(.contained)` when the ancestor
   * is the root's own modifier), `""` when the ancestor is always there in our DOM, or `null` when
   * the descendant is unreachable from this element. A rule that continues from a context ancestor
   * to a descendant is emitted on the descendant's side (the ancestor's side skips it), like a
   * `.group` state.
   */
  context?: Record<string, string | null>;
  /**
   * Root properties that act through the wrapper: those the root owns as an item of its parent's
   * layout (`flex`, `min-width`, `align-self`, `margin`) and those it takes from its parent by
   * `inherit` (`background-color`). In ours the host is the parent's item and the root's parent,
   * so the root's base and modifier rules for these properties are repeated on `:host`, each
   * modifier class translated through `mods` to the host's attribute (`.fill` → `[fill]`, an
   * attribute the element reflects). An at-rule variant (a responsive `sm:min-w-0`) is mirrored
   * under the same at-rule; state and theme variants stay the root's own. A modifier with no
   * translation is reported and not mirrored.
   */
  host?: { mirror: string[]; mods?: Record<string, string> };
  /**
   * Classes of a reference ancestor whose rules reach the root as its child (`[&>li:not(:last-child)]:border-b`
   * on the list around a row: a rule that names the row by its tag alone): the root reads as
   * carrying them, so they are assigned like its own and emitted here, the child compound's own
   * states as the root's (a position among siblings is the host's, see {@link StateMap}). The
   * ancestor's own mapping lists them under `ignore`.
   */
  fromAncestor?: (cls: string) => boolean;
};
/** Pick helper: the child carries this class. */
export const has = (cls: string) => (c: SpecNode) => c.styles.some((s) => s.cls === cls) || c.unresolved.includes(cls);
export type SpecNode = { tag: string; attrs: Record<string, string>; text?: string; styles: { cls: string; state: string; at: string; decl: string }[]; unresolved: string[]; children: SpecNode[] };
type Spec = { page: string; examples: { heading: string; code: string; dom: SpecNode[] }[] };
type Labeled = { props: Record<string, string>; node: SpecNode; /** A mapped child's ancestors in the spec, the root first, its parent last. */ path?: SpecNode[] };

const ROOT = path.resolve(import.meta.dir, "../..");
const specDir = path.join(import.meta.dir, "spec");
/**
 * A reference rule's cascade precedence, as one number: its layer first (the sheet declares
 * theme, base, components, utilities in that order; an unlayered rule beats every layered one),
 * then its selector's specificity, then its source order. Two rules on one element that conflict
 * are emitted in this order, so ours (all `:where()`, source order decides) resolves them the way
 * the reference does. `:where()` adds nothing; `:is()`, `:not()` and `:has()` count their arguments.
 */
const LAYERS = ["theme", "properties", "base", "components", "utilities"];
function specificity(sel: string): number {
  let s = sel.replace(/\\./g, "x").replace(/:where\((?:[^()]|\([^()]*\))*\)/g, "").replace(/:(?:is|not|has)\(/g, "(");
  const pseudoElements = (s.match(/::[\w-]+/g) ?? []).length;
  s = s.replace(/::[\w-]+/g, "");
  const ids = (s.match(/#[\w-]+/g) ?? []).length;
  const classes = (s.match(/\.[\w-]+|\[[^\]]*\]|:[\w-]+/g) ?? []).length;
  const elements = pseudoElements + (s.match(/(?:^|[\s>+~(,])[a-zA-Z][\w-]*/g) ?? []).length;
  return ids * 10000 + Math.min(classes, 99) * 100 + Math.min(elements, 99);
}
const ruleOrder = new Map(
  allRules().map((r, i) => {
    const layer = r.at.match(/@layer ([a-z]+)/)?.[1];
    return [r, (layer ? LAYERS.indexOf(layer) : LAYERS.length) * 1e9 + specificity(r.sel) * 1e5 + i];
  }),
);
/** An important declaration inverts the layer order (an earlier layer wins, unlayered last), as the cascade does. */
const cascadeKey = (d: { order?: number; important?: boolean }) => {
  const o = d.order ?? 0;
  return d.important ? (LAYERS.length - Math.floor(o / 1e9)) * 1e9 + (o % 1e9) : o;
};

/**
 * JSX instances of the component tag(s) in the example code, in order, with their props. Open
 * tags are tracked as a stack, so a prop in `inherit` reaches an instance from an enclosing
 * component: the nearest named one fills a missing prop, or the direct parent's value replaces
 * the instance's own (`"Tag >"`). A component written inside a braced prop
 * (`icon={<EmptyStateIcon … />}`) renders inside the one that takes it: its instances are read
 * from the prop's value, after the taker's own, with the taker on the stack as their parent.
 */
function jsxInstances(code: string, tags: string[], inherit: Record<string, string> = {}) {
  const out: Record<string, string>[] = [];
  const stack: { tag: string; props: Record<string, string> }[] = [];
  const VOID = /^(area|base|br|col|embed|hr|img|input|link|meta|source|track|wbr)$/;
  const scan = (src: string) => {
    // A braced prop nests three deep at most: an object literal holding a function body (`callToAction={{ onClick: () => { … } }}`).
    for (const m of src.matchAll(/<(\/?)([A-Za-z][A-Za-z0-9.]*)((?:[^>"'{}]|"[^"]*"|'[^']*'|\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\})*?)(\/?)>/g)) {
      const [, close, tag, attrs, self] = m;
      if (close) {
        const i = stack.map((s) => s.tag).lastIndexOf(tag);
        if (i >= 0) stack.length = i;
        continue;
      }
      const props: Record<string, string> = { $tag: tag };
      const nested: string[] = [];
      // A prop name may carry an underscore (`unstable_useContainer`).
      for (const p of attrs.matchAll(/([a-zA-Z_][a-zA-Z0-9_-]*)(?:=(?:"([^"]*)"|'([^']*)'|\{((?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*)\}))?/g)) {
        props[p[1]] = (p[2] ?? p[3] ?? p[4] ?? "true").trim().replace(/^["']|["']$/g, "");
        if (p[4] && /<[A-Za-z]/.test(p[4])) nested.push(p[4]);
      }
      if (tags.includes(tag)) {
        for (const [prop, spec] of Object.entries(inherit)) {
          const [from, clone] = spec.split(/\s*>$/);
          const parent = stack[stack.length - 1];
          if (clone !== undefined) {
            if (parent?.tag !== from) continue;
            if (prop in parent.props) props[prop] = parent.props[prop];
            else delete props[prop];
          } else {
            const anc = [...stack].reverse().find((s) => s.tag === from);
            if (!(prop in props) && anc && prop in anc.props) props[prop] = anc.props[prop];
          }
        }
        out.push(props);
      }
      stack.push({ tag, props });
      for (const n of nested) scan(n);
      if (self || VOID.test(tag)) stack.pop();
    }
  };
  scan(code);
  return out;
}

/** The roots under `nodes`; with `nested`, the search continues inside a root (see GeistMap.nested). */
const findRoots = (nodes: SpecNode[], isRoot: (n: SpecNode) => boolean, out: SpecNode[] = [], nested = false) => {
  for (const n of nodes) {
    if (isRoot(n)) out.push(n);
    if (!isRoot(n) || nested) findRoots(n.children, isRoot, out, nested);
  }
  return out;
};
/** The last compound of a selector tail (`> li`, ` [data-tree-indent]`): the element the rule ends on; null when the tail ends on a combinator. */
function lastCompound(tail: string): string | null {
  const { segs, tail: t } = segments(tail);
  return t ? null : (segs[segs.length - 1]?.seg ?? null);
}
/** Whether a compound (a type, attributes, classes; pseudo-classes left aside) matches a spec node. */
function nodeMatches(compound: string, n: SpecNode): boolean {
  const c = stripParens(compound);
  const type = c.match(/^(?:[a-zA-Z][\w-]*|\*)/)?.[0];
  if (type && type !== "*" && type.toLowerCase() !== n.tag) return false;
  for (const m of c.matchAll(/\[([\w-]+)(?:([*^$|~]?=)"?((?:\\.|[^\]"])*)"?)?\]/g)) {
    if (!(m[1] in n.attrs)) return false;
    if (m[2] === "=" && n.attrs[m[1]] !== unesc(m[3])) return false;
  }
  const own = classesOf(n);
  return classesIn(compound).every((k) => own.has(k));
}
/** A node with every node below it. */
const subtree = (n: SpecNode): SpecNode[] => [n, ...n.children.flatMap(subtree)];
/** Every root with its ancestors in the spec (the outermost first, the root's parent last). */
const findRootPaths = (nodes: SpecNode[], isRoot: (n: SpecNode) => boolean, ancestors: SpecNode[] = [], out: { node: SpecNode; ancestors: SpecNode[] }[] = [], nested = false) => {
  for (const n of nodes) {
    if (isRoot(n)) out.push({ node: n, ancestors });
    if (!isRoot(n) || nested) findRootPaths(n.children, isRoot, [...ancestors, n], out, nested);
  }
  return out;
};

/** `skip`: a wrapper our pages never carry (an inverted-theme section); the rule is dropped. */
type Theme = "" | "light" | "dark" | "skip";
/** The reference's theme classes: on the page root one is the theme, on a node either is a local theme scope (a forced-light preview). */
const THEME_CLASSES = new Set(["dark-theme", "light-theme"]);
const STATE_RE = /(?:\[[^\]]*\]|:[a-z-]+(?:\([^)]*\))?)*/.source;
/**
 * The parts of a reference selector outside the class compound become ours: the theme wrappers
 * (`.dark-theme`, its `.dark` alias, the `[data-theme=dark]` attribute) become a theme prefix, a
 * group state becomes the root's state (or a mapped ancestor's, when the group class is on one),
 * the rest is the state.
 */
/**
 * A state on a mapped ancestor of the element (a named group on the row above a toggle): `depth` 0 is
 * the parent, counted in spec levels; `seg` is the ancestor's segment of the rendered selector,
 * counted from its end (0 is the last segment), which differs where a level has no selector of ours.
 */
type AncestorState = { depth: number; seg?: number; state: string };
/** The compiled form of a group variant on the element's own compound (`group-hover:` → `:is(:where(.group):hover *)`), with its name and state. A name is any identifier (`group/row`, `group/toastArea`). */
const GROUP_FORM = `:is\\(:where\\(\\.group((?:\\\\\\/[\\w-]+)?)\\)(${STATE_RE}) \\*\\)`;
function parseState(prefixSel: string, rest: string, context: Record<string, string | null> = {}, chain?: Set<string>[], groupOnAncestor = false, levels?: boolean[], groups?: Set<string>[]): { theme: Theme; rootState: string; state: string; ancestors?: AncestorState[]; unmatched?: boolean } {
  const skip = { theme: "skip" as Theme, rootState: "", state: "" };
  if (/^\.invert-theme\s/.test(prefixSel ? `${prefixSel} ${rest}` : rest)) return skip;
  // Light-only wrappers: `html:not(.dark-theme)` before the compound, or the `not-dark-theme:` variant's `:not(:where(.dark-theme,.dark-theme *))` on it.
  const notDark = /:not\(:where\(\.dark-theme(?:,\s*\.dark-theme \*)?\)\)/;
  const light = /html:not\(\.dark-theme\)/.test(prefixSel) || notDark.test(prefixSel) || notDark.test(rest);
  const noLight = (x: string) => x.replace(/html:not\(\.dark-theme\)\s*/g, "").replace(notDark, "");
  let p = noLight(prefixSel);
  let r = noLight(rest);
  // The sheet writes the dark theme two ways: the `.dark-theme` class (its `.dark` alias), and the
  // `[data-theme=dark]` attribute an arbitrary variant (`[[data-theme='dark']_&]:`) names as the ancestor.
  const DATA_DARK = /^\[data-theme=(['"]?)dark\1\]\s*/;
  const dark = /dark-theme/.test(`${p} ${r}`) || /^\.dark(\s|$)/.test(p) || DATA_DARK.test(p);
  const noDark = (x: string) => x.replace(/:(where|is)\(\s*\.dark-theme(\s*,\s*\.dark-theme \*)?\s*\)\s*/g, "").replace(/\.dark-theme\s*/g, "");
  p = noDark(p).replace(/^\.dark(\s+|$)/, "").replace(DATA_DARK, "");
  r = noDark(r);
  let rootState = "";
  // A context ancestor (see GeistMap.context) becomes the root's state; one the descendant cannot reach drops the rule.
  const consumed: string[] = [];
  for (let found = true; found; ) {
    found = false;
    for (const [anc, ours] of Object.entries(context)) {
      if (!p.startsWith(anc) || !/[\s>+~]/.test(p[anc.length] ?? " ")) continue;
      if (ours === null) return skip;
      rootState += ours;
      consumed.push(anc);
      p = p.slice(anc.length).replace(/^\s*[>+~]?\s*/, "");
      found = true;
    }
  }
  // A named group (`group/trigger`) or the plain `group` class on the root: an ancestor in the prefix, or the `group-hover:` variant's `:is()` on the element's own compound.
  const groupOf = (s: string) => s.match(new RegExp(`^\\.group((?:\\\\\\/[\\w-]+)?)(${STATE_RE})\\s*`)) ?? s.match(new RegExp(`^${GROUP_FORM}`));
  // The negated variant (`not-group-has-disabled/x:`) wraps the same form in `:not()`.
  const notGroupOf = (s: string) => s.match(new RegExp(`^:not\\(${GROUP_FORM}\\)`));
  const g = groupOf(p) ?? (p.trim() ? null : groupOf(r));
  const ancestors: AncestorState[] = [];
  // The group on a mapped ancestor below the root (a named group on the row above a toggle): its
  // state lands on that ancestor's own segment of the selector, nearest first (see GeistMap.groupOnAncestor),
  // when that level has a selector of ours. Anywhere else it is the root's.
  // The group class is looked for on any member's ancestor (`groups`), not only those every member shares: a control that is
  // disabled drops its `group`, and the rule (already guarded by `peer-not-disabled`) is still the enabled control's hover.
  // A named group variant with no state of its own (`group-[&]/x:`, the arbitrary variant compiled to
  // `:is(:where(.group\/x) *)`) is conditioned on the group class being there at all (a class the
  // reference toggles at runtime): its state is that class token, translated through `states` like any other.
  const land = (name: string, state: string, bare = false) => {
    if (bare && !state && name) state = `.group${name}`;
    const depth = groupOnAncestor && chain ? (groups ?? chain).findIndex((s) => s.has(`group${unesc(name)}`)) : -1;
    if (chain && depth >= 0 && depth < chain.length - 1 && (levels?.[depth] ?? true)) ancestors.push({ depth, state });
    else rootState += state;
  };
  if (g) {
    land(g[1], g[2], g[0].startsWith(":is("));
    if (groupOf(p)) p = p.slice(g[0].length);
    else r = r.slice(g[0].length);
  }
  // Group variants stack on one compound (`group-has-checked/x:not-group-has-disabled/x:`): each one after the first lands the same way, a negated one as `:not(state)`.
  if (!p.trim()) for (let m = groupOf(r) ?? notGroupOf(r); m; m = groupOf(r) ?? notGroupOf(r)) {
    const own = m[2] || `.group${m[1]}`;
    land(m[1], m[0].startsWith(":not(") ? `:not(${own})` : own);
    r = r.slice(m[0].length);
  }
  // A mapped child's leftover prefix (`.body` in `.body .bind`) names ancestors on its own path: a
  // matched prefix drops out (ours nests the same way), a state on the root's compound is the root's,
  // and a prefix off the path (the other `.bind`, an ancestor with a state) makes the rule another element's.
  if (chain && p.trim()) {
    // A context ancestor that is on the path (the wrapper the root's modifier stands for) bounds the leftover: its compounds match below it.
    const below = Math.min(chain.length, ...consumed.map((anc) => chain.findIndex((s) => classesIn(anc).length > 0 && classesIn(anc).every((c) => s.has(c)))).filter((j) => j >= 0));
    const m = matchesChain(p, chain, below);
    // Off the path with classes alone is expected (the same class under another parent); a state that found no place is reported.
    if (!m) return { ...skip, unmatched: segments(p).segs.some(({ seg }) => removeClasses(seg) !== "") };
    rootState += m.rootState;
    p = "";
  }
  let s = p.trim() ? `${p} ${r}` : r;
  s = s.replace(/\s+/g, " ").replace(/(:[a-z-]+|\[[^\]]+\])\1/g, "$1").replace(/\s+$/, "");
  return { theme: dark ? "dark" : light ? "light" : "", rootState, state: s, ancestors };
}
/** The class names of one compound segment (pseudo-class arguments left out). */
const classesIn = (seg: string) => [...stripParens(seg).matchAll(/\.((?:\\.|[^\s.:>~+\[\]()])+)/g)].map((m) => unesc(m[1]));
/** A selector's compound segments at paren depth 0, each with the combinator before it (`" "`, `>`, `+` or `~`); `tail` is a combinator the selector ends on. */
function segments(sel: string): { segs: { comb: string; seg: string }[]; tail: string } {
  const segs: { comb: string; seg: string }[] = [];
  let depth = 0;
  let seg = "";
  let comb = " ";
  let sep = "";
  for (let k = 0; k < sel.length; k++) {
    const ch = sel[k];
    if (ch === "\\") {
      seg += ch + (sel[k + 1] ?? "");
      k++;
      continue;
    }
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    if (!depth && /[\s>+~]/.test(ch)) {
      if (seg) {
        segs.push({ comb, seg });
        seg = "";
        sep = "";
      }
      sep += ch;
      continue;
    }
    if (!seg) comb = sep.replace(/\s/g, "") || " ";
    seg += ch;
  }
  if (seg) segs.push({ comb, seg });
  return { segs, tail: seg ? "" : sep.replace(/\s/g, "") };
}
/**
 * Matches a prefix's compounds against an element's ancestors (`chain`, nearest first, each a class
 * set), right to left: a compound's classes must all be on an ancestor above the one matched before
 * (`>` binds to the very next). Classes alone match; a state (`:hover`) is allowed on the root's
 * compound only (the chain's last entry) and comes back as the root's state. Null when no match.
 */
function matchesChain(prefix: string, chain: Set<string>[], below = chain.length): { rootState: string } | null {
  const { segs, tail } = segments(prefix);
  if (/[+~]/.test(tail) || segs.some((s) => /[+~]/.test(s.comb))) return null;
  let rootState = "";
  let from = 0;
  let child = tail === ">";
  for (const { comb, seg } of [...segs].reverse()) {
    const classes = classesIn(seg);
    const extra = removeClasses(seg);
    if (!classes.length) return null;
    const fits = (i: number) => i < below && classes.every((c) => chain[i]?.has(c)) && (!extra || i === chain.length - 1);
    const at = child ? (fits(from) ? from : -1) : chain.findIndex((_, i) => i >= from && fits(i));
    if (at < 0) return null;
    rootState = extra + rootState;
    from = at + 1;
    child = comb === ">";
  }
  return { rootState };
}

/** Position of the first combinator at paren depth 0 (the `+` of `:nth-last-child(n+4)` is the argument's); -1 when the selector is one compound. */
function combinatorAt(sel: string): number {
  let depth = 0;
  for (let k = 0; k < sel.length; k++) {
    const ch = sel[k];
    if (ch === "\\") {
      k++;
      continue;
    }
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    else if (!depth && /[\s>+~]/.test(ch)) return k;
  }
  return -1;
}
/** One selector token: a pseudo-class or pseudo-element with its argument, an attribute, or a class inside an argument (`:not(.indeterminate)`). */
const TOKEN_RE = /::?[a-z-]+(?:\((?:[^()]|\([^()]*\))*\))?|\[[^\]]*\]|\.(?:\\.|[A-Za-z0-9_-])+/g;
/**
 * Applies a {@link StateMap} to a rule's states. A state the reference reaches through a sibling
 * `.peer` moves to the root, `:not()` kept; a group state is already the root's. A token on the
 * element itself is replaced in place, or moved to the root when its value starts with `^`.
 * Returns null when a token maps to null: the rule is dropped.
 */
function applyStates(rootState: string, state: string, states?: StateMap): { rootState: string; state: string; hostState: string } | null {
  if (!states) return { rootState, state, hostState: "" };
  let dropped = false;
  let hostState = "";
  const token = (t: string): string => {
    const not = t.match(/^:not\((.*)\)$/);
    // A class token is looked up unescaped (`.peer\/x` under the key `.peer/x`).
    const key = unesc(not ? not[1] : t);
    if (!(key in states)) return t;
    const v = states[key];
    if (v === null) dropped = true;
    return not ? `:not(${v ?? ""})` : (v ?? "");
  };
  const chain = (s: string) => s.replace(TOKEN_RE, token).replace(/[\^@]/g, "");
  // A root state reached through a group ancestor (a child's rule under `group-not-last/x:`) may map to
  // the host's (`@:last-child`: the root's place among its siblings is the host's in ours): it moves to the
  // host like a token on the element itself does below; a `^` value is already the root's.
  let root = rootState.replace(TOKEN_RE, (t) => {
    const v = token(t);
    const up = v.match(/^(:not\()?@(.*)$/);
    if (!up) return v.replace(/\^/g, "");
    hostState += up[1] ? `:not(${up[2]}` : up[2];
    return "";
  });
  // A named peer with no state of its own (`peer-[&]/x:`) is conditioned on the peer class being there at all: its state is that class token (see the group form in parseState).
  const peer = (name: string, c: string) => chain(c || (name ? `.peer${name}` : ""));
  let own = state.replace(/:not\(:is\(:where\(\.peer((?:\\\/[\w-]+)?)\)((?:[^()]|\([^()]*\))*)~\*\)\)/g, (_, name, c) => {
    root += `:not(${peer(name, c)})`;
    return "";
  });
  own = own.replace(/:is\(:where\(\.peer((?:\\\/[\w-]+)?)\)((?:[^()]|\([^()]*\))*)~\*\)/g, (_, name, c) => {
    root += peer(name, c);
    return "";
  });
  // Tokens on the element itself run up to the first combinator (one at paren depth 0: the `+` of `:nth-last-child(n+4)` is the argument's); beyond it, tokens are replaced in place only.
  const i = combinatorAt(own);
  const head = (i < 0 ? own : own.slice(0, i)).replace(TOKEN_RE, (t) => {
    const v = token(t);
    const up = v.match(/^(:not\()?([\^@])(.*)$/);
    if (!up) return v;
    const moved = up[1] ? `:not(${up[3]}` : up[3];
    if (up[2] === "@") hostState += moved;
    else root += moved;
    return "";
  });
  const rest = i < 0 ? "" : own.slice(i).replace(TOKEN_RE, (t) => (t in states ? (states[t] ?? t) : t));
  return dropped ? null : { rootState: root, state: head + rest, hostState };
}

/** `hostState`: the host's own states (a position among its siblings), see {@link StateMap}. */
type Entry = { at: string; theme: Theme; mod: string; element: string; rootState: string; state: string; hostState: string; /** States on mapped ancestors of the element (see {@link AncestorState}). */ ancestors: AncestorState[]; decls: { text: string; order: number }[] };
type Emitted = Map<string, Entry>;
const ancestorsKey = (a: AncestorState[]) => a.map((x) => `${x.depth}${x.state}`).join(",");
const entryKey = (at: string, theme: Theme, mod: string, element: string, rootState: string, state: string, hostState = "", ancestors: AncestorState[] = []) => [at, theme, mod, element, rootState, state, hostState, ancestorsKey(ancestors)].join("|");
const unesc = (s: string) => s.replace(/\\(.)/g, "$1");
/** Position of the class token `esc` where it names an element of the selector (paren depth 0, the whole token); -1 when it only appears inside an argument (`:not(.x)`). */
function classAt(sel: string, esc: string): number {
  let depth = 0;
  for (let k = 0; k < sel.length; k++) {
    if (sel[k] === "\\") {
      k++;
      continue;
    }
    if (sel[k] === "(") depth++;
    else if (sel[k] === ")") depth--;
    else if (!depth && sel.startsWith(esc, k) && !/[A-Za-z0-9_-]/.test(sel[k + esc.length] ?? "")) return k;
  }
  return -1;
}
/** Every position of the class token `esc` where it names an element of the selector (see {@link classAt}), in order. */
function classPositions(sel: string, esc: string): number[] {
  const out: number[] = [];
  for (let from = 0; ; ) {
    const i = classAt(sel.slice(from), esc);
    if (i < 0) return out;
    out.push(from + i);
    from += i + esc.length;
  }
}
/** Drops parenthesized pseudo-class arguments (their classes belong to other elements); escapes are kept. */
function stripParens(s: string): string {
  let out = "";
  let depth = 0;
  for (let k = 0; k < s.length; k++) {
    const ch = s[k];
    if (ch === "\\") {
      if (!depth) out += ch + (s[k + 1] ?? "");
      k++;
      continue;
    }
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    else if (!depth) out += ch;
  }
  return out;
}
/**
 * A selector that opens with one `:is(a, b, c)` list (the sheet's shorthand for a rule on several
 * selectors) reads as those alternatives, each an element of its own, with whatever follows the
 * list (`:is(a, b) > div`) appended to each.
 */
function alternatives(sel: string): string[] {
  if (!sel.startsWith(":is(")) return [sel];
  let depth = 0;
  const parts: string[] = [];
  let start = 4;
  for (let k = 4; k < sel.length; k++) {
    if (sel[k] === "\\") {
      k++;
      continue;
    }
    if (sel[k] === "(") depth++;
    else if (sel[k] === ")") {
      if (depth-- === 0) {
        const tail = sel.slice(k + 1);
        return [...parts, sel.slice(start, k)].map((s) => s.trim() + tail);
      }
    } else if (sel[k] === "," && depth === 0) {
      parts.push(sel.slice(start, k));
      start = k + 1;
    }
  }
  return [sel];
}
/**
 * Two wrappers the sheet puts around a whole selector come off. A zero-specificity rule
 * (`space-y-6`: `:where(.x > :not(:last-child))`) wraps it in `:where()`, where no class token sits
 * at depth 0 and the rule would find no element: the inner selector stands on its own (an `:is()`
 * list when it holds several alternatives, which {@link alternatives} splits). Tailwind's `*:` and
 * `**:` variants wrap the class in `:is(.x > *)` / `:is(.x *)`: the compound comes out, so the rest
 * reads as a descendant state.
 */
function unwrapStar(sel: string): string {
  if (sel.startsWith(":where(")) {
    let depth = 0;
    let list = false;
    for (let k = 6; k < sel.length; k++) {
      if (sel[k] === "\\") {
        k++;
        continue;
      }
      if (sel[k] === "(") depth++;
      else if (sel[k] === ")") {
        if (--depth === 0) {
          if (k === sel.length - 1) return unwrapStar(list ? `:is(${sel.slice(7, k)})` : sel.slice(7, k));
          break;
        }
      } else if (sel[k] === "," && depth === 1) list = true;
    }
  }
  if (!sel.startsWith(":is(")) return sel;
  let depth = 0;
  for (let k = 3; k < sel.length; k++) {
    if (sel[k] === "\\") {
      k++;
      continue;
    }
    if (sel[k] === "(") depth++;
    else if (sel[k] === ")" && --depth === 0) {
      const m = sel.slice(4, k).match(/^(.*?)(\s*>\s*\*|\s+\*)$/);
      return m ? m[1] + m[2] + sel.slice(k + 1) : sel;
    }
  }
  return sel;
}
/** A compound segment without its class selectors; pseudo-class arguments stay intact. */
function removeClasses(seg: string): string {
  let out = "";
  let depth = 0;
  for (let k = 0; k < seg.length; k++) {
    const ch = seg[k];
    if (ch === "\\") {
      out += ch + (seg[k + 1] ?? "");
      k++;
      continue;
    }
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    if (!depth && ch === ".") {
      k++;
      while (k < seg.length && !/[\s.:>~+\[\]()]/.test(seg[k])) {
        if (seg[k] === "\\") k++;
        k++;
      }
      k--;
      continue;
    }
    out += ch;
  }
  return out;
}
/** The compound segment that contains position i of a selector, and the classes on that element. */
function compoundAt(sel: string, i: number): { start: number; end: number; classes: string[] } {
  const depthAt: number[] = [];
  const escaped: boolean[] = [];
  let d = 0;
  for (let k = 0; k < sel.length; k++) {
    if (sel[k] === "\\") {
      depthAt[k] = d;
      depthAt[k + 1] = d;
      escaped[k + 1] = true; // an escaped combinator character belongs to a class name
      k++;
      continue;
    }
    if (sel[k] === "(") d++;
    depthAt[k] = d;
    if (sel[k] === ")") d--;
  }
  const boundary = (k: number) => /[\s>+~]/.test(sel[k]) && depthAt[k] === 0 && !escaped[k];
  let start = i;
  while (start > 0 && !boundary(start - 1)) start--;
  let end = i;
  while (end < sel.length && !boundary(end)) end++;
  const classes = [...stripParens(sel.slice(start, end)).matchAll(/\.((?:\\.|[^\s.:>~+\[\]()])+)/g)].map((m) => unesc(m[1]));
  return { start, end, classes };
}
const FAMILIES: Record<string, RegExp> = {
  shadow: /^--tw-(inset-shadow|inset-ring-shadow|ring-offset-shadow|ring-shadow|shadow)$/,
  transform: /^--tw-(translate-[xyz]|rotate-[xyz]?|skew-[xy]?|scale-[xyz]?)$/,
  filter: /^--tw-(blur|brightness|contrast|grayscale|hue-rotate|invert|saturate|sepia|drop-shadow)$/,
};
type Setters = Map<string, Map<string, Set<string>>>; // element|family -> member -> mods
/** A class token as the sheet writes it; the root's marker attribute (`[data-grid]`, a bare attribute token) is a token of its own. */
const tokenSel = (cls: string) => (/^\[[\w-]+\]$/.test(cls) ? cls : `.${cls.replace(/([^A-Za-z0-9_-])/g, "\\$1")}`);
type EmitOptions = {
  /** The tag of the roots this group styles; a rule qualified by a type selector (`button.geist-reset`) applies to that tag only. */
  tag?: string;
  context?: Record<string, string | null>;
  /** The root's marker attribute token: a rule that names the root by it is the root's, the marker read as its tag. */
  marker?: string;
  /** Classes of an element this one extends: only their descendant rules (`.block > div`, into this element's own tree) are emitted. */
  inherited?: Set<string>;
  /** A mapped child's ancestors' classes, nearest first (the root last), common to the group: a leftover ancestor prefix must match them (see {@link matchesChain}). */
  chain?: Set<string>[];
  /** Classes the mapped children carry: a descendant rule whose tail names one is that child's, emitted on its side. */
  mapped?: Set<string>;
  /** Classes taken from an ancestor (see GeistMap.fromAncestor): their rules style this element as the ancestor's child. */
  fromAncestor?: (cls: string) => boolean;
  /** Tails that cross into a composed child's shadow tree (see {@link GeistMap.crossing}): a rule ending on one is left out and reported. */
  crossing?: string[];
  /** An outer ancestor's classes (see {@link GeistMap.outer}): only a rule whose tail ends on one of these nodes (this element's tree) is emitted. */
  reach?: SpecNode[];
  /** See {@link GeistMap.groupOnAncestor}. */
  groupOnAncestor?: boolean;
  /** The reference compounds of slotted content (the keys of {@link GeistMap.slotted}): a context ancestor's rule that ends on one is emitted on the ancestor's side, through the slot. */
  slotted?: string[];
  /** Whether each ancestor level of a mapped child (nearest first, the root last) has a selector of ours: an ancestor state lands on a level's segment only when it has one. */
  levels?: boolean[];
  /** Whether the element has a segment of its own (a part with no `ours` renders on its parent's tag). */
  ownSeg?: boolean;
  /** Classes carried above the element in the spec (its ancestors', the roots' ancestors' included): a group variant on an element carrying the group class itself needs one of these to match. */
  above?: Set<string>;
  /** The group classes carried by any member's ancestor at each level (nearest first), where `chain` keeps those every member shares. */
  groups?: Set<string>[];
  /** The reference nodes the group styles: a child rule that weighs nothing is checked against their children's own utilities. */
  nodes?: SpecNode[];
};
/**
 * A `@supports` test for a color space every current engine has (lab, oklch, display-p3, color-mix
 * and gradients in lab) holds in the browsers ours runs in, as the theme's own overrides do (see
 * tw.ts rootVars). A conditional rule that sets only `--tw-*` variables under such a test (the lab
 * value of a gradient stop) cannot stand as a block of its own: the simplifier folds the variables
 * into the properties that read them, in the unconditional rule, so the block would come out empty
 * and the override lost. Its declarations join the unconditional entry instead, after the rule they
 * override (sheet order keeps them later), and the test drops off the at-rule prefix. A conditional
 * rule that sets a property keeps its block: the browser applies it as it stands.
 */
const MODERN_COLOR = /^@supports \((?:color:(?:lab|oklch|color\(display-p3|color-mix\(in lab)|background-image:linear-gradient\(in lab)/;
const foldSupports = (at: string, decl: string) =>
  decl.split(/;(?![^(]*\))/).every((d) => !d.trim() || d.trim().startsWith("--tw-"))
    ? at
        .split(/\s+(?=@)/)
        .filter((a) => !MODERN_COLOR.test(a))
        .join(" ")
    : at;
/** The child compound a rule's tail ends on (`> li:not(:last-child)`): its tag and its own states; null when the tail reaches elsewhere. */
const childOf = (tail: string) => {
  const m = tail.match(/^\s*>\s*([a-zA-Z][\w-]*|\*)?((?:\[[^\]]*\]|:[a-z-]+(?:\((?:[^()]|\([^()]*\))*\))?)*)$/);
  return m ? { tag: m[1], state: m[2] } : null;
};
function emit(into: Emitted, setters: Setters, mod: string, element: string, classes: string[], ignore: Set<string>, report: { unresolved: Set<string>; dropped?: Set<string>; crossing?: Set<string>; inert?: Set<string> }, present: Set<string>, states?: StateMap, opts: EmitOptions = {}) {
  const { tag, context = {}, marker, inherited, chain, mapped, fromAncestor, crossing, reach, groupOnAncestor, slotted = [], levels, ownSeg = true, above, groups, nodes } = opts;
  /** A base rule of the class on the node itself (no ancestor, no state, no tail, no condition): the node's own value for its properties. */
  const ownRule = (c: string, r: ReturnType<typeof resolve>[number]) =>
    !/@(media|supports|container)/.test(r.at) &&
    alternatives(unwrapStar(r.sel)).some((s) => {
      const at = classAt(s, tokenSel(c));
      if (at < 0) return false;
      const { start, end } = compoundAt(s, at);
      return end >= s.length && !s.slice(0, start).trim() && removeClasses(s.slice(start, end)).replace(/^[a-zA-Z][\w-]*/, "") === "";
    });
  // A tail ending on slotted content (`.geist-disabled svg`, `[data-geist-button]`): the slot rewrite reaches it from this element.
  const endsOnSlotted = (tail: string) => {
    const target = lastCompound(tail);
    return !!target && slotted.some((k) => new RegExp(`^\\*?${k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w-])`).test(target));
  };
  const rules = classes
    .filter((c) => !ignore.has(c))
    .flatMap((c) => {
      const rs = resolve(c);
      if (!rs.length && !/^(group\/|peer\/|tailwind)/.test(c)) report.unresolved.add(c);
      // The class token at each of its occurrences (`.stripe .stripe`: the outer one is an ancestor's, the inner one this element's).
      return rs.flatMap((r) => alternatives(unwrapStar(r.sel)).flatMap((sel) => classPositions(sel, tokenSel(c)).map((i) => ({ rule: r, cls: c, sel, i }))));
    })
    .filter(({ rule, sel, cls, i }) => {
      // A compound rule (".a.b") applies only when every class of the compound is on the element; emit it once.
      // A class named only inside an argument (`:not(.x)`) belongs to another rule's element.
      const { classes: comp, start, end } = compoundAt(sel, i);
      if (!comp.every((k) => present.has(k))) return false;
      // A context compound the element carries in full is its own: the rule continues to a descendant and is emitted there.
      if (start > 0 && segments(sel.slice(0, start)).segs.some(({ seg }) => seg in context && classesIn(seg).length > 0 && classesIn(seg).every((k) => present.has(k)))) return false;
      // A tail that names a mapped child's class is that child's rule.
      if (end < sel.length && mapped && classesIn(sel.slice(end)).some((k) => mapped.has(k))) return false;
      // A type selector on the compound scopes the rule to elements of that tag.
      const type = sel.slice(start, end).match(/^[a-zA-Z][\w-]*/)?.[0];
      if (type && tag && type.toLowerCase() !== tag) return false;
      // An outer ancestor's rule is this element's only when its tail ends on a node of this tree; without a tail it is the ancestor's own box.
      if (reach) {
        const target = end < sel.length ? lastCompound(sel.slice(end)) : null;
        if (!target || !reach.some((n) => nodeMatches(target, n))) return false;
      }
      // A class taken from an ancestor styles this element as the ancestor's child: the rule must end on that child, of this element's tag.
      if (fromAncestor?.(cls)) {
        const child = childOf(sel.slice(end));
        if (!child || (child.tag && child.tag !== "*" && tag && child.tag !== tag)) return false;
      }
      // A node carrying the reference's theme class is a local theme scope: it takes the theme's token
      // block (the rules on the class alone); a rule for another class under that scope belongs to that class.
      if (THEME_CLASSES.has(cls) && (start > 0 || end < sel.length)) return false;
      // A context ancestor's descendant rule is the descendant's (or out of reach), unless it ends on slotted content, which only this side reaches; an extended class keeps its descendant rules only.
      if (end < sel.length && sel.slice(start, end) in context && !endsOnSlotted(sel.slice(end))) return false;
      if (inherited?.has(cls) && end >= sel.length) return false;
      // A tail that crosses into a composed child's shadow tree (see GeistMap.crossing) is that element's: its mapping emits the rule through `outer`.
      if (crossing && end < sel.length) {
        const target = lastCompound(sel.slice(end));
        if (target && crossing.some((k) => target.includes(k))) {
          report.crossing?.add(sel);
          return false;
        }
      }
      // An empty `:is()` (a variant the reference's compiler resolved to no selector, `[::-webkit-full-screen]:`) matches no element in the reference: the rule is left out and reported.
      if (/:is\(\s*\)/.test(sel)) {
        report.inert?.add(sel);
        return false;
      }
      // A group variant on the element that carries the group class itself (`group-focus-within/x:` on the `.group/x` element)
      // compiles to a descendant form (`:is(:where(.group/x):focus-within *)`) that matches only under an outer element with that
      // class: where nothing above the element in the reference carries it, the rule matches no element there, and is left out and reported.
      const ownGroup = [...sel.slice(start, end).matchAll(new RegExp(GROUP_FORM, "g"))].find((m) => !sel.slice(0, start + (m.index ?? 0)).endsWith(":not(") && present.has(`group${unesc(m[1])}`) && !above?.has(`group${unesc(m[1])}`));
      if (ownGroup) {
        report.inert?.add(sel);
        return false;
      }
      // A rule the sheet wraps whole in `:where()` weighs nothing: a child it reaches that carries a utility of its own for
      // one of its properties (`m-0` on a button under `space-x-2`) keeps its own value in the reference, whatever the order.
      // Where every child the tail names is such a child, the rule reaches nothing there: left out and reported.
      if (nodes && end < sel.length && rule.sel.startsWith(":where(") && specificity(rule.sel) === 0) {
        const child = childOf(sel.slice(end));
        const targets = child ? nodes.flatMap((n) => n.children.filter((k) => nodeMatches(`${child.tag ?? ""}${child.state}`, k))) : [];
        const props = parseDecls(rule.decl).map((d) => d.prop);
        const order = ruleOrder.get(rule) ?? 0;
        const outranked = (k: SpecNode) => [...classesOf(k)].some((c) => resolve(c).some((r2) => (ruleOrder.get(r2) ?? 0) > order && ownRule(c, r2) && parseDecls(r2.decl).some((d) => props.some((p) => overlaps(p, d.prop)))));
        if (targets.length && targets.every(outranked)) {
          report.inert?.add(sel);
          return false;
        }
      }
      // A marker-named rule is the root's own under the ancestors the map declares as context (and the theme wrappers) alone.
      if (cls === marker && start > 0) {
        const ancestors = sel
          .slice(0, start)
          .replace(/html:not\(\.dark-theme\)|\.dark-theme|^\.dark(?=\s)/g, "")
          .split(/[\s>+~]+/)
          .filter(Boolean);
        if (!ancestors.every((a) => a in context)) return false;
      }
      return true;
    })
    // One rule reached at two positions of its class (`.stripe .stripe`) is emitted once, from the first position that passed.
    .filter((r, idx, arr) => arr.findIndex((o) => o.rule === r.rule && o.sel === r.sel) === idx)
    // A rule the sheet repeats (the same selector, at-rule and declarations again in a later file)
    // stands where its last copy does: the cascade takes the last, so a rule between the copies
    // (`--ds-background-100:#000` between the two `hsla(var(--ds-background-100-value), 1)` blocks
    // of the inverted theme) yields to it.
    .filter((r, idx, arr) => arr.findLastIndex((o) => o.sel === r.sel && o.rule.at === r.rule.at && o.rule.decl === r.rule.decl) === idx)
    .sort((a, b) => (ruleOrder.get(a.rule) ?? 0) - (ruleOrder.get(b.rule) ?? 0));
  for (const { rule: r, sel, i, cls } of rules) {
    const { start, end } = compoundAt(sel, i);
    // The compound segment's other classes are on the same element: keep only its non-class parts as the state; its type selector (or the marker) is the element's own and drops out.
    const segState = removeClasses(sel.slice(start, end))
      .replace(/^[a-zA-Z][\w-]*/, "")
      .replace(marker ?? /^$/, "");
    // A class taken from an ancestor: the compound is the ancestor's, and the child it ends on is this element, with that child's own states.
    const child = fromAncestor?.(cls) ? childOf(sel.slice(end)) : null;
    const parsed = parseState(start > 0 ? sel.slice(0, start).trim() : "", child ? child.state : segState + sel.slice(end), context, chain, groupOnAncestor, levels, groups);
    if (parsed.unmatched) report.dropped?.add(`${element.trim()} ← ${sel}`);
    if (parsed.theme === "skip") continue;
    const st = applyStates(parsed.rootState, parsed.state, states);
    if (!st) continue;
    // An ancestor's state is translated like the root's; a token that maps to null drops the rule. The ancestor's
    // segment is counted from the end of the element's selector: the element's own (when it has one), then one per level with a selector.
    const ancestors: AncestorState[] = [];
    for (const a of parsed.ancestors ?? []) {
      const t = applyStates(a.state, "", states);
      if (t) ancestors.push({ depth: a.depth, seg: (ownSeg ? 1 : 0) + (levels ?? []).slice(0, a.depth).filter(Boolean).length, state: t.rootState });
    }
    if (ancestors.length < (parsed.ancestors?.length ?? 0)) continue;
    const p = { theme: parsed.theme, ...st };
    const at = foldSupports(r.at.replace(/@layer [a-z]+\s*/g, "").trim(), r.decl);
    const key = entryKey(at, p.theme, mod, element, p.rootState, p.state, p.hostState, ancestors);
    const e = into.get(key) ?? into.set(key, { at, theme: p.theme, mod, element, rootState: p.rootState, state: p.state, hostState: p.hostState, ancestors, decls: [] }).get(key)!;
    e.decls.push({ text: r.decl.replace(/;$/, ""), order: ruleOrder.get(r) ?? 0 });
    for (const [fam, re] of Object.entries(FAMILIES))
      for (const m of r.decl.matchAll(/--tw-[a-z-]+(?=\s*:)/g))
        if (re.test(m[0])) {
          const k = `${element || "root"}|${fam}`;
          const members = setters.get(k) ?? setters.set(k, new Map()).get(k)!;
          (members.get(m[0]) ?? members.set(m[0], new Set()).get(m[0])!).add(mod);
        }
  }
}

const classesOf = (n: SpecNode) => new Set(n.styles.map((s) => s.cls).concat(n.unresolved));
/** The classes every member of a group carries: a compound rule applies to the group only when its other classes are among them. */
const carriedByAll = (members: Set<Labeled>) => {
  const sets = [...members].map((l) => classesOf(l.node));
  return new Set([...(sets[0] ?? [])].filter((c) => sets.every((s) => s.has(c))));
};
/** A modifier's meaning: prop -> the values it admits. */
type Cons = Record<string, string[]>;
/** Prop Q -> the props whose classes Q's non-default values displace in the reference (Q's rules come after theirs). */
type Dominance = Map<string, Set<string>>;
type Assigned = Map<string, { classes: string[]; cons: Cons; members: Set<Labeled> }>;

/**
 * Assigns every class of a set of labeled nodes to the widest group of nodes that all carry it:
 * the whole set (the base), the nodes whose prop takes one of a subset of values (its modifier,
 * `:not(...)` of the excluded values, or `:is(...)` of the admitted ones), or a pair of such
 * groups on two props. A class present on more nodes than any group covers is split across
 * groups; what no group covers is reported. Returns modifier -> classes and its constraints.
 */
function assign(items: Labeled[], propMods: Record<string, Record<string, string>>, report: string[], label: string, defaults: Record<string, string>, dominates: Dominance, ignore: Set<string> = new Set(), prefer: string[] = []): Assigned {
  const out: Assigned = new Map();
  // A group on a preferred prop (see ChildMap.owns) ranks before one on any other prop of the same width.
  const rank = (cons: Cons) => Math.min(...Object.keys(cons).map((p) => (prefer.includes(p) ? prefer.indexOf(p) : prefer.length)));
  const put = (mod: string, cons: Cons, members: Set<Labeled>, c: string) => (out.get(mod) ?? out.set(mod, { classes: [], cons, members }).get(mod)!).classes.push(c);
  const all = new Set(items.flatMap((l) => [...classesOf(l.node)]).filter((c) => !ignore.has(c)));
  const withClass = (c: string) => new Set(items.filter((l) => classesOf(l.node).has(c)));
  type Group = { mod: string; cons: Cons; members: Set<Labeled> };
  const simple = (m: string) => /^([.:][a-z-]+|\[[a-z-]+(?:="[^"]*")?\])$/i.test(m); // one class, pseudo-class or attribute, usable inside :not()/:is()
  const single: Group[] = [];
  for (const [prop, values] of Object.entries(propMods)) {
    const present = Object.keys(values).filter((v) => items.some((l) => l.props[prop] === v));
    if (present.length < 2) continue;
    for (let mask = 1; mask < (1 << present.length) - 1; mask++) {
      const admitted = present.filter((_, i) => mask & (1 << i));
      const excluded = Object.keys(values).filter((v) => !admitted.includes(v));
      let mod: string;
      if (admitted.length === 1) mod = values[admitted[0]];
      else if (excluded.every((v) => simple(values[v]))) mod = `:not(${excluded.map((v) => values[v]).join(",")})`;
      else if (admitted.every((v) => simple(values[v]))) mod = `:is(${admitted.map((v) => values[v]).join(",")})`;
      else continue;
      if (!mod) continue;
      single.push({ mod, cons: { [prop]: admitted }, members: new Set(items.filter((l) => admitted.includes(l.props[prop]))) });
    }
  }
  const pairs: Group[] = [];
  for (let a = 0; a < single.length; a++)
    for (let b = a + 1; b < single.length; b++) {
      if (Object.keys(single[a].cons)[0] === Object.keys(single[b].cons)[0]) continue;
      const members = new Set([...single[a].members].filter((l) => single[b].members.has(l)));
      if (members.size) pairs.push({ mod: single[a].mod + single[b].mod, cons: { ...single[a].cons, ...single[b].cons }, members });
    }
  const subset = (g: Set<Labeled>, r: Set<Labeled>) => [...g].every((l) => r.has(l));
  // A group constrained on several props that admits only the default of one of them (P=V and
  // Q=default) is evidence that Q's other values displaced the class: the reference merges Q's
  // classes after P's, so Q's rules must follow P's in our cascade wherever they conflict.
  const learn = (cons: Cons) => {
    const constrained = Object.keys(cons).filter((p) => cons[p].length < Object.keys(propMods[p]).length);
    const nonDefault = constrained.filter((p) => !cons[p].includes(defaults[p]));
    for (const q of constrained)
      if (cons[q].length === 1 && cons[q][0] === defaults[q])
        for (const p of nonDefault) (dominates.get(q) ?? dominates.set(q, new Set()).get(q)!).add(p);
  };
  const leftovers: string[] = [];
  for (const c of all) {
    let remaining = withClass(c);
    if (remaining.size === items.length) {
      put("", {}, new Set(items), c);
      continue;
    }
    // One group whose members are exactly the class's carriers explains the class in full (a pair of
    // value sets: `:not(.secondary):not(.unstyled)`, every non-secondary styled button): it is taken
    // over a union of narrower groups, each of which would also fire on a combination the reference
    // never renders (a secondary square button taking the square group's hover).
    const exact = [...single, ...pairs]
      .filter((g) => g.members.size === remaining.size && subset(g.members, remaining))
      .sort((a, b) => rank(a.cons) - rank(b.cons) || Object.keys(a.cons).length - Object.keys(b.cons).length || a.mod.length - b.mod.length)[0];
    if (exact) {
      put(exact.mod, exact.cons, exact.members, c);
      if (pairs.includes(exact)) learn(exact.cons);
      continue;
    }
    // Widest group first (the simpler modifier on a tie), then pairs, until the class's nodes are covered.
    for (const pool of [single, pairs]) {
      const candidates = pool.filter((g) => subset(g.members, remaining)).sort((a, b) => b.members.size - a.members.size || rank(a.cons) - rank(b.cons) || a.mod.length - b.mod.length);
      for (const g of candidates) {
        if (!subset(g.members, remaining)) continue;
        put(g.mod, g.cons, g.members, c);
        if (pool === pairs) learn(g.cons);
        remaining = new Set([...remaining].filter((l) => !g.members.has(l)));
        if (!remaining.size) break;
      }
      if (!remaining.size) break;
    }
    // Last resort: the tightest constraint that admits the remaining members (one value set per
    // prop), then widened prop by prop while the group stays within the class's carriers, so a
    // class on three props' worth of roots gets `.a.b:not(.c)` rather than one rule per exact
    // signature. Members that share a signature are indistinguishable in our DOM, so a class only
    // some of them carry is a reference inconsistency, and is reported.
    if (remaining.size) {
      const carriers = withClass(c);
      const consOf = (ls: Iterable<Labeled>): Cons => Object.fromEntries(Object.keys(propMods).map((prop) => [prop, [...new Set([...ls].map((l) => l.props[prop]))]]));
      const membersOf = (cons: Cons) => new Set(items.filter((l) => Object.entries(cons).every(([p, vs]) => vs.includes(l.props[p]))));
      const modOf = (cons: Cons): string | null => {
        let mod = "";
        for (const [prop, admitted] of Object.entries(cons)) {
          const all = Object.keys(propMods[prop]);
          const excluded = all.filter((v) => !admitted.includes(v));
          if (!excluded.length) continue; // every mapped value admitted (an unmapped value, e.g. a tag alias, adds no constraint)
          if (admitted.length === 1) mod += propMods[prop][admitted[0]];
          else if (excluded.every((v) => simple(propMods[prop][v]))) mod += `:not(${excluded.map((v) => propMods[prop][v]).join(",")})`;
          else if (admitted.every((v) => simple(propMods[prop][v]))) mod += `:is(${admitted.map((v) => propMods[prop][v]).join(",")})`;
          else return null;
        }
        return mod;
      };
      const widen = (seed: Set<Labeled>) => {
        let cons = consOf(seed);
        if (!subset(membersOf(cons), carriers)) return false;
        // A preferred prop's constraint is the last to be dropped.
        for (const prop of Object.keys(cons).sort((a, b) => rank({ [b]: [] }) - rank({ [a]: [] }))) {
          const { [prop]: _, ...rest } = cons;
          if (subset(membersOf(rest), carriers)) cons = rest;
        }
        const mod = modOf(cons);
        if (mod === null) return false;
        const members = membersOf(cons);
        learn(cons);
        put(mod, cons, members, c);
        remaining = new Set([...remaining].filter((l) => !members.has(l)));
        return true;
      };
      if (!widen(remaining)) {
        // Unrelated clusters: one group per exact signature.
        const sig = (l: Labeled) => Object.keys(propMods).map((prop) => l.props[prop]).join("|");
        const bySig = new Map<string, Labeled[]>();
        for (const l of remaining) (bySig.get(sig(l)) ?? bySig.set(sig(l), []).get(sig(l))!).push(l);
        for (const [s, members] of bySig) {
          const same = items.filter((l) => sig(l) === s);
          if (same.length !== members.length || !widen(new Set(members))) leftovers.push(`${c} (${members.length} of ${same.length} with ${modOf(consOf(members)) || "no modifier"})`);
        }
      }
    }
  }
  if (leftovers.length) report.push(`${label}: no prop group covers: ${leftovers.join("  ")}`);
  return out;
}

// The longhands a property sets (`atoms`, in simplify.ts): two declarations of overlapping properties are ordered like the reference.
const overlaps = (p: string, q: string) => {
  const a = atoms(p);
  const b = atoms(q);
  return a.some((x) => b.some((y) => x === y || x.startsWith(`${y}-`) || y.startsWith(`${x}-`)));
};

type Out = Omit<Entry, "decls"> & { decls: Decl[]; idx: number; cons: Cons };
const descendant = (s: string) => {
  const i = s.search(/[\s>+~]/);
  return i < 0 ? "" : s.slice(i);
};
/** The pseudo-element a state ends on (`:before`, `::after`, `::-webkit-scrollbar`): a box of its own, so rules on different ones never meet. */
const pseudoOf = (s: string) => s.match(/::?(before|after|marker|placeholder|backdrop|selection|first-line|first-letter|-webkit-[a-z-]+)(?![\w-])/)?.[1] ?? "";
/** Two rules can match one element when they target the same element (the same pseudo-element, if any) and no prop constraint contradicts. */
const coMatch = (a: Out, b: Out) =>
  a.element === b.element &&
  descendant(a.state) === descendant(b.state) &&
  pseudoOf(a.state) === pseudoOf(b.state) &&
  !(a.theme && b.theme && a.theme !== b.theme) &&
  Object.entries(a.cons).every(([p, vs]) => !(p in b.cons) || vs.some((v) => b.cons[p].includes(v)));

/**
 * Orders the rules like the reference cascade. Every modifier is wrapped in :where(), so rules
 * that can match one element tie on specificity, and source order decides between them the way
 * the reference's flat utility order does. The order is a topological sort of the conflicts
 * (overlapping properties of co-matching rules, ordered by reference rule order). When that has
 * a cycle, the rules are split per declaration, which always orders.
 */
function order(outs: Out[], report: string[], label: string, defaults: Record<string, string>, dominates: Dominance, items: Labeled[], propMods: Record<string, Record<string, string>>): Out[] {
  // Evidence that says both "Q after P" and "P after Q" is no evidence: drop both directions and say so.
  const contradictory = [...dominates].flatMap(([q, ps]) => [...ps].filter((p) => dominates.get(p)?.has(q)).map((p) => [q, p] as [string, string]));
  for (const [q, p] of contradictory) dominates.get(q)?.delete(p);
  if (contradictory.length) report.push(`${label}: contradictory merge-order evidence dropped: ${[...new Set(contradictory.map(([q, p]) => [q, p].sort().join(" vs ")))].join(", ")}`);
  const explode = (list: Out[]) => list.flatMap((o) => o.decls.map((d) => ({ ...o, decls: [d] })));
  // Where the reference renders a root that both rules match, its class list is the truth and the
  // sheet order stands. Where it renders none, the learned merge order decides: a is constrained
  // to a non-default value of a prop Q whose classes displace another prop P's classes, and b is
  // constrained on P and not on Q's non-default values.
  const matches = (cons: Cons, l: Labeled) => Object.entries(cons).every(([p, vs]) => vs.includes(l.props[p]));
  const coexist = (a: Out, b: Out) => items.some((l) => matches(a.cons, l) && matches(b.cons, l));
  const nonDefault = (o: Out, p: string) => o.cons[p] && !o.cons[p].includes(defaults[p]);
  const constrained = (o: Out, p: string) => o.cons[p] && o.cons[p].length < Object.keys(propMods[p]).length;
  const displaces = (a: Out, b: Out) => !coexist(a, b) && [...dominates].some(([q, ps]) => nonDefault(a, q) && !nonDefault(b, q) && [...ps].some((p) => constrained(b, p)));
  const sort = (list: Out[], learned = true): Out[] | null => {
    const after = list.map(() => new Set<number>());
    const indeg = list.map(() => 0);
    const edge = (a: number, b: number) => {
      if (after[a].has(b)) return;
      after[a].add(b);
      indeg[b]++;
    };
    for (let i = 0; i < list.length; i++)
      for (let j = i + 1; j < list.length; j++) {
        if (!coMatch(list[i], list[j])) continue;
        for (const da of list[i].decls)
          for (const db of list[j].decls) {
            if (da.important !== db.important || da.order === db.order || !overlaps(da.prop, db.prop)) continue;
            const iAfter = learned && displaces(list[i], list[j]);
            const jAfter = learned && displaces(list[j], list[i]);
            if (iAfter !== jAfter) edge(jAfter ? i : j, jAfter ? j : i);
            else if (cascadeKey(da) < cascadeKey(db)) edge(i, j);
            else edge(j, i);
          }
      }
    const minOrder = list.map((o) => Math.min(...o.decls.map((d) => d.order ?? 0)));
    const done: Out[] = [];
    const ready = list.map((_, i) => i).filter((i) => !indeg[i]);
    while (ready.length) {
      ready.sort((a, b) => minOrder[a] - minOrder[b] || list[a].idx - list[b].idx);
      const i = ready.shift()!;
      done.push(list[i]);
      for (const j of after[i]) if (!--indeg[j]) ready.push(j);
    }
    return done.length === list.length ? done : null;
  };
  const grouped = sort(outs);
  if (grouped) return grouped;
  report.push(`${label}: the reference cascade needs interleaved rules; declarations were split to keep its order`);
  let split = sort(explode(outs));
  if (!split) {
    // The learned merge order is a heuristic for roots the reference never renders together; when
    // it contradicts the sheet order it is dropped for this element and the sheet order stands.
    split = sort(explode(outs), false);
    if (split) report.push(`${label}: the learned merge order contradicts the sheet order and was dropped (${[...dominates].map(([q, ps]) => `${q} after ${[...ps].join(",")}`).join("; ")})`);
  }
  if (!split) {
    // Name the rules that never became ready: they hold the cycle.
    const stuck = cycleMembers(explode(outs));
    const learned = [...dominates].map(([q, ps]) => `${q} after ${[...ps].join(",")}`).join("; ");
    throw new Error(`${label}: cascade order has a cycle even per declaration (learned merge order: ${learned || "none"}):\n  ${stuck.join("\n  ")}`);
  }
  // Neighbours with one selector and at-rule fold back into one rule.
  const merged: Out[] = [];
  for (const o of split) {
    const last = merged[merged.length - 1];
    if (last && last.at === o.at && last.theme === o.theme && last.mod === o.mod && last.element === o.element && last.rootState === o.rootState && last.state === o.state && last.hostState === o.hostState && ancestorsKey(last.ancestors) === ancestorsKey(o.ancestors)) last.decls.push(...o.decls);
    else merged.push({ ...o, decls: [...o.decls] });
  }
  return merged;
}

/** The children of a parent node that a child map picks: the one at an index, the first the predicate accepts, or (`all`) every one. */
function pickChildren(cm: ChildMap, kids: SpecNode[]): SpecNode[] {
  const pick = cm.pick;
  const found = typeof pick === "number" ? [kids[pick]] : cm.all ? kids.filter((k, i) => pick(k, i, kids)) : [kids.find((k, i) => pick(k, i, kids))];
  return found.filter(Boolean) as SpecNode[];
}
/** Every class the roots of a mapping carry across its examples: that element's own class universe. */
function rootClasses(map: GeistMap): Set<string> {
  const spec = JSON.parse(fs.readFileSync(path.join(specDir, `${map.page}.json`), "utf8")) as Spec;
  const isRoot = typeof map.root === "string" ? (n: SpecNode) => map.root as string in n.attrs : map.root;
  return new Set(spec.examples.flatMap((ex) => findRoots(ex.dom, isRoot, [], map.nested).flatMap((n) => [...classesOf(n)])));
}
/**
 * The classes a mapped element's node carries: its roots (an empty path), or the child its
 * child maps reach by `ours` path (`["textarea"]`), picked level by level through the roots.
 */
function ownClasses(name: string, map: GeistMap, ours: string[]): Set<string> {
  if (!ours.length) return rootClasses(map);
  const spec = JSON.parse(fs.readFileSync(path.join(specDir, `${map.page}.json`), "utf8")) as Spec;
  const isRoot = typeof map.root === "string" ? (n: SpecNode) => map.root as string in n.attrs : map.root;
  let nodes = spec.examples.flatMap((ex) => findRoots(ex.dom, isRoot, [], map.nested));
  let maps = map.children ?? [];
  for (const seg of ours) {
    const cm = maps.find((c) => c.ours === seg);
    if (!cm) throw new Error(`${name}: no child "${seg}" in the mapping (extends path ${ours.join("/")})`);
    nodes = nodes.flatMap((n) => pickChildren(cm, n.children));
    maps = cm.children ?? [];
  }
  return new Set(nodes.flatMap((n) => [...classesOf(n)]));
}
/**
 * The nodes a mapped element's own child maps reach below one of its nodes (see {@link ownClasses}
 * for the path): the composed element's module styles them itself, so a descendant rule of that
 * node ending on one of them (`[&_svg_path]` on a checkbox's box) is not re-emitted by a parent.
 */
function ownBelow(name: string, map: GeistMap, ours: string[]): SpecNode[] {
  const spec = JSON.parse(fs.readFileSync(path.join(specDir, `${map.page}.json`), "utf8")) as Spec;
  const isRoot = typeof map.root === "string" ? (n: SpecNode) => map.root as string in n.attrs : map.root;
  let nodes = spec.examples.flatMap((ex) => findRoots(ex.dom, isRoot, [], map.nested));
  let maps = map.children ?? [];
  for (const seg of ours) {
    const cm = maps.find((c) => c.ours === seg);
    if (!cm) throw new Error(`${name}: no child "${seg}" in the mapping (extends path ${ours.join("/")})`);
    nodes = nodes.flatMap((n) => pickChildren(cm, n.children));
    maps = cm.children ?? [];
  }
  const below = (cms: ChildMap[], parents: SpecNode[]): SpecNode[] =>
    cms.flatMap((cm) => {
      const picked = parents.flatMap((p) => pickChildren(cm, p.children));
      return [...picked, ...below(cm.children ?? [], picked)];
    });
  return below(maps, nodes);
}

/**
 * Whether a composed element's class reaches only beyond its own tree. Its descendant rules
 * (`[&_svg]`) reach into what is slotted to it in the reference; ours cannot reach a slotted
 * subtree's inside from the composed element's shadow tree, so those rules are emitted on the
 * composing element's own tree. A sibling rule (`[&+span]`) reaches outside its tree the same way.
 * A child rule (`[&>input]`) does not: the child is its own shadow child or a node slotted straight
 * into it, both of which its own module reaches; nor does a rule ending on a node the composed
 * element's own map covers (`reached`: `[&_svg_path]` on a checkbox's box, whose svg is its shadow child).
 */
function deepReach(c: string, reached: SpecNode[]): boolean {
  const rs = resolve(c);
  return (
    rs.length > 0 &&
    rs.every((r) => {
      const sel = unwrapStar(r.sel);
      const i = classAt(sel, `.${c.replace(/([^A-Za-z0-9_-])/g, "\\$1")}`);
      if (i < 0) return false;
      const tail = sel.slice(compoundAt(sel, i).end);
      const target = lastCompound(tail);
      return /^(?:\s+|\s*[+~]\s*)[a-zA-Z*]/.test(tail) && !(target && reached.some((n) => nodeMatches(target, n)));
    })
  );
}
/** The nodes of this element's own tree under `parents`: those the child maps with a selector of ours pick, and everything under them (a level with no selector is the composed element's). */
function ownTree(cms: ChildMap[] | undefined, parents: SpecNode[]): SpecNode[] {
  return (cms ?? []).flatMap((cm) => {
    const picked = parents.flatMap((p) => pickChildren(cm, p.children));
    return cm.ours ? picked.flatMap(subtree) : ownTree(cm.children, picked);
  });
}
/**
 * Whether a composed element's class reaches a node of this element's own tree: every rule of it ends,
 * past a descendant or sibling combinator, on a compound one of `own` matches (`[&_svg]:shrink-0` on
 * a menu button, the dots icon the dots menu draws inside it). The reference reaches the node from the
 * composed element; ours only from this module, so the class is emitted here too, in this tree.
 */
function reachesOwn(c: string, own: SpecNode[]): boolean {
  const rs = resolve(c);
  return (
    own.length > 0 &&
    rs.length > 0 &&
    rs.every((r) =>
      alternatives(unwrapStar(r.sel)).some((sel) => {
        const i = classAt(sel, tokenSel(c));
        if (i < 0) return false;
        const tail = sel.slice(compoundAt(sel, i).end);
        const target = lastCompound(tail);
        return /^(?:\s+|\s*[+~]\s*)[a-zA-Z*[.]/.test(tail) && !!target && own.some((n) => nodeMatches(target, n));
      }),
    )
  );
}
/**
 * The composed element's classes whose rules on its own box the reference orders after one of this
 * element's classes on the same property. A rule of this module lands on a composed root from the
 * outer tree, which beats every rule of the element's own module whatever the reference's order (a
 * hover fill the reference orders after the open fill): those later rules are repeated here, where
 * the module orders them as the reference does.
 */
function laterOnRoot(own: Iterable<string>, composed: Iterable<string>): string[] {
  type Ref = ReturnType<typeof resolve>[number];
  const keyOf = (r: Ref) => cascadeKey({ order: ruleOrder.get(r), important: /!important/.test(r.decl) });
  // The rules of a class that end on the element itself (no tail).
  const onBox = (c: string): Ref[] =>
    resolve(c).filter((r) =>
      alternatives(unwrapStar(r.sel)).some((sel) => {
        const i = classAt(sel, tokenSel(c));
        return i >= 0 && compoundAt(sel, i).end >= sel.length;
      }),
    );
  // A rule under a state (a pseudo-class, an attribute, a theme wrapper): a base rule the reference orders later is the mapping's own call.
  const stateful = (c: string, r: Ref) =>
    alternatives(unwrapStar(r.sel)).some((sel) => {
      const i = classAt(sel, tokenSel(c));
      if (i < 0) return false;
      const { start, end } = compoundAt(sel, i);
      return start > 0 || removeClasses(sel.slice(start, end)).replace(/^[a-zA-Z][\w-]*/, "") !== "";
    });
  // Normal declarations only: an important one of ours is beaten by no normal rule, and an important one of the composed element wins from its own tree (the inner context wins for important rules).
  const earliest = new Map<string, number>();
  for (const c of own) for (const r of onBox(c)) for (const d of parseDecls(r.decl)) if (!d.important) earliest.set(d.prop, Math.min(keyOf(r), earliest.get(d.prop) ?? Number.POSITIVE_INFINITY));
  if (!earliest.size) return [];
  return [...composed].filter((c) => onBox(c).some((r) => stateful(c, r) && parseDecls(r.decl).some((d) => !d.important && earliest.has(d.prop) && keyOf(r) > (earliest.get(d.prop) ?? 0))));
}

/** `parent` is the mapping this one `extends`: its roots' classes are the composed element's and are skipped, except those that reach only beyond its tree (see {@link deepReach}), which this element's own tree needs. */
export function generate(name: string, map: GeistMap, parent?: GeistMap, extended: Record<string, GeistMap> = {}): { css: string; report: string[] } {
  // The reference sheets load on demand, so read them before anything here touches twProperty.
  loadReference();
  const spec = JSON.parse(fs.readFileSync(path.join(specDir, `${map.page}.json`), "utf8")) as Spec;
  const tags = Array.isArray(map.component) ? map.component : [map.component];
  const isRoot = typeof map.root === "string" ? (n: SpecNode) => map.root as string in n.attrs : map.root;
  const labeled: Labeled[] = [];
  const outers: (SpecNode | undefined)[] = [];
  // Classes carried by the roots' ancestors in the spec (see EmitOptions.above).
  const aboveRoots = new Set<string>();
  const report: string[] = [];
  // A prop with no declared default reads as unset on a root that lacks it: the negation of its modifiers, like a boolean's false.
  const implicit = Object.fromEntries(
    Object.keys(map.props ?? {})
      .filter((p) => !(p in (map.defaults ?? {})))
      .map((p) => [p, ""]),
  );
  const declared: Record<string, string> = { ...implicit, ...map.defaults };
  for (const ex of spec.examples) {
    if (map.skip?.includes(ex.heading)) continue;
    const all = jsxInstances(ex.code, tags, map.inherit);
    const branch = map.instances?.[ex.heading];
    const inst = branch === undefined ? all : [branch].flat().map((i) => all[i]);
    const found = findRootPaths(ex.dom, isRoot, [], [], map.nested);
    const roots = found.map((f) => f.node);
    const per = (typeof map.perInstance === "object" ? map.perInstance[ex.heading] : map.perInstance) ?? 1;
    if (inst.length * per !== roots.length) report.push(`${ex.heading}: ${inst.length} <${tags.join("|")}> in code, ${roots.length} rendered roots; example skipped`);
    else
      for (let i = 0; i < roots.length; i++) {
        const own = { ...inst[Math.floor(i / per)] };
        // Raw JSX values become the values the props name (`*` is the catch-all); defaults fill in after.
        for (const [prop, aliases] of Object.entries(map.values ?? {})) if (prop in own) own[prop] = aliases[own[prop]] ?? aliases["*"] ?? own[prop];
        const props = { ...declared, ...own };
        for (const [prop, fn] of Object.entries(map.derive ?? {})) props[prop] = fn(roots[i], props, found[i].ancestors);
        // An ancestor's classes whose rules reach this root as the ancestor's child, of this root's tag (see GeistMap.fromAncestor), read as the root's own.
        const reaches = (c: string) =>
          resolve(c).some((r) =>
            alternatives(unwrapStar(r.sel)).some((sel) => {
              const at = classAt(sel, tokenSel(c));
              const child = at < 0 ? null : childOf(sel.slice(compoundAt(sel, at).end));
              return !!child && (!child.tag || child.tag === "*" || child.tag === roots[i].tag);
            }),
          );
        const taken = map.fromAncestor ? found[i].ancestors.flatMap((a) => [...classesOf(a)]).filter((c) => map.fromAncestor!(c) && reaches(c)) : [];
        labeled.push({ props, node: taken.length ? { ...roots[i], unresolved: [...roots[i].unresolved, ...taken] } : roots[i] });
        // The nearest outer ancestor of this root (see GeistMap.outer), one entry per labeled root.
        outers.push(map.outer ? [...found[i].ancestors].reverse().find(map.outer) : undefined);
        for (const a of found[i].ancestors) for (const c of classesOf(a)) aboveRoots.add(c);
      }
  }
  if (!labeled.length) throw new Error(`${name}: no labeled roots`);
  // A rule that names the root by its marker attribute (`.system [data-grid]`) is the root's own: the marker joins its class universe.
  const marker = typeof map.root === "string" ? `[${map.root}]` : undefined;
  if (marker && resolve(marker).length) for (const l of labeled) if (!l.node.styles.some((s) => s.cls === marker)) l.node.styles.push({ cls: marker, state: "", at: "", decl: "" });
  // The composed element's own root classes are skipped on the root alone: a child of this element that
  // carries one of them (`flex` on a button inside an input wrapper) styles itself with it.
  // A root that extends a mapped child of another element (`grid/acme-grid-cell`) is that child's box in ours: the
  // child's own rules ship with that element, and only the rules into this element's tree are emitted here.
  const [extName, ...extPath] = map.extends?.split("/") ?? [];
  const inherited = parent && extPath.length ? ownClasses(extName, parent, extPath) : undefined;
  // A composed element's own classes are its whole chain's: a menu button is a button, so the
  // button's root classes on a menu button (a tertiary look, a disabled fade) are its own too.
  // Only a whole-root `extends` continues the chain (`name/ours` names one child of the element).
  const lineage = (n: string, m: GeistMap | undefined): [string, GeistMap][] => {
    if (!m) return [];
    const ext = m.extends ?? "";
    const [next] = ext.split("/");
    return [[n, m], ...(next && !ext.includes("/") ? lineage(next, extended[next]) : [])];
  };
  const chain = parent && !inherited ? lineage(extName, parent) : [];
  // The nodes the composed element's own map reaches below its roots: a descendant rule ending on one is that module's own.
  const reachedRoot = chain.flatMap(([n, m]) => ownBelow(n, m, []));
  // A slotted root (`ours` ending on `::slotted()`) is light DOM of ours: nothing here reaches into its tree, so the deep rules stay the composed element's own.
  const slottedRoot = /::slotted\(/.test(map.ours);
  // The nodes of this element's own tree below the roots: a composed class that reaches one of them is emitted here too (see `reachesOwn`).
  const ownRoot = ownTree(map.children, labeled.map((l) => l.node));
  const ignore = new Set([...(map.ignore ?? []), ...chain.flatMap(([, m]) => [...rootClasses(m)]).filter((c) => slottedRoot || !(deepReach(c, reachedRoot) || reachesOwn(c, ownRoot)))]);
  // A root on a part of the composed element is styled from the outer tree: the composed chain's rules the reference orders after this element's own on a property are repeated here (see `laterOnRoot`).
  if (map.part && chain.length) {
    const later = laterOnRoot(labeled.flatMap((l) => [...classesOf(l.node)]).filter((c) => !ignore.has(c)), ignore);
    for (const c of later) ignore.delete(c);
    if (later.length) report.push(`${name}: composed rules the reference orders after this element's own on one property, repeated here: ${later.join("  ")}`);
  }
  // A composed root's host mirror (see GeistMap.host): the composed element's own module mirrors its
  // root's layout properties on its own host, one box in; this element's host, the parent's item, is a
  // box the reference has no more than that one, so the same properties are repeated on it here from
  // the composed classes every root carries (their own base rules alone), which this module otherwise skips.
  const composedMirror: Decl[] = [];
  if (map.host && chain.length) {
    const common = labeled.map((l) => classesOf(l.node)).reduce((a, b) => new Set([...a].filter((c) => b.has(c))));
    const mirrored = (d: Decl) => map.host!.mirror.some((m) => overlaps(d.prop, m));
    const base = (c: string) => resolve(c).filter((r) => !/@(media|supports|container)/.test(r.at) && alternatives(unwrapStar(r.sel)).includes(tokenSel(c)));
    const rules = [...common].filter((c) => ignore.has(c)).flatMap(base).sort((a, b) => (ruleOrder.get(a) ?? 0) - (ruleOrder.get(b) ?? 0));
    composedMirror.push(...simplify(rules.flatMap((r) => parseDecls(r.decl).filter(mirrored)), []));
    const modifiers = [...new Set(labeled.flatMap((l) => [...classesOf(l.node)]))].filter((c) => !common.has(c) && ignore.has(c) && base(c).some((r) => parseDecls(r.decl).some(mirrored)));
    if (modifiers.length) report.push(`${name}: composed host mirror takes the base alone; composed modifier classes on a mirrored property left out: ${modifiers.join("  ")}`);
  }
  const childIgnore = new Set(map.ignore ?? []);
  // The reference compounds of slotted content, for a context ancestor's rule that ends on one (see EmitOptions.slotted).
  const slottedKeys = Array.isArray(map.slotted) ? map.slotted : Object.keys(map.slotted ?? {});
  const unresolved = { unresolved: new Set<string>(), dropped: new Set<string>(), crossing: new Set<string>(), inert: new Set<string>() };
  const into: Emitted = new Map();
  const setters: Setters = new Map();

  // Every prop value maps to a modifier; a default value maps to the negation of the prop's other modifiers.
  const propMods: Record<string, Record<string, string>> = {};
  for (const [prop, values] of Object.entries(map.props ?? {})) propMods[prop] = { ...values };
  const negation = (prop: string, def: string) => {
    const others = Object.entries(propMods[prop] ?? {})
      .filter(([v, m]) => v !== def && m)
      .map(([, m]) => m);
    return others.length ? `:not(${others.join(",")})` : "";
  };
  for (const [prop, def] of Object.entries(declared)) {
    propMods[prop] ??= {};
    if (!(def in propMods[prop])) propMods[prop][def] = negation(prop, def);
  }
  propMods.$tag ??= {};
  if (!(tags[0] in propMods.$tag)) propMods.$tag[tags[0]] = negation("$tag", tags[0]);

  const defaults: Record<string, string> = { ...declared, $tag: tags[0] };
  const dominates: Dominance = new Map();
  const cons = new Map<string, Cons>();
  const rootAssign = assign(labeled, propMods, report, "root", defaults, dominates, ignore);
  // The classes the mapped children carry: a descendant rule from an ancestor that ends on one of them is emitted on the child's side.
  const mapped = new Set<string>();
  const collectMapped = (cms: ChildMap[] | undefined, parents: SpecNode[]) => {
    for (const cm of cms ?? []) {
      const picked = parents.flatMap((p) => pickChildren(cm, p.children));
      if (cm.ours) for (const n of picked) for (const c of classesOf(n)) mapped.add(c);
      collectMapped(cm.children, picked);
    }
  };
  collectMapped(map.children, labeled.map((l) => l.node));
  for (const [mod, a] of rootAssign) {
    cons.set(mod, a.cons);
    emit(into, setters, mod, "", a.classes, ignore, unresolved, carriedByAll(a.members), map.states, { tag: [...a.members][0]?.node.tag, context: map.context, marker, inherited, mapped, fromAncestor: map.fromAncestor, crossing: map.crossing, slotted: slottedKeys, above: aboveRoots, nodes: [...a.members].map((l) => l.node) });
  }
  // The outer ancestor's rules into this tree (see GeistMap.outer): the classes every outer ancestor carries, emitted on the root like its own base.
  if (map.outer) {
    const missing = outers.filter((o) => !o).length;
    if (missing) report.push(`${name}: ${missing} root(s) have no outer ancestor`);
    const sets = outers.filter((o): o is SpecNode => !!o).map(classesOf);
    if (sets.length) {
      const common = new Set([...sets[0]].filter((c) => sets.every((s) => s.has(c))));
      const tailed = (c: string) =>
        resolve(c).some((r) =>
          alternatives(unwrapStar(r.sel)).some((sel) => {
            const at = classAt(sel, tokenSel(c));
            return at >= 0 && compoundAt(sel, at).end < sel.length;
          }),
        );
      const uncommon = [...new Set(sets.flatMap((s) => [...s]))].filter((c) => !common.has(c) && tailed(c));
      if (uncommon.length) report.push(`${name}: outer classes on some outer ancestors only, left out: ${uncommon.join("  ")}`);
      emit(into, setters, "", "", [...common], ignore, unresolved, common, map.states, { tag: outers.find(Boolean)?.tag, context: map.context, reach: labeled.flatMap((l) => subtree(l.node)) });
    }
  }

  // Children: the mapped child of every parent, assigned the same way; unmapped children with rules are reported.
  // `nodesOf`: the reference nodes behind every emitted element (the roots, each mapped child by its tail), for the inline styles they carry.
  const nodesOf = new Map<string, SpecNode[]>([["root", labeled.map((l) => l.node)]]);
  // `childrenOf`: the mapped children under each element's tail (the root's is ""), with their reference nodes: a tag compound in a
  // rule's tail (`> div` on a wrapper) that matches one of them is written as that child's selector (see `retail` in `render`).
  const childrenOf = new Map<string, { ours: string; part?: string; tail: string; nodes: SpecNode[]; parents: SpecNode[] }[]>();
  // `levels`: whether each ancestor level of the children walked (nearest first, the root last) has a selector of ours (see EmitOptions.levels).
  const walkChildren = (childMaps: ChildMap[] | undefined, parents: Labeled[], parentTail: string, states?: StateMap, levels: boolean[] = [true]) => {
    const seen = new Set<SpecNode>();
    for (const cm of childMaps ?? []) {
      const picked = parents.flatMap((p) => pickChildren(cm, p.node.children).map((node) => ({ props: p.props, node, path: [...(p.path ?? []), p.node] })));
      for (const p of picked) seen.add(p.node);
      // A part with no selector of ours renders on the composed ancestor's tag (see ChildMap.part): its tail is the parent's.
      const tail = cm.ours ? `${parentTail} ${cm.ours}` : parentTail;
      const element = cm.part ? `${tail}::part(${cm.part})` : tail;
      if (cm.ours || cm.part) nodesOf.set(element, picked.map((p) => p.node));
      if (cm.ours) (childrenOf.get(parentTail) ?? childrenOf.set(parentTail, []).get(parentTail)!).push({ ours: cm.ours, part: cm.part, tail, nodes: picked.map((p) => p.node), parents: parents.map((p) => p.node) });
      if (!picked.length) {
        report.push(`${map.ours}${element}: no reference child matched`);
        continue;
      }
      // A child with no selector of ours (and no part) is a level of a composed element: nothing is emitted for it, its children map on the parent's tail.
      if (!cm.ours && !cm.part) {
        if (!cm.leaf) walkChildren(cm.children, picked, parentTail, cm.states ?? states, [false, ...levels]);
        continue;
      }
      const [extName, ...extPath] = cm.extends?.split("/") ?? [];
      if (cm.extends && !extended[extName]) throw new Error(`${name}: child ${cm.ours} extends an unknown mapping ${extName}`);
      // A whole-root `extends` takes the composed element's chain (see `lineage`); `name/ours` names one child of it.
      const childChain = cm.extends ? (extPath.length ? [[extName, extended[extName]] as [string, GeistMap]] : lineage(extName, extended[extName])) : [];
      const own = cm.extends ? new Set(childChain.flatMap(([n, m]) => [...ownClasses(n, m, extPath)])) : null;
      // The nodes the composed element's own map reaches below this child: a descendant rule ending on one is that module's own.
      const reached = childChain.flatMap(([n, m]) => ownBelow(n, m, extPath));
      // A composed class that reaches a node of this element's own tree under the child (see `reachesOwn`), or one the reference orders after this element's own on a part (see `laterOnRoot`), is emitted here too.
      const ownChild = ownTree(cm.children, picked.map((p) => p.node));
      const later = new Set(own && cm.part ? laterOnRoot(picked.flatMap((p) => [...classesOf(p.node)]).filter((c) => !own.has(c)), own) : []);
      if (later.size) report.push(`${name}: composed rules the reference orders after this element's own on one property, repeated on ${element}: ${[...later].join("  ")}`);
      const deepOnly = (c: string) => deepReach(c, reached) || reachesOwn(c, ownChild) || later.has(c);
      // A composed child's own classes (those its module emits, its variants among them) need no prop group of this element:
      // they are left out of the assignment, so a group of mixed variants (a default and a secondary button in one footer) reports nothing.
      const childAssign = assign(picked, propMods, report, `${map.ours}${element}`, defaults, dominates, own ? new Set([...childIgnore, ...[...own].filter((c) => !deepOnly(c))]) : childIgnore, cm.owns);
      // The ancestors' classes common to the group, nearest first: the members of one child map share a path, so one chain stands for all.
      const chainOf = (members: Set<Labeled>) => {
        const paths = [...members].map((l) => [...(l.path ?? [])].reverse().map(classesOf));
        return Array.from({ length: Math.min(...paths.map((p) => p.length)) }, (_, i) => new Set([...paths[0][i]].filter((c) => paths.every((p) => p[i].has(c)))));
      };
      for (const [mod, a] of childAssign) {
        cons.set(mod, a.cons);
        const chain = chainOf(a.members);
        const groups = chain.map((_, i) => new Set([...a.members].flatMap((l) => [...classesOf([...(l.path ?? [])].reverse()[i])].filter((c) => /^group(\/|$)/.test(c)))));
        emit(into, setters, mod, element, a.classes.filter((c) => !own?.has(c) || deepOnly(c)), childIgnore, unresolved, carriedByAll(a.members), cm.states ?? states, { tag: [...a.members][0]?.node.tag, context: map.context, chain, mapped, crossing: map.crossing, groupOnAncestor: map.groupOnAncestor, slotted: slottedKeys, levels, ownSeg: !!cm.ours, above: new Set([...aboveRoots, ...chain.flatMap((s) => [...s])]), groups, nodes: [...a.members].map((l) => l.node) });
      }
      if (!cm.leaf) walkChildren(cm.children, picked, tail, cm.states ?? states, [!!cm.ours, ...levels]);
    }
    if (parent && !parentTail) return; // a composed root's children belong to the element it extends
    for (const p of parents) for (const k of p.node.children) if (!seen.has(k) && k.styles.length) report.push(`${map.ours}${parentTail}: unmapped reference child <${k.tag}${k.text ? ` "${k.text}"` : ""}> with ${k.styles.length} rules`);
  };
  walkChildren(map.children, labeled, "", map.states);
  if (unresolved.unresolved.size) report.push(`classes with no rule in the reference CSS: ${[...unresolved.unresolved].join("  ")}`);
  if (unresolved.dropped.size) report.push(`descendant rules dropped, an ancestor state off the root (name the ancestor in \`context\`): ${[...unresolved.dropped].join("  ")}`);
  if (unresolved.crossing.size) report.push(`rules crossing into a composed child's tree left out (its mapping emits them through \`outer\`): ${[...unresolved.crossing].join("  ")}`);
  if (unresolved.inert.size) report.push(`rules that match no element in the reference left out (an empty :is(), a variant its compiler resolved to no selector; a group variant on the group element itself, which needs an outer group; a zero-weight child rule every child's own utilities outrank): ${[...unresolved.inert].join("  ")}`);
  for (const [q, ps] of dominates) report.push(`cascade: ${q} rules follow ${[...ps].join(", ")} rules (the reference merges ${q}'s classes last)`);
  // A composite property (box-shadow, transform, filter) is written out evaluated. When different
  // groups set different layers of one composite, the reference composes them at runtime through
  // its variables: that element keeps the family's variables, its rules set them, and the module
  // registers them with the reference's defaults, so the layers compose the same way in ours.
  // Groups that exclude each other (`.copied` and `:not(.copied)`) never style one element together, so they compose nothing.
  const compatible = (a: string, b: string) => Object.entries(cons.get(a) ?? {}).every(([p, vs]) => !(p in (cons.get(b) ?? {})) || vs.some((v) => cons.get(b)![p].includes(v)));
  const kept = new Map<string, Set<string>>(); // element -> variables kept
  for (const [k, members] of setters) {
    if (members.size < 2) continue;
    const mods = [...new Set([...members.values()].flatMap((s) => [...s]))];
    if (!mods.some((a, i) => mods.slice(i + 1).some((b) => compatible(a, b)))) continue;
    const [element, fam] = k.split("|");
    const names = Object.keys(twProperty).filter((n) => FAMILIES[fam].test(n));
    const set = kept.get(element) ?? kept.set(element, new Set()).get(element)!;
    for (const n of names) set.add(n);
    report.push(`${element} ${fam}: layers set by different groups, kept as variables (${[...members].map(([m, s]) => `${m}: ${[...s].map((x) => x || "base").join(" ")}`).join("; ")})`);
  }
  // A variable that a shipped keyframes body reads (`--tw-enter-opacity` in `enter`, the fade of an
  // `animate-in`) has no property on the element to fold into: the animation reads it at runtime,
  // so an element whose rules name that animation keeps the variables its body reads, registered
  // with the reference's defaults.
  for (const e of into.values()) {
    const read = new Set<string>();
    for (const d of e.decls)
      for (const p of parseDecls(d.text))
        if (p.prop === "animation" || p.prop === "animation-name")
          for (const part of p.value.split(/,(?![^(]*\))/)) for (const token of part.trim().split(/\s+/)) for (const m of (keyframesOf(token) ?? "").matchAll(/var\((--tw-[\w-]+)/g)) if (twProperty[m[1]]) read.add(m[1]);
    if (!read.size) continue;
    const element = e.element || "root";
    const set = kept.get(element) ?? kept.set(element, new Set()).get(element)!;
    for (const v of read) set.add(v);
  }
  // A layer the reference writes at runtime, in an inline style on the element (a ring colored per
  // variant), composes with the rules at runtime the same way: where a rule of the element sets the
  // family too, the element keeps its variables, and the value the element writes reaches the property.
  for (const [element, nodes] of nodesOf) {
    const inline = nodes.flatMap((n) => [...(n.attrs.style ?? "").matchAll(/--tw-[a-z-]+(?=\s*:)/g)].map((m) => m[0]));
    for (const [fam, re] of Object.entries(FAMILIES)) {
      const vars = [...new Set(inline.filter((v) => re.test(v)))];
      if (!vars.length || !setters.has(`${element}|${fam}`)) continue;
      const set = kept.get(element) ?? kept.set(element, new Set()).get(element)!;
      for (const n of Object.keys(twProperty).filter((n) => re.test(n))) set.add(n);
      report.push(`${element} ${fam}: set at runtime by an inline style (${vars.join(" ")}), kept as variables`);
    }
  }

  // Serialize through the simplifier. A rule inherits the --tw-* variables of the rules that also
  // match its element: the element's base rule and the same-modifier rule without the state.
  const baseOf = (e: Entry, mod: string) => into.get(entryKey("", "", mod, e.element, "", ""));
  const outs: Out[] = [];
  let idx = 0;
  for (const e of into.values()) {
    const own = e.decls.flatMap((d) => parseDecls(d.text).map((x) => ({ ...x, order: d.order })));
    const beyondBase = e.mod || e.state || e.rootState || e.hostState || e.ancestors.length || e.theme || e.at;
    const beyondMod = e.state || e.rootState || e.hostState || e.ancestors.length || e.theme || e.at;
    // A rule under a context (a root state, `.sticky` on the panel above a title) also inherits the variables the
    // same context's own rule sets (`leading-6` under `.sticky`), which the reference's cascade puts over the base's.
    const beyondRoot = e.state || e.hostState || e.ancestors.length || e.theme || e.at;
    const contextBase = e.rootState && beyondRoot ? into.get(entryKey("", "", e.mod, e.element, e.rootState, "")) : undefined;
    const inherited = [...(beyondBase ? (baseOf(e, "")?.decls ?? []) : []), ...(e.mod && beyondMod ? (baseOf(e, e.mod)?.decls ?? []) : []), ...(contextBase?.decls ?? [])].flatMap((d) => parseDecls(d.text));
    // A state or theme rule that sets only variables (`dark-theme:ring-black` sets the ring color) changes
    // the properties of the rules it inherits from that read them (the ring's box-shadow, through
    // `--tw-ring-shadow`): those properties are re-evaluated here with the rule's values, in the rule's
    // cascade position, so the state renders the composed value as the reference does.
    const setsVars = new Set(own.filter((d) => d.prop.startsWith("--tw-")).map((d) => d.prop));
    if (setsVars.size) {
      const env = Object.fromEntries(inherited.filter((d) => d.prop.startsWith("--tw-")).map((d) => [d.prop, d.value]));
      const readsVar = (value: string, seen = new Set<string>()): boolean =>
        [...value.matchAll(/var\((--tw-[\w-]+)/g)].some((m) => setsVars.has(m[1]) || (!seen.has(m[1]) && seen.add(m[1]) && readsVar(env[m[1]] ?? "", seen)));
      const at = Math.max(...own.filter((d) => setsVars.has(d.prop)).map((d) => d.order ?? 0));
      for (const d of inherited) if (!d.prop.startsWith("--") && !own.some((o) => o.prop === d.prop) && readsVar(d.value)) own.push({ ...d, order: at });
    }
    const simple = simplify(own, inherited, kept.get(e.element || "root"));
    if (simple.length) outs.push({ ...e, decls: simple, idx: idx++, cons: cons.get(e.mod) ?? {} });
  }
  // The host's own states prefix a rule: the theme, and a state moved onto the host (a position among its siblings).
  const prefix = (t: Theme, hostState = "") => {
    const h = `${t === "light" ? ":not([data-dark])" : t === "dark" ? "[data-dark]" : ""}${hostState}`;
    return !h ? "" : t === "dark" ? `:where(:host(${h})) ` : `:host(${h}) `;
  };
  // A child compound is wrapped in :where() so rules on one element tie on specificity, as the
  // reference's flat utility classes do; a slotted child is reached through its slot, with the
  // rest of its compound (attributes, pseudo-classes) inside `::slotted()`.
  const slottedMap: [string, string][] = Array.isArray(map.slotted) ? map.slotted.map((t) => [t, t]) : Object.entries(map.slotted ?? {});
  const escRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const tail = "((?:\\[[^\\]]*\\]|\\.[^\\s.:>~+\\[\\]()]+|:[a-z-]+(?:\\([^()]*(?:\\([^()]*\\)[^()]*)*\\))?)*)";
  const slottedRes = slottedMap.map(([theirs, ours]) => [new RegExp(`(\\s|>)\\s*\\*?${escRe(theirs)}${tail}(?=$|[\\s>+~])`, "g"), ours, theirs] as const);
  // The same rule also reaches the slot's fallback content (`slot > tag`), the element's own default for the slot.
  // A child mapped as slotted (`acme-grid-cell`) stays a bare tag, so the slot rewrite below reaches it.
  const slottedChildren = new Set<string>();
  const collectSlotted = (cms?: ChildMap[]) => {
    for (const cm of cms ?? []) {
      if (cm.slotted) slottedChildren.add(cm.ours);
      collectSlotted(cm.children);
    }
  };
  collectSlotted(map.children);
  const wrap = (element: string) => element.replace(/(\S+)/g, (seg) => (slottedChildren.has(seg) ? seg : seg.replace(/^([^:]+)(::part\([^)]*\))?$/, (_, tag, part) => `:where(${tag})${part ?? ""}`)));
  const render = (o: Out): { plain?: string; slotted?: string; pageTag?: boolean } => {
    let element = wrap(o.element);
    // A state on a mapped ancestor joins that ancestor's segment, counted from the end (see {@link AncestorState}).
    if (o.ancestors.length) {
      const segs = element.split(" ");
      // On a part's segment the state sits before `::part()` (an attribute state on a part lands on the part's host).
      for (const { depth, seg, state } of o.ancestors) {
        const k = segs.length - 1 - (seg ?? depth + 1);
        segs[k] = segs[k].replace(/^(.*?)(::part\([^)]*\))?$/, (_, head, part) => `${head}${state}${part ?? ""}`);
      }
      element = segs.join(" ");
    }
    let state = o.state;
    // A root mapped onto a part (`part` in the map) is that part's segment itself: its own rules take the part here, so a state or a descendant lands the way a child part's does below.
    if (map.part && !o.element) element = `::part(${map.part})`;
    // An attribute state on a part lands on the part's host (no attribute selector may follow `::part()`); the element keeps the host's state attributes in step with the part's.
    // Read first, so a descendant or a child after the state (`[data-hover=true] [data-suffix]`, a rule keyed on the host's state into this element's own tree) is judged on what follows it.
    const hostAttrs = /::part\([^)]*\)$/.test(element) ? state.match(/^(\[[^\]]+\])+/)?.[0] : undefined;
    if (hostAttrs) {
      element = element.replace(/::part\(/, `${hostAttrs}::part(`);
      state = state.slice(hostAttrs.length);
    }
    // A tag compound in the tail that matches exactly one mapped child of the element the rule is on (`> div` on the crumbs
    // wrapper: the composed breadcrumbs list, a part of ours) is written as that child's selector, its part included and the
    // compound's own states kept before the part; the rewrite follows the tail hop by hop and stops at the first compound
    // that names a class (handled through `classes`) or matches no mapped child (the tail is then the reference's own).
    const retail = (parentKey: string, t: string): string => {
      const { segs, tail: end } = segments(t);
      let key = parentKey;
      let hits = 0;
      const out = segs.map(({ comb, seg }) => {
        const type = seg.match(/^(?:[a-zA-Z][\w-]*|\*)/)?.[0];
        // Only a child ours composes (a part, or a custom element of ours) replaces the reference's tag; a child that keeps its tag (`input`, `svg`) needs no rewrite.
        // Every node the compound reaches under the rule's own parents (children for `>`, descendants otherwise) must be the mapped child's:
        // a tag that also names an unmapped node there (the anchor of a text crumb beside the menu type's chip) is the reference's own tail.
        const under = (n: SpecNode): SpecNode[] => (comb === ">" ? n.children : subtree(n).slice(1));
        const found =
          key === undefined || !type || classesIn(seg).length
            ? []
            : (childrenOf.get(key) ?? []).filter(
                (k) => (k.part || /^[a-zA-Z][\w]*-[\w-]*$/.test(k.ours)) && k.nodes.some((n) => nodeMatches(seg, n)) && k.parents.every((p) => under(p).every((n) => !nodeMatches(seg, n) || k.nodes.includes(n))),
              );
        if (found.length !== 1) {
          key = undefined as unknown as string;
          return { comb, seg };
        }
        hits++;
        key = found[0].tail;
        const own = seg.slice(type.length);
        const sel = slottedChildren.has(found[0].ours) ? found[0].ours : `:where(${found[0].ours})`;
        return { comb, seg: found[0].part ? `${sel}${own}::part(${found[0].part})` : `${sel}${own}` };
      });
      return hits ? out.map(({ comb, seg }) => `${comb === " " ? " " : ` ${comb} `}${seg}`).join("") + end : t;
    };
    if (!map.part || o.element) state = retail(o.element.replace(/::part\([^)]*\)$/, ""), state);
    // A child of a part (`[&>span]` on a composed button: its label) is the composed element's own shadow child, which its own module reaches and this one cannot: left out and reported.
    if (/::part\([^)]*\)$/.test(element) && /^\s*>/.test(state)) {
      report.push(`${name}: rule on a part's own child left out (the composed element's module carries the child's rules): ${map.ours}${element}${state} {${serialize(o.decls)}}`);
      return { plain: undefined };
    }
    // A descendant or a sibling of a part sits in this element's own tree, slotted into the part's host or beside it: the rule renders on the host tag, not on the part.
    if (/::part\([^)]*\)$/.test(element) && /^[\s+~]/.test(state)) element = element.replace(/::part\([^)]*\)$/, "");
    // A root that is our host itself (`ours: ":host"`) takes its theme, modifier and state inside `:host()`.
    const host = map.ours === ":host";
    // A root that is a pseudo-element of our element (`pseudo: "::backdrop"`) takes it after its modifier and state.
    let rest = o.element || !map.pseudo ? `${host ? "" : o.rootState}${element}${state}` : `${o.rootState}${state}${map.pseudo}`;
    // A reference class named in a descendant tail (a CSS-module hash on a line number) becomes our class on that descendant.
    for (const [theirs, ours] of Object.entries(map.classes ?? {})) rest = rest.replaceAll(theirs.startsWith("[") ? theirs : `.${theirs}`, `.${ours}`);
    // An unquoted attribute value with escapes (`[style*=border-right\:none]`) is written quoted, the same selector.
    rest = rest.replace(/\[([\w-]+)([*^$|~]?=)((?:\\.|[^\]"'])*\\(?:\\.|[^\]"'])*)\]/g, (_, n, op, v) => `[${n}${op}"${unesc(v)}"]`);
    const mod = o.mod ? `:where(${o.mod})` : "";
    const hostSel = `${o.theme === "light" ? ":not([data-dark])" : o.theme === "dark" ? "[data-dark]" : ""}${o.hostState}${mod}${o.rootState}`;
    // A host state (`@:last-child`) weighs one pseudo-class plus its argument, where the reference's state weighs its argument alone
    // on the root's class: the root's class is wrapped in `:where()` under it, so the `:host` pseudo-class stands in for the class
    // and the rule ties with a root state of the same weight (`.toast[data-expanded]`), letting source order decide as the reference does.
    const ours = o.hostState && o.theme !== "dark" && /^\.[\w-]+$/.test(map.ours) ? `:where(${map.ours})` : map.ours;
    const head = host ? `:host${hostSel ? `(${hostSel})` : ""}` : `${prefix(o.theme, o.hostState)}${ours}${mod}`;
    // A root that is slotted light DOM of ours (`ours: "slot[name=x]::slotted(acme-button)"`, a composed
    // element the consumer slots in) takes its modifier and its own state inside `::slotted()`; a rule
    // into its tree (a descendant or a child of the root) belongs to that element's own mapping and is left out.
    const slottedRoot = map.ours.match(/^(.*::slotted\()((?:[^()]|\([^()]*\))*)\)$/);
    if (slottedRoot) {
      if (o.element || /[\s>+~]/.test(state)) {
        report.push(`${name}: rule into a slotted root's tree left out (its own mapping emits it): ${head}${rest}{${serialize(o.decls)}}`);
        return { plain: undefined };
      }
      return { plain: `${prefix(o.theme, o.hostState)}${slottedRoot[1]}${slottedRoot[2]}${mod}${o.rootState}${state})` };
    }
    let slotted = rest;
    let fallback = rest;
    // A slotted element of ours keeps its own styles in its shadow tree, which any rule of the outer tree outranks: no important needed.
    let pageTag = false;
    // A child mapped onto a slot element of ours (`slot[name=prefix]`, a slot the element forwards
    // into a composed one) holds its slotted content as its own assigned nodes: the rule reaches
    // them through `::slotted()` on that slot, and its fallback content as its plain children.
    const onSlot = (str: string, offset: number) => /:where\(slot(?:\[[^\]]*\])*\)$/.test(str.slice(0, offset));
    // A positional child (`> :last-child`) may be a shadow child of ours or a node slotted in that
    // position: the position moves onto the slot (`slot:last-child::slotted(*)`) and the rule keeps
    // its plain form for the shadow child.
    // The plain form skips the slot in that position (a slot has no box, and a rule landing on it would reach the slotted node by inheritance twice over).
    let plain = rest;
    for (const [re, ours, theirs] of slottedRes) {
      const pos = theirs.startsWith(":") ? theirs : "";
      slotted = slotted.replace(re, (_, lead, compound, offset: number, str: string) => {
        pageTag ||= !ours.startsWith("acme-");
        return onSlot(str, offset) ? `::slotted(${ours}${compound})` : `${lead}slot${pos}::slotted(${ours}${compound})`;
      });
      fallback = fallback.replace(re, (_, lead, compound, offset: number, str: string) => (onSlot(str, offset) ? `${lead}${ours}${compound}` : `${lead}slot${pos} > ${ours}${compound}`));
      if (pos) plain = plain.replace(re, (_, lead, compound) => `${lead}${pos}:where(:not(slot))${compound}`);
    }
    // `::slotted()` takes a compound selector: a `:has()` on the slotted child parses in no browser, so that rule is inert.
    if (/::slotted\([^)]*:has\(/.test(slotted)) report.push(`${name}: inert rule, ::slotted() cannot carry :has(): ${slotted}`);
    // Nothing follows `::slotted()`: a rule into the slotted node's own tree (`.cell > div`) belongs to that element's mapping and is left out here.
    if (/::slotted\((?:[^()]|\([^()]*\))*\)\s*(?:[>+~]|\s\S)/.test(slotted)) {
      report.push(`${name}: rule into a slotted element's tree left out (its own mapping emits it): ${head}${slotted}`);
      return { plain: undefined };
    }
    // `plain` is the selector of a shadow child of ours; `slotted` reaches slotted content and the slot's fallback.
    if (slotted === rest) return { plain: head + rest };
    return { plain: plain !== rest ? head + plain : undefined, slotted: `${head}${slotted},\n${head}${fallback}`, pageTag };
  };
  // Slotted content also matches the page's own element rules (the global reset's `a`, `code`),
  // which outrank a shadow tree's normal declarations. The reference's utilities sit in a layer
  // above its reset; an important declaration is how a shadow rule reaches the same standing.
  // Only the slotted form carries it: the same rule's plain form, on a shadow child of ours, keeps its
  // normal standing so a later rule of the element (a hover on the cell) still wins as the reference orders it.
  const important = (decls: Decl[]) => decls.map((d) => ({ ...d, important: true }));
  const lines: string[] = [];
  // The kept variables are registered as the reference registers them, document-wide with their
  // defaults: an `@property` rule in a shadow tree's sheet registers nothing, so the module
  // registers them at runtime (`registerProperties` in src/base.ts) from this list.
  const properties = [...new Set([...kept.values()].flatMap((s) => [...s]))].map((n) => {
    const m = twProperty[n].match(/syntax:\s*"([^"]*)";\s*inherits:\s*(true|false)(?:;\s*initial-value:\s*([^;}]*))?/);
    if (!m) throw new Error(`${name}: unreadable registration of ${n}: ${twProperty[n]}`);
    return { name: n, syntax: m[1], inherits: m[2] === "true", ...(m[3]?.trim() ? { initialValue: m[3].trim() } : {}) };
  });
  let at: string | null = null;
  let buf: string[] = [];
  // Nested at-rules (`@media … @supports …`) nest again in the output, innermost around the rules.
  const flush = () => {
    if (buf.length) {
      const ats = at ? at.split(/\s+(?=@)/) : [];
      lines.push(`${ats.map((a) => `${a}{\n`).join("")}${buf.join("\n")}${"\n}".repeat(ats.length)}`);
    }
    buf = [];
  };
  // The keyframes the module's animations name (and those the mapping lists) ship with it.
  const animations = new Set(map.keyframes ?? []);
  for (const o of order(outs, report, name, defaults, dominates, labeled, propMods)) {
    if (o.at !== at) {
      flush();
      at = o.at;
    }
    const { plain, slotted, pageTag } = render(o);
    if (plain) buf.push(`${plain}{${serialize(o.decls)}}`);
    if (slotted) buf.push(`${slotted}{${serialize(pageTag ? important(o.decls) : o.decls)}}`);
    // A root rule on a mirrored property (see GeistMap.host) is repeated on the host, its modifier classes translated to the host's attributes.
    // An at-rule variant (a responsive value, `sm:min-w-0`) is mirrored inside the same at-rule block: the rule lands in the block being buffered.
    if (map.host && !o.element && !o.state && !o.rootState && !o.hostState && !o.theme) {
      const mirrored = o.decls.filter((d) => map.host!.mirror.some((m) => overlaps(d.prop, m)));
      const missing: string[] = [];
      const sel = o.mod.replace(/\.[A-Za-z0-9_-]+/g, (c) => map.host!.mods?.[c] ?? (missing.push(c), c));
      if (mirrored.length && missing.length) report.push(`${name}: host mirror skipped, no host attribute for ${missing.join(" ")} (${o.mod})`);
      else if (mirrored.length) buf.push(`:host${sel ? `(${sel})` : ""}{${serialize(mirrored)}}`);
    }
    for (const d of o.decls)
      if (d.prop === "animation" || d.prop === "animation-name")
        for (const part of d.value.split(/,(?![^(]*\))/)) for (const token of part.trim().split(/\s+/)) if (keyframesOf(token)) animations.add(token);
  }
  flush();
  if (composedMirror.length) lines.push(`:host{${serialize(composedMirror)}}`);
  for (const k of animations) {
    const body = keyframesOf(k);
    if (body) lines.push(`@keyframes ${k}{${body}}`);
    else report.push(`${name}: no @keyframes ${k} in the reference CSS`);
  }
  let css = lines.join("\n");
  // A reference name in `classes` is renamed wherever it stands, a keyframes name (a CSS-module animation) included.
  for (const [theirs, ours] of Object.entries(map.classes ?? {})) css = css.replace(new RegExp(`(?<![\\w-])${escRe(theirs)}(?![\\w-])`, "g"), theirs.startsWith("[") ? `.${ours}` : ours);
  return { css, report: [...new Set(report)], properties };
}

/** Source-system variable names become house names in everything the package ships. */
export const rename = (s: string) =>
  s
    .replace(/--tw-/g, "--acme-")
    .replace(/--font-geist-/g, "--acme-font-")
    .replace(/--geist-/g, "--acme-")
    // The popper library's runtime variables (the anchor's width, the room left for the box), set by our own script under house names.
    .replace(/--radix-popover-/g, "--acme-popover-")
    .replace(/\[data-slot=geist-icon\]/g, "")
    .replace(/data-geist-/g, "data-acme-");
const escTpl = (s: string) => s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");

/**
 * Writes one element's style module from its mapping.
 *
 * The file is written unformatted; the caller formats the whole batch through
 * {@link formatGenerated} so one Biome process covers every element.
 *
 * @param name* - The element's mapping name under tools/geist/maps.
 *
 * @returns The path written, and the mapping's report lines.
 */
export async function writeStyles(name: string): Promise<{ file: string; report: string[] }> {
  const mapFile = path.join(import.meta.dir, "maps", `${name}.ts`);
  const { geist } = (await import(mapFile)) as { geist: GeistMap };
  const dir = path.join(ROOT, "src/components", geist.element ?? name);
  const load = async (n: string) => ((await import(path.join(import.meta.dir, "maps", `${n}.ts`))) as { geist: GeistMap }).geist;
  const parent = geist.extends ? await load(geist.extends.split("/")[0]) : undefined;
  // The mappings the root and the children extend (instances of other elements inside this one), and those these extend in turn (a menu button that is a button).
  const maps: Record<string, GeistMap> = {};
  const chase = async (n: string) => {
    if (maps[n]) return;
    maps[n] = await load(n);
    const ext = maps[n].extends ?? "";
    if (ext && !ext.includes("/")) await chase(ext);
  };
  const collect = async (cms?: ChildMap[]) => {
    for (const cm of cms ?? []) {
      if (cm.extends) await chase(cm.extends.split("/")[0]);
      await collect(cm.children);
    }
  };
  if (parent) {
    const ext = parent.extends ?? "";
    if (ext && !ext.includes("/")) await chase(ext);
  }
  await collect(geist.children);
  const { css, report, properties } = generate(name, geist, parent, maps);
  const id = `${name.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}Css`;
  let own = rename(css);
  for (const [theirs, ours] of Object.entries(geist.assets ?? {})) own = own.replaceAll(theirs, ours);
  // The composition variables the module keeps, registered document-wide with the reference's defaults (see `registerProperties`).
  const register = properties.length ? `import { registerProperties } from "../../base";\n\nregisterProperties(${JSON.stringify(properties.map((p) => ({ ...p, name: rename(p.name) })))});\n` : "";
  const file = path.join(dir, `${name}.styles.ts`);
  fs.writeFileSync(file, `// Generated by the style generator from the reference spec. Do not edit; edit the mapping and regenerate.\nimport { css } from "lit";\n${register}export const ${id} = css\`\n${escTpl(own)}\n\`;\n`);
  return { file, report };
}

if (import.meta.main) {
  const names = process.argv.slice(2);
  const all = names.length
    ? names
    : fs
        .readdirSync(path.join(import.meta.dir, "maps"))
        .filter((f) => f.endsWith(".ts"))
        .map((f) => f.replace(/\.ts$/, ""));
  const written: string[] = [];
  for (const n of all) {
    const { file, report } = await writeStyles(n);
    written.push(file);
    console.log(`${n}: ${report.length ? `\n  - ${report.join("\n  - ")}` : "clean"}`);
  }

  // One Biome pass over the batch, so a regenerated module is already formatted.
  await formatGenerated(written);
}

/** The per-declaration rules a topological sort cannot place, with their conflicting neighbours, for the cycle report. */
function cycleMembers(list: Out[]): string[] {
  const name = (o: Out) => `${o.theme ? `[${o.theme}] ` : ""}${o.mod || "(base)"}${o.element}${o.state} { ${o.decls.map((d) => `${d.prop}@${d.order}`).join(" ")} }`;
  const edges: [number, number][] = [];
  for (let i = 0; i < list.length; i++)
    for (let j = i + 1; j < list.length; j++) {
      if (!coMatch(list[i], list[j])) continue;
      for (const da of list[i].decls) for (const db of list[j].decls) if (da.important === db.important && da.order !== db.order && overlaps(da.prop, db.prop)) edges.push([i, j]);
    }
  const indeg = list.map(() => 0);
  for (const [, b] of edges) indeg[b]++;
  // Peel the acyclic part away; what stays is on or behind a cycle.
  const remaining = new Set(list.map((_, i) => i));
  let changed = true;
  while (changed) {
    changed = false;
    for (const i of [...remaining]) if (edges.every(([a, b]) => !(b === i && remaining.has(a)))) { remaining.delete(i); changed = true; }
  }
  return [...remaining].map((i) => name(list[i]));
}
