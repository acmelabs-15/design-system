import type { Doc } from "../../site";
export const doc: Doc = {
  id: "progress",
  title: "Progress",
  lede: "Task completion with a real distinction between zero and unknown progress.",
  tags: ["acme-progress"],
  examples: [
    {
      h: "Known progress",
      html: '<acme-progress label="Upload progress" value="40" max="100">Uploading files</acme-progress><acme-h-stack gap="3"><acme-button variant="secondary">Increase progress</acme-button><acme-button variant="secondary">Reset progress</acme-button></acme-h-stack>',
      script:
        'const progress=root.querySelector("acme-progress"),buttons=root.querySelectorAll("acme-button");buttons[0].addEventListener("click",()=>progress.value=Math.min(progress.max,(progress.value??0)+10));buttons[1].addEventListener("click",()=>progress.value=0);',
    },
    { h: "Indeterminate", html: '<acme-progress label="Waiting for a response"></acme-progress>' },
    {
      h: "Status treatments",
      html:
        '<acme-v-stack align="stretch" gap="4">' +
        ["default", "success", "error", "warning", "secondary"].map((variant) => `<acme-progress label="${variant} example" value="65" variant="${variant}"></acme-progress>`).join("") +
        "</acme-v-stack>",
    },
    { h: "Scoped width", html: '<acme-box width="240px"><acme-progress label="Import progress" value="3" max="4" value-text="Three of four files"></acme-progress></acme-box>' },
  ],
  practices: {
    Meaning: [
      "Use Progress for task completion. Use Meter for a measurement within a known range.",
      "Omit value for indeterminate progress. A supplied value of 0 is a real known zero. Removing the value attribute restores the indeterminate state.",
      "max must be finite and positive. Displayed values clamp to 0..max without changing the supplied value; invalid configuration produces a diagnostic.",
    ],
    Accessibility: [
      "label supplies an accessible name. Default-slot content supplies a visible label and takes precedence over label. Standard aria-label and aria-labelledby inputs are also supported.",
      "valueText supplies an accessible description of the current value. Use it for units or a phrase such as Three of four files.",
      "The native progress element carries the current value immediately. Decorative interpolation never changes the announced value or emits a change event.",
      "Reduced motion stops indeterminate movement and makes value changes immediate. Only the linear shape is supported.",
    ],
    Layout: ["Use Box or another layout component to control available width. The track and range parts provide styling hooks."],
  },
};
