import { css, html, nothing, svg } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { AcmeElement, assetsBase, glyphSized, sharedCss } from "../../base";
import { Interaction } from "../../shared/interaction";
import { toasts } from "../../shared/state";
import "../button/button";
import { atomState } from "../../shared/atom-state";
import { copyButtonCss } from "../copy-button/copy-button.styles";
import { brandsCss } from "./brands.styles";

/** The logo files live in the package's `assets/` directory; `assetsBase` in the shared base says where that is served from. */

/** The marks the element draws: the wordmarks (`-logotype`) and the symbols of the house brands. */
export type BrandName = "vercel-logotype" | "vercel" | "nextjs-logotype" | "next-js" | "turbo-logotype" | "turbo" | "turborepo-logotype" | "turbopack-logotype" | "turbopack" | "v0" | "eve" | "ai-sdk";

/** One mark: its natural size, and either the paths of an inline drawing (in the current color) or the light and dark files of an image pair. */
export type Brand = {
  /** The accessible name. */
  name: string;
  /** The natural height in px. */
  height: number;
  /** The width per px of height. */
  aspect: number;
  /** The balanced width and height per px of height: the mark sized to read as tall as text beside it. */
  balanced?: [number, number];
  /** An inline mark: its view box and its paths, filled with the current color. */
  viewBox?: string;
  paths?: { d: string; evenOdd?: boolean }[];
  /** An image mark: the light and the dark file under `assets/`. */
  files?: [string, string];
};

export const BRANDS: Record<BrandName, Brand> = {
  "vercel-logotype": {
    name: "Vercel logotype",
    height: 52,
    aspect: 261 / 52,
    viewBox: "0 0 261 52",
    paths: [
      {
        d: "M59.8 52H0L29.9 0zm67.82-38.45q4.9 0 8.81 2.13a15.5 15.5 0 0 1 6.22 6.32q2.3 4.2 2.38 10.26v2.06h-26.35q.27 4.4 2.58 6.92 2.38 2.47 6.36 2.47a8.4 8.4 0 0 0 7.76-4.93l9.16.67q-1.68 4.98-6.29 7.99t-10.63 3q-5.53 0-9.64-2.27a16 16 0 0 1-6.43-6.46 20 20 0 0 1-2.31-9.72q0-5.52 2.3-9.72a16 16 0 0 1 6.44-6.46 20 20 0 0 1 9.64-2.26m62.55 0q4.47 0 8.18 1.66a15.3 15.3 0 0 1 6.15 4.6q2.38 3 2.87 7.05l-9.23.47a8 8 0 0 0-2.8-5 7.7 7.7 0 0 0-5.17-1.86q-4.33 0-6.7 3-2.4 3-2.39 8.52t2.38 8.52q2.37 3 6.71 3 3.15 0 5.39-1.87 2.24-1.92 2.72-5.46l9.3.4a14.7 14.7 0 0 1-2.87 7.33 16 16 0 0 1-6.15 4.86 21 21 0 0 1-8.39 1.66q-5.53 0-9.64-2.26a16 16 0 0 1-6.44-6.46 20 20 0 0 1-2.3-9.72q0-5.52 2.3-9.72a16 16 0 0 1 6.44-6.46 20 20 0 0 1 9.64-2.26m38.66 0q4.9 0 8.8 2.13a15.5 15.5 0 0 1 6.22 6.32q2.31 4.2 2.38 10.26v2.06h-26.35q.28 4.4 2.58 6.92 2.38 2.47 6.36 2.47a8.4 8.4 0 0 0 7.77-4.93l9.15.67q-1.68 5-6.29 7.99t-10.62 3q-5.53 0-9.65-2.27a16 16 0 0 1-6.43-6.46 20 20 0 0 1-2.31-9.72q0-5.52 2.3-9.72a16 16 0 0 1 6.44-6.46 20 20 0 0 1 9.64-2.26M86.9 36.69l17.24-34.33h10.8L89.96 49.63h-6.12L58.85 2.36h10.81zm71.62-15.55a11 11 0 0 1 2.47-4.48q2.28-2.31 6.38-2.31h3.4v7.26h-3.47q-2.91 0-4.79.8a5.8 5.8 0 0 0-2.77 2.5q-.9 1.72-.9 4.37v20.35h-8.89V14.35h8.33zm101.73 28.5h-8.95V2.35h8.95zM127.62 20.26q-3.7 0-6 2.2-2.32 2.2-2.87 6.2h17.05q-.48-4.34-2.72-6.33a7.8 7.8 0 0 0-5.46-2.07m101.2 0q-3.7 0-6 2.2-2.31 2.2-2.87 6.2H237q-.5-4.34-2.73-6.33a7.8 7.8 0 0 0-5.46-2.07",
      },
    ],
  },
  vercel: { name: "Vercel", height: 100, aspect: 1.15, balanced: [1.678509, 1.459573], viewBox: "0 0 115 100", paths: [{ d: "M57.5 0 115 100H0z", evenOdd: true }] },
  "nextjs-logotype": { name: "Next.js logotype", height: 64, aspect: 318 / 64, files: ["nextjs-logotype-light.svg", "nextjs-logotype-dark.svg"] },
  "next-js": { name: "Next.js", height: 40, aspect: 1, files: ["next-js-light.svg", "next-js-dark.svg"] },
  "turbo-logotype": { name: "Turbo logotype", height: 64, aspect: 302 / 64, files: ["turbo-logotype-color-light.svg", "turbo-logotype-color-dark.svg"] },
  turbo: { name: "Turbo", height: 40, aspect: 39 / 40, files: ["turbo-color-light.svg", "turbo-color-dark.svg"] },
  "turborepo-logotype": { name: "Turborepo logotype", height: 64, aspect: 473 / 64, files: ["turborepo-logotype-color-light.svg", "turborepo-logotype-color-dark.svg"] },
  "turbopack-logotype": { name: "Turbopack logotype", height: 64, aspect: 471 / 64, files: ["turbopack-logotype-color-light.svg", "turbopack-logotype-color-dark.svg"] },
  turbopack: { name: "Turbopack", height: 40, aspect: 1, files: ["turbopack-color-light.svg", "turbopack-color-dark.svg"] },
  v0: {
    name: "v0",
    height: 70,
    aspect: 2.1,
    balanced: [2.553243, 1.21583],
    viewBox: "0 0 147 70",
    paths: [
      {
        d: "M56 50.2V14h14v46.16c0 5.43-4.4 9.84-9.84 9.84-2.6 0-5.16-1-7-2.84L0 14h19.8zM147 56h-14V23.95L100.95 56H133v14H96.69A19.7 19.7 0 0 1 77 50.31V14h14v32.16L123.16 14H91V0h36.31A19.7 19.7 0 0 1 147 19.69z",
      },
    ],
    files: ["v-zero-light.svg", "v-zero-dark.svg"],
  },
  eve: {
    name: "eve",
    height: 53,
    aspect: 169 / 53,
    balanced: [3.29137, 1.032205],
    viewBox: "0 0 169 53",
    paths: [
      { d: "M169 8.47h-51.39L81.73 53H70.36L113 0H169zM169 44.51v8.47h-45.87V44.5zM45.87 52.98H0V44.5h45.87zM38.66 30.55H0v-8.47h38.66z" },
      { d: "M169 30.55h-38.66v-8.47H169zM75.52 8.47H0V0h75.52z" },
    ],
    files: ["eve-light.svg", "eve-dark.svg"],
  },
  "ai-sdk": {
    name: "AI SDK",
    height: 40,
    aspect: 3.65,
    balanced: [3.559283, 0.975146],
    viewBox: "0 0 146 40",
    paths: [
      {
        d: "M37.8 40h-7.66l-3.32-9.46H10.99L7.66 40H0L14.42 0h8.96zM61.57 6.37h-6.43v27.26h6.76V40H41v-6.37h6.82V6.37h-6.48V0h20.23zM125.7 0a20 20 0 0 1 0 40H88.56a20 20 0 1 1 0-40zM88.56 4.29a15.72 15.72 0 1 0 0 31.43h37.15a15.72 15.72 0 0 0 0-31.43zm.54 5.7c4.28 0 7.2 2.64 7.67 6.51l-4.12.22a3.5 3.5 0 0 0-3.66-3.3c-1.79 0-3.06.91-2.98 2.32.05 1.63 1.95 2.17 4 2.68 4.32.95 7.05 2.8 7.05 5.86 0 3.66-3.22 5.72-7.37 5.72-4.68 0-8-2.6-8.26-6.67l4.14-.19c.36 2.06 1.82 3.41 4.23 3.41 1.84 0 3.1-.73 3.06-2.14-.02-1.4-1.22-2.22-4.22-2.95-4.18-1-6.86-2.68-6.86-5.77 0-3.5 2.93-5.7 7.32-5.7m16.88.44c6.24 0 9.73 3.47 9.73 9.65 0 6.15-3.44 9.6-9.56 9.6h-6.8V10.42zm16.08 8.4 7-8.4h4.8l-7.08 8.48 7.5 10.76h-4.68l-5.53-8-2 2.34v5.66h-4.31V10.43h4.3zm-18.6 7.37h2.52c3.74 0 5.53-1.98 5.53-6.15s-1.79-6.15-5.53-6.15h-2.52zm-90.33-1.92h11.55l-5.75-16.9z",
      },
    ],
  },
};

/** The box of a mark at a height (its natural height when none): the width follows the aspect ratio, or the balanced multipliers size both. */
export const brandSize = (brand: Brand, height = 0, balanced = false) => {
  const h = height || brand.height;
  return balanced && brand.balanced ? { width: Math.round(h * brand.balanced[0]), height: Math.round(h * brand.balanced[1]) } : { width: Math.round(h * brand.aspect), height: Math.round(h) };
};

/**
 * Brands: a brand mark in a preview box. The box forces the light theme's tokens, so a mark reads
 * the same on either page theme, and centres the frame around the mark; `copy` adds a button over
 * the box's top right corner (shown on hover or focus) that copies the mark's markup. `brand`
 * names a house mark: the wordmarks (`vercel-logotype`, `nextjs-logotype`, `turbo-logotype`,
 * `turborepo-logotype`, `turbopack-logotype`) and the symbols (`vercel`, `next-js`, `turbo`,
 * `turbopack`, `v0`, `eve`, `ai-sdk`); anything slotted is shown instead (a custom illustration).
 * An inline mark is drawn in the current color: `mode="light"` makes it black, `mode="dark"` white;
 * an image mark is a light and a dark file, and `mode="dark"` shows the dark one. `height` sizes the
 * mark (its natural height by default; `balanced` sizes it to read as tall as text beside it).
 * `full-width` lifts the frame's 80% cap on an inline mark; `white` gives the box a white ground.
 * Fires `acme-copy` with the copied markup.
 */
