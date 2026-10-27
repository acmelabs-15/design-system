# @acmelabs/design-system-browser

Self-contained browser modules, bundles and styles for the ACME design system. Use selective modules from a CDN or serve this package from your own origin.

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@400..700&family=Google+Sans+Code:wght@400..700&display=swap">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@acmelabs/design-system-browser@0.3.3/styles/tokens.css">
<script type="module">
  import "https://cdn.jsdelivr.net/npm/@acmelabs/design-system-browser@0.3.3/dist/define/button.js";
</script>

<acme-button>Save</acme-button>
```

Selective modules register their owned component dependencies. Import each component used in your page. Modules share runtime chunks within this package.

Use `dist/standalone.js` to register the component library and install its token stylesheet. Use `dist/configure.js` for configuration helpers. Optional icon definitions live under `dist/define/`; optional artwork lives under `dist/generated/icons/artwork/`.

The `bundle/` directory provides complete bundles. Keep their generated chunks and assets beside them. Flow Diagram loads its layout engine and worker on demand.

This package includes its runtime dependencies and does not require the core package. Applications that use a bundler or TypeScript use `@acmelabs/design-system`. Keep all design-system package versions aligned.

Third-party notices are included under `licenses/`. Asset notices, modified runtime notices and bundled package licenses retain their original text and provenance.

[Documentation](https://acmelabs-15.github.io/design-system/)
