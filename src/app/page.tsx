import Homepage from "@/app/components/client/homepage";
import { readStaticDir } from "@/helpers/search-data";
import { HomepageData, HomepageEntryData, XmlDataType } from "@/helpers/types";
import { createPath, getContributors, createSummary } from "@/helpers/utils";
import * as fs from "fs";

async function getHomepageData() {
  try {
    const data = fs.readFileSync(
      `${process.cwd()}/public/static/static/homepage.json`,
      "utf-8"
    );
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

  const singleBlock = Object.keys(groupedDuplicates)
    .filter((post) => !post.toLowerCase().startsWith("combined summary"))
    .map((x) => x.toLowerCase());

  const combinedBlock = Object.keys(groupedDuplicates)
    .filter((post) => post.toLowerCase().startsWith("combined summary"))
    .map((x) => x.toLowerCase());

  const cleanedCombinedBlock = combinedBlock.map((x) => {
    const element = x.split("combined summary ");
    const lastElem = element[element.length - 1].substring(1).trim();

    return lastElem;
  });

  const isAlone = singleBlock.filter((x) => !cleanedCombinedBlock.includes(x));

  const allSections = [...combinedBlock, ...isAlone];

  const finalValues = [];
  for (const [key, value] of Object.entries(groupedDuplicates)) {
    if (allSections.includes(key.toLowerCase().trim())) {
      finalValues.push(value);
    }
  }
  const flatten = finalValues.flat() as HomepageEntryData[];

  flatten.sort((a, b) => {
    if (b.published_at < a.published_at) {
      return -1;
    }
    if (b.published_at > a.published_at) {
      return 1;
    }

    return 0;
  });

  return flatten;
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
