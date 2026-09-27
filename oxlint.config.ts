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
    // Constructor identity and prototype ancestry are the behavior under test; empty fixture classes provide those distinct identities.
    { files: ["src/shared/__tests__/registration.test.ts"], rules: { "typescript/no-extraneous-class": "off" } },
    // The fixtures bind these handles after construction; their callbacks must see undefined during initial synchronization.
    { files: ["src/shared/__tests__/native-form.test.ts"], rules: { "prefer-const": "off" } },
    // insertBefore handles a null sibling and appends into an empty parent; using sibling.before without preserving that case changes behavior.
    { files: ["src/shared/static-styles.ts", "src/components/json-view/json-view.ts"], rules: { "unicorn/prefer-modern-dom-apis": "off" } },
    // The cover texture hash intentionally wraps to signed32 bits on each character; Math.trunc is not equivalent.
    { files: ["src/components/book/book.ts"], rules: { "unicorn/prefer-math-trunc": "off" } },
    // Abortable work observes success/failure on the original Promise independently and removes the abort listener in each branch; chaining catch changes the error boundary.
    { files: ["src/shared/flow-layout.ts"], rules: { "promise/prefer-catch": "off", "promise/prefer-await-to-callbacks": "off" } },
    // A synchronous scheduler attaches a guarded asynchronous positioning result and error callback; it does not return an owned awaitable task.
    { files: ["src/shared/overlay-placement.ts"], rules: { "promise/prefer-await-to-callbacks": "off" } },
    // Snapshot traversal seeds and cycle-peeling collections before recursive visits or deletions mutate them.
    { files: ["scripts/manifest.ts", "tools/geist/gen.ts"], rules: { "unicorn/no-useless-spread": "off" } },
    // Separate interpolation delimiters make the generated CSS-to-template escaping boundary explicit and keep the fixture independent of interpolation.
    { files: ["scripts/styles.ts", "scripts/__tests__/styles.test.ts"], rules: { "eslint/no-useless-concat": "off" } },
    // These modules remove known dictionary keys to restore actual absence/inheritance; assigning undefined is not equivalent. no-array-delete remains enabled.
    {
      files: ["src/shared/theme-scope.ts", "src/shared/typography-element.ts", "packages/react/src/create-component.ts", "scripts/styles.ts", "tools/geist/gen.ts"],
      rules: { "typescript/no-dynamic-delete": "off" },
    },
    // The patched date runtime exports a value and corresponding TypeScript type with the same approved public name.
    { files: ["src/shared/date.ts"], rules: { "no-redeclare": "off" } },
    // These callbacks run synchronously inside find/filter/replace, or share the explicitly coalesced watch state. They do not capture a per-iteration value for later execution.
    { files: ["src/components/tree-view/tree-view.ts", "tools/geist/gen.ts", "scripts/dev.ts"], rules: { "no-loop-func": "off" } },
    // Compile trusted authored examples or validate local fixture syntax. No remotely supplied code enters these functions; general runtime eval restrictions remain enabled.
    { files: ["site/app/example.ts", "site/__tests__/format.test.ts", "site/__tests__/recipes.test.ts", "site/build.ts", "tools/geist/census.js"], rules: { "no-new-func": "off" } },
    // This same census collector runs as an injected classic browser script and exposes its pure helpers to Bun tests through conditional module.exports.
    { files: ["tools/geist/census.js"], rules: { "unicorn/prefer-module": "off" } },
    // Generator reduction computes a shrinking Set intersection, not an accumulating copied array; the numeric accumulation heuristic does not apply.
    { files: ["tools/geist/gen.ts"], rules: { "oxc/no-accumulating-spread": "off" } },
    // These already checked branches intentionally call one side-effect path or its alternative; unused non-effectful expressions are still rejected.
    { files: ["src/components/tree-view/tree-view.ts", "tools/geist/census.js"], rules: { "no-unused-expressions": ["error", { allowTernary: true, allowShortCircuit: true }] } },
    // Snapshot live Set/Map/DOM collections before callbacks remove/reconnect members; direct iteration is not equivalent.
    {
      files: ["src/shared/theme-context.ts", "src/shared/composed-participants.ts", "src/shared/field-association.ts", "src/shared/toast-store.ts", "packages/devtools/src/diagnostics.ts"],
      rules: { "unicorn/no-useless-spread": "off" },
    },
    // This module posts to Worker instances. Worker.postMessage accepts transfer/options, not Window targetOrigin.
    { files: ["examples/table/worker-session.ts"], rules: { "unicorn/require-post-message-target-origin": "off" } },
    // These strings deliberately contain executable template source for examples, extraction fixtures and lint fixtures; early interpolation would break them.
    {
      files: [
        "site/pages/components/button.ts",
        "site/pages/components/code-block.ts",
        "site/pages/components/scroll-area.ts",
        "scripts/__tests__/entries.test.ts",
        "scripts/__tests__/lint-policy.test.ts",
      ],
      rules: { "no-template-curly-in-string": "off" },
    },
    // Sparse allocation preserves missing positions or tests invalid sparse slider inputs; Array.from/fill changes holes into values.
    { files: ["src/shared/responsive-input.ts", "src/components/slider/__tests__/slider-values.test.ts"], rules: { "unicorn/no-new-array": "off" } },
    // Required regression inputs distinguish holes from explicit undefined/null; the normalization contract tests these cases.
    { files: ["src/shared/__tests__/responsive-input.test.ts", "src/shared/__tests__/responsive.test.ts"], rules: { "no-sparse-arrays": "off" } },
    // Concrete base classes supply deliberate optional extension hooks; callers can invoke the method unconditionally without forcing an override.
    {
      files: [
        "src/shared/semantic-element.ts",
        "src/shared/action-element.ts",
        "src/shared/single-line-control.ts",
        "src/shared/text-control.ts",
        "src/shared/option-control.ts",
        "src/shared/selection-control.ts",
        "src/shared/roving-tabindex.ts",
      ],
      rules: { "no-empty-function": ["error", { allow: ["methods"] }] },
    },
  ],
  rules: {
    ...core.rules,
    // Comments name deliberately exhaustive switches and keys intentionally left to native behavior.
    "default-case": ["error", { commentPattern: "^no default:" }],
    // Typed conversion callbacks retain their declared parameter boundary instead of widening to a built-in constructor.
    "unicorn/prefer-native-coercion-functions": "off",
    // Explicit literal annotations are valid public/manifest type contracts.
    "typescript/prefer-as-const": "off",
    // Date snapshots explicitly copy epoch milliseconds and do not depend on subclass primitive conversion.
    "unicorn/consistent-date-clone": "off",
    // typeof also safely handles absent optional platform globals; both undefined checks remain valid.
    "unicorn/no-typeof-undefined": "off",
    // Namespace/default imports have different module shapes; both are intentional in dynamic Bun fixtures.
    "unicorn/import-style": "off",
    // Both Array<T> and T[] preserve existing public type contracts; a syntax migration is not required.
    "typescript/array-type": "off",
    // Lexically separate callbacks reuse the same domain names (row, item, value); restricted global names remain protected.
    "no-shadow": "off",
    // Hoisted functions and later-bound callback dependencies are intentional; TypeScript remains the initialization-order check.
    "no-use-before-define": ["error", { functions: false, variables: false, classes: true, ignoreTypeReferences: true }],
    // Hoisted function declarations and local expression callbacks are both intentional (scripts/styles.ts and component callbacks); converting declarations can change initialization/cycle behavior.
    "func-style": "off",
    // Multiple related local bindings use one declaration with ordered initializers; Oxfmt supplies consistent layout without rewriting declaration structure.
    "one-var": "off",
    // Inline type specifiers keep a dependency in one import declaration; separate type imports remain valid where an entire declaration is type-only.
    "import/consistent-type-specifier-style": "off",
    // Public controller/owner interfaces use method signatures. Changing methods into function properties changes TypeScript variance and is not a formatting migration.
    "typescript/method-signature-style": "off",
    // Generator and documentation code deliberately compose strings containing template syntax. Both concatenation and template literals remain supported; coercion hints can differ.
    "prefer-template": "off",
    // Loop counters and monotonic component IDs use standard increment/decrement operators; the numeric type is checked separately.
    "no-plusplus": "off",
    // Preserve authored dependency declaration order, including re-exports and ordered registration imports; formatting does not reorder the module graph.
    "import/first": "off",
    // Explicit member access makes owner/receiver relationships visible and preserves access timing for reactive getters.
    "prefer-destructuring": "off",
    // CSS/source parsers use numbered capture groups and positional replace callbacks; named captures change match/replace result contracts.
    "prefer-named-capture-group": "off",
    // Lit/native-content classes implement inherited instance hooks even when a particular override returns static content or a constant.
    "class-methods-use-this": "off",
    // Lit render expressions and typed value normalization use conditional expressions; Oxfmt lays them out without moving reads across reactive branches.
    "no-nested-ternary": "off",
    // Existing global regex replacements preserve intentional regex flags and replacement callback behavior. Literal/global regex spelling is not a correctness requirement.
    "unicorn/prefer-string-replace-all": "off",
    // Constructor parameter properties are the existing TypeScript dependency-injection style; expanding them adds repeated declarations without improving ownership.
    "typescript/parameter-properties": "off",
    // Interfaces and type aliases serve distinct extension/composition needs in the approved contracts; no global syntax replacement.
    "typescript/consistent-type-definitions": "off",
    // Mutating sorts are used on owned snapshots and temporary arrays; readonly typing protects immutable inputs. Replacing every sort with copying changes allocation and intended mutation.
    "unicorn/no-array-sort": "off",
    // Small helpers stay with the operation they explain; hoisting closure-free functions is not automatically better module locality.
    "unicorn/consistent-function-scoping": "off",
    // Cases get lexical blocks where needed. no-case-declarations remains enabled; a mandatory extra block around every branch is a separate style convention.
    "unicorn/switch-case-braces": "off",
    // No project-wide cyclomatic threshold was approved. Parsers, keyboard state handling and value validators retain capability-focused tests; do not split domain logic merely to satisfy the preset default20.
    complexity: "off",
    // Attribute APIs preserve exact platform names, handle non-HTMLElement nodes and share code with observed-attribute contracts; dataset is not mandatory.
    "unicorn/prefer-dom-node-dataset": "off",
    // Both plain and separated numeric literals are valid; formatting must preserve literals without a new numeric spelling policy.
    "unicorn/numeric-separators-style": "off",
    // Explicit undefined expresses omitted/reset callback results and public reset/default boundaries; omission is not uniformly clearer.
    "unicorn/no-useless-undefined": "off",
    // concat and spread have different one-level array flattening and symbol-spreadability behavior; retain the chosen operation.
    "unicorn/prefer-spread": "off",
    // Early checks and fallback condition order follow the domain rather than a global positive-first branch style.
    "no-negated-condition": "off",
    // Early checks and fallback condition order follow the domain rather than a global positive-first branch style.
    "unicorn/no-negated-condition": "off",
    // TypeScript flags, DOM position flags and numeric algorithms intentionally use bitwise operators.
    "no-bitwise": "off",
    // Global parseInt/parseFloat/isFinite are legitimate APIs with intentionally chosen coercion behavior; numeric safety rules remain active.
    "unicorn/prefer-number-properties": "off",
    // Native timers, animation frames and callback APIs require explicit Promise construction. Async-promise-executor and multiple-resolution correctness checks stay active.
    "promise/avoid-new": "off",
    // Explicit findIndex result checks express collection positions; no additional spelling rule for equivalent comparisons.
    "unicorn/consistent-existence-index-check": "off",
    // Reading a result immediately after awaited I/O is valid; splitting every read into an extra binding is not a correctness change.
    "unicorn/no-await-expression-member": "off",
    // Short inline comments explain non-obvious arguments and generated-field ownership; their placement is not banned.
    "no-inline-comments": "off",
    // Promise continuations are required in synchronous Lit lifecycle hooks and cleanup paths; async/await remains used where the containing function owns the wait.
    "promise/prefer-await-to-then": "off",
    // Reassigning a local scalar parameter normalizes the received value without mutating the caller. This does not authorize object/property mutation.
    "no-param-reassign": "off",
    // Number construction and unary plus are both supported explicit coercions; numeric validation retains behavioral tests.
    "unicorn/prefer-number-coercion": "off",
    // Private controllers and related helper classes may share a module with one public capability; file count does not determine interface quality.
    "max-classes-per-file": "off",
    // Some coordinated local resets intentionally share one assigned value; the value/order are tested rather than banning assignment syntax.
    "no-multi-assign": "off",
    // Reverse operates on owned arrays/snapshots where mutation is intentional; do not force an additional allocation.
    "unicorn/no-array-reverse": "off",
    // getElementById expresses exact IDs without CSS-selector escaping, while querySelector expresses selectors; both APIs are valid.
    "unicorn/prefer-query-selector": "off",
    // Framework callbacks may intentionally satisfy a Promise-returning contract before they need to await anything.
    "require-await": "off",
    // A nullish check intentionally covers both null and undefined. Other loose equality remains rejected by eqeqeq smart mode.
    "no-eq-null": "off",
    // appendChild returns the appended node; append does not. Keep the selected native API and its return contract.
    "unicorn/prefer-dom-node-append": "off",
    // Synchronous forEach expresses iteration with scoped callbacks; it is not automatically replaced by loop statements.
    "unicorn/no-array-for-each": "off",
    // Direct indexing is the existing typed collection convention; .at() has different negative-index and undefined-return behavior.
    "unicorn/prefer-at": "off",
    // Separate native operations may intentionally establish order or keep ownership steps explicit; do not merge them solely for call-count style.
    "unicorn/prefer-single-call": "off",
    // Callable platform constructors are retained where the platform permits either spelling; actual constructor-only misuse remains a correctness error.
    "unicorn/new-for-builtins": "off",
    // void explicitly marks intentionally discarded results/dependency reads and Promise-returning event work; its use is not limited to standalone statements.
    "no-void": "off",
    // Type annotations and constructor type arguments both express valid generic ownership; no global placement preference.
    "typescript/consistent-generic-constructors": "off",
    // Explicit ./ URL paths are retained in worker/module asset constructors for consistent local-source references.
    "unicorn/relative-url-style": "off",
    // Error subclasses are part of observable behavior; a lint migration does not reclassify errors.
    "unicorn/prefer-type-error": "off",
    // Owner captures support getter objects whose this is the returned object, and parent-walking cursors; typed no-this-alias remains restricted to named owners.
    "unicorn/no-this-assignment": "off",
    // Comma expressions are retained where deliberate evaluation order is part of compact parser/visitor operations.
    "no-sequences": "off",
    // A newly constructed owned array can be mutated before use; immutability applies to published snapshots, not every local temporary.
    "unicorn/no-immediate-mutation": "off",
    // Statement and expression branches follow the operation and side effects; the linter does not force either branch representation.
    "unicorn/prefer-ternary": "off",
    // Some parsers intentionally operate on UTF-16 code units and indices; replacing charCodeAt/code-unit handling changes their contract.
    "unicorn/prefer-code-point": "off",
    // Reducers can express accumulation or set intersection. Algorithmic complexity is reviewed separately; reduce itself is not banned.
    "unicorn/no-array-reduce": "off",
    // Explicit public literal/property types support metadata generation and stable declarations even where an initializer is inferable.
    "typescript/no-inferrable-types": "off",
    // Record and index signatures serve authored public types; no global interface spelling preference.
    "typescript/consistent-indexed-object-style": "off",
    // Small fixed vocabularies may use arrays; an additional Set allocation is not required without measured benefit.
    "unicorn/prefer-set-has": "off",
    // Regex checks may be part of existing parser contracts and flags; string/regex spelling is not uniformly interchangeable.
    "unicorn/prefer-string-starts-ends-with": "off",
    // Public helper entrypoints intentionally re-export the documented surface; they are explicit package boundaries.
    "oxc/no-barrel-file": "off",
    // Catch binding names match their local domain; no fixed variable-name convention is adopted.
    "unicorn/catch-error-name": "off",
    // Numeric literal spelling can reflect reference coefficients. Equal-value textual rewrites are formatting preferences.
    "unicorn/no-zero-fractions": "off",
    // Nullish checks intentionally match null and undefined; other loose comparisons remain errors.
    eqeqeq: ["error", "smart"],
    // Getter objects capture their owner, and parent traversal uses an explicit owner/root cursor.
    "typescript/no-this-alias": ["error", { allowedNames: ["host", "owner", "root"] }],
    // Bun and the existing file/buffer APIs consistently use the valid utf8 spelling.
    "unicorn/text-encoding-identifier-case": ["error", { withDash: false }],
    // Key and declaration order are observable: ordered style inputs and dependent initializers use it.
    "sort-keys": "off",
    // Initializers may depend on earlier bindings; alphabetical declaration order is not a safe convention.
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
    // Preserve the prior explicit noExplicitAny setting; strict TypeScript remains required.
    "typescript/no-explicit-any": "off",
    // Preserve the prior explicit noBannedTypes setting instead of adding an implicit type-spelling migration.
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
