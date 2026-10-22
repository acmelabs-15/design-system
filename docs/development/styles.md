# Style ownership

Read this guide before changing CSS, token producers, style maps or generated style output. The [repository map](../agents/repository.md#generator-and-delivery-map) identifies each authoritative input and writer.

## Change the owning input

Author declarations in the recorded producer inputs. These include authored styles, reference maps, committed specifications and producer scripts. Fix the producer that owns the defect. Reference tooling is one producer family, not the owner of every CSS change.

Mapped source uses its named generator:

```sh
bun tools/geist/gen.ts <name>
```

The split producer regenerates authored base and component styles:

```sh
bun run split
```

Read [generation guidance](generation.md) before changing reference extraction, maps or census evidence. Preserve the [real-wrapper-box constraint](components.md#composition-and-browser-behavior); style delivery does not create an exception.

## Compile and verify output

The shared [style compiler](../../scripts/styles.ts) produces compiled CSS, source maps, Lit delivery modules and manifest records. Generated style modules and compiled CSS are outputs. Change their inputs and regenerate them.

Manifest records bind producer inputs, output hashes, compiler details and custom-property registration definitions. Respect the producer write lock and registration validation. Output retirement checks protect files changed outside their recorded owner. Build rejects stale or unrecorded generated inputs.

Theme CSS, token metadata, responsive delivery and artwork have distinct writers in the repository map. External corpus inputs are checked when available. Their absence does not turn historical source evidence into a fresh reference capture.

Review generated output with its input change. Use [verification guidance](../agents/verification.md) for dependent build, type, style and browser checks. A compiled declaration alone does not establish its rendered effect.
