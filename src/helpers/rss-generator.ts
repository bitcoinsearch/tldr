import * as fs from "fs";
import { HomepageEntryData } from "./types";
import { createArticlesFromFolder, createMonthsFromKeys, monthsInOrder } from "./utils";
import { Feed } from "feed";
import { readStaticDir } from "./search-data";

// var RSS = require('rss');

const numberOfMonths = 2;

export const generateRSSFeed = async () => {
  const folders = [
    "lightning-dev", 
    // "bitcoin-dev"
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

  const monthsToGenerate = allpossibleMonths.slice(
    sliceIndex,
    numberOfMonths + 1
  );
  // console.log(monthsToGenerate);

  
 
  // var feed = new RSS(feedOptions);

  const feed = new Feed({
    title: "TLDR RSS Feed",
    description: "Bitcoin and Lightning mailing list summaries",
    id: `Feed for month of ${currentMonth}`,
    link: "https://tldr.bitcoinsearch.xyz/feed/rss",
    language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
    image: "https://tldr.bitcoinsearch.xyz/images/laughing_cat_sq.jpg",
    favicon: "https://tldr.bitcoinsearch.xyz/favicon.ico",
    copyright: `All rights reserved ${startYear}, Chaincode Labs`,
    feedLinks: {
      json: "https://tldr.bitcoinsearch.xyz/feed/rss?format=json",
      atom: "https://tldr.bitcoinsearch.xyz/feed/rss?format=atom",
    },
    author: {
      name: "John Doe",
      email: "johndoe@example.com",
      link: "https://example.com/johndoe",
    },
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
              const data = createArticlesFromFolder(folderData, folder);
              // console.log({data})
              // const cleanData = removeBadData(data);

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

  result.slice(0, 50).map((item) => {
    feed.addItem({
      title: item.title,
      id: item.id,
      link: item.link,
      // description: "desc",
      content: item.summary,
      author: item.authors.map((author) => ({name: author})),
      contributor: item.contributors.map((contributor) => ({name: contributor})),
      date: new Date(item.published_at),
    });
  })

  return feed

  // feed.addItem({
  //   title: "title",
  //   id: "rand",
  //   link: "link",
  //   description: "desc",
  //   content: "rand",
  //   author: [
  //     {
  //       name: "Jane Doe",
  //       email: "janedoe@example.com",
  //       link: "https://example.com/janedoe",
  //     },
  //   ],
  //   contributor: [
  //     {
  //       name: "Shawn Kemp",
  //       email: "shawnkemp@example.com",
  //       link: "https://example.com/shawnkemp",
  //     },
  //   ],
  //   date: new Date(),
  //   image: "https://example.com/reggiemiller",
  // });

  // feed.addCategory("Technologie");

  // feed.addContributor({
  //   name: "Johan Cruyff",
  //   email: "johancruyff@example.com",
  //   link: "https://example.com/johancruyff",
  // });

  // console.log("atom", feed.atom1());
};

// const removeBadData