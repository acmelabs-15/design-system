# Brands

Guidelines to help others use our brand and assets, including our logo, content, and trademarks, without having to negotiate legal agreements for each use.

## Vercel

The Vercel trademark includes the Vercel name &amp; logo, and any word, phrase, image, or other designation that identifies any Vercel products. Please don’t modify the trademarks or use them in an altered way, including suggesting sponsorship or endorsement by Vercel, or in a way that confuses Vercel with another brand. For more information on correct usage, see Usage and misuse →Download Vercel Assets

```html
<style>.brand-ground{position:relative;display:flex;justify-content:center;background:var(--ds-white);padding-block:56px} .brand-ground.black{background:var(--ds-black);align-items:center} .brand-ground.symbol,.brand-ground.v0{height:164px;align-items:center;padding:0} .brand-pair{display:grid;grid-template-columns:1fr 1fr} @media (min-width:601px){.brand-ground{padding-block:112px}.brand-ground.symbol{height:200px}.brand-ground.v0{height:288px}} :root[data-theme=dark] .brand-ground.v0{background:var(--ds-background-200)} @media (prefers-color-scheme:dark){:root:not([data-theme=light]) .brand-ground.v0{background:var(--ds-background-200)}}</style>
<div class="brand-ground">
  <acme-brands brand="vercel-logotype" height="64" mode="light" copy></acme-brands>
</div>
<div class="brand-ground black">
  <acme-brands brand="vercel-logotype" height="64" mode="dark" copy></acme-brands>
</div>
```

## Symbol & unicode

The Vercel symbol should only be used in places where there is not enough room to display the full logo, or in cases where only brand symbols of multiple brands are displayed. The Vercel symbol can be used as a Unicode symbol (▲ U+25B2) to represent the brand with only text.

```html
<div class="brand-pair">
  <div class="brand-ground symbol">
    <acme-brands brand="vercel" height="32" mode="light" copy></acme-brands>
  </div>
  <div class="brand-ground symbol black">
    <acme-brands brand="vercel" height="32" mode="dark" copy></acme-brands>
  </div>
</div>
```

## Spacing considerations

The safety area surrounding the Primary Logo is defined by the height of our symbol.

```html
<acme-brands full-width>
  <svg fill="none" style="margin-top:-1px" viewBox="0 0 720 361" xmlns="http://www.w3.org/2000/svg">
    <title>Vercel Spacing Consideration</title>
    <path d="M.5.87h719v359H.5z" fill="var(--acme-background)">
    <path clip-rule="evenodd" d="m267.25 155.75 28.75 50h-57.5z" fill="var(--ds-gray-1000)" fill-rule="evenodd">
    <path clip-rule="evenodd" d="m324.75 155.75 28.75 50h-57.5z" fill="var(--ds-gray-600)" fill-rule="evenodd">
    <path d="m357.5 180.75h6m6 0h-6m0 0v-6m0 6v6" stroke="#a8a8a8" stroke-width=".96">
    <path clip-rule="evenodd" d="m402.25 155.75 28.75 50h-57.5z" fill="var(--ds-gray-600)" fill-rule="evenodd">
    <g mask="url(#a)">
      <path d="m450.35 173.95v-4.75c0-.4.15-.7.5-.9l9.55-5.5c1.3-.75 2.85-1.1 4.45-1.1 6 0 9.8 4.65 9.8 9.6 0 .35 0 .75-.05 1.15l-9.9-5.8c-.6-.35-1.2-.35-1.8 0zm22.3 18.5v-11.35c0-.7-.3-1.2-.9-1.55l-12.55-7.3 4.1-2.35c.35-.2.65-.2 1 0l9.55 5.5c2.75 1.6 4.6 5 4.6 8.299 0 3.8-2.25 7.301-5.8 8.751zm-25.25-10-4.1-2.4c-.35-.2-.5-.5-.5-.9v-11c0-5.35 4.1-9.4 9.65-9.4 2.1 0 4.05.7 5.7 1.95l-9.85 5.7c-.599.35-.9.85-.9 1.551v14.5zm8.825 5.1-5.875-3.3v-7l5.875-3.3 5.875 3.3v7zm3.775 15.2c-2.1 0-4.05-.7-5.7-1.95l9.85-5.7c.6-.35.9-.85.9-1.55v-14.5l4.15 2.4c.35.2.5.5.5.9v11c0 5.35-4.15 9.4-9.7 9.4zm-11.85-11.15-9.55-5.5c-2.751-1.6-4.6-5-4.6-8.3 0-3.85 2.3-7.3 5.85-8.75v11.4c0 .7.3 1.2.9 1.55l12.5 7.25-4.1 2.35c-.35.2-.65.2-1 0zm-.55 8.2c-5.65 0-9.8-4.25-9.8-9.5 0-.4.05-.8.1-1.2l9.85 5.7c.6.35 1.2.35 1.8 0l12.55-7.25v4.751c0 .4-.15.7-.5.899l-9.55 5.5c-1.3.75-2.85 1.1-4.45 1.1zm12.4 5.95c6.05 0 11.1-4.3 12.25-10 5.6-1.45 9.2-6.7 9.2-12.05 0-3.5-1.5-6.9-4.2-9.35.25-1.05.4-2.1.4-3.15 0-7.15-5.8-12.5-12.5-12.5-1.35 0-2.65.2-3.95.65-2.25-2.2-5.35-3.6-8.75-3.6-6.05 0-11.1 4.3-12.25 10-5.6 1.45-9.2 6.7-9.2 12.05 0 3.5 1.5 6.9 4.2 9.35-.25 1.05-.4 2.1-.4 3.15 0 7.15 5.8 12.5 12.5 12.5 1.35 0 2.65-.2 3.95-.65 2.25 2.2 5.35 3.6 8.75 3.6z" fill="var(--ds-gray-1000)">
    </g>
    <path clip-rule="evenodd" d="m267.25 105.75 28.75 50h-57.5z" fill="var(--ds-gray-600)" fill-rule="evenodd">
    <path clip-rule="evenodd" d="m267.25 205.75 28.75 50h-57.5z" fill="var(--ds-gray-600)" fill-rule="evenodd">
    <path d="m296 255.75v-150" stroke="#a8a8a8" stroke-dasharray="4 8" stroke-width=".5">
    <path d="m353.5 255.75v-150" stroke="#a8a8a8" stroke-dasharray="4 8" stroke-width=".5">
    <path d="m373.5 255.75v-150" stroke="#a8a8a8" stroke-dasharray="4 8" stroke-width=".5">
    <path d="m431 255.75v-150" stroke="#a8a8a8" stroke-dasharray="4 8" stroke-width=".5">
    <path d="m481.5 255.75v-150" stroke="#a8a8a8" stroke-dasharray="4 8" stroke-width=".5">
    <path clip-rule="evenodd" d="m209.75 155.75 28.75 50h-57.5z" fill="var(--ds-gray-600)" fill-rule="evenodd">
    <g stroke="#a8a8a8" stroke-dasharray="4 8" stroke-width=".5">
      <path d="m238.5 255.75v-150">
      <path d="m181 255.75v-150">
      <path d="m600 205.75h-480">
      <path d="m600 155.75h-480">
      <path d="m600 105.75h-480">
      <path d="m600 255.75h-480">
    </g>
  </svg>
</acme-brands>
<acme-brands full-width white>
  <svg fill="none" style="margin-top:-1px" viewBox="0 0 720 361" xmlns="http://www.w3.org/2000/svg">
    <title>Vercel Spacing Partner</title>
    <path d="M.5.87h719v359H.5z" fill="var(--acme-background)">
    <path clip-rule="evenodd" d="m134.425 160.75 22.425 39h-44.85z" fill="var(--ds-gray-600)" fill-rule="evenodd">
    <path clip-rule="evenodd" d="m201.7 199.75-22.425-39-22.425 39zm22.618-1.775 18.741-35.452h-8.106l-12.928 25.746-12.928-25.746h-8.106l18.741 35.452zm127.718-35.452v35.452h-6.711v-35.452zm-37.356 22.22c0-2.763.577-5.193 1.731-7.291 1.153-2.097 2.761-3.711 4.823-4.843s4.474-1.698 7.235-1.698c2.447 0 4.649.533 6.606 1.598 1.958 1.065 3.513 2.647 4.666 4.744 1.154 2.097 1.748 4.66 1.783 7.689v1.548h-19.766c.14 2.197.787 3.928 1.94 5.193 1.189 1.232 2.779 1.848 4.771 1.848 1.259 0 2.412-.333 3.461-.999 1.048-.666 1.835-1.565 2.359-2.696l6.868.499c-.839 2.497-2.412 4.494-4.719 5.992-2.306 1.498-4.963 2.247-7.969 2.247-2.761 0-5.173-.566-7.235-1.698s-3.67-2.746-4.823-4.843c-1.154-2.098-1.731-4.528-1.731-7.29zm19.923-2.497c-.244-2.164-.926-3.745-2.044-4.744-1.119-1.032-2.482-1.548-4.09-1.548-1.852 0-3.355.55-4.509 1.648-1.153 1.099-1.87 2.647-2.149 4.644zm-31.244-4.744c1.118.899 1.818 2.147 2.097 3.745l6.921-.349c-.245-2.031-.961-3.795-2.15-5.293-1.188-1.498-2.726-2.647-4.614-3.445-1.852-.833-3.897-1.249-6.134-1.249-2.761 0-5.173.566-7.235 1.698s-3.67 2.746-4.823 4.843c-1.154 2.098-1.731 4.528-1.731 7.291 0 2.762.577 5.192 1.731 7.29 1.153 2.097 2.761 3.711 4.823 4.843s4.474 1.698 7.235 1.698c2.307 0 4.404-.416 6.292-1.249 1.887-.865 3.425-2.08 4.613-3.645 1.189-1.564 1.905-3.395 2.15-5.492l-6.973-.3c-.245 1.765-.926 3.129-2.045 4.095-1.118.932-2.464 1.398-4.037 1.398-2.167 0-3.845-.749-5.033-2.247s-1.783-3.629-1.783-6.391c0-2.763.595-4.894 1.783-6.392s2.866-2.247 5.033-2.247c1.503 0 2.796.466 3.88 1.398zm-34.044-5.993h6.245l.18 5.094c.443-1.442 1.06-2.562 1.849-3.359 1.145-1.157 2.741-1.735 4.788-1.735h2.55v5.452h-2.602c-1.457 0-2.654.198-3.591.595-.902.396-1.596 1.024-2.081 1.883-.452.859-.677 1.949-.677 3.271v15.265h-6.661zm-28.806 5.943c-1.153 2.098-1.73 4.528-1.73 7.291 0 2.762.577 5.192 1.73 7.29 1.154 2.097 2.762 3.711 4.824 4.843s4.474 1.698 7.235 1.698c3.006 0 5.662-.749 7.969-2.247s3.88-3.495 4.719-5.992l-6.868-.499c-.525 1.131-1.311 2.03-2.36 2.696-1.048.666-2.202.999-3.46.999-1.992 0-3.583-.616-4.771-1.848-1.153-1.265-1.8-2.996-1.94-5.193h19.766v-1.548c-.035-3.029-.629-5.592-1.783-7.689-1.153-2.097-2.709-3.679-4.666-4.744s-4.159-1.598-6.606-1.598c-2.761 0-5.173.566-7.235 1.698s-3.67 2.746-4.824 4.843zm16.148.05c1.119.999 1.801 2.58 2.045 4.744h-12.792c.279-1.997.996-3.545 2.149-4.644 1.154-1.098 2.656-1.648 4.509-1.648 1.608 0 2.971.516 4.089 1.548z" fill="var(--ds-gray-1000)" fill-rule="evenodd">
    <path clip-rule="evenodd" d="m375.775 160.75 22.425 39h-44.85z" fill="var(--ds-gray-600)" fill-rule="evenodd">
    <path d="m402.2 180.25h6m6 0h-6m0 0v-6m0 6v6" stroke="#a8a8a8" stroke-width=".96">
    <path clip-rule="evenodd" d="m440.625 160.75 22.425 39h-44.85z" fill="var(--ds-gray-600)" fill-rule="evenodd">
    <path d="m478.478 160.75c-8.485 0-15.428 6.943-15.428 15.429 0 8.485 6.943 15.428 15.428 15.428 8.486 0 15.429-6.9 15.429-15.428 0-8.529-6.9-15.429-15.429-15.429zm0 25.329c-5.271 0-9.514-4.329-9.514-9.9 0-5.572 4.243-9.901 9.514-9.901 5.272 0 9.515 4.329 9.515 9.901 0 5.571-4.243 9.9-9.515 9.9z" fill="var(--ds-gray-1000)">
    <path d="m509.507 169.321c-2.786 0-5.486 1.115-6.9 3v-2.571h-5.572v30h5.572v-10.843c1.414 1.757 4.028 2.7 6.9 2.7 6 0 10.714-4.714 10.714-11.143 0-6.428-4.714-11.143-10.714-11.143zm-.943 17.443c-3.172 0-6-2.485-6-6.3 0-3.814 2.828-6.3 6-6.3 3.171 0 6 2.486 6 6.3 0 3.815-2.829 6.3-6 6.3z" fill="var(--ds-gray-1000)">
    <path d="m533.336 169.321c-6.086 0-10.886 4.757-10.886 11.143s4.2 11.143 11.057 11.143c5.615 0 9.215-3.386 10.329-7.2h-5.443c-.686 1.586-2.614 2.7-4.929 2.7-2.871 0-5.057-2.014-5.571-4.886h16.2v-2.185c0-5.829-4.071-10.715-10.757-10.715zm-5.4 8.958c.6-2.7 2.828-4.458 5.528-4.458 2.872 0 5.058 1.886 5.315 4.458z" fill="var(--ds-gray-1000)">
    <path d="m558.921 169.321c-2.485 0-5.1 1.115-6.3 2.957v-2.528h-5.571v21.428h5.571v-11.528c0-3.343 1.8-5.529 4.714-5.529 2.7 0 4.157 2.057 4.157 4.929v12.128h5.572v-13.028c0-5.314-3.257-8.829-8.143-8.829z" fill="var(--ds-gray-1000)">
    <path d="m581.334 161.179-12.129 30h5.957l2.571-6.557h13.801l2.571 6.557h6.042l-12.042-30zm-1.672 18.472 4.972-12.557 4.928 12.557z" fill="var(--ds-gray-1000)">
    <path d="m608.076 161.179h-5.657v30h5.657z" fill="var(--ds-gray-1000)">
    <path clip-rule="evenodd" d="m255.25 121.75 22.425 39h-44.85z" fill="var(--ds-gray-600)" fill-rule="evenodd">
    <path clip-rule="evenodd" d="m255.25 199.75 22.425 39h-44.85z" fill="var(--ds-gray-600)" fill-rule="evenodd">
    <g stroke="#a8a8a8" stroke-dasharray="4 8" stroke-width=".5">
      <path d="m353.5 238.75v-117">
      <path d="m398 238.75v-117">
      <path d="m418 238.75v-117">
      <path d="m463 238.75v-117">
      <path d="m656 199.75h-600">
      <path d="m656 160.75h-600">
      <path d="m656 121.75h-600">
      <path d="m608 238.75v-117">
      <path d="m660 238.75h-600">
      <path d="m157 238.75v-117">
      <path d="m112 238.75v-117">
    </g>
  </svg>
</acme-brands>
```

