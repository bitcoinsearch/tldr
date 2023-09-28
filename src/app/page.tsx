import Homepage from "@/app/components/client/homepage";
import { readStaticDir } from "@/helpers/search-data";
import { HomepageData, HomepageEntryData, XmlDataType } from "@/helpers/types";
import { createPath, getContributors, createSummary } from "@/helpers/utils";
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

      const data = folderData.map((xml: XmlDataType) => {
        const {
          path,
          data: {
            entry: { id, title, link, published },
            authors,
          },
        } = xml;

        const authorList = authors.map((author) => author.name);
        const newPath = createPath(path);
        const contributorsList = getContributors(authorList);
        const summary = createSummary(xml.data?.entry.summary);

        return {
          id,
          title,
          link,
          authors: authorList,
          published_at: published,
          summary,
          n_threads: 3,
          dev_name: `${folder}`,
          contributors: contributorsList,
          file_path: newPath,
        };
      });

      result.push(...data);
    })
  );

  const groupedDuplicates = result.reduce((acc: any, obj) => {
    const key = obj.title;
    const currentGroup = acc[key] ?? [];
    return { ...acc, [key]: [...currentGroup, obj] };
  }, {});

  const entries = Object.values(groupedDuplicates) as Array<HomepageEntryData[]>;
  console.log(entries, "entries");

  const singleEntries = entries
    .filter((i) => i.length === 1)
    .flat()
    .sort((a, b) => {
      if (b.published_at < a.published_at) {
        return -1;
      }
      if (b.published_at > a.published_at) {
        return 1;
      }

      return 0;
    });
  console.log(singleEntries, "singularItems");

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
