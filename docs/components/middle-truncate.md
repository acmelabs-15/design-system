# Middle Truncate

Truncate text in the middle, so the start and the end of the string both stay readable.

## Examples

Strings that gain from a cut in the middle. The slider sets the width; Animate sweeps it.

```html
<div class="vstack" style="gap:24px">
  <div class="vstack" style="gap:12px">
    <div class="row" style="gap:16px;flex-wrap:nowrap;padding:12px 16px;border:1px solid var(--ds-gray-alpha-400);border-radius:6px">
      <div class="text-label-13" style="flex:0 0 128px;color:var(--ds-gray-700)">Branch</div>
      <div data-width style="max-width:600px">
        <div style="min-width:0;flex:1 1 0">
          <acme-middle-truncate class="text-label-14" value="feature/redesign-dashboard-navigation-with-sidebar-improvements"></acme-middle-truncate>
        </div>
      </div>
    </div>
    <div class="row" style="gap:16px;flex-wrap:nowrap;padding:12px 16px;border:1px solid var(--ds-gray-alpha-400);border-radius:6px">
      <div class="text-label-13" style="flex:0 0 128px;color:var(--ds-gray-700)">Preview URL</div>
      <div data-width style="max-width:600px">
        <div style="min-width:0;flex:1 1 0">
          <acme-middle-truncate class="text-copy-14" value="platform-web-git-feature-redesign-dashboard-navigation-phamous.vercel.app"></acme-middle-truncate>
        </div>
      </div>
    </div>
    <div class="row" style="gap:16px;flex-wrap:nowrap;padding:12px 16px;border:1px solid var(--ds-gray-alpha-400);border-radius:6px">
      <div class="text-label-13" style="flex:0 0 128px;color:var(--ds-gray-700)">Deployment ID</div>
      <div data-width style="max-width:600px">
        <div style="min-width:0;flex:1 1 0">
          <acme-middle-truncate class="text-label-14" value="dpl_8gmXTT1yJRP8UbGfXD7A3sp4RKhW"></acme-middle-truncate>
        </div>
      </div>
    </div>
    <div class="row" style="gap:16px;flex-wrap:nowrap;padding:12px 16px;border:1px solid var(--ds-gray-alpha-400);border-radius:6px">
      <div class="text-label-13" style="flex:0 0 128px;color:var(--ds-gray-700)">Env var key</div>
      <div data-width style="max-width:600px">
        <div style="min-width:0;flex:1 1 0">
          <acme-middle-truncate class="text-label-14" style="font-family:var(--mono)" value="STRIPE_WEBHOOK_SIGNING_SECRET"></acme-middle-truncate>
        </div>
      </div>
    </div>
    <div class="row" style="gap:16px;flex-wrap:nowrap;padding:12px 16px;border:1px solid var(--ds-gray-alpha-400);border-radius:6px">
      <div class="text-label-13" style="flex:0 0 128px;color:var(--ds-gray-700)">Monospace no ligatures</div>
      <div data-width style="max-width:600px">
        <div style="min-width:0;flex:1 1 0">
          <acme-middle-truncate class="text-label-14" style="font-family:var(--mono);font-feature-settings:'liga' 0,'calt' 0;font-variant-ligatures:none" value="STRIPE_WEBHOOK_SIGNING_SECRET"></acme-middle-truncate>
        </div>
      </div>
    </div>
    <div class="row" style="gap:16px;flex-wrap:nowrap;padding:12px 16px;border:1px solid var(--ds-gray-alpha-400);border-radius:6px">
      <div class="text-label-13" style="flex:0 0 128px;color:var(--ds-gray-700)">Commit SHA</div>
      <div data-width style="max-width:600px">
        <div style="min-width:0;flex:1 1 0">
          <acme-middle-truncate class="text-copy-14" value="2b0874e797d7c2a4092d0033ee0c2f0f9aef2869"></acme-middle-truncate>
        </div>
      </div>
    </div>
    <div class="row" style="gap:16px;flex-wrap:nowrap;padding:12px 16px;border:1px solid var(--ds-gray-alpha-400);border-radius:6px">
      <div class="text-label-13" style="flex:0 0 128px;color:var(--ds-gray-700)">File path</div>
      <div data-width style="max-width:600px">
        <div style="min-width:0;flex:1 1 0">
          <acme-middle-truncate class="text-copy-14" value="apps/vercel-site/app/(dashboard)/[teamSlug]/[project]/settings/page.tsx"></acme-middle-truncate>
        </div>
      </div>
    </div>
    <div class="row" style="gap:16px;flex-wrap:nowrap;padding:12px 16px;border:1px solid var(--ds-gray-alpha-400);border-radius:6px">
      <div class="text-label-13" style="flex:0 0 128px;color:var(--ds-gray-700)">Custom domain</div>
      <div data-width style="max-width:600px">
        <div style="min-width:0;flex:1 1 0">
          <acme-middle-truncate class="text-copy-14" value="api.internal.platform-observability.example.com"></acme-middle-truncate>
        </div>
      </div>
    </div>
    <div class="row" style="gap:16px;flex-wrap:nowrap;padding:12px 16px;border:1px solid var(--ds-gray-alpha-400);border-radius:6px">
      <div class="text-label-13" style="flex:0 0 128px;color:var(--ds-gray-700)">Model name</div>
      <div data-width style="max-width:600px">
        <div style="min-width:0;flex:1 1 0">
          <acme-middle-truncate class="text-label-14" value="google/gemini-3.1-flash-image-preview"></acme-middle-truncate>
        </div>
      </div>
    </div>
    <div class="row" style="gap:16px;flex-wrap:nowrap;padding:12px 16px;border:1px solid var(--ds-gray-alpha-400);border-radius:6px">
      <div class="text-label-13" style="flex:0 0 128px;color:var(--ds-gray-700)">Tight width</div>
      <div data-width style="max-width:600px">
        <div style="min-width:0;flex:1 1 0">
          <acme-middle-truncate class="text-label-14" value="feature/redesign-dashboard-navigation-with-sidebar-improvements"></acme-middle-truncate>
        </div>
      </div>
    </div>
    <div class="row" style="gap:16px;flex-wrap:nowrap;padding:12px 16px;border:1px solid var(--ds-gray-alpha-400);border-radius:6px">
      <div class="text-label-13" style="flex:0 0 128px;color:var(--ds-gray-700)">Fits as-is</div>
      <div data-width style="max-width:600px">
        <div style="min-width:0;flex:1 1 0">
          <acme-middle-truncate class="text-label-14" value="sidebar.tsx"></acme-middle-truncate>
        </div>
      </div>
    </div>
  </div>
  <aside class="vstack" style="gap:12px;align-items:flex-start">
    <form class="row" style="gap:4px">
      <acme-label value="Width">
        <span class="row" style="gap:8px">
          <acme-slider min="0" max="600" value="600" style="width:240px"></acme-slider>
          <span class="text-copy-13" style="font-family:var(--mono);color:var(--ds-gray-900)">
            <output>600px</output>
          </span>
        </span>
      </acme-label>
    </form>
    <acme-toggle>Animate</acme-toggle>
  </aside>
</div>
<script>const MAX = 600; const boxes = root.querySelectorAll('[data-width]'); const slider = root.querySelector('acme-slider'); const out = root.querySelector('output'); const toggle = root.querySelector('acme-toggle'); const set = (w) => { for (const b of boxes) b.style.maxWidth = w + 'px'; out.textContent = w + 'px'; slider.value = [w]; }; slider.addEventListener('acme-change', (e) => set(e.detail.value[0])); let raf = 0, start = null; const step = (t) => { if (start === null) start = t; const p = ((t - start) % 4000) / 4000; const k = p 0.5 ? p * 2 : 2 - p * 2; set(Math.round(k * MAX)); raf = requestAnimationFrame(step); }; toggle.addEventListener('acme-change', (e) => { slider.disabled = e.detail.checked; if (e.detail.checked) { start = null; raf = requestAnimationFrame(step); } else cancelAnimationFrame(raf); });</script>
```

