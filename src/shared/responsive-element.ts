import { property } from "lit/decorators.js";
import { AcmeSemanticElement } from "./semantic-element";
import { atomState } from "./atom-state";
import { optionalString } from "./attributes";
import type { ResponsiveStyleTarget } from "./style-renderer";

/** Shared query authoring for components with responsive styling inputs. */
export abstract class AcmeResponsiveElement extends AcmeSemanticElement {
  @atomState()
  @property({ attribute: "responsive-target", noAccessor: true, useDefault: true })
  responsiveTarget: ResponsiveStyleTarget = "window";
  @atomState()
  @property({ attribute: "responsive-container", noAccessor: true, converter: optionalString })
  responsiveContainer?: string;
}