## Next.js

The Next.js trademark includes the Next.js name &amp; logo, and any word, phrase, image, or other designation that identifies any Vercel products. Please don’t modify the marks or use them in a confusing way, including suggesting sponsorship or endorsement by Vercel, or in a way that confuses Vercel with another brand.Download Next.js Assets

```html
<div class="brand-ground">
  <acme-brands brand="nextjs-logotype" height="64" mode="light" copy></acme-brands>
</div>
<div class="brand-ground black">
  <acme-brands brand="nextjs-logotype" height="64" mode="dark" copy></acme-brands>
</div>
```

## Next.js symbol

The Next.js symbol should only be used in places where there is not enough room to display the full logo, or in cases where only brand icons of multiple brands are displayed.

```html
<div class="brand-pair">
  <div class="brand-ground symbol">
    <acme-brands brand="next-js" height="40" mode="light" copy></acme-brands>
  </div>
  <div class="brand-ground symbol black">
    <acme-brands brand="next-js" height="40" mode="dark" copy></acme-brands>
  </div>
</div>
```

## Turbo

Turbo includes the Turbo, Turborepo and Turbopack names &amp; logos, and any word, phrase, image, or other designation that identifies any Vercel products. Please don’t modify the marks or use them in a confusing way, including suggesting sponsorship or endorsement by Vercel, or in a way that confuses Vercel with another brand.Download Turbo Assets

