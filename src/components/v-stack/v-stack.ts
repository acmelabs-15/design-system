import { AcmeStackElement } from "../../shared/stack-element";
import { vStackStructureCss } from "../../generated/components/v-stack/v-stack-structure.styles";
/** A spaced vertical stack with centered cross-axis alignment. */
export class AcmeVStack extends AcmeStackElement {
  static styles = [...AcmeStackElement.styles, vStackStructureCss];
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-v-stack": AcmeVStack;
  }
}
