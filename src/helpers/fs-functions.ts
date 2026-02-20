import * as fs from "fs";
import {
  HomepageData,
  HomepageEntryData,
  NewsletterData,
  PostSummaryData,
  Tweet,
} from "./types";
import {
  createArticlesFromFolder,
  createMonthsFromKeys,
  flattenEntries,
  formatDateString,
  getBatchesInSameMonth,
  getSummaryDataInfo,
  groupDuplicates,
  monthsInOrder,
  removeDuplicateSummaries,
} from "./utils";
import { getRouteFromPath } from "@/app/components/server/actions/summary-data";
import { readStaticDir } from "./search-data";
import { BATCHSIZE } from "@/config/config";

export const getAllNewsletters = () => {
  let newsletterData: NewsletterData[] = [];

  try {
    const newsletterDir = `${process.cwd()}/public/static/static/newsletters`;
    const readNewsletterDir = fs.readdirSync(newsletterDir);
    const newsletterFolders = readNewsletterDir.slice(
      0,
      readNewsletterDir.length - 1
    );

    // loop through each folder and extract the newsletters
    for (let i = 0; i < newsletterFolders.length; i++) {
      const readMonthlyNewsletter = fs.readdirSync(
        `${newsletterDir}/${newsletterFolders[i]}`
      );

      for (let j = 0; j < readMonthlyNewsletter.length; j++) {
        const weeklyNewsletter = readMonthlyNewsletter[j];
        const newsletterPath = `newsletters/${newsletterFolders[i]}/${weeklyNewsletter}`;

        const readWeeklyNewsletter = fs.readFileSync(
          `${process.cwd()}/public/static/static/${newsletterPath}`,
          "utf-8"
        );
        const parseWeeklyNewsletter: NewsLetterDataType =
          JSON.parse(readWeeklyNewsletter);
        const weeklyNewsletterData = [
          ...parseWeeklyNewsletter.active_posts_this_week,
          ...parseWeeklyNewsletter.new_threads_this_week,
        ];

        const getDateRange = weeklyNewsletterData
          .map((post) => post.published_at)
          .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

        const startDate = getDateRange[0];
        const endDate = getDateRange[getDateRange.length - 1];

        const splitNewsletterPath = newsletterPath.split("/");

        const newsletterMonth =
          splitNewsletterPath[splitNewsletterPath.length - 1].split(
            "-newsletter"
          )[0];

        newsletterData.push({
          summary: parseWeeklyNewsletter.summary_of_threads_started_this_week,
          url: `/newsletters/${newsletterMonth}`,
          dateRange: `${formatDateString(
            startDate,
            false
          )} - ${formatDateString(endDate, true)}`,
          publishedAt: endDate,
          issueNumber: 0,
        });
      }
    }

    newsletterData = newsletterData
      .sort(
        (a, b) =>
          new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
      )
      .map((newsletter, index) => ({ ...newsletter, issueNumber: index + 1 }));

    return newsletterData;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getSummaryData = async (
  path: string[]
): Promise<PostSummaryData | null> => {
  const pathString = path.join("/");
  try {
    const fileContent = fs.readFileSync(
      `${process.cwd()}/public/static/static/${pathString}.xml`,
      "utf-8"
    );
    const summaryInfo = getSummaryDataInfo(path, fileContent);
    const result = await summaryInfo;
    if (result.data.generatedUrl && result.data.generatedUrl.includes("lightning-dev")) {
      result.data.generatedUrl = "https://www.mail-archive.com/lightning-dev@lists.linuxfoundation.org/";
    }
    return result;
  } catch (err) {
    return null;
  }
};

export async function fetchAndProcessPosts(): Promise<HomepageData> {
  try {
    // Read and parse homepage data once
    const readHomePageJson = await fs.promises.readFile(
      `${process.cwd()}/public/static/static/homepage.json`,
      "utf-8"
    );
    const parseHomePageJson = JSON.parse(readHomePageJson) as HomepageData;

    // Process homepageJson entries in  using Object.fromEntries and Promise.all
    const entries = await Promise.all(
      Object.entries(parseHomePageJson).map(async ([key, value]) => {
        if (!Array.isArray(value)) {
          return [key, value];
        }

        // Process array values in parallel
        const processedValue = await Promise.all(
          value.map(async (post) => {
            // get the file path of all posts in the array
            const filePath =
              post.contributors.length > 0
                ? post.combined_summ_file_path
                : post.file_path;
            const route = getRouteFromPath(filePath);
            const summaryData = await getSummaryData([route]);
            const replies = summaryData
              ? Number(summaryData.data.authors.length) - 1
              : 0;

            return { ...post, n_threads: replies };
          })
        );

        return [key, processedValue];
      })
    );

    const homePageJsonData = Object.fromEntries(entries);
    return homePageJsonData as HomepageData;
  } catch (err) {
    console.error(err);
    return {} as HomepageData;
  }
}

export const fetchAllActivityPosts = async (
  count: number
): Promise<{ batch: HomepageEntryData[]; count: number }> => {
  "use server";
  const folders = ["delvingbitcoin", "lightning-dev", "bitcoin-dev"];
  let result: HomepageEntryData[] = [];

  const currentDate = new Date();

  const startYear = currentDate.getFullYear();
  const endYear = 2010;
  const startMonth = currentDate.getMonth().toString();
  const currentMonth = monthsInOrder[startMonth];

  const allpossibleMonths = createMonthsFromKeys(startYear, endYear);
  const sliceIndex = allpossibleMonths.findIndex(
    (month) => month.slice(0, -5) === currentMonth
  );

  let monthsToBegin = allpossibleMonths.slice(sliceIndex);

  const LTDIRECTORY = `${process.cwd()}/public/static/static/${folders[0]}/${
    monthsToBegin[count]
  }`;
  const BTDIRECTORY = `${process.cwd()}/public/static/static/${folders[1]}/${
    monthsToBegin[count]
  }`;
// Note: We can’t display all months in lightning-dev.
// Only the last 5–6 months will be shown in the "All Activity" section.
  const LIGHTNINGLEGACY =  ['April_2024', 'March_2024', 'Feb_2024','Jan_2024', 'Dec_2023', 'Nov_2023' ]

  const isFolderPresent =
    fs.existsSync(LTDIRECTORY) || fs.existsSync(BTDIRECTORY);

  if (!isFolderPresent) {
    monthsToBegin = allpossibleMonths.slice(sliceIndex + 1);
  }

  const batchSize = BATCHSIZE;
  let groupedBy3: Record<string, Array<string>> = {};

  for (let idx = 0; idx < monthsToBegin.length; idx += batchSize) {
    const monthsBatch = monthsToBegin.slice(idx, idx + batchSize);
    groupedBy3[idx / BATCHSIZE] = monthsBatch;
  }

  let mappedBy = groupedBy3[count]
  await Promise.all(

    folders.map(async (folder) => {
      if (folder === "lightning-dev") {
          mappedBy = LIGHTNINGLEGACY
      
      } 
        await Promise.all(
          mappedBy.map(async (month) => {
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

  const groups: Record<string, Array<HomepageEntryData>> = groupDuplicates(
    result
  );

  const finalValues = removeDuplicateSummaries(groups);
  const batch = flattenEntries(finalValues);

  return { batch, count };
};

export const getTweetsFromFile = async () => {
  try {
    const fileContent = fs.readFileSync(
      `${process.cwd()}/public/tweets.json`,
      "utf-8"
    );
    const tweetsFromFile = JSON.parse(fileContent) as Tweet[];

    return tweetsFromFile;
  } catch (err) {
    return [];
  }
};


export const getHistoricalConversations = async () => {
  try {
    const fileContent = fs.readFileSync(`${process.cwd()}/public/historical.json`, "utf-8");
    const historicalJson = JSON.parse(fileContent).historicaldata as HomepageEntryData[];

    return historicalJson;
  } catch (err) {
    return [];
  }
};