# React preferences consumer evaluation

Uses exact core/wrapper 0.2.0 and React/ReactDOM 19.3.0. Run `bun run build`, then `bun start`; open http://localhost:4313. Parent node_modules supplies these installed packages.

Individual typed wrappers own their behavior. Tabs uses manual keyboard activation: arrows move focus; Enter or Space activates. Source contains a React stateful editor with ordinary children, so tab changes preserve its local state and DOM node. Radio Group owns plan selection; Group attaches and stretches Radio Cards. The outer controls unmount/remount the whole preferences panel and replace callback closures. Strict Mode is enabled.

Run `bun verify.mjs` for browser checks. Typecheck command: `bun /Users/peterkloss/Dev/ACMElabs/design-system/node_modules/typescript/bin/tsc -p tsconfig.json`.

Evidence: result.json preserves original failures and repairs; first-run.json and second-run.json preserve test attempts. ax.json uses native Chromium accessibility names. preferences.png shows the final artifact. No package files were changed.

All ten functional checks pass. Visual QA records one unresolved package observation: after activating Output, its panel appears and its native tab is selected, but the underline remains below Source. See preferences.png and indicator.json. Package source is unchanged.