```html
<div class="brand-ground">
  <acme-brands brand="turbo-logotype" height="64" mode="light" copy></acme-brands>
</div>
<div class="brand-ground black">
  <acme-brands brand="turbo-logotype" height="64" mode="dark" copy></acme-brands>
</div>
```

## Turbo symbol

The Turbo symbol should only be used in places where there is not enough room to display the full logo, or in cases where only brand icons of multiple brands are displayed.

```html
<div class="brand-pair">
  <div class="brand-ground symbol">
    <acme-brands brand="turbo" height="40" mode="light" copy></acme-brands>
  </div>
  <div class="brand-ground symbol black">
    <acme-brands brand="turbo" height="40" mode="dark" copy></acme-brands>
  </div>
</div>
```

## Turborepo

Turborepo symbol: The Turbo symbol should only be used in places where there is not enough room to display the full Turborepo logo, or in cases where only brand icons of multiple brands are displayed.

```html
<div class="brand-ground">
  <acme-brands brand="turborepo-logotype" height="64" mode="light" copy></acme-brands>
</div>
<div class="brand-ground black">
  <acme-brands brand="turborepo-logotype" height="64" mode="dark" copy></acme-brands>
</div>
```

## Turbopack

```html
<div class="brand-ground">
  <acme-brands brand="turbopack-logotype" height="64" mode="light" copy></acme-brands>
</div>
<div class="brand-ground black">
  <acme-brands brand="turbopack-logotype" height="64" mode="dark" copy></acme-brands>
</div>
```

