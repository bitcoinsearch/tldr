"use server"

import { indexAndSearch } from "@/helpers/search-data";
import { SearchDataParams } from "@/helpers/types";

async function getSearchData({ path, query }: SearchDataParams) {
  const directory = `public/static/static${path ? "/" + path : "/"}`;
  const data = await indexAndSearch(directory, query);
  if (data) {
    return data;
  } else {
    throw new Error("No data found");
  }
}

export default getSearchData;