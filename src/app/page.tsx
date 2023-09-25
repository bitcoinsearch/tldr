"use server";

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

export const fetchDataInBatches = async (count: number): Promise<HomepageEntryData[]> => {
  const folders = ["lightning-dev", "bitcoin-dev"];
  let result: HomepageEntryData[] = [];

  await Promise.allSettled(
    folders.map(async (folder) => {
      if (!folder) return [];

      const DIRECTORY = `${process.cwd()}/public/static/static/${folder}`;
      const files = fs.readdirSync(DIRECTORY).reverse();
      const dir = files[count];
      const path = DIRECTORY + `/${dir}`;
      console.log(path, "current:path");
      console.log(count, "current:count");

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

  result.sort((a, b) => {
    if (b.published_at < a.published_at) {
      return -1;
    }
    if (b.published_at > a.published_at) {
      return 1;
    }

    return 0;
  });
  console.log(".....>>>>");

  return result;
};

export default async function Home() {
  const data = await getHomepageData();

  if (!data) return null;

  return (
    <>
      <Homepage data={data} fetchDataInBatches={fetchDataInBatches} />
    </>
  );
}