## Turbopack Symbol

The Turbopack symbol should only be used in places where there is not enough room to display the full logo, or in cases where only brand icons of multiple brands are displayed.

```html
<div class="brand-pair">
  <div class="brand-ground symbol">
    <acme-brands brand="turbopack" height="40" mode="light" copy></acme-brands>
  </div>
  <div class="brand-ground symbol black">
    <acme-brands brand="turbopack" height="40" mode="dark" copy></acme-brands>
  </div>
</div>
```

## v0

The v0 trademark includes the v0 name &amp; logo, and any word, phrase, image, or other designation that identifies any Vercel products. Please don’t modify the marks or use them in a confusing way, including suggesting sponsorship or endorsement by Vercel, or in a way that confuses Vercel with another brand.v0 Assets

```html
<div class="brand-ground v0">
  <acme-brands brand="v0" height="48" copy></acme-brands>
</div>
```

## eve

eve is an open source framework. Its brand assets include the eve name &amp; logo, and any word, phrase, image, or other designation that identifies the framework. Please don’t modify the logo or use these assets in a confusing way, including suggesting sponsorship or endorsement by Vercel, or in a way that confuses eve with another brand.Download eve assets

```html
<div class="brand-ground">
  <acme-brands brand="eve" height="24" mode="light" copy full-width></acme-brands>
</div>
<div class="brand-ground black">
  <acme-brands brand="eve" height="24" mode="dark" copy full-width></acme-brands>
</div>
```

## AI SDK

AI SDK includes the logo, and any word, phrase, image, or other designation that identifies any Vercel products. Please don’t modify the marks or use them in a confusing way, including suggesting sponsorship or endorsement by Vercel, or in a way that confuses Vercel with another brand.Download AI SDK Assets

```html
<div class="brand-ground">
  <acme-brands brand="ai-sdk" height="24" mode="light" copy full-width></acme-brands>
</div>
<div class="brand-ground black">
  <acme-brands brand="ai-sdk" height="24" mode="dark" copy full-width></acme-brands>
</div>
```

## `<acme-brands>`

