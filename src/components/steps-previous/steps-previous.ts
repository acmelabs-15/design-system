import { AcmeStepsAction } from "../../shared/steps-action";
/** Requests the previous available step.
 * @slot - Action label; defaults to localized Previous.
 */
export class AcmeStepsPrevious extends AcmeStepsAction {
  constructor() {
    super("previous");
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-steps-previous": AcmeStepsPrevious;
  }
}
