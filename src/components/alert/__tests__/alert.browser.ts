import { AcmeAlert } from "../alert";
import { AcmeBanner } from "../../banner/banner";
import { AcmeButton } from "../../button/button";
import { AcmeIconButton } from "../../icon-button/icon-button";
import { AcmeSpinner } from "../../spinner/spinner";
import { AcmeInfoIcon } from "../../../generated/icons/classes/info-icon";
import { AcmeErrorIcon } from "../../../generated/icons/classes/error-icon";
import { AcmeWarningIcon } from "../../../generated/icons/classes/warning-icon";
import { AcmeCheckIcon } from "../../../generated/icons/classes/check-icon";
import { AcmeCloseIcon } from "../../../generated/icons/classes/close-icon";
for (const [name, ctor] of Object.entries({
  "acme-alert": AcmeAlert,
  "acme-banner": AcmeBanner,
  "acme-button": AcmeButton,
  "acme-icon-button": AcmeIconButton,
  "acme-spinner": AcmeSpinner,
  "acme-info-icon": AcmeInfoIcon,
  "acme-error-icon": AcmeErrorIcon,
  "acme-warning-icon": AcmeWarningIcon,
  "acme-check-icon": AcmeCheckIcon,
  "acme-close-icon": AcmeCloseIcon,
}))
  customElements.define(name, ctor);
document.body.innerHTML = `<style>body{margin:20px;font-family:system-ui}acme-alert,acme-banner{margin-block:16px}</style><acme-alert id="static" heading="Deployment ready" variant="success" dismissible>Your changes are ready.<acme-button slot="actions" variant="secondary">View deployment</acme-button></acme-alert><acme-alert id="live" role="alert" variant="error"><h2 slot="heading">Save failed</h2>Try again when your connection returns.</acme-alert><acme-banner id="banner" heading="Planned maintenance">Service will be unavailable for a short time.<a slot="actions" href="#details">View details</a></acme-banner>`;
