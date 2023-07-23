import { indexAndSearch } from "../helpers/search-data";
import FakeData from "../../data.json";
import Homepage from "@/components/client/homepage";
import { SearchDataParams } from "@/helpers/types";

export type FakeDataType = typeof FakeData;

async function getSearchData({ path, query }: SearchDataParams) {
  const directory = `public/static/static${path ? "/" + path : "/"}`;
  const data = await indexAndSearch(directory, query);
  if (data) {
    return data;
  } else {
    throw new Error("No data found");
  }
}

export default async function Home() {
  const data = FakeData;

  return <Homepage data={data} />;
}
