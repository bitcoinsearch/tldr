import { DEFAULT_LIMIT_OF_RESULTS_TO_DISPLAY } from "@/config/config";
import { SearchQuery } from "../helpers/types";
import { AggregationsAggregate, SearchResponse, SearchTotalHits } from "@elastic/elasticsearch/lib/api/types";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

type BuildQuery = ({queryString, page,sortFields, mailListType}: Omit<SearchQuery, "size">) => Promise<SearchResponse<unknown, Record<string, AggregationsAggregate>>>

export const buildQueryCall: BuildQuery = async ({queryString, page, sortFields, mailListType}) => {
  const body = {
    queryString,
    page,
    sortFields,
    mailListType
  };
  
  const jsonBody = JSON.stringify(body);

  return fetch("/api/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: jsonBody,
  })
    .then(async (res) => {
      const data = await res.json();
      if (!data.success) {
        const errMessage = data.message || "Error while fetching";
        throw new Error(errMessage);
      }
      return data.data?.result;
    })
    .catch((err) => {
      throw new Error(err.message ?? "Error fetching results");
    });
};

export const useSearch = ({
  queryString,sortFields, mailListType
}: Omit<SearchQuery, "size" | "page">) => {
  const queryResult = useInfiniteQuery({
    queryKey: ["query", queryString, sortFields, mailListType],
    queryFn: ({pageParam}) => buildQueryCall({queryString, page: pageParam, sortFields, mailListType}),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      const totalHitsAsSearchTotalHits = lastPage?.hits?.total as SearchTotalHits;
      const totalDocs = totalHitsAsSearchTotalHits.value;
      const totalPages = Math.floor(totalDocs/DEFAULT_LIMIT_OF_RESULTS_TO_DISPLAY)
      if (lastPageParam + 1 <= totalPages) return lastPageParam + 1
      else return undefined
    },
    enabled: !!queryString?.trim(),
  });

  return queryResult
}

