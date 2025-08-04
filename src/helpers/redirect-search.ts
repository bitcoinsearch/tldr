import { getSummaryData } from "./fs-functions";
import { mappingMonths, stringToHex } from "./utils";

export const convertLegacyDate = (path: string) => {
  const strippedLink = path.split("/");

  try {
    // return list, year_month
    const [list, year_month, id] = strippedLink;
    // separate month and year from year_month string with the right tldr mapping
    const [year, month] = year_month.split("-").map((i, index) => {
      if (index === 0) return i;
      else {
        const monthIndex = i as keyof typeof mappingMonths;
        return mappingMonths?.[monthIndex] ?? "";
      }
    });

    if (!month || !year || !list) {
      return path;
    }

    return `${list}/${month}_${year}/${id}`;
  } catch {
    return path;
  }
};

export const convertNewDate = (path: string) => {
  const strippedLink = path.split("/");

  try {
    // return list, year_month
    const [list, month_year, id] = strippedLink;

    // separate month and year from year_month string with the right tldr mapping
    const [month, year] = month_year.split("_").map((i, index) => {
      if (index === 1) return i;
      else {
        const monthIndex = i as keyof typeof mappingMonths;
        return mappingMonths?.[monthIndex] ?? "";
      }
    });

    if (!month || !year || !list) {
      return path;
    }

    return `${list}/${month}_${year}/${id}`;
  } catch {
    return path;
  }
};
export const convertMailingListUrlToPath = async (
  url: string
): Promise<string[]> => {
  let urlPaths = url.split("/");
  let source = urlPaths.pop();

  if (source && source.includes("list-linuxfoundation")) {
    let reconstructedLegacyPath = convertLegacyDate(url);
    const singlePost = reconstructedLegacyPath;
    const combinedSummary = reconstructedLegacyPath.replace(
      /\d+_/,
      "combined_"
    );

    const combinedSummaryData = await getSummaryData(
      combinedSummary.split("/")
    );

    let hex = [stringToHex(singlePost)];
    if (combinedSummaryData?.data.historyLinks) {
      hex.unshift(stringToHex(combinedSummary));
    } else {
      hex.unshift("");
    }

    return hex;
  } else if (source && source.includes("bitcoin-dev")) {
    const readjustedUrl = convertNewDate(url);
    const readjustedPaths = readjustedUrl.split("/");
    let fileName = readjustedPaths[readjustedPaths.length - 1];
    let singleFileName = readjustedPaths.pop();
    let path = readjustedPaths.join("/");
    let combinedFileName = fileName.replace(/\w+_/, "combined_");

    const singlePost = path + `/${singleFileName}`;
    const combinedSummary = path + `/${combinedFileName}`;
    const combinedSummaryData = await getSummaryData(
      combinedSummary.split("/")
    );

    let hex = [stringToHex(singlePost)];
    if (combinedSummaryData?.data.historyLinks) {
      hex.unshift(stringToHex(combinedSummary));
    } else {
      hex.unshift("");
    }

    return hex;
  }

  return [];
};
