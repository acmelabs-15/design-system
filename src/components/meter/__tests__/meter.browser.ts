import { AcmeProgress } from "../../progress/progress";
import { AcmeMeter } from "../meter";
import { AcmeSkeleton } from "../../skeleton/skeleton";
import { AcmeSpinner } from "../../spinner/spinner";
for (const [name, ctor] of Object.entries({ "acme-progress": AcmeProgress, "acme-meter": AcmeMeter, "acme-skeleton": AcmeSkeleton, "acme-spinner": AcmeSpinner })) customElements.define(name, ctor);
document.body.innerHTML = `<style>body{margin:24px;font-family:system-ui}acme-progress{margin:16px 0}acme-meter{margin:16px}acme-skeleton{max-width:320px}</style><acme-progress id="progress" label="Upload" value="25"></acme-progress><acme-progress id="unknown" label="Waiting"></acme-progress><acme-meter id="meter" label="Storage" value="50" size="medium" show-value></acme-meter><acme-meter id="absent" label="Capacity"></acme-meter><acme-skeleton id="skeleton"><label>Retained input <input id="retained" value="Draft"></label></acme-skeleton><acme-spinner id="spinner" label="Working"></acme-spinner>`;
import { AcmeTheme } from "../../theme/theme";
customElements.define("acme-theme", AcmeTheme);
