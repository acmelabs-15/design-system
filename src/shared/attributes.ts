/** Optional string inputs restore absence when their HTML attribute is removed. */
export const optionalString = Object.freeze({ fromAttribute: (value: string | null): string | undefined => value ?? undefined });

/** Missing or empty numeric attributes preserve absence instead of inventing zero. */
export const numberAttribute = { fromAttribute: (value: string | null): number | undefined => (value === null || value.trim() === "" ? undefined : Number(value)) };
