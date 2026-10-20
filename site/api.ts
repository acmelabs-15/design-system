import { readCorePackage } from "../scripts/core-package";
import fs from "node:fs";
import path from "node:path";
import type { ClassDeclaration, CustomElement, Package } from "custom-elements-manifest/schema";

export type NamedApi = { name: string; doc: string; inherited: string };
export type Prop = NamedApi & { attribute: string | false; type: string; default: string; readonly: boolean; reset: string };
export type ApiEvent = NamedApi & { type: string; bubbles?: boolean; composed?: boolean; cancelable?: boolean };
export type ApiSection = { heading: string; headings: string[]; rows: string[][]; codeColumns: number[] };
export type ElementApi = {
  tag: string;
  className: string;
  file: string;
  module: string;
  version: string;
  doc: string;
  props: Prop[];
  attributes: (NamedApi & { type: string; default: string })[];
  methods: (NamedApi & { signature: string })[];
  slots: NamedApi[];
  events: ApiEvent[];
  parts: NamedApi[];
  cssProperties: (NamedApi & { default: string })[];
  states: NamedApi[];
};
const ROOT = path.resolve(import.meta.dir, "..");
const named = (item: { name: string; description?: string; inheritedFrom?: { name: string } }): NamedApi => ({
  name: item.name,
  doc: item.description ?? "",
  inherited: item.inheritedFrom?.name ?? "",
});
const visible = (member: { static?: boolean; privacy?: string }) => !member.static && member.privacy !== "private" && member.privacy !== "protected";

export function apiFromManifest(manifest: Package): ElementApi[] {
  const version = (manifest as Package & { "x-acme-version"?: string })["x-acme-version"];
  if (!version) {
    throw new Error("The documentation manifest must identify its package version");
  }
  return manifest.modules
    .flatMap((module) =>
      (module.declarations ?? []).flatMap((declaration) => {
        if (declaration.kind !== "class" || !("tagName" in declaration) || !declaration.tagName) {
          return [];
        }
        const element = declaration as ClassDeclaration & CustomElement & { "x-acme-states"?: { name: string; description?: string }[] };
        const source = (module as unknown as Record<string, unknown>)["x-acme-source"];
        if (typeof source !== "string") {
          throw new Error("Element manifest lacks source location: " + module.path);
        }
        return [
          {
            tag: element.tagName!,
            className: element.name,
            file: source,
            module: module.path,
            version,
            doc: element.description ?? "",
            props: (element.members ?? []).flatMap<Prop>((member) => {
              if (member.kind !== "field" || !visible(member)) {
                return [];
              }
              const details = member as typeof member & { readonly?: boolean; "x-acme-reset"?: string };
              return [
                {
                  ...named(member),
                  attribute: element.attributes?.find((attribute) => attribute.fieldName === member.name)?.name ?? false,
                  type: member.type?.text ?? "",
                  default: member.default ?? "",
                  readonly: !!details.readonly,
                  reset: details["x-acme-reset"] ?? "",
                },
              ];
            }),
            attributes: (element.attributes ?? [])
              .filter((attribute) => !attribute.fieldName)
              .map((attribute) => ({ ...named(attribute), type: attribute.type?.text ?? "string", default: attribute.default ?? "" })),
            methods: (element.members ?? []).flatMap((member) =>
              member.kind !== "method" || !visible(member)
                ? []
                : [
                    {
                      ...named(member),
                      signature: `${member.name}(${(member.parameters ?? []).map((parameter) => `${(parameter as typeof parameter & { rest?: boolean }).rest ? "..." : ""}${parameter.name}${parameter.optional ? "?" : ""}: ${parameter.type?.text ?? "unknown"}${parameter.default === undefined ? "" : " = " + parameter.default}`).join(", ")}): ${member.return?.type?.text ?? "void"}`,
                    },
                  ],
            ),
            slots: (element.slots ?? []).map(named),
            events: (element.events ?? []).map((event) => ({
              ...named(event),
              type: event.type?.text ?? "Event",
              ...(event as typeof event & { "x-acme-options"?: { bubbles?: boolean; composed?: boolean; cancelable?: boolean } })["x-acme-options"],
            })),
            parts: (element.cssParts ?? []).map(named),
            cssProperties: (element.cssProperties ?? []).map((property) => ({ ...named(property), default: property.default ?? "" })),
            states: (element["x-acme-states"] ?? []).map(named),
          },
        ];
      }),
    )
    .sort((a, b) => a.tag.localeCompare(b.tag));
}

/** One set of factual rows feeds both the website and Markdown references. */
export function apiSections(element: ElementApi): ApiSection[] {
  const flag = (value?: boolean) => (value === undefined ? "Not declared" : String(value));
  return [
    {
      heading: "Attributes and properties",
      headings: ["Attribute", "Property", "Type", "Default", "Access", "Inherited from", "Description"],
      codeColumns: [0, 1, 2, 3, 5],
      rows: element.props.map((p) => [
        p.attribute === false ? "—" : p.attribute,
        p.name,
        p.type,
        p.default || "—",
        p.readonly ? "Read only" : p.reset === "undefined" ? "Set or omit" : "Set",
        p.inherited || "—",
        p.doc,
      ]),
    },
    {
      heading: "Additional attributes",
      headings: ["Attribute", "Type", "Default", "Description"],
      codeColumns: [0, 1, 2],
      rows: element.attributes.map((a) => [a.name, a.type, a.default || "—", a.doc]),
    },
    { heading: "Methods", headings: ["Signature", "Inherited from", "Description"], codeColumns: [0, 1], rows: element.methods.map((m) => [m.signature, m.inherited || "—", m.doc]) },
    { heading: "Slots", headings: ["Name", "Description"], codeColumns: [0], rows: element.slots.map((s) => [s.name || "(default)", s.doc]) },
    {
      heading: "Events",
      headings: ["Event", "Type", "Bubbles", "Composed", "Cancelable", "Inherited from", "Description"],
      codeColumns: [0, 1, 5],
      rows: element.events.map((e) => [e.name, e.type, flag(e.bubbles), flag(e.composed), flag(e.cancelable), e.inherited || "—", e.doc]),
    },
    { heading: "CSS parts", headings: ["Part", "Description"], codeColumns: [0], rows: element.parts.map((p) => [p.name, p.doc]) },
    { heading: "CSS custom properties", headings: ["Property", "Default", "Description"], codeColumns: [0, 1], rows: element.cssProperties.map((p) => [p.name, p.default || "—", p.doc]) },
    { heading: "Custom states", headings: ["State", "Description"], codeColumns: [0], rows: element.states.map((s) => [s.name, s.doc]) },
  ].filter((section) => section.rows.length > 0);
}

export function readApi(): ElementApi[] {
  const file = path.join(ROOT, "dist/custom-elements.json");
  if (!fs.existsSync(file)) {
    throw new Error("Build the package before the documentation: bun run build");
  }
  const manifest = JSON.parse(fs.readFileSync(file, "utf8"));
  if (manifest["x-acme-version"] !== readCorePackage(ROOT).version) {
    throw new Error("Rebuild the package: documentation and manifest versions differ");
  }
  return apiFromManifest(manifest as Package);
}
if (import.meta.main) {
  console.log(JSON.stringify(readApi(), null, 2));
}
