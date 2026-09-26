import { AcmeStat } from "../stat";
import { AcmeStatLabel } from "../../stat-label/stat-label";
import { AcmeStatValue } from "../../stat-value/stat-value";
import { AcmeStatUnit } from "../../stat-unit/stat-unit";
import { AcmeStatDescription } from "../../stat-description/stat-description";
import { AcmeStatChange } from "../../stat-change/stat-change";
import { AcmeStatFooter } from "../../stat-footer/stat-footer";
import { AcmeSkeleton } from "../../skeleton/skeleton";
import { AcmeFormatNumber } from "../../format-number/format-number";
import { AcmeArrowUpwardIcon } from "../../../generated/icons/classes/arrow-upward-icon";
import { AcmeArrowDownwardIcon } from "../../../generated/icons/classes/arrow-downward-icon";
import { AcmeHorizontalRuleIcon } from "../../../generated/icons/classes/horizontal-rule-icon";

for (const [name, ctor] of Object.entries({
  "acme-stat": AcmeStat,
  "acme-stat-label": AcmeStatLabel,
  "acme-stat-value": AcmeStatValue,
  "acme-stat-unit": AcmeStatUnit,
  "acme-stat-description": AcmeStatDescription,
  "acme-stat-change": AcmeStatChange,
  "acme-stat-footer": AcmeStatFooter,
  "acme-skeleton": AcmeSkeleton,
  "acme-format-number": AcmeFormatNumber,
  "acme-arrow-upward-icon": AcmeArrowUpwardIcon,
  "acme-arrow-downward-icon": AcmeArrowDownwardIcon,
  "acme-horizontal-rule-icon": AcmeHorizontalRuleIcon,
})) {
  customElements.define(name, ctor);
}
document.body.innerHTML = `<style>body{font-family:system-ui;margin:24px}acme-stat{max-width:400px;margin-block:24px}</style><acme-stat id="stat"><acme-stat-label>Failed deliveries</acme-stat-label><acme-stat-value id="value"><acme-format-number id="number" value="0"></acme-format-number><acme-stat-unit>events</acme-stat-unit></acme-stat-value><acme-stat-change id="change" direction="down" sentiment="positive">12%</acme-stat-change><acme-stat-description>Compared with last month.</acme-stat-description><acme-stat-footer><a href="#report">View report</a></acme-stat-footer></acme-stat><acme-stat id="other" loading><acme-stat-label>Other value</acme-stat-label></acme-stat>`;
