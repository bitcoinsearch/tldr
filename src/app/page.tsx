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
  const response = await getSearchData({
    path: "bitcoin-dev",
    query: {
      author: "Jeremy",
      keyword: "legal defense",
    },
  });
  if (response instanceof Error) {
    console.error(response);
  }
  console.log(response);

  return <Homepage data={data} />;
}
