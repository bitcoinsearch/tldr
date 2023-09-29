import Homepage from "@/app/components/client/homepage";
import { readStaticDir } from "@/helpers/search-data";
import { HomepageData, HomepageEntryData } from "@/helpers/types";
import { flattenEntries, groupDuplicates, createArticlesFromFolder } from "@/helpers/utils";
import * as fs from "fs";

async function getHomepageData() {
  try {
    const data = fs.readFileSync(`${process.cwd()}/public/static/static/homepage.json`, "utf-8");
    const parsedData = JSON.parse(data) as HomepageData;
    return parsedData;
  } catch (err) {
    return null;
  }
}

const fetchDataInBatches = async (): Promise<HomepageEntryData[]> => {
  const folders = ["lightning-dev", "bitcoin-dev"];
  let result: HomepageEntryData[] = [];

  await Promise.allSettled(
    folders.map(async (folder) => {
      if (!folder) return [];

      const DIRECTORY = `${process.cwd()}/public/static/static/${folder}`;
      const files = fs.readdirSync(DIRECTORY).reverse();
      const dir = files[0];
      const path = DIRECTORY + `/${dir}`;

      const folderData = await readStaticDir(path);
      const data = createArticlesFromFolder(folderData, folder);

      result.push(...data);
    })
  );

  const groups = groupDuplicates(result);
  const entries = Object.values(groups) as Array<HomepageEntryData[]>;
  const singleEntries = flattenEntries(entries);

  return singleEntries;
};

export default async function Home() {
  const data = await getHomepageData();
  const batch = await fetchDataInBatches();

  if (!data) return null;
  if (!batch) return null;

  return (
    <>
      <Homepage data={data} batch={batch} />
    </>
  );
}
