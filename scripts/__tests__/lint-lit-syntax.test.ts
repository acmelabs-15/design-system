import { expect, test } from "bun:test";
import stylelint from "stylelint";
import cssConfig from "../../stylelint.config";
import { lintLitSyntax } from "../lint-lit-syntax";

test("raw CSS and Lit CSS retain unknown-property and accidental duplicate checks", async () => {
  const invalid = ".example { colour: red; color: red; color: red; }";
  for (const embedded of [false, true]) {
    const result = await stylelint.lint({
      code: embedded ? "const styles = css`" + invalid + "`;" : invalid,
      codeFilename: embedded ? "fixture.ts" : "fixture.css",
      config: cssConfig,
      ...(embedded ? { customSyntax: lintLitSyntax } : {}),
    });
    expect(result.errored).toBe(true);
    expect(result.results[0]?.warnings.map((warning) => warning.rule).sort()).toEqual(["declaration-block-no-duplicate-properties", "property-no-unknown"]);
  }
});

test("a JavaScript source-map string does not become the TypeScript file source map", async () => {
  const code = 'const source = "/*# sourceMappingURL=data:application/json;base64," + data + " */";\nconst styles = css`.example { colour: red; }`;';
  const result = await stylelint.lint({ code, codeFilename: "fixture.ts", config: cssConfig, customSyntax: lintLitSyntax });
  expect(result.results[0]?.warnings.map((warning) => warning.rule)).toEqual(["property-no-unknown"]);
});

test("invalid templates fail rather than silently losing CSS coverage", () => {
  expect(() => lintLitSyntax.parse("const styles = css`.example { color: red;`;", { from: "fixture.ts" })).toThrow("CSS template coverage failure");
  expect(() => lintLitSyntax.parse("// postcss-lit-disable-next-line\nconst styles = css`.example { color: red; }`;", { from: "fixture.ts" })).toThrow("CSS template coverage failure");
});

test("consecutive different-value fallbacks pass while custom-property duplication fails", async () => {
  const valid = await stylelint.lint({ code: ".example { color: #ff0000; color: oklch(60% 0.2 30); }", config: cssConfig });
  expect(valid.errored).toBe(false);
  const invalid = await stylelint.lint({ code: ".example { --tone: red; --tone: red; }", config: cssConfig });
  expect(invalid.errored).toBe(true);
  expect(invalid.results[0]?.warnings[0]?.rule).toBe("declaration-block-no-duplicate-custom-properties");
});
