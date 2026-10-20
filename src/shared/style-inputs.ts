import { noChange } from "lit";
import { Directive, directive, type ElementPart, type PartInfo, PartType } from "lit/directive.js";
import { applyStyleInputBinding, type StyleInputs } from "./style-input-binding";

class StyleInputsDirective extends Directive {
  private readonly owner = {};
  constructor(part: PartInfo) {
    super(part);
    if (part.type !== PartType.ELEMENT) {
      throw new TypeError("styleInputs must be used in an element expression");
    }
  }
  render(_inputs: StyleInputs) {
    return noChange;
  }
  update(part: ElementPart, [inputs]: [StyleInputs]) {
    applyStyleInputBinding(part.element, this.owner, inputs);
    return noChange;
  }
}

/** Reapplies ordered inputs on each render. Keep the expression present and pass {} to clear it. */
export const styleInputs = directive(StyleInputsDirective);
