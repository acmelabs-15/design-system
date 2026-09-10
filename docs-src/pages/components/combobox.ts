// Docs page: Combobox — mirrors https://vercel.com/geist/combobox
import type { Doc } from "../../site";

const three = `<acme-combobox-option value="a">One</acme-combobox-option><acme-combobox-option value="b">Two</acme-combobox-option><acme-combobox-option value="c">Three</acme-combobox-option>`;
/** The reference's 16px logo mark, sized by its attributes like the icons a row takes. */
const logo = (slot: string) =>
  `<svg viewBox="0 0 16 16" width="16" height="16" slot="${slot}" fill="none" style="color:currentColor" aria-hidden="true"><path fill="currentColor" d="M8 1 16 15H0L8 1Z"/></svg>`;
const withLogo = (slot: string, truncateLast = false) =>
  `<acme-combobox-option value="a">${logo(slot)}One</acme-combobox-option><acme-combobox-option value="b">${logo(slot)}Two</acme-combobox-option><acme-combobox-option value="c"${truncateLast ? ` truncate-${slot}` : ""}>${logo(slot)}Three</acme-combobox-option>`;
const lorem = `<acme-combobox-option value="a">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</acme-combobox-option><acme-combobox-option value="b">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</acme-combobox-option><acme-combobox-option value="c">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</acme-combobox-option>`;
/** A two-line row: the variable name in mono over its target. */
const twoLine = (key: string, target: string) =>
  `<acme-combobox-option ignore-default-height value="${key}::${target}"><div class="vstack" style="gap:0;padding:15px 8px"><p class="text-copy-14-mono" style="font-weight:500">${key}</p><p class="text-label-12" style="margin-top:3px;color:var(--ds-gray-900)">${target}</p></div></acme-combobox-option>`;

const sharedVars: [string, string][] = [
  ["CONTENTFUL_MANAGEMENT_APP_INSTALLATION_ID", "Preview and Production"],
  ["EXTENSION_AUTH_JWT_SECRET", "Development"],
  ["SCREENSHOT_SECRET_DEPLOYMENT_SUMMARY", "failover"],
  ["FLAGS_VERCEL_MARKETING", "Preview and Production"],
  ["FLAGS_VERCEL_MARKETING", "Development"],
  ["FLAGS_VERCEL_MARKETING", "Preview"],
  ["DATABASE_URL", "Production"],
  ["REDIS_URL", "Preview and Production"],
  ["STRIPE_SECRET_KEY", "Production"],
  ["STRIPE_WEBHOOK_SECRET", "Development"],
  ["OPENAI_API_KEY", "Preview and Production"],
  ["SENTRY_AUTH_TOKEN", "Preview"],
  ["NEXT_PUBLIC_ANALYTICS_ID", "Development"],
  ["AWS_ACCESS_KEY_ID", "Production"],
  ["AWS_SECRET_ACCESS_KEY", "Production"],
  ["GITHUB_APP_PRIVATE_KEY", "Preview and Production"],
];
const sharedOptions = sharedVars.map(([key, target]) => twoLine(key, target)).join("");

/** Room under an open field for its list, so the census page's examples do not sit on each other. */
const box = (h: number, inner: string) => `<div style="min-height:${h}px">${inner}</div>`;
/** Opens every field in the example, as a focus or a click on the reference does. */
const openAll = "for (const c of root.querySelectorAll('acme-combobox')) c.open = true;";
/** Focuses the field from the keys, then closes the list with Escape: the closed field keeps its keyboard focus ring. */
const keyboardFocus =
  "const c = root.querySelector('acme-combobox');\nc.updateComplete.then(() => {\n  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));\n  c.focus();\n  c.shadowRoot.querySelector('input').dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));\n});";

