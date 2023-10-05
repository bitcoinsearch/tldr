import { HomepageEntryData, XmlDataType } from "./types";

export function addSpaceAfterPeriods(text: string): string {
  return text.replace(/\.(\S)/g, ". $1");
}

export function formattedDate(date: string): string {
  const dateObj = new Date(date);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    hourCycle: "h23",
    timeZoneName: "short",
  })
    .format(dateObj)
    .replace("at", "");
  return formattedDate;
}

export const createPath = (path: string) => {
  const pathIndex = path.split("/").findIndex((x) => x === "static");
  const sliced_path = path.split("/").slice(pathIndex);
  sliced_path.shift();
  return sliced_path.join("/");
};

export const getContributors = (authors: Array<string>) => {
  return authors.length <= 1 ? [] : authors.slice(1);
};

export const createSummary = (summary: string) => {
  const findIndex = summary.split(". ").slice(0, 2);

  const line1 = findIndex[0].split(" ");
  const line2 = findIndex[1].split(" ");

  const line1LastItem = line1[line1.length - 1];
  const line2LastItem = line2[line2.length - 1];

  if (
    (line1LastItem.length <= 2 && line1LastItem.charAt(0) === line1LastItem.charAt(0).toUpperCase()) ||
    (line2LastItem.length <= 2 && line2LastItem.charAt(0) === line2LastItem.charAt(0).toUpperCase())
  ) {
    return summary.split(". ").slice(0, 3).join(". ");
  } else {
    return summary.split(". ").slice(0, 2).join(". ");
  }
};

export const groupDuplicates = (result: HomepageEntryData[]) => {
  return result.reduce((acc: any, obj) => {
    const key = obj.title;
    const currentGroup = acc[key] ?? [];
    return { ...acc, [key]: [...currentGroup, obj] };
  }, {});
};

export const flattenEntries = (entries: Array<HomepageEntryData[]>) => {
  return entries
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
};

export const createArticlesFromFolder = (folderData: any[], folder: string) => {
  return folderData.map((xml: XmlDataType) => {
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
};

export const groupAccordingToYears = (files: string[]) => {
  return files.reduce((acc: any, curr) => {
    const key = curr.slice(curr.length - 4);
    const currentGroup = acc[key] ?? [];

    return { ...acc, [key]: [...currentGroup, curr] };
  }, {});
};

export const sortAccordingToMonths = (groupedYears: Array<Array<string>>) => {
  const monthsInOrder: any = {
    Jan: 11,
    Feb: 10,
    March: 9,
    April: 8,
    May: 7,
    June: 6,
    July: 5,
    Aug: 4,
    Sept: 3,
    Oct: 2,
    Nov: 1,
    Dec: 0,
  };

  return groupedYears
    .map((groupedYear) =>
      groupedYear.sort((a, b) => {
        const monthA = a.slice(0, -5);
        const monthB = b.slice(0, -5);

        return monthsInOrder[monthA] - monthsInOrder[monthB];
      })
    )
    .reverse()
    .flat();
};
