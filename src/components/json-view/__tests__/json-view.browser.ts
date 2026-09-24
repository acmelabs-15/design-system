import {AcmeChevronRightIcon} from "../../../generated/icons/classes/chevron-right-icon";
import {AcmeJsonView} from "../../../components/json-view/json-view";
customElements.define('acme-chevron-right-icon',AcmeChevronRightIcon);
customElements.define('acme-json-view',AcmeJsonView);
document.body.innerHTML='<acme-json-view id="json" expanded-depth="1"></acme-json-view>';window.json=document.querySelector('#json');window.left={leaf:1};window.json.value={alpha:window.left,beta:{leaf:2},ready:true,missing:undefined};window.events=[];window.json.addEventListener('acme-expanded-change',event=>window.events.push(event.detail));