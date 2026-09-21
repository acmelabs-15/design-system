import { AcmeStackElement } from "../../shared/stack-element";
import { hStackStructureCss } from "../../generated/components/h-stack/h-stack-structure.styles";
/** A spaced horizontal stack with centered cross-axis alignment. */
export class AcmeHStack extends AcmeStackElement {
  static styles = [...AcmeStackElement.styles, hStackStructureCss];
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-h-stack": AcmeHStack;
  }
}
