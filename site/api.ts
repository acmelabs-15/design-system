import fs from "node:fs";
import path from "node:path";
import type { ClassDeclaration, CustomElement, Package } from "custom-elements-manifest/schema";

export type Prop = { name: string; attribute: string | false; type: string; default: string; doc: string };
export type ElementApi = { tag: string; className: string; file: string; doc: string; props: Prop[]; slots: string[]; events: string[]; parts: string[] };

const ROOT = path.resolve(import.meta.dir, "..");

export function apiFromManifest(manifest: Package): ElementApi[] {
  return manifest.modules
    .flatMap((module) =>
      (module.declarations ?? []).flatMap((declaration) => {
        if (declaration.kind !== "class" || !("tagName" in declaration) || !declaration.tagName) return [];
        const element = declaration as ClassDeclaration & CustomElement;
        const source = (module as unknown as Record<string, unknown>)["x-acme-source"];
        if (typeof source !== "string") throw new Error("Element manifest lacks source location: " + module.path);
        return [
          {
            tag: element.tagName!,
            className: element.name,
            file: source,
            doc: element.description ?? "",
            props: (element.members ?? []).flatMap<Prop>((member) =>
              member.kind !== "field" || member.static || member.privacy === "private" || member.privacy === "protected"
                ? []
                : [
                    {
                      name: member.name,
                      attribute: element.attributes?.find((attribute) => attribute.fieldName === member.name)?.name ?? false,
                      type: member.type?.text ?? "",
                      default: member.default ?? "",
                      doc: member.description ?? "",
                    },
                  ],
            ),
            slots: (element.slots ?? []).map((slot) => slot.name || "(default)"),
            events: (element.events ?? []).map((event) => event.name),
            parts: (element.cssParts ?? []).map((part) => part.name),
          },
        ];
      }),
    )
    .sort((a, b) => a.tag.localeCompare(b.tag));
}

export function readApi(): ElementApi[] {
  const file = path.join(ROOT, "dist/custom-elements.json");
  if (!fs.existsSync(file)) throw new Error("Build the package before the documentation: bun run build");
  return apiFromManifest(JSON.parse(fs.readFileSync(file, "utf8")) as Package);
}

if (import.meta.main) console.log(JSON.stringify(readApi(), null, 2));
