import type { Doc } from "../../site";

export const doc: Doc = {
  id: "slider",
  title: "Slider",
  lede: "Choose one value or an ordered range. Native thumbs share one numeric array and one form owner.",
  tags: ["acme-slider"],
  examples: [
    {
      h: "Single value",
      html: '<acme-field><span slot="label">Volume</span><acme-slider name="volume" value="[40]"></acme-slider><span slot="help">Use arrow keys for small changes.</span></acme-field>',
    },
    { h: "Range", html: '<acme-slider aria-label="Price range" name="price" value="[20,80]" thumb-labels=\'["Minimum price","Maximum price"]\' min-steps-between-values="5"></acme-slider>' },
    {
      h: "Three values",
      html: '<acme-slider aria-label="Thresholds" value="[20,50,80]" thumb-labels=\'["Low threshold","Middle threshold","High threshold"]\' min-steps-between-values="5"></acme-slider>',
    },
    { h: "Decimal steps", html: '<acme-slider aria-label="Opacity" min="0" max="1" step="0.01" large-step="0.1" value="[0.5]"></acme-slider>' },
    { h: "Vertical", html: '<acme-slider orientation="vertical" aria-label="Level" value="[60]"></acme-slider>' },
    { h: "Right to left", html: '<acme-slider dir="rtl" aria-label="Level" value="[30]"></acme-slider>' },
    {
      h: "Number Input composition",
      p: "One shared application value drives both controls. Only Slider has a name, so the form submits once. Empty or partial Number Input text does not replace the slider value.",
      html: '<form><acme-slider id="linked-slider" name="amount" value="[40]" aria-label="Amount"><acme-number-input id="linked-number" slot="end" min="0" max="100" value="40" aria-label="Exact amount" style="width:100px"></acme-number-input></acme-slider></form>',
      script:
        "const slider=root.querySelector('#linked-slider'),number=root.querySelector('#linked-number');slider.addEventListener('acme-input',event=>{if(event.target===slider)number.value=String(event.detail.value[0]);});number.addEventListener('acme-input',event=>{if(Number.isFinite(event.detail.valueAsNumber))slider.value=[event.detail.valueAsNumber];});",
    },
    {
      h: "Live and completed edits",
      html: '<acme-slider aria-label="Preview level" value="[50]"></acme-slider><p>Live: <output data-live>50</output> · Completed: <output data-complete>50</output></p>',
      script:
        "const slider=root.querySelector('acme-slider');slider.addEventListener('acme-input',event=>root.querySelector('[data-live]').textContent=event.detail.value.join(', '));slider.addEventListener('acme-change',event=>root.querySelector('[data-complete]').textContent=event.detail.value.join(', '));",
    },
    {
      h: "Native form",
      html: '<form><acme-field><span slot="label">Budget range</span><acme-slider name="budget" value="[25,75]" thumb-labels=\'["Minimum budget","Maximum budget"]\'></acme-slider></acme-field><acme-button type="submit">Read values</acme-button><acme-button type="reset" variant="secondary">Reset</acme-button><output></output></form>',
      script:
        "root.querySelector('form').addEventListener('submit',event=>{event.preventDefault();root.querySelector('output').textContent=new FormData(event.currentTarget).getAll('budget').join(' – ');});",
    },
    { h: "Disabled", html: '<acme-slider disabled aria-label="Unavailable amount" value="[30,70]" thumb-labels=\'["Minimum","Maximum"]\'></acme-slider>' },
  ],
  practices: {
    Behavior: [
      "Use one number per thumb. Values remain ordered and thumb names stay attached to their positions. User edits stop at neighboring values and the configured minimum gap.",
      "Arrows move by step. Shift with arrows and Page Up/Down use largeStep. Home and End move the focused thumb to its nearest legal endpoint. Right-to-left horizontal controls reverse the left and right arrows.",
      "acme-input reports live edits. acme-change reports a completed changed gesture or keyboard action. Cancellation keeps the last live value and emits no completion.",
      "Programmatic values remain exact. Invalid bounds, steps or spacing participate in native validity. Native thumbs display and announce a constrained projection; the public value and FormData retain the supplied values. Correcting constraints restores the projection without losing the supplied value.",
      "Use defaultValue or the value attribute for reset defaults. Property assignments, reset and restoration do not emit user events.",
    ],
    Accessibility: [
      "Name a single slider with Field, a native label or aria-label. Give each range thumb a distinct thumbLabels entry. formatValue supplies readable value text.",
      "Keep related Number Inputs after the track in Tab order. Use horizontal examples for ranges when possible. The component retains native slider controls and normal Tab navigation.",
      "The labels property retains its native NodeList meaning; thumbLabels configures the per-thumb names.",
    ],
  },
};
