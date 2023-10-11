import Homepage from "@/app/components/client/homepage";
import { readStaticDir } from "@/helpers/search-data";
import { HomepageData, HomepageEntryData } from "@/helpers/types";
import {
  flattenEntries,
  groupDuplicates,
  createArticlesFromFolder,
  getBatchesInSameMonth,
  monthsInOrder,
  createMonthsFromKeys,
  removeDuplicateSummaries,
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

  const currentDate = new Date();

  const startYear = currentDate.getFullYear();
  const endYear = 2010;
  const startMonth = currentDate.getMonth().toString();
  const currentMonth = monthsInOrder[startMonth];

  const allpossibleMonths = createMonthsFromKeys(startYear, endYear);
  const sliceIndex = allpossibleMonths.findIndex((month) => month.slice(0, -5) === currentMonth);

  let monthsToBegin = allpossibleMonths.slice(sliceIndex);

  const LTDIRECTORY = `${process.cwd()}/public/static/static/${folders[0]}/${monthsToBegin[count]}`;
  const BTDIRECTORY = `${process.cwd()}/public/static/static/${folders[1]}/${monthsToBegin[count]}`;

  const isFolderPresent = fs.existsSync(LTDIRECTORY) || fs.existsSync(BTDIRECTORY);

  if (!isFolderPresent) {
    monthsToBegin = allpossibleMonths.slice(sliceIndex + 1);
  }

  await Promise.all(
    folders.map(async (folder) => {
      if (!folder) return [];

      const DIRECTORY = `${process.cwd()}/public/static/static/${folder}/${monthsToBegin[count]}`;

      try {
        const isExists = fs.existsSync(DIRECTORY);
        if (!isExists) {
          result.push(...[]);
        } else {
          const folderData = await readStaticDir(DIRECTORY);
          const data = createArticlesFromFolder(folderData, folder);
          const getSameMonth = getBatchesInSameMonth(data, monthsToBegin[count]);

          return result.push(...getSameMonth);
        }
      } catch (error) {
        console.error(error);
        return result.push(...[]);
      }
    })
  );

  const groups: Record<string, Array<HomepageEntryData>> = groupDuplicates(result);

  const finalValues = removeDuplicateSummaries(groups);
  const batch = flattenEntries(finalValues);

  return { batch, count };
};

export default async function Home() {
  let serverCount = [0];

  const data = await getHomepageData();
  const { batch } = await fetchDataInBatches(0);

  if (!data) return null;
  if (!batch) return null;

  return <Homepage data={data} batch={batch} fetchMore={fetchDataInBatches} serverCount={serverCount} />;
}
