import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";

export default defineConfig({
  ...core,
  ignorePatterns: [
    ...(core.ignorePatterns ?? []),
    "docs/**",
    "_site/**",
    ".artifacts/**",
    "src/define/**",
    "src/internal/define/**",
    "src/register/**",
    "src/internal/register/**",
    "src/all.ts",
    "packages/*/.build-src/**",
    "tools/geist/corpus/**",
  ],
  overrides: [
    ...(core.overrides ?? []),
    // Constructor identity and prototype ancestry are the behavior under test.
    { files: ["src/shared/__tests__/registration.test.ts"], rules: { "typescript/no-extraneous-class": "off" } },
  ],
  rules: {
    ...core.rules,
    // Key and declaration order are observable: ordered style inputs and dependent initializers use it.
    "sort-keys": "off",
    "sort-vars": "off",
    // Sequential cleanup, overlays, builds and browser checks intentionally await each operation.
    "no-await-in-loop": "off",
    // Lit controllers register themselves with their host during construction.
    "no-new": "off",
    // Unicode mode changes regexp grammar and matching; each expression chooses its flags.
    "require-unicode-regexp": "off",
    // Getter overrides can be read by a base constructor before subclass fields initialize.
    "typescript/class-literal-property-style": "off",
    // Preserve the three explicit TypeScript conventions from the previous configuration.
    "typescript/no-non-null-assertion": "off",
    "typescript/no-explicit-any": "off",
    "typescript/ban-types": "off",
    // These tags are inputs to the custom-elements manifest generator.
    "jsdoc/check-tag-names": [
      "error",
      {
        definedTags: [
          "attr",
          "attribute",
          "csspart",
          "cssprop",
          "cssproperty",
          "slot",
          "fires",
          "event",
          "element",
          "customElement",
          "tagname",
          "default",
          "acmeDefault",
          "acmeNativeRoot",
          "acmeNativeContentTarget",
          "internal",
        ],
      },
    ],
  },
});
