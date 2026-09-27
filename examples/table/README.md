# Table consumer examples

The application owns TanStack Table and TanStack Virtual. `acme-table` supplies appearance, a scrolling element and native-content styling. React and Lit each render their own native nodes.

- `lit.ts` and `react.ts`: the complete feature fixture, including grouped headings, selection, sorting/filtering, pinning, resizing, aggregation, spans, a custom review feature and Pagination.
- `grid-interaction.ts`: application-owned keyboard navigation and editor entry. Arrow keys move between cells. Enter opens a cell action. F2 enters its editor. Escape returns to its cell.
- `virtual-lit.ts` and `virtual-react.ts`: element virtualizers for both axes. The vertical recipe uses unmerged, independently measured rows. The horizontal recipe keeps native spans. Both preserve direct refs and logical row/column counts.
- `worker-session.ts`, `worker-lit.ts`, `worker-react.ts`, `table-worker.ts`: an application-owned experimental worker, failure/retry, manual server results and explicit cleanup. Compile the worker as a separate browser entry. Keep its URL relative to the application entry. Dispose the session when its owning application root is removed.

The compatibility baseline is Table 9.2.4 and Virtual 3.14.0. Ordinary Table and Virtual examples require no declaration patch.

## Experimental worker application

Copy every source file from the worker recipe, keeping its paths, plus its `main.ts` and `index.html`. Use Bun 1.4.2. From the new application directory, run `bun init -y`, then install the dependencies for one framework:

```sh
# Lit
bun add --exact @acmelabs/design-system@0.3.0 lit@3.3.3 @tanstack/lit-table@9.2.4 @tanstack/lit-store@0.13.2 @tanstack/table-core@9.2.4 @tanstack/store@0.11.1

# React
bun add --exact @acmelabs/design-system@0.3.0 @acmelabs/design-system-react@0.3.0 react@19.3.0 react-dom@19.3.0 @tanstack/react-table@9.2.4 @tanstack/react-store@0.11.1 @tanstack/table-core@9.2.4 @tanstack/store@0.11.1
```

If this application also uses custom Table features, run:

```sh
bun examples/table/setup.ts
```

Table 9.2.4's experimental worker and custom features augment different declaration modules. This causes type errors when both are in one TypeScript program. `setup.ts` verifies version 9.2.4 and the full declaration SHA-256 before changing two module targets. It runs `bun patch` before editing and `bun patch --commit` afterward. Keep the generated application patch, `package.json` and `bun.lock` together. A clean install then applies the same correction. The command is safe to repeat and fails on an unverified version or declaration. No runtime JavaScript changes.

Build the application and separate worker:

```sh
bun examples/table/build-worker.ts
```

Serve `dist/` over HTTP. The build carries the worker URL through Bun's file loader, including shared application chunks. Browser entries never import `setup.ts` or `build-worker.ts`. Remove the Lit host or unmount the React host to dispose worker resources. Remounting creates a working session. The visible controls demonstrate filtering, failure, retry and manual server results.

The declaration comes from the [official Table 9.2.4 package](https://www.npmjs.com/package/@tanstack/table-core/v/9.2.4), under [TanStack Table's MIT license](https://github.com/TanStack/table/blob/main/LICENSE). Its installed license stays intact. The correction follows the public extension module used by `review-feature.ts`; [upstream worker source](https://github.com/TanStack/table/blob/main/packages/table-core/src/worker/createTableWorker.ts) still declares the two private targets at this review. Reevaluate the correction only after the combined type check passes against a newer upstream release. [Bun's patch workflow](https://bun.sh/docs/pm/cli/patch) preserves the correction across application installs.

The fixture intentionally registers every Table feature to test compatibility. Production applications should register only the features they use. Known totals and source data remain application-owned. These examples do not promise compatibility with every future release or every untested combination.
