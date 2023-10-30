import { SearchQuery } from "../helpers/types";
import { AggregationsAggregate, SearchResponse } from "@elastic/elasticsearch/lib/api/types";
import { useQuery } from "@tanstack/react-query";

type BuildQuery = ({queryString, size, page, filterFields, sortFields, mailListType}: SearchQuery) => Promise<SearchResponse<unknown, Record<string, AggregationsAggregate>>>

const buildQueryCall: BuildQuery = async ({queryString, size, page, filterFields, sortFields,  mailListType}) => {
  const body = {
    queryString,
    size,
    page,
    filterFields,
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
  queryString, size, page, filterFields, sortFields, mailListType
}: SearchQuery) => {
  const hasFilters = Boolean(filterFields.length)
  const queryResult = useQuery({
    queryKey: ["query", queryString, filterFields, page, sortFields, mailListType],
    queryFn: () => buildQueryCall({queryString, size, page, filterFields, sortFields, mailListType}),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    enabled: true,
    // enabled: !!queryString?.trim() || hasFilters,
  });

  return queryResult
}