export const doc: Doc = {
  id: "combobox",
  title: "Combobox",
  lede: "Filters a large list down to the options that match what the user types.",
  tags: ["acme-combobox", "acme-combobox-option"],
  examples: [
    {
      h: "Uncontrolled",
      html: `<acme-combobox aria-label="Search" placeholder="Search...">${three}</acme-combobox>`,
    },
    {
      h: "Controlled",
      html: `<acme-combobox aria-label="Search" placeholder="Search..." value="b">${three}</acme-combobox>`,
      script: "const combobox = root.querySelector('acme-combobox');\ncombobox.addEventListener('acme-change', (e) => {\n  combobox.value = e.detail.value ?? '';\n});",
    },
    {
      h: "Disabled",
      html: `<acme-combobox aria-label="Search" disabled placeholder="Search...">${three}</acme-combobox>`,
    },
    {
      h: "Errored",
      html: `<acme-combobox aria-label="Search" errored placeholder="Search...">${three}</acme-combobox>`,
    },
    {
      h: "Custom width input",
      html: `<acme-combobox aria-label="Search" placeholder="Search..." width="256">${three}</acme-combobox>`,
    },
    {
      h: "Custom width list",
      html: `<acme-combobox aria-label="Search" placeholder="Search..." list-max-width="500">${lorem}</acme-combobox>`,
    },
    {
      h: "Custom empty message",
      html: `<acme-combobox aria-label="Search" placeholder="Search..." width="256" empty-message="Nothing to see here..."></acme-combobox>`,
    },
    {
      h: "Clearable",
      p: "Set `clearable` to show a clear button once a value is selected.",
      html: `<acme-combobox aria-label="Search" clearable placeholder="Search..." value="two"><acme-combobox-option value="one">one</acme-combobox-option><acme-combobox-option value="two">two</acme-combobox-option><acme-combobox-option value="three">three</acme-combobox-option></acme-combobox>`,
    },
    {
      h: "With prefix icons",
      html: `<acme-combobox aria-label="Search" placeholder="Search..." style="width:fit-content">${withLogo("prefix")}</acme-combobox>`,
    },
    {
      h: "With suffix icons",
      html: `<acme-combobox aria-label="Search" placeholder="Search..." style="width:fit-content">${withLogo("suffix")}</acme-combobox>`,
    },
    {
      h: "With label",
      html: `<div class="vstack" style="gap:8px"><label class="text-label-14" style="color:var(--ds-gray-900)" for="combobox-country">Select your country</label><acme-combobox aria-label="Select your country" id="combobox-country" placeholder="Search countries…"><acme-combobox-option value="us">United States</acme-combobox-option><acme-combobox-option value="ca">Canada</acme-combobox-option><acme-combobox-option value="uk">United Kingdom</acme-combobox-option><acme-combobox-option value="de">Germany</acme-combobox-option><acme-combobox-option value="fr">France</acme-combobox-option><acme-combobox-option value="jp">Japan</acme-combobox-option><acme-combobox-option value="au">Australia</acme-combobox-option><acme-combobox-option value="br">Brazil</acme-combobox-option></acme-combobox></div>`,
    },
    {
      h: "Sizes",
      html: `<div class="row-md" style="gap:16px;align-items:stretch"><acme-combobox aria-label="Search" placeholder="Search..." size="small">${three}</acme-combobox><acme-combobox aria-label="Search" placeholder="Search...">${three}</acme-combobox><acme-combobox aria-label="Search" placeholder="Search..." size="large">${three}</acme-combobox></div>`,
    },
    {
      h: "Used inside a Modal",
      p: "A Combobox often sits inside a Modal. On mobile the Modal becomes a bottom sheet by itself.",
      html: `<div class="row" style="gap:16px"><acme-button size="small">Open Modal</acme-button><acme-modal heading="Create Token"><p slot="subtitle">Enter a unique name for your token to differentiate it from other tokens and then select the scope.</p><acme-modal-inset><div class="vstack" style="gap:10px"><acme-label>Region</acme-label><acme-combobox aria-label="Region" placeholder="Search..." size="small">${three}</acme-combobox><p class="text-copy-13" style="color:var(--ds-gray-900)">This is the region where your database reads and writes will take place.</p></div></acme-modal-inset><acme-button slot="actions" variant="secondary">Cancel</acme-button><acme-button slot="actions">Submit</acme-button></acme-modal></div>`,
      script:
        "const modal = root.querySelector('acme-modal');\nroot.querySelector('acme-button').addEventListener('click', () => modal.show());\nfor (const action of modal.querySelectorAll('[slot=actions]')) action.addEventListener('click', () => modal.close());",
    },
    {
      h: "Inside a Sheet with multi-line options",
      p: "An option opts out of the fixed row height with `ignore-default-height` and renders multi-line content, such as a shared environment variable name with its target. The list sizes each row to its content and still scrolls.",
      html: `<acme-button size="small">Link Shared Variable</acme-button><acme-sheet heading="Link Shared Variable"><p slot="header" class="text-copy-14 muted">Changes to shared variables sync automatically across all linked projects.</p><acme-combobox aria-label="Search for shared environment variables" placeholder="Search for shared environment variables…">${sharedOptions}</acme-combobox></acme-sheet>`,
      script:
        "const sheet = root.querySelector('acme-sheet');\nconst combobox = root.querySelector('acme-combobox');\nroot.querySelector('acme-button').addEventListener('click', () => sheet.show());\n// A chosen variable is linked: it leaves the list.\ncombobox.addEventListener('acme-change', (e) => {\n  const value = e.detail.value;\n  if (!value) return;\n  for (const option of combobox.querySelectorAll('acme-combobox-option')) if (option.value === value) option.remove();\n  combobox.value = '';\n});",
    },
    {
      h: "Open",
      census: true,
      p: "The field open: the first row highlighted, the chevron turned.",
      html: box(220, `<acme-combobox aria-label="Search" placeholder="Search...">${three}</acme-combobox>`),
      script: openAll,
    },
    {
      h: "Open with value",
      census: true,
      p: "A chosen value: its label in the field, the clear button in place of the chevron, the chosen row marked with a check.",
      html: box(220, `<acme-combobox aria-label="Search" placeholder="Search..." value="b">${three}</acme-combobox>`),
      script: openAll,
    },
    {
      h: "Open with a disabled option",
      census: true,
      p: "A disabled row fades and takes no pointer.",
      html: box(
        220,
        `<acme-combobox aria-label="Search" placeholder="Search..."><acme-combobox-option value="a">One</acme-combobox-option><acme-combobox-option value="b" disabled>Two</acme-combobox-option><acme-combobox-option value="c">Three</acme-combobox-option></acme-combobox>`,
      ),
      script: openAll,
    },
    {
      h: "Open empty",
      census: true,
      p: "No row: the list holds the empty message, the default one and a custom one.",
      html: box(
        300,
        `<div class="vstack" style="gap:16px"><acme-combobox aria-label="Search" placeholder="Search..."></acme-combobox><acme-combobox aria-label="Search" placeholder="Search..." empty-message="Nothing to see here..."></acme-combobox></div>`,
      ),
      script: openAll,
    },
    {
      h: "Open loading",
      census: true,
      p: "A spinner replaces the glass while `loading`.",
      html: box(220, `<acme-combobox aria-label="Search" placeholder="Search..." loading>${three}</acme-combobox>`),
      script: openAll,
    },
    {
      h: "Open sizes",
      census: true,
      p: "The three sizes open: the rows follow the field's text size.",
      html: box(
        560,
        `<div class="vstack" style="gap:16px"><acme-combobox aria-label="Search" placeholder="Search..." size="small">${three}</acme-combobox><acme-combobox aria-label="Search" placeholder="Search...">${three}</acme-combobox><acme-combobox aria-label="Search" placeholder="Search..." size="large">${three}</acme-combobox></div>`,
      ),
      script: openAll,
    },
    {
      h: "Open errored",
      census: true,
      p: "The errored field open with a value: the red ring, red text and a red clear button.",
      html: box(220, `<acme-combobox aria-label="Search" placeholder="Search..." errored value="b">${three}</acme-combobox>`),
      script: openAll,
    },
    {
      h: "Open with prefix and suffix icons",
      census: true,
      p: "Rows with a prefix icon (the last one truncated), and rows with a suffix icon on a chosen value (the last one truncated).",
      html: box(
        420,
        `<div class="vstack" style="gap:16px"><acme-combobox aria-label="Search" placeholder="Search...">${withLogo("prefix", true)}</acme-combobox><acme-combobox aria-label="Search" placeholder="Search..." value="b">${withLogo("suffix", true)}</acme-combobox></div>`,
      ),
      script: openAll,
    },
    {
      h: "Open custom width list",
      census: true,
      p: "The list may grow past the field to `list-max-width`; long labels truncate.",
      html: box(220, `<acme-combobox aria-label="Search" placeholder="Search..." list-max-width="500">${lorem}</acme-combobox>`),
      script: openAll,
    },
    {
      h: "Open multi-line options",
      census: true,
      p: "Rows with `ignore-default-height` take their content's height.",
      html: box(
        240,
        `<acme-combobox aria-label="Search" placeholder="Search for shared environment variables…">${twoLine("DATABASE_URL", "Production")}${twoLine("REDIS_URL", "Preview and Production")}</acme-combobox>`,
      ),
      script: openAll,
    },
    {
      h: "Open with a footer",
      census: true,
      p: "The `footer` slot renders under the rows; the arrows reach its control from the list's ends.",
      html: box(220, `<acme-combobox aria-label="Search" placeholder="Search...">${three}<acme-button slot="footer" size="small" variant="secondary">Create new</acme-button></acme-combobox>`),
      script: openAll,
    },
    {
      h: "Field variants",
      census: true,
      p: 'The field without its glass (`no-input-prefix`), without the menu button (`show-menu-button="false"`), and with the chosen row\'s suffix beside the field (`display-selected-suffix`).',
      html: `<div class="vstack" style="gap:16px"><acme-combobox aria-label="Search" placeholder="Search..." no-input-prefix>${three}</acme-combobox><acme-combobox aria-label="Search" placeholder="Search..." show-menu-button="false">${three}</acme-combobox><acme-combobox aria-label="Search" placeholder="Search..." display-selected-suffix value="b">${withLogo("suffix")}</acme-combobox></div>`,
    },
    {
      h: "Keyboard focus",
      census: true,
      p: "The closed field focused from the keys keeps the focus ring.",
      html: `<acme-combobox aria-label="Search" placeholder="Search...">${three}</acme-combobox>`,
      script: keyboardFocus,
    },
  ],
  practices: {
    "When to use": [
      "A Combobox is for typing to narrow a known list: regions, frameworks, environment variable names.",
      "A short fixed list where typing adds nothing is a Select.",
      "Several values at once is a Multi Select.",
      "A free-form filter string that maps to no single option is an Input in its search form.",
    ],
    Behavior: [
      "Async results show a loading state; the list stays open while the request runs.",
      'The empty state names the query: No {items} match "{query}", not a bare No results.',
      "Inside a Modal the Modal turns into a bottom sheet on mobile by itself; no second layer is needed.",
      "Arrow keys move through the options; Enter picks an option while the list is open and never submits the form around it.",
    ],
    Content: [
      "The visible label is a short Title Case noun (Region, Environment Variable Name).",
      "The placeholder is the inline hint (Search regions, DATABASE_URL): never a bare Search… and never the label again.",
      "Option text is Title Case for short values and follows the product's own spelling (Next.js, not NextJS), in one register across the list.",
      "A validation message names the field and the constraint, in sentence case with a period (Select a region.).",
    ],
    Accessibility: [
      "The element has no label prop: pair a sibling label whose for names the element's id, or set aria-label for an icon-only trigger.",
      "aria-label is the only name attribute; there is no aria-labelledby, so the sibling label is the way to point at visible text.",
      "Inside a Modal, focus stays in the list, so Tab moves through the options and not the page behind.",
    ],
  },
};
