import type { Doc } from "../../site";
export const doc: Doc = {
  id: "pin-input",
  title: "Pin Input",
  house: true,
  lede: "One code value with separate character fields, focus movement and full-code paste.",
  tags: ["acme-pin-input", "acme-pin-input-field"],
  examples: [
    {
      h: "Default",
      html: '<acme-field required><span slot="label">Verification code</span><acme-pin-input count="6" name="code" required otp></acme-pin-input><span slot="help">Enter the six-character code.</span></acme-field>',
    },
    {
      h: "Custom fields and separators",
      p: "Give each supplied field a unique zero-based index in reading order.",
      html: '<acme-pin-input count="6" aria-label="Verification code"><acme-pin-input-field index="0"></acme-pin-input-field><acme-pin-input-field index="1"></acme-pin-input-field><acme-pin-input-field index="2"></acme-pin-input-field><span aria-hidden="true">—</span><acme-pin-input-field index="3"></acme-pin-input-field><acme-pin-input-field index="4"></acme-pin-input-field><acme-pin-input-field index="5"></acme-pin-input-field></acme-pin-input>',
    },
    {
      h: "Attached fields",
      html: '<acme-pin-input count="4" aria-label="Attached code"><acme-group attached><acme-pin-input-field index="0"></acme-pin-input-field><acme-pin-input-field index="1"></acme-pin-input-field><acme-pin-input-field index="2"></acme-pin-input-field><acme-pin-input-field index="3"></acme-pin-input-field></acme-group></acme-pin-input>',
    },
    { h: "Masked", html: '<acme-pin-input count="4" mask aria-label="Masked code"></acme-pin-input>' },
    {
      h: "Character policies",
      p: "Numeric accepts 0–9. Alphabetic accepts A–Z and a–z. Alphanumeric accepts both. The OTP flag sets the native autocomplete hint; the character policy sets the keyboard mode.",
      html: '<acme-v-stack gap="3"><acme-pin-input count="4" type="alphabetic" aria-label="Letter code"></acme-pin-input><acme-pin-input count="4" type="alphanumeric" otp aria-label="Mixed code"></acme-pin-input></acme-v-stack>',
    },
    {
      h: "Native form",
      html: '<form id="pin-form-example"><acme-field required><span slot="label">Access code</span><acme-pin-input count="4" name="code" required></acme-pin-input></acme-field><acme-button type="submit">Verify</acme-button><acme-button type="reset" variant="secondary">Reset</acme-button><output></output></form>',
      script: "root.querySelector('form').addEventListener('submit',event=>{event.preventDefault();root.querySelector('output').textContent='Code submitted';});",
    },
    {
      h: "Completion",
      html: '<div id="pin-completion-example"><acme-pin-input count="4" aria-label="Completion example" blur-on-complete></acme-pin-input><output>Enter a code</output></div>',
      script: "root.querySelector('acme-pin-input').addEventListener('acme-complete',()=>{root.querySelector('output').textContent='Complete';});",
    },
    {
      h: "Sizes",
      html: `<acme-v-stack gap="3">${["small", "medium", "large"].map((size) => `<acme-pin-input count="4" size="${size}" aria-label="${size} code"></acme-pin-input>`).join("")}</acme-v-stack>`,
    },
  ],
  practices: {
    Behavior: [
      "The root owns the value array and submits one joined string. Fields do not submit separate values.",
      "Typing advances focus. Arrow keys move between fields. Home and End move to the first and last filled fields.",
      "Backspace and Delete shift remaining characters left. A full-code paste replaces all fields; a shorter paste preserves the left prefix and replaces the remaining suffix.",
      "Programmatic values, reset and restoration do not emit completion or submit. autoSubmit is off by default.",
      "Use a native form for validation. Use a string-array field when binding the control to managed form state.",
      "Masking changes display. It does not provide secure storage.",
    ],
    Accessibility: [
      "Use Field or an accessible name for the whole code. Each field has a localized position label, which can be replaced with an authored accessible name.",
      "Readonly codes retain focus navigation while preventing edits.",
      "Native one-time-code authoring is provided; actual autofill depends on the browser and device.",
    ],
  },
};
