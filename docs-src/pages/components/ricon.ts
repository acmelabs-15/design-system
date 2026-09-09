// Docs page: Round Icon (house component)
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "ricon",
  title: "Round Icon",
  lede: "A tinted circle for a state or a kind, leading a row.",
  tags: ["acme-ricon"],
  house: true,
  examples: [
    {
      h: "Hues",
      html: `<div class="row" style="gap:12px"><acme-ricon><svg class="ic" aria-hidden="true"><use href="#i-box"/></svg></acme-ricon><acme-ricon hue="green"><svg class="ic" aria-hidden="true"><use href="#i-check"/></svg></acme-ricon><acme-ricon hue="red"><svg class="ic" aria-hidden="true"><use href="#i-alert"/></svg></acme-ricon><acme-ricon hue="amber"><svg class="ic" aria-hidden="true"><use href="#i-clock"/></svg></acme-ricon><acme-ricon hue="blue"><svg class="ic" aria-hidden="true"><use href="#i-rocket"/></svg></acme-ricon><acme-ricon hue="purple"><svg class="ic" aria-hidden="true"><use href="#i-branch"/></svg></acme-ricon><acme-ricon small hue="teal"><svg class="ic" aria-hidden="true"><use href="#i-globe"/></svg></acme-ricon></div>`,
    },
  ],
};
