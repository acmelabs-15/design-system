import catalog from "../assets/material-symbols/catalog.json";
const names = new Set(catalog.symbols.map((symbol) => symbol.name.replaceAll("_", "-")));
/** Named icon markup for authored documentation examples. */
export function iconMarkup(name: string, attributes = ""): string {
  if (!names.has(name)) throw new Error("Unknown documentation icon: " + name);
  return `<acme-${name}-icon class="ic" size="16px"${attributes}></acme-${name}-icon>`;
}
