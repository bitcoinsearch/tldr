import Homepage from "@/app/components/client/homepage";
import { readStaticDir } from "@/helpers/search-data";
import { HomepageData, HomepageEntryData } from "@/helpers/types";
import { flattenEntries, groupDuplicates, createArticlesFromFolder, createYearlySet } from "@/helpers/utils";
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
  let groupedResults: HomepageEntryData[] = [];

  await Promise.allSettled(
    folders.map(async (folder) => {
      if (!folder) return [];

      const DIRECTORY = `${process.cwd()}/public/static/static/${folder}`;
      const files = fs.readdirSync(DIRECTORY).reverse();

      const years = createYearlySet(files);

      const createDirectorySet = files.map((year) => `${DIRECTORY}/${year}`).filter((year) => year.endsWith(years[count]));

      console.log(createDirectorySet, `createDirectorySet`);
      console.log(count, `COUNT`);

      /**
       * split into chunks and send until a single year is exhausted
       */
      await Promise.allSettled(
        createDirectorySet.map(async (path) => {
          const res = await readStaticDir(path);
          const data = createArticlesFromFolder(res, folder);
          groupedResults.push(...data);
        })
      );
    })
  );

  const groupYears = groupDuplicates(groupedResults);
  const entryYears = Object.values(groupYears) as Array<HomepageEntryData[]>;
  const batch = flattenEntries(entryYears);

  const divideBatch = batch.slice(batch.length / 2);
  const cache = new WeakMap();

  return { batch, count };
};

export default async function Home() {
  let serverCount = [0];

  const data = await getHomepageData();
  const { batch } = await fetchDataInBatches(serverCount[0]);

  if (!data) return null;
  if (!batch) return null;

  return (
    <>
      <Homepage data={data} batch={batch} next={fetchDataInBatches} serverCount={serverCount} />
    </>
  );
}
