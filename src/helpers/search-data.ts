import * as fs from "fs";
import path from "path";
import util from "util";

import { SearchDataParams, SearchIndexData } from "./types";
import { convertXmlToText } from "./convert-from-xml";

const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);

const handleFile = async (file: any, directory: string) => {
  const fullPath = path.join(directory, file);
  const stats = await stat(fullPath);

  if (stats.isDirectory()) {
    return readStaticDir(fullPath);
  } else if (path.extname(fullPath) === ".xml") {
    const xml = fs.readFileSync(fullPath, "utf8");
    const { data, month, path, year } = await convertXmlToText(xml, fullPath);
    return { data, month, path, year };
  }
};

export const readStaticDir = async (directory: string) => {
  const files = await readdir(directory);
  const promises: Promise<any>[] = files.map(
    async (file) => await handleFile(file, directory)
  );
  const results = await Promise.all(promises);
  const data = [].concat(...results).filter(Boolean);
  return data.flat();
};

const indexData = (data: any[]) => {
  const indexedEntries: any = [];

  data.forEach((entry) => {
    if (entry.data && entry.data.title && entry.data.authors) {
      const title = entry.data.title;
      const link = entry.data.entry.link;
      const summary = entry.data.entry.summary;
      const authors = Object.keys(entry.data.authors);

      indexedEntries.push({
        title,
        authors,
        summary,
        link,
        path: entry.path,
      });
    }
  });

  return indexedEntries;
};

const searchData = (
  indexedData: SearchIndexData[],
  query: SearchDataParams["query"]
) => {
  let result: boolean = true;
  return indexedData.filter((entry) => {
    if (query.author && query.keyword) {
      return (result =
        entry.authors.some((author) =>
          author.toLowerCase().includes(query.author!.toLowerCase())
        ) && entry.title.toLowerCase().includes(query.keyword.toLowerCase()));
    } else if (query.author) {
      return (result = entry.authors.some((author) =>
        author.toLowerCase().includes(query.author!.toLowerCase())
      ));
    } else if (query.keyword) {
      return (
        (result = entry.title
          .toLowerCase()
          .includes(query.keyword.toLowerCase())) ||
        entry.summary.toLowerCase().includes(query.keyword.toLowerCase())
      );
    } else {
      return result;
    }
  });
};

export const indexAndSearch = async (
  directory: string,
  query: SearchDataParams["query"]
) => {
  const data = await readStaticDir(directory);

  // Index the data
  const index = indexData(data);

  // Search the data
  const searchResults = searchData(index, query);
  return { searchResults, totalSearchResults: searchResults.length };
};
