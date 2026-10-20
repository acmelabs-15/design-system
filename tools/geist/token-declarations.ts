import { transform } from "lightningcss";
import { numericTokenProperty, numericTokenValue, type NumericTokenKey } from "../../src/shared/numeric-tokens";

const NUMERIC_SPACING = /^--geist-space(?:-(\d+(?:\.\d+)?)x)?(-negative)?$/;

/** Import named roles and palette values while routing numeric spacing to the shared catalog. */
export function transformTokenDeclaration(declaration: string): string | undefined {
  const colon = declaration.indexOf(":");
  if (colon < 1) {
    throw new TypeError("Expected a CSS token declaration");
  }
  if (NUMERIC_SPACING.test(declaration.slice(0, colon).trim())) {
    return undefined;
  }
  if (!declaration.includes("--geist-space")) {
    return declaration;
  }

  let changed = false;
  let removed = false;
  const result = transform({
    filename: "token-declaration.css",
    code: Buffer.from(`:root { ${declaration}; }`),
    minify: false,
    visitor: {
      Declaration(declaration) {
        if (declaration.property === "custom" && NUMERIC_SPACING.test(declaration.value.name)) {
          removed = true;
          return [];
        }
      },
      VariableExit(variable) {
        const match = NUMERIC_SPACING.exec(variable.name.ident);
        if (!match) {
          return;
        }
        const positive = match[1] === undefined ? 1 : Number(match[1]);
        const key = match[2] ? -positive : positive;
        const value = numericTokenValue("spacing", key);
        changed = true;
        if (variable.fallback?.length) {
          // A fallback can be a CSS-wide keyword or a list, which cannot be negated as a length.
          if (key < 0) {
            throw new TypeError("Unsupported negative numeric token fallback; provide an explicit derived value");
          }
          const replacement = { ...variable, name: { ...variable.name, ident: numericTokenProperty("spacing", positive as NumericTokenKey) } };
          // Omit absent optional fields when sending the parsed value back through the native visitor bridge.
          return { type: "var", value: JSON.parse(JSON.stringify(replacement), (_key, value) => (value === null ? undefined : value)) };
        }
        return { raw: value };
      },
    },
  });
  if (removed) {
    return undefined;
  }
  if (!changed) {
    return declaration;
  }
  const css = result.code.toString();
  return css
    .slice(css.indexOf("{") + 1, css.lastIndexOf("}"))
    .trim()
    .replace(/;$/, "");
}
