const recipe=await Bun.file('../node_modules/@acmelabs/design-system/skills/references/0.2.0/recipe/virtualized-table.json').json();
const files=recipe.examples.lit.sources.flatMap((s:any)=>s.files);
await Bun.write('grid-interaction.ts',files.find((f:any)=>f.path==='examples/table/grid-interaction.ts').code);
await Bun.write('definitions.ts',files.find((f:any)=>f.path==='examples/table/definitions.ts').code);