Brands: a brand mark in a preview box. The box forces the light theme's tokens, so a mark reads
the same on either page theme, and centres the frame around the mark; `copy` adds a button over
the box's top right corner (shown on hover or focus) that copies the mark's markup. `brand`
names a house mark: the wordmarks (`vercel-logotype`, `nextjs-logotype`, `turbo-logotype`,
`turborepo-logotype`, `turbopack-logotype`) and the symbols (`vercel`, `next-js`, `turbo`,
`turbopack`, `v0`, `eve`, `ai-sdk`); anything slotted is shown instead (a custom illustration).
An inline mark is drawn in the current color: `mode="light"` makes it black, `mode="dark"` white;
an image mark is a light and a dark file, and `mode="dark"` shows the dark one. `height` sizes the
mark (its natural height by default; `balanced` sizes it to read as tall as text beside it).
`full-width` lifts the frame's 80% cap on an inline mark; `white` gives the box a white ground.
Fires `acme-copy` with the copied markup.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `brand` | `brand` | `BrandName \| ""` | `""` | The house mark to draw; empty shows the slotted content. |
| `height` | `height` | `number` | `0` | The mark's height in px; 0 is its natural height. |
| `balanced` | `balanced` | `boolean` | `false` | Sizes the mark by its balanced multipliers, to read as tall as text beside it (needs a `height`). |
| `mode` | `mode` | `"" \| "light" \| "dark"` | `""` | `light` draws an inline mark black and shows an image mark's light file; `dark` draws it white and shows the dark file; unset keeps the current color and the light file. |
| `full-width` | `fullWidth` | `boolean` | `false` | Lifts the frame's 80% width cap on an inline mark. |
| `white` | `white` | `boolean` | `false` | A white ground behind the frame. |
| `copy` | `copy` | `boolean` | `false` | The copy button over the box's top right corner: it copies the mark's markup. |
| `image` | `image` | `boolean` | `false` | Shows the image pair of a brand that also has an inline drawing (`v0`, `eve`, `ai-sdk`). |

Slots: `(default)`

Events: `acme-copy`

## Best Practices

**Next.js spelling**

- The preferred written format is Next.js. After the first instance of Next.js, Next is an accepted format if used at least several times on the same page.
- URLs may use nextjs or next. Using Next as a pun for Next.js should be done sparingly and in good taste.
- For tagging on social media, #nextjs is an accepted format.

**eve spelling**

- The preferred written format is eve. Always write eve in lowercase, including in headings, links, buttons, URLs, and social tags. Do not use Eve, EVE, or other capitalized variations.

**General Information**

- By using the Vercel trademarks you agree to the guidelines as well as our Terms of Service and all our rules and policies. Vercel reserves the right to cancel, modify, or change the permission in these guidelines at any time at its sole discretion.
- For further information about use of the Vercel name and trademarks, please contact brand@vercel.com.

**Usage**

- You may use the Vercel marks to truthfully describe the products, services, and technologies that we offer. You may also use Vercel marks to truthfully state that you are a customer and are using a Vercel product. For example, "Our website is hosted on the Vercel platform."
- All other uses of Vercel marks, including in connection with our vendors and products, software, or applications that utilize our open source code, require prior written permission from us. Note that a copyright license for software, even an open source software license, does not provide a license to use a trademark related to the project. For inquiries, please contact brand@vercel.com.
- Any advertisements, documentation, websites, or other references that include permitted uses of the Vercel marks must also include the following attribution statement which can be displayed at the end of the material, in the footer of the document, or some other clear and conspicuous location that can be quickly identified: Vercel, the Vercel design, Next.js and related marks, designs and logos are trademarks or registered trademarks of Vercel, Inc. or its affiliates in the US and other countries.

**Misuse**

- Do not use Vercel marks in the name of your business, product, service, application, domain name, publication, or other offering.
- Do not use marks, logos, company names, slogans, domain names, or designs that are confusingly similar to any Vercel marks.
- Do not use the Vercel marks in any manner likely to create confusion as to the sponsorship or relationship, affiliation, or endorsement of your company, product or service by Vercel.
- Do not use the Vercel marks in a false or misleading manner.
- Do not display the Vercel marks more prominently than your trademarks, product, service, or company name.
- Do not use Vercel marks for commercial purposes. e.g. do not include Vercel marks on merchandise or marketing collateral for your commercial products or services.
- Do not modify the Vercel marks.
- Do not use the Vercel marks on or in connection with any defamatory, scandalous, pornographic, obscene or other objectionable materials.

