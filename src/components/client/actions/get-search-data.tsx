"use server";

import { indexAndSearch, searchIndexForData } from "@/helpers/search-data";
import { SearchDataParams, SearchIndexData } from "@/helpers/types";
import searchDataIndex from "../../../../public/search-index.json";

type SearchDataType = {
  entries: SearchIndexData[];
};

async function getSearchDataFromDirectory({ path, query }: SearchDataParams) {
  const directory = `public/static/static${path ? "/" + path : "/"}`;
  const data = await indexAndSearch(directory, query);
  if (data) {
    return data;
  } else {
    throw new Error("No data found");
  }
}

async function getDataFromCachedIndex({ query }: SearchDataParams) {
  const data = searchDataIndex as SearchDataType;
  if (data) {
    const filteredData = searchIndexForData(data.entries, query);
    return { filteredData, filteredDataLength: filteredData.length };
  } else {
    throw new Error("No data found");
  }
}
export { getSearchDataFromDirectory, getDataFromCachedIndex };
