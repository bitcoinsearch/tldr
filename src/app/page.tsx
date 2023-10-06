import Homepage from "@/app/components/client/homepage";
import { readStaticDir } from "@/helpers/search-data";
import { HomepageData, HomepageEntryData } from "@/helpers/types";
import {
  flattenEntries,
  groupDuplicates,
  createArticlesFromFolder,
  groupAccordingToYears,
  sortAccordingToMonths,
  getBatchesInSameMonth,
} from "@/helpers/utils";
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

const fetchDataInBatches = async (count: number): Promise<{ batch: HomepageEntryData[]; count: number }> => {
  "use server";
  const folders = ["lightning-dev", "bitcoin-dev"];
  let result: HomepageEntryData[] = [];

  await Promise.all(
    folders.map(async (folder) => {
      if (!folder) return [];

      const DIRECTORY = `${process.cwd()}/public/static/static/${folder}`;
      const files = fs.readdirSync(DIRECTORY);

      const groupYears = groupAccordingToYears(files);
      const getGroupedYears = Object.values(groupYears) as Array<Array<string>>;

      const sortYears = sortAccordingToMonths(getGroupedYears);
      const dir = sortYears[count];
      const path = DIRECTORY + `/${dir}`;

      const folderData = await readStaticDir(path);
      const data = createArticlesFromFolder(folderData, folder);
      const isSameMonth = getBatchesInSameMonth(data, dir);

      result.push(...isSameMonth);
    })
  );

  const groups = groupDuplicates(result);
  const entries = Object.values(groups) as Array<HomepageEntryData[]>;

  const batch = flattenEntries(entries);

  return { batch, count };
};

export default async function Home() {
  let serverCount = [0];

  const data = await getHomepageData();
  const { batch } = await fetchDataInBatches(serverCount[0]);

  if (!data) return null;
  if (!batch) return null;

  return <Homepage data={data} batch={batch} fetchMore={fetchDataInBatches} serverCount={serverCount} />;
}
