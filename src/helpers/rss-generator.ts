import * as fs from "fs";
import { HomepageEntryData } from "./types";
import { createArticlesFromFolder, createMonthsFromKeys, monthsInOrder } from "./utils";
import { Feed } from "feed";
import { readStaticDir } from "./search-data";
import { RSS_FEED_IN_MONTHS } from "@/config/config";

export const generateRSSFeed = async () => {
  const folders = [
    "lightning-dev", 
    "bitcoin-dev",
    "delvingbitcoin"
  ];
  let result: HomepageEntryData[] = [];

  const currentDate = new Date();

  const startYear = currentDate.getFullYear();

  const endYear = startYear - 1;
  const startMonth = currentDate.getMonth().toString();
  const currentMonth = monthsInOrder[startMonth];

  const allpossibleMonths = createMonthsFromKeys(startYear, endYear);
  const sliceIndex = allpossibleMonths.findIndex(
    (month) => month.slice(0, -5) === currentMonth
  );

  const endMonth = RSS_FEED_IN_MONTHS < 2 ? null : allpossibleMonths[sliceIndex + RSS_FEED_IN_MONTHS].slice(0, -5)
  const monthRange = endMonth ? `${endMonth} to ${currentMonth}` : currentMonth

  const monthsToGenerate = allpossibleMonths.slice(
    sliceIndex,
    RSS_FEED_IN_MONTHS + 1
  );

  const feed = new Feed({
    title: "TLDR RSS Feed",
    description: "Bitcoin and Lightning mailing list summaries",
    id: `Feed for month of ${monthRange}`,
    link: "https://tldr.bitcoinsearch.xyz/feed/rss",
    language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
    image: "https://tldr.bitcoinsearch.xyz/images/laughing_cat_sq.jpg",
    favicon: "https://tldr.bitcoinsearch.xyz/favicon.ico",
    copyright: `All rights reserved ${startYear}, Chaincode Labs`,
    feedLinks: {
      json: "https://tldr.bitcoinsearch.xyz/feed/rss?format=json",
      atom: "https://tldr.bitcoinsearch.xyz/feed/rss?format=atom",
    }
  });

  await Promise.all(
    folders.map(async (folder) => {
      await Promise.all(
        monthsToGenerate.map(async (month) => {
          const DIRECTORY = `${process.cwd()}/public/static/static/${folder}/${month}`;

          try {
            const isExists = fs.existsSync(DIRECTORY);
            if (!isExists) {
              result.push(...[]);
            } else {
              const folderData = await readStaticDir(DIRECTORY);
              const data = createArticlesFromFolder(folderData, folder)
              return result.push(...data);
            }
          } catch (error) {
            console.error(error);
            return result.push(...[]);
          }
        })
      )
    })
  )

  result.map((item) => {
    feed.addItem({
      title: item.title,
      id: item.id,
      link: item.link,
      content: item.summary,
      author: item.authors.map((author) => ({name: author})),
      contributor: item.contributors.map((contributor) => ({name: contributor})),
      date: new Date(item.published_at),
    });
  })

  return feed
};