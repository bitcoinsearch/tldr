import {
  AuthorData,
  EsSearchResult,
  HomepageEntryData,
  NewsletterData,
  SortKey,
  XmlDataType,
  sortedAuthorData,
} from "./types";
import { domainFunctionMapper } from "./path-mappers";
import { convertXmlToText } from "./convert-from-xml";
import Image from "next/image";

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

  if (pathIndex !== -1) {
    const sliced_path = path.split("/").slice(pathIndex);
    sliced_path.shift();
    const fullPath = sliced_path.join("/").replace(".xml", "");
    return fullPath;
  } else {
    const fullPath = path.replace(
      "https://tldr.bitcoinsearch.xyz/summary/",
      ""
    );
    return fullPath;
  }
};

export const getContributors = (authors: Array<string>) => {
  return authors.length <= 1
    ? []
    : Array.from(new Set(authors.slice(1))).filter(
        (author) => author !== authors[0]
      );
};

export const createSummary = (summary: string) => {
  const findIndex = summary.split(". ").slice(0, 2);

  const line1 = findIndex[0].split(" ");
  const line2 = findIndex[1]?.split(" ");

  const line1LastItem = line1[line1.length - 1];
  const line2LastItem = line2?.[line2?.length - 1];

  if (
    (line1LastItem.length <= 2 &&
      line1LastItem.charAt(0) === line1LastItem.charAt(0).toUpperCase()) ||
    (line2LastItem?.length <= 2 &&
      line2LastItem?.charAt(0) === line2LastItem?.charAt(0).toUpperCase())
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

export const getBatchesInSameMonth = (
  entries: Array<HomepageEntryData>,
  currMonth: string
) => {
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
    const noCombinedSummaryTitle =
      entry.title !== "combined summary - (no subject)";
    const noSummaryTitle = entry.title !== "(no subject)";

    return (
      date === monthsInOrder[currentMonth] &&
      dummyAuthor &&
      noSummaryTitle &&
      noCombinedSummaryTitle
    );
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

    const authorList = authors.map((author) => removeZeros(author)).reverse();

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
      n_threads: authors.length - 1,
      dev_name: `${folder}`,
      contributors: contributorsList,
      file_path: newPath,
      combined_summ_file_path: newPath,
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
  const years = Array.from({ length: startYear - endYear + 1 }, (_, index) =>
    (startYear - index).toString()
  );
  const months = [
    "Dec",
    "Nov",
    "Oct",
    "Sept",
    "Aug",
    "July",
    "June",
    "May",
    "April",
    "March",
    "Feb",
    "Jan",
  ];

  return years
    .map((key) => {
      return months.map((month) => {
        return `${month}_${key}`;
      });
    })
    .flat();
};

export const removeDuplicateSummaries = (
  groups: Record<string, Array<HomepageEntryData>>
) => {
  const finalValues: HomepageEntryData[] = [];
  const cleanedGroups: Record<string, Array<HomepageEntryData>> = {};

  for (const [key, value] of Object.entries(groups)) {
    if (
      value.length === 1 ||
      key.toLowerCase().startsWith("combined summary")
    ) {
      cleanedGroups[key] = value;
    }
  }

  // get summaries that are not combined summaries
  const singleSummaries = Object.keys(cleanedGroups)
    .filter((post) => !post.toLowerCase().startsWith("combined summary"))
    .map((x) => x.toLowerCase());

  // get combined summaries from list
  const combinedSummaries = Object.keys(cleanedGroups)
    .filter((post) => post.toLowerCase().startsWith("combined summary"))
    .map((x) => x.toLowerCase());

  // extract title from combined summaries
  const splitCombSummaries = combinedSummaries.map((x) => {
    const element = x.split("combined summary ");
    const lastElem = element[element.length - 1].substring(1).trim();

    return lastElem;
  });

  // check for summaries which doesn't have combined summaries
  const getSingleSummaries = singleSummaries.filter(
    (x) => !splitCombSummaries.includes(x)
  );

  const allSections = [...combinedSummaries, ...getSingleSummaries];

  for (const [key, value] of Object.entries(cleanedGroups)) {
    if (allSections.includes(key.toLowerCase().trim())) {
      finalValues.push(value as unknown as HomepageEntryData);
    }
  }

  return finalValues;
};

export const mappingMonths = {
  January: "Jan",
  February: "Feb",
  March: "March",
  April: "April",
  May: "May",
  June: "June",
  July: "July",
  August: "Aug",
  September: "Sept",
  October: "Oct",
  November: "Nov",
  December: "Dec",
};

export const getStaticPathFromURL = (data: EsSearchResult["_source"]) => {
  const domainFunction = domainFunctionMapper[data.domain];
  const path = domainFunction(data);
  return path;
};


export const removeZeros = (author: AuthorData) => {
  if (author.name.startsWith(".")) {
    const name = author.name.split(":")[1].slice(2).trim();
    if (name.endsWith(".")) {
      return name.slice(0, -1);
    } else {
      return name;
    }
  } else {
    return author.name.endsWith(".") ? author.name.slice(0, -1) : author.name;
  }
};

export const getSummaryDataInfo = async (path: string[], fileContent: any) => {
  const pathString = path.join("/");

  const data = await convertXmlToText(fileContent, pathString);

  const linksCopy = data.data?.historyLinks;
  const linkByAnchor = (data.data as any).linkByAnchor as Record<string, string> | undefined;

  const authorsFormatted: sortedAuthorData[] = data.data.authors.map(
    (author, index) => ({
      ...author,
      name: removeZeros(author),
      initialIndex: index,
      dateInMS: Date.parse(author.date + "T" + author.time),
    })
  );

  // Build proper thread tree structure and traverse depth-first to match mailing list order
  const orderedAuthors = (() => {
    const hasThreadingData = authorsFormatted.some(a => 
      typeof a.position === "number" || typeof a.depth === "number"
    );
    
    if (!hasThreadingData) {
      // Fallback to chronological sorting for legacy data
      return authorsFormatted.sort((a, b) => a.dateInMS - b.dateInMS);
    }

    // Build tree structure
    const messageMap = new Map<string, sortedAuthorData>();
    const childrenMap = new Map<string, sortedAuthorData[]>();
    
    // First pass: create message map and identify children
    authorsFormatted.forEach(author => {
      const msgId = author.anchor || `${author.name}-${author.dateInMS}`;
      messageMap.set(msgId, author);
      
      // Also map by parent_id for easier lookup
      if (author.parent_id) {
        // Extract the anchor from parent_id (format: mailing-list-2025-07-m376871ab5341f27343e4e85b66d86ca373a5b857)
        const parentAnchor = author.parent_id.split('-').slice(-1)[0]; // Get the last part after the last dash
        if (!childrenMap.has(parentAnchor)) {
          childrenMap.set(parentAnchor, []);
        }
        childrenMap.get(parentAnchor)!.push(author);
      }
    });

    // Second pass: sort children by timestamp within each parent
    childrenMap.forEach(children => {
      children.sort((a, b) => a.dateInMS - b.dateInMS);
    });

    // Third pass: depth-first traversal starting from root messages (depth=0)
    const result: sortedAuthorData[] = [];
    const visited = new Set<string>();
    
    const traverse = (msgId: string, currentDepth: number = 0) => {
      if (visited.has(msgId)) return;
      visited.add(msgId);
      
      const message = messageMap.get(msgId);
      if (message) {
        // Override the depth with the actual traversal depth
        const messageWithCorrectDepth = { ...message, depth: currentDepth };
        result.push(messageWithCorrectDepth);
        
        // Add all children in chronological order
        const children = childrenMap.get(msgId) || [];
        children.forEach(child => {
          const childId = child.anchor || `${child.name}-${child.dateInMS}`;
          traverse(childId, currentDepth + 1);
        });
      }
    };

    // Find root messages (depth=0 or no parent_id) and traverse
    const rootMessages = authorsFormatted.filter(a => 
      a.depth === 0 || !a.parent_id
    ).sort((a, b) => a.dateInMS - b.dateInMS);
    
    rootMessages.forEach(root => {
      const rootId = root.anchor || `${root.name}-${root.dateInMS}`;
      traverse(rootId);
    });
    return result;
  })();

  // Produce links in the exact thread order; prefer anchor mapping when available
  const linksInThreadOrder = orderedAuthors.map((author) => {
    const byAnchorKey = author.anchor;
    const byLegacyKey = `${author.name}-${author.dateInMS}`;
    if (linkByAnchor) {
      if (byAnchorKey && linkByAnchor[byAnchorKey]) {
        return linkByAnchor[byAnchorKey] + ".xml";
      }
      if (linkByAnchor[byLegacyKey]) {
        return linkByAnchor[byLegacyKey] + ".xml";
      }
      // Try with the original name from the XML data (before removeZeros processing)
      // The linkByAnchor keys are created with the original names that include spaces and dots
      const originalName = data.data.authors[author.initialIndex]?.name || author.name;
      const originalKey = `${originalName}-${author.dateInMS}`;
      if (linkByAnchor[originalKey]) {
        return linkByAnchor[originalKey] + ".xml";
      }
    }
    // For missing links, return empty string to indicate no XML available
    // This will be handled in the UI to show reduced opacity
    return "";
  });


  return {
    ...data,
    data: {
      ...data.data,
      authors: orderedAuthors,
      historyLinks: linksInThreadOrder,
      linkByAnchor: linkByAnchor,
    },
  };
};

/**
 * @param date - The date to format
 * @param year - Whether to include the year in the formatted date
 * @returns The formatted date string in the format of "Jan 1, 2024"
 */

export const formatDateString = (date: string, year: boolean): string => {
  const dateObj = new Date(date);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: year ? "numeric" : undefined,
    month: "short",
    day: "numeric",
  }).format(dateObj);

  return formattedDate;
};

export function getUtcTime(date: string): string {
  const dateObj = new Date(date);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
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

/**
 * @param data - The data to shuffle
 * @returns The shuffled data
 */
export function shuffle(
  data: (HomepageEntryData & { firstPostDate: string; lastPostDate: string })[]
) {
  let currIndex = data.length;

  while (currIndex !== 0) {
    let randomIndex = Math.floor(Math.random() * currIndex);
    currIndex--;
    [data[currIndex], data[randomIndex]] = [data[randomIndex], data[currIndex]];
  }

  return data;
}

/**
 * @param posts - The posts to sort
 * @param sortKey - The key to sort by
 * @returns The sorted posts according to the sort key
 */

export function getSortedPosts(
  posts: (HomepageEntryData & {
    firstPostDate: string;
    lastPostDate: string;
  })[],
  sortKey: SortKey
) {
  switch (sortKey) {
    case "newest":
      return [...posts].sort(
        (a, b) =>
          new Date(b.published_at).getTime() -
          new Date(a.published_at).getTime()
      );
    case "oldest":
      return [...posts].sort(
        (a, b) =>
          new Date(a.published_at).getTime() -
          new Date(b.published_at).getTime()
      );
    case "bitcoin-dev":
      return posts.filter((post) => post.dev_name === "bitcoin-dev");
    case "delvingbitcoin":
      return posts.filter((post) => post.dev_name === "delvingbitcoin");
    case "all":
      return posts;
    default:
      return posts;
  }
}

export function stringToHex(str: string) {
  return Buffer.from(str, "utf8").toString("hex");
}

export function hexToString(hex: string) {
  if (
    typeof hex !== "string" ||
    !hex.match(/^[0-9a-fA-F]+$/) ||
    hex.length % 2 !== 0
  ) {
    return "404";
  }
  return Buffer.from(hex, "hex").toString("utf8");
}

export const baseUrl = (query: string) => {
  const base = "https://bitcoinsearch.xyz/";
  const encodedQuery = encodeURIComponent(query);
  const domains = [
    "https://mailing-list.bitcoindevs.xyz/bitcoindev/",
    "https://lists.linuxfoundation.org/pipermail/bitcoin-dev/",
    "https://delvingbitcoin.org/",
    "https://lists.linuxfoundation.org/pipermail/lightning-dev/"
  ];
  const filters = domains.map(domain => `filter_domain=${encodeURIComponent(domain)}`).join("&");

  return `${base}?search=${encodedQuery}&utm_source=tldr.bitcoinsearch.xyz&${filters}`;
};
