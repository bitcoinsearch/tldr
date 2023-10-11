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
  const line2 = findIndex[1]?.split(" ");

  const line1LastItem = line1[line1.length - 1];
  const line2LastItem = line2?.[line2?.length - 1];

  if (
    (line1LastItem.length <= 2 && line1LastItem.charAt(0) === line1LastItem.charAt(0).toUpperCase()) ||
    (line2LastItem?.length <= 2 && line2LastItem?.charAt(0) === line2LastItem?.charAt(0).toUpperCase())
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

export const flattenEntries = (entries: Array<HomepageEntryData>) => {
  return entries.flat().sort((a, b) => {
    if (b.published_at < a.published_at) {
      return -1;
    }
    if (b.published_at > a.published_at) {
      return 1;
    }

    return 0;
  });
};

export const getBatchesInSameMonth = (entries: Array<HomepageEntryData>, currMonth: string) => {
  const monthsInOrder: Record<string, string> = {
    Jan: "01",
    Feb: "02",
    March: "03",
    April: "04",
    May: "05",
    June: "06",
    July: "07",
    Aug: "08",
    Sept: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };
  const currentMonth = currMonth.slice(0, -5);

  return entries.filter((entry) => {
    const date = entry.published_at.slice(5, 7);
    const dummyAuthor = entry.authors[0].toLowerCase() !== "victor umobi";
    const noCombinedSummaryTitle = entry.title !== "combined summary - (no subject)";
    const noSummaryTitle = entry.title !== "(no subject)";

    return date === monthsInOrder[currentMonth] && dummyAuthor && noSummaryTitle && noCombinedSummaryTitle;
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

export const monthsInOrder: Record<string, string> = {
  "0": "Jan",
  "1": "Feb",
  "2": "March",
  "3": "April",
  "4": "May",
  "5": "June",
  "6": "July",
  "7": "Aug",
  "8": "Sept",
  "9": "Oct",
  "10": "Nov",
  "11": "Dec",
};

export const createMonthsFromKeys = (startYear: number, endYear: number) => {
  const years = Array.from({ length: startYear - endYear + 1 }, (_, index) => (startYear - index).toString());
  const months = ["Dec", "Nov", "Oct", "Sept", "Aug", "July", "June", "May", "April", "March", "Feb", "Jan"];

  return years
    .map((key) => {
      return months.map((month) => {
        return `${month}_${key}`;
      });
    })
    .flat();
};

export const removeDuplicateSummaries = (groups: Record<string, Array<HomepageEntryData>>) => {
  const finalValues: HomepageEntryData[] = [];
  const cleanedGroups: Record<string, Array<HomepageEntryData>> = {};

  for (const [key, value] of Object.entries(groups)) {
    if (value.length === 1 || key.toLowerCase().startsWith("combined summary")) {
      cleanedGroups[key] = value;
    }
  }

  const singleSummaries = Object.keys(cleanedGroups)
    .filter((post) => !post.toLowerCase().startsWith("combined summary"))
    .map((x) => x.toLowerCase());

  const combinedSummaries = Object.keys(cleanedGroups)
    .filter((post) => post.toLowerCase().startsWith("combined summary"))
    .map((x) => x.toLowerCase());

  const splitCombSummaries = combinedSummaries.map((x) => {
    const element = x.split("combined summary ");
    const lastElem = element[element.length - 1].substring(1).trim();

    return lastElem;
  });

  const getSingleSummaries = singleSummaries.filter((x) => !splitCombSummaries.includes(x));

  const allSections = [...combinedSummaries, ...getSingleSummaries];

  for (const [key, value] of Object.entries(cleanedGroups)) {
    if (allSections.includes(key.toLowerCase().trim())) {
      finalValues.push(value as unknown as HomepageEntryData);
    }
  }

  return finalValues;
};
