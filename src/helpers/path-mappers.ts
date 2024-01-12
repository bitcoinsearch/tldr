import { BITCOINDEV, DELVINGBITCOIN, LIGHTNINGDEV, urlMapping } from "@/config/config";
import { mappingMonths, monthsInOrder } from "./utils";
import { EsSearchResult } from "./types";

type Result = EsSearchResult["_source"]

export const domainFunctionMapper = {
  [urlMapping[BITCOINDEV]]: (data: Result) => relativePathFromMailingListDomain(data),
  [urlMapping[LIGHTNINGDEV]]: (data: Result) => relativePathFromMailingListDomain(data),
  [urlMapping[DELVINGBITCOIN]]: (data: Result) => relativePathFromDelving(data),
}

const relativePathFromMailingListDomain = ({url, id}: Result) => {
  const baseLink = "https://lists.linuxfoundation.org/pipermail/";
  const strippedLink = url.split(baseLink)[1].split("/");

  try {
    // return list, year_month
    const [list, year_month] = strippedLink;

    // separate month and year from year_month string with the right tldr mapping
    const [year, month] = year_month.split("-").map((i, index) => {
      if (index === 0) return i;
      else {
        const monthIndex = i as keyof typeof mappingMonths;
        return mappingMonths?.[monthIndex] ?? "";
      }
    });

    if (!month || !year || !list || !id) {
      return { url };
    }

    return {
      url: `/summary/${list}/${month}_${year}/${id}`,
      list,
    };
  } catch {
    return { url };
  }
};
const relativePathFromDelving = (data: Result) => {
  const {url, id, created_at} = data
  try {
    const postDate = new Date(created_at)
    const year = postDate.getFullYear()
    const monthInNumber = postDate.getUTCMonth()
    const month = Object.values(monthsInOrder)[monthInNumber]
    if (!month || !year || !id) {
      throw new Error()
    }
    return {
      url: `/summary/delvingbitcoin/${month}_${year}/${id}`,
      list: DELVINGBITCOIN
    }
  } catch {
    return {
      url,
      list: DELVINGBITCOIN
    }
  }
};