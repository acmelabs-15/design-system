export function paginationState(page: number, pageSize: number, count?: number, hasNextPage?: boolean) {
  if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(pageSize) || pageSize < 1 || (count !== undefined && (!Number.isSafeInteger(count) || count < 0))) {
    throw new RangeError("Pagination requires a positive page and page size, and a nonnegative count");
  }
  const totalPages = count === undefined ? undefined : Math.ceil(count / pageSize);
  return Object.freeze({
    page,
    pageSize,
    count,
    totalPages,
    previous: page > 1 && totalPages !== 0 ? Math.min(page - 1, totalPages ?? page - 1) : undefined,
    next: page < Number.MAX_SAFE_INTEGER && (totalPages === undefined ? hasNextPage === true : page < totalPages) ? page + 1 : undefined,
  });
}
export type PaginationState = ReturnType<typeof paginationState>;
export function paginationRange(page: number, totalPages?: number): readonly (number | "ellipsis")[] {
  if (totalPages === undefined) {
    return Object.freeze([page]);
  }
  if (totalPages <= 0) {
    return Object.freeze([]);
  }
  const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i);
  if (totalPages <= 7) {
    return Object.freeze(range(1, totalPages));
  }
  const current = Math.min(page, totalPages);
  if (current <= 4) {
    return Object.freeze([...range(1, 5), "ellipsis", totalPages]);
  }
  if (current >= totalPages - 3) {
    return Object.freeze([1, "ellipsis", ...range(totalPages - 4, totalPages)]);
  }
  return Object.freeze([1, "ellipsis", current - 1, current, current + 1, "ellipsis", totalPages]);
}
