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

  const batchSize = 3;
  let groupedBy3: Record<string, Array<string>> = {};

  for (let idx = 0; idx < monthsToBegin.length; idx += batchSize) {
    const monthsBatch = monthsToBegin.slice(idx, idx + batchSize);
    groupedBy3[idx / 3] = monthsBatch;
  }

  await Promise.all(
    folders.map(async (folder) => {
      await Promise.all(
        groupedBy3[count].map(async (month) => {
          if (!folder) return [];

          const DIRECTORY = `${process.cwd()}/public/static/static/${folder}/${month}`;

          try {
            const isExists = fs.existsSync(DIRECTORY);
            if (!isExists) {
              result.push(...[]);
            } else {
              const folderData = await readStaticDir(DIRECTORY);
              const data = createArticlesFromFolder(folderData, folder);
              const getSameMonth = getBatchesInSameMonth(data, month);

              return result.push(...getSameMonth);
            }
          } catch (error) {
            console.error(error);
            return result.push(...[]);
          }
        })
      );
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
  let batchData = [];

  if (data) {
    const { batch } = await fetchDataInBatches(0);
    batchData.push(...batch);
  }

  if (!data) return null;
  if (!batchData) return null;

  return <Homepage data={data} batch={batchData} fetchMore={fetchDataInBatches} serverCount={serverCount} />;
}
