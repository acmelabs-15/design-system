import { AcmeLayoutElement } from "../../shared/layout-element";

/**
 * A semantic container with responsive spacing, sizing and surface inputs.
 * @slot - Author-owned content.
 * @csspart root - The native semantic element.
 */
export class AcmeBox extends AcmeLayoutElement {}

declare global {
  interface HTMLElementTagNameMap {
    "acme-box": AcmeBox;
  }
}
