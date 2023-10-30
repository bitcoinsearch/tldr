import { SearchQuery } from "../helpers/types";
import { AggregationsAggregate, SearchResponse } from "@elastic/elasticsearch/lib/api/types";
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
  queryString, size, page,sortFields, mailListType
}: SearchQuery) => {
  const queryResult = useInfiniteQuery({
    queryKey: ["query", queryString,page, sortFields, mailListType],
    queryFn: () => buildQueryCall({queryString, size, page,sortFields, mailListType}),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    enabled: true,
    // enabled: !!queryString?.trim() || hasFilters,
  });

  return queryResult
}

