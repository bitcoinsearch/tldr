"use server"

import { indexAndSearch } from "@/helpers/search-data";
import { SearchDataParams } from "@/helpers/types";

async function getSearchData({ path, query }: SearchDataParams, limit = -1) {
  const directory = `public/static/static${path ? "/" + path : "/"}`;
  const data = await indexAndSearch(directory, query);
  if (data) {
    data.searchResults = data.searchResults.slice(0, limit);
    return data;
  } else {
    throw new Error("No data found");
  }
}

export default getSearchData;