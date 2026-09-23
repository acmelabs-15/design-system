import { AcmeToc } from "../toc.ts";
import { AcmeHeading } from "../../heading/heading.ts";
customElements.define("acme-toc", AcmeToc);
customElements.define("acme-heading", AcmeHeading);
document.body.innerHTML = `<style>body{margin:20px}#content{height:340px;overflow:auto;border:8px solid gray}section{height:450px}h2,h3{margin:0}acme-toc{display:block;width:240px}acme-heading{display:block}</style><acme-toc id="toc" source="#content" offset="24px"></acme-toc><article id="content"><section><h2 id="alpha">Alpha</h2></section><section><h3 id="beta">Beta</h3></section><section><acme-heading id="gamma" as="h2">Gamma</acme-heading></section></article>`;
const toc = document.querySelector("acme-toc")!;
toc.scrollRoot = document.querySelector("#content")!;
