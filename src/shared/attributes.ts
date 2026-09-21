/** Optional string inputs restore absence when their HTML attribute is removed. */
export const optionalString = Object.freeze({ fromAttribute: (value: string | null): string | undefined => value ?? undefined });
