import { defineConfig } from "oxfmt";
import preset from "ultracite/oxfmt";

export default defineConfig({
  ...preset,
  printWidth: 200,
  // At 200 columns Oxfmt relocates an inline JSDoc onto Entry.ancestors; 280 preserves its attachment.
  overrides: [{ files: ["tools/geist/gen.ts"], options: { printWidth: 280 } }],
  tabWidth: 2,
  useTabs: false,
  trailingComma: "all",
  sortImports: false,
  sortPackageJson: false,
  sortTailwindcss: false,
  // Lit strings and executable documentation examples must retain their authored text.
  embeddedLanguageFormatting: "off",
  htmlWhitespaceSensitivity: "strict",
  ignorePatterns: [
    ...(preset.ignorePatterns ?? []),
    // Authored CSS is checked by Stylelint; the CSS compiler owns its generated layout.
    "**/*.css",
    "docs/**",
    "_site/**",
    ".artifacts/**",
    "src/define/**",
    "src/internal/define/**",
    "src/all.ts",
    "packages/*/.build-src/**",
    "tools/geist/corpus/**",
    "package.json",
    "packages/*/package.json",
  ],
});
