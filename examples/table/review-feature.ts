import { assignTableAPIs, makeStateUpdater, type OnChangeFn, type Plugins, type RowData, type TableFeature, type TableFeatures } from "@tanstack/table-core";

type ReviewState = { reviewedIds: string[] };
type ReviewOptions = { onReviewedIdsChange?: OnChangeFn<string[]> };
type ReviewApi = { markReviewed(id: string): void; getReviewedIds(): readonly string[] };
declare module "@tanstack/table-core" {
  interface Plugins {
    reviewFeature: TableFeature;
  }
  interface TableState_FeatureMap {
    reviewFeature: ReviewState;
  }
  interface TableOptions_FeatureMap<TFeatures extends TableFeatures, TData extends RowData> {
    reviewFeature: ReviewOptions;
  }
  interface Table_FeatureMap<TFeatures extends TableFeatures, TData extends RowData> {
    reviewFeature: ReviewApi;
  }
}
type ReviewTable = { atoms: { reviewedIds: { get(): string[] } }; options: ReviewOptions };
/** Example application plugin with a real reactive state slice. */
export const reviewFeature: Plugins["reviewFeature"] = {
  getInitialState: (state) => ({ reviewedIds: [], ...state }),
  getDefaultTableOptions: (table) => ({ onReviewedIdsChange: makeStateUpdater("reviewedIds", table) }),
  constructTableAPIs: (table) => {
    const source = table as unknown as ReviewTable;
    assignTableAPIs("reviewFeature", table, {
      table_markReviewed: { fn: (id: string) => source.options.onReviewedIdsChange?.((old) => (old.includes(id) ? old : [...old, id])) },
      table_getReviewedIds: { fn: () => source.atoms.reviewedIds.get() },
    });
  },
};
