import type { Doc } from "../../site";

const measure = (label: string, value: string, unit = "") =>
  `<acme-stat><acme-stat-label>${label}</acme-stat-label><acme-stat-value>${value}${unit ? `<acme-stat-unit>${unit}</acme-stat-unit>` : ""}</acme-stat-value></acme-stat>`;
export const doc: Doc = {
  id: "stat",
  title: "Stat",
  lede: "One composable family for a measurement and its context.",
  tags: ["acme-stat", "acme-stat-label", "acme-stat-value", "acme-stat-unit", "acme-stat-description", "acme-stat-change", "acme-stat-footer", "acme-spark"],
  examples: [
    {
      h: "Label value and unit",
      html: `<acme-h-stack gap="8" flex-wrap="wrap">${measure("Active users", "1,240")}${measure("Response time", "42", "ms")}${measure("Failed deliveries", "0", "events")}</acme-h-stack>`,
    },
    {
      h: "Direction and meaning",
      html: '<acme-h-stack gap="8" flex-wrap="wrap"><acme-stat><acme-stat-label>Failed deliveries</acme-stat-label><acme-stat-value>14</acme-stat-value><acme-stat-change direction="down" sentiment="positive">12%</acme-stat-change><acme-stat-description>Fewer failures than last month.</acme-stat-description></acme-stat><acme-stat><acme-stat-label>Revenue</acme-stat-label><acme-stat-value>$62,450</acme-stat-value><acme-stat-change direction="down" sentiment="negative">4%</acme-stat-change><acme-stat-description>Lower revenue than last month.</acme-stat-description></acme-stat></acme-h-stack>',
    },
    {
      h: "Number formatting",
      html: '<acme-stat><acme-stat-label>Revenue</acme-stat-label><acme-stat-value><acme-format-number value="62450" options=\'{"style":"currency","currency":"USD","maximumFractionDigits":0}\'></acme-format-number></acme-stat-value><acme-stat-change direction="up" sentiment="positive" value="0.125"></acme-stat-change></acme-stat>',
      script: 'root.querySelector("acme-stat-change").formatOptions={style:"percent",maximumFractionDigits:1};',
    },
    {
      h: "Loading",
      html: '<acme-button variant="secondary">Toggle statistic loading</acme-button><acme-stat loading><acme-stat-label>Response time</acme-stat-label><acme-stat-value>42<acme-stat-unit>ms</acme-stat-unit></acme-stat-value><acme-stat-change direction="down" sentiment="positive">8%</acme-stat-change><acme-stat-description>The application controls the loading state.</acme-stat-description></acme-stat>',
      script: 'root.querySelector("acme-button").addEventListener("click",()=>{const stat=root.querySelector("acme-stat");stat.loading=!stat.loading;});',
    },
    {
      h: "Composed displays",
      html: '<acme-h-stack gap="8" flex-wrap="wrap"><acme-stat><acme-stat-label>Storage used</acme-stat-label><acme-stat-value>72<acme-stat-unit>GB</acme-stat-unit></acme-stat-value><acme-stat-footer><acme-meter label="Storage used" value="72" max="100" size="medium"></acme-meter><span>Of 100 GB available</span></acme-stat-footer></acme-stat><acme-stat><acme-stat-label>Recent activity</acme-stat-label><acme-stat-value>240</acme-stat-value><acme-stat-footer><acme-spark points="[1,3,2,5,4,6]"></acme-spark></acme-stat-footer><acme-stat-description>Activity increased over the last six samples.</acme-stat-description></acme-stat></acme-h-stack>',
    },
    {
      h: "Selectable statistics",
      html: '<acme-radio-group aria-label="Choose a metric" orientation="horizontal"><acme-group attached outline align-items="stretch"><acme-radio-card value="requests"><span slot="heading">Requests</span><acme-stat><acme-stat-label>Total requests</acme-stat-label><acme-stat-value>24,000</acme-stat-value></acme-stat></acme-radio-card><acme-radio-card value="errors"><span slot="heading">Errors</span><acme-stat><acme-stat-label>Total errors</acme-stat-label><acme-stat-value>14</acme-stat-value></acme-stat></acme-radio-card></acme-group></acme-radio-group><output></output>',
      script: 'root.querySelector("acme-radio-group").addEventListener("acme-change",event=>{root.querySelector("output").textContent="Selected metric: "+event.detail.value;});',
    },
  ],
  practices: {
    Structure: [
      "Compose Stat Label followed by Stat Value and optional Description, Change and Footer parts. The root, label and definitions retain native description-list semantics.",
      "Put Stat Unit inside Stat Value. Values may contain FormatNumber or FormatByte; Stat does not parse child text into a number.",
      "Use the footer for additional measurements, charts, context and application actions. Their own data and loading states remain application-owned.",
    ],
    Change: [
      "direction and sentiment are separate. A decrease can be favorable, such as fewer failed deliveries.",
      "Supply direction explicitly as up, down or flat. Omission draws no arrow; the component never infers a direction from value or sentiment.",
      "sentiment defaults to neutral. Direction and meaning have readable text in addition to the decorative arrow and color.",
      "value is optional. formatOptions is a JavaScript Intl.NumberFormatOptions object; default-slot text replaces the generated number.",
    ],
    Loading: [
      "loading marks the measurement busy, masks Stat Value with Skeleton and hides Stat Change. Author nodes and their values stay mounted.",
      "Zero is real data. For absent data, supply appropriate content or loading state instead of inventing zero.",
      "Use Radio Cards or Checkbox Cards for selection. Stat itself has no selection or click behavior.",
    ],
  },
};