@customElement("acme-brands")
export class AcmeBrands extends AcmeElement {
  static styles = [
    sharedCss,
    brandsCss,
    copyButtonCss,
    css`
      /* The host is a column: the box is its flex item, as the preview is an item of the page's centred cell (min-width auto, full width). */
      :host {
        display: flex;
        flex-direction: column;
      }
      /* The copy button's host takes no line of its own: the button inside it is positioned over the box. */
      acme-button.copy {
        display: block;
      }
    `,
  ];
  /** The house mark to draw; empty shows the slotted content. */
  @property() brand: BrandName | "" = "";
  /** The mark's height in px; 0 is its natural height. */
  @property({ type: Number }) height = 0;
  /** Sizes the mark by its balanced multipliers, to read as tall as text beside it (needs a `height`). */
  @property({ type: Boolean }) balanced = false;
  /** `light` draws an inline mark black and shows an image mark's light file; `dark` draws it white and shows the dark file; unset keeps the current color and the light file. */
  @property() mode: "" | "light" | "dark" = "";
  /** Lifts the frame's 80% width cap on an inline mark. */
  @property({ type: Boolean, attribute: "full-width" }) fullWidth = false;
  /** A white ground behind the frame. */
  @property({ type: Boolean }) white = false;
  /** The copy button over the box's top right corner: it copies the mark's markup. */
  @property({ type: Boolean }) copy = false;
  /** Shows the image pair of a brand that also has an inline drawing (`v0`, `eve`, `ai-sdk`). */
  @property({ type: Boolean }) image = false;
  @atomState() private done = false;
  @query(".brands") private root!: HTMLElement;
  @query(".frame") private frame!: HTMLElement;
  private timer?: ReturnType<typeof setTimeout>;
  private interaction = new Interaction(this);

  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this.timer);
  }

  updated() {
    this.interaction.attach(this.root);
  }

  /** The markup of the mark: the slotted content, or the drawing or image pair the element renders. */
  markup(): string {
    const slotted = this.frame?.querySelector("slot")?.assignedElements({ flatten: true }) ?? [];
    const own = [...(this.frame?.querySelectorAll(":scope > img, :scope > .force > img, :scope > slot > svg") ?? [])];
    // The element's own drawing carries template markers and its part name; the copy is the plain markup.
    return (slotted.length ? slotted : own).map((el) => el.outerHTML.replace(/<!--[\s\S]*?-->/g, "").replace(/ part="mark"/, "")).join("\n");
  }

  private copyMarkup = async () => {
    const text = this.markup();
    clearTimeout(this.timer);
    try {
      await navigator.clipboard.writeText(text);
      this.done = true;
      this.timer = setTimeout(() => {
        this.done = false;
      }, 1000);
      this.dispatchEvent(new CustomEvent("acme-copy", { detail: { text }, bubbles: true, composed: true }));
    } catch {
      toasts.error("Failed to copy to clipboard");
    }
  };

  /** The copy button shows while it holds the focus: the state lands on its host, where the box's rule reads it. */
  private copyFocus = (e: FocusEvent) => (e.currentTarget as HTMLElement).toggleAttribute("data-focus", e.type === "focusin");

  render() {
    const brand = this.brand ? BRANDS[this.brand] : undefined;
    const size = brand ? brandSize(brand, this.height, this.balanced) : undefined;
    const image = !!brand?.files && (this.image || !brand.viewBox);
    const imgs =
      brand && size && image
        ? html`<img class="light" src=${assetsBase + brand.files![0]} alt=${brand.name} width=${size.width} height=${size.height} style="color:transparent" /><img
              class="dark"
              src=${assetsBase + brand.files![1]}
              alt=${brand.name}
              width=${size.width}
              height=${size.height}
              style="color:transparent"
            />`
        : nothing;
    const mark =
      brand && size && !image
        ? svg`<svg viewBox=${brand.viewBox} height=${size.height} width=${size.width} role="img" aria-label=${brand.name} part="mark"><g>${brand.paths!.map((p) => svg`<path fill="currentColor" fill-rule=${p.evenOdd ? "evenodd" : nothing} clip-rule=${p.evenOdd ? "evenodd" : nothing} d=${p.d}></path>`)}</g></svg>`
        : nothing;
    return html`<div class=${this.cls("brands", { light: this.mode === "light", dark: this.mode === "dark", full: this.fullWidth, white: this.white })} part="brands">
      ${
        this.copy
          ? html`<acme-button class="copy" variant="secondary" shape="square" svg-only aria-label="Copy code" @click=${this.copyMarkup} @focusin=${this.copyFocus} @focusout=${this.copyFocus} part="copy"
              >${this.done ? html`<div class="sr" role="status" aria-live="assertive">Copied!</div>` : nothing}<div class=${this.cls("stack", { copied: this.done })}>
                <div class="check">${glyphSized("check")}</div>
                <div class="copy">${glyphSized("copy")}</div>
              </div></acme-button
            >`
          : nothing
      }
      <div class="frame" part="frame">${this.mode === "dark" && image ? html`<div class="force">${imgs}</div>` : imgs}<slot>${mark}</slot></div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-brands": AcmeBrands;
  }
}
