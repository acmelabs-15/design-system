// Source baseline for composed references. No production stylesheet is emitted.
import type {GeistMap,SpecNode} from "../gen";
export const geist:GeistMap={
 referenceOnly:true,
 page:"keyboard-input",component:"Kbd",root:"data-geist-kbd",ours:".kbd",
 defaults:{small:"false"},props:{small:{true:".sm"}},
 children:[{ours:".key",pick:(node:SpecNode)=>node.tag==="span"}],
};
