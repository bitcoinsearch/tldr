import { useMemo, useState } from "react";

const emptyArray = [] as const;

export function usePaginatedResult<T>(result: T[] | undefined, pageSize = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = currentPage * pageSize;
  const defaultResult = result ?? emptyArray;

  const pages = useMemo(() => Math.ceil((defaultResult?.length ?? 0) / pageSize), [defaultResult?.length]);

  return {
    currentPage,
    paginatedResult: defaultResult.slice(startIndex, endIndex),
    setCurrentPage,
    pages,
  };
}