## `<acme-middle-truncate>`

Middle truncate: keeps the head and the tail of `value` around one ellipsis glyph, cut to the
width of the container (a resize or a font load re-measures). The root is an inline grid: a
hidden copy of the full value sets its intrinsic width, the visible text sits over it, and an
absolute hidden span measures candidate cuts. When cut, the root carries the full value as its
title, a visually hidden span keeps it for assistive tech, and a copy of the visible text yields
the matching part of the full value.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `value` | `value` | `string` | `""` |  |

## Best Practices

**When to use**

- Middle Truncate is for strings whose head and tail both carry information: file paths (apps/…/page.tsx), URLs, deployment IDs (dpl_…abc123), commit hashes, branch names with prefixes.
- Prose, descriptions and headings end-truncate with …; a cut in the middle of a sentence destroys the meaning.
- A truncated value the reader may need verbatim gets a Tooltip with the full string or a copy-on-click affordance.

**Behavior**

- The element renders one ellipsis glyph (…), not three periods, so monospace values (environment variable keys, IDs, hashes, paths) do not spend three character cells on the marker.
- The element follows its container width, so a layout that changes width on hover (an expanding card, an animated row) makes the cut point jitter. Lock the width during interaction.
- A copy of the truncated text yields the full value, not the visible form. Keep that true if you add a custom copy handler.
- Never put the element inside another text-overflow: ellipsis container; the two strategies fight and the inner ellipsis wins inconsistently.

**Accessibility**

- The full string reaches assistive tech through the accessible name of the wrapper; the element keeps the full value in the DOM for copy.
- Inside a focusable control, give the control an explicit aria-label; the ellipsis alone gives a screen reader nothing to announce.
- Keep the visible string long enough on small viewports that the head still identifies the resource (a path segment, an ID prefix).

