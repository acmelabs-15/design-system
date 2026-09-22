import type { Doc } from "../../site";
export const doc: Doc = {
  id: "number-input",
  title: "Number Input",
  house: true,
  lede: "Edit localized numbers with decimal steps, limits and optional press-and-hold actions.",
  tags: ["acme-number-input", "acme-number-input-increment", "acme-number-input-decrement"],
  examples: [
    { h: "Default", html: '<acme-field><span slot="label">Quantity</span><acme-number-input name="quantity" value="1" min="0" max="100"></acme-number-input></acme-field>' },
    { h: "Decimal steps", html: '<acme-number-input aria-label="Distance" value="0.1" step="0.1" large-step="1" small-step="0.01"></acme-number-input>' },
    { h: "Localized currency", html: `<acme-number-input aria-label="Amount" locale="en-US" value="$25.50" format-options='{"style":"currency","currency":"USD"}'></acme-number-input>` },
    {
      h: "Percent",
      p: "A percent format uses 0.01 as the default numeric step. A value of 12% submits as 0.12.",
      html: `<acme-number-input aria-label="Tax" value="12%" locale="en-US" format-options='{"style":"percent"}'></acme-number-input>`,
    },
    { h: "Locale", html: '<acme-number-input aria-label="German amount" locale="de-DE" value="1.234,5" step="0.1"></acme-number-input>' },
    {
      h: "Custom actions",
      html: '<acme-number-input aria-label="Guests" value="2" min="1" max="10"><acme-number-input-decrement><acme-remove-icon></acme-remove-icon></acme-number-input-decrement><acme-number-input-increment><acme-add-icon></acme-add-icon></acme-number-input-increment></acme-number-input>',
    },
    {
      h: "Native form",
      html: '<form id="number-form-example"><acme-field required><span slot="label">Seats</span><acme-number-input name="seats" min="1" max="20" value="3" required></acme-number-input></acme-field><acme-button type="submit">Save</acme-button><acme-button type="reset" variant="secondary">Reset</acme-button><output></output></form>',
      script: "root.querySelector('form').addEventListener('submit',event=>{event.preventDefault();root.querySelector('output').textContent='Seats: '+new FormData(event.target).get('seats');});",
    },
    {
      h: "Read only and disabled",
      html: '<acme-v-stack gap="3"><acme-number-input aria-label="Read only amount" value="20" readonly></acme-number-input><acme-number-input aria-label="Disabled amount" value="20" disabled></acme-number-input></acme-v-stack>',
    },
    { h: "One step per press", html: '<acme-number-input aria-label="One step" value="0" spin-on-press="false"></acme-number-input>' },
  ],
  practices: {
    Behavior: [
      "value is editable text. valueAsNumber is the parsed number, or NaN for empty or invalid text.",
      "Native forms submit an unformatted numeric string. Native validity blocks incomplete and out-of-range values.",
      "Arrow keys step. Shift uses largeStep; Alt uses smallStep. Home and End move to the bounds.",
      "Enter and blur format and commit. clampValueOnBlur defaults to the opposite of allowOverflow.",
      "Mouse-wheel changes require allowMouseWheel and focus. A held action repeats until release, cancellation, disabling or disconnection.",
      "Locale and format changes preserve the current numeric amount. Defaults remain authored strings and reset under the current format.",
    ],
    Formatting: [
      "Decimal, percent, currency and unit formats use standard notation.",
      "Explicit Intl rounding limits apply on commit. Without a supplied rounding limit, small finite values remain representable.",
      "Use Field for label, help and error content.",
    ],
  },
};
