"use server";

import { indexAndSearch, searchIndexForData } from "@/helpers/search-data";
import { SearchDataParams, SearchIndexData } from "@/helpers/types";
import searchDataIndex from "../../../../../public/search-index.json";

async function getSearchDataFromDirectory({ path, query }: SearchDataParams) {
  const directory = `public/static/static${path ? "/" + path : "/"}`;
  const data = await indexAndSearch(directory, query);
  if (data) {
    return data;
  } else {
    throw new Error("No data found");
  }
}

async function getDataFromCachedIndex({ query, relevance }: SearchDataParams) {
  const data = searchDataIndex.entries as SearchIndexData[];
  if (data) {
    const filteredData = searchIndexForData(data, query);
    switch (relevance) {
      case "old-new":
        filteredData.sort((a, b) => {
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        });

        break;
      case "new-old":
        filteredData.sort((a, b) => {
          return (
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          );
        });
        filteredData.sort((a, b) => {
          if (!query.author) return a.score - b.score;
          const aIncludesAuthor = a.startedBy
            .toLowerCase()
            .includes(query.author)
            ? -1
            : 0;
          const bIncludesAuthor = b.startedBy
            .toLowerCase()
            .includes(query.author)
            ? -1
            : 0;
          return aIncludesAuthor - bIncludesAuthor;
        });
        break;

      default:
        filteredData.sort((a, b) => {
          if (!query.author) return a.score - b.score;
          const aIncludesAuthor = a.startedBy
            .toLowerCase()
            .includes(query.author)
            ? -1
            : 0;
          const bIncludesAuthor = b.startedBy
            .toLowerCase()
            .includes(query.author)
            ? -1
            : 0;
          return aIncludesAuthor - bIncludesAuthor;
        });
        break;
    }
    return { filteredData, filteredDataLength: filteredData.length };
  } else {
    throw new Error("No data found");
  }
}

export { getSearchDataFromDirectory, getDataFromCachedIndex };
