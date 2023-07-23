import * as fs from "fs";
import path from "path";
import util from "util";

import { SearchDataParams, SearchIndexData } from "./types";
import { convertXmlToText } from "./convert-from-xml";

const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);
const writeFile = util.promisify(fs.writeFile);

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

export const searchIndexForData = (
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
  const pathToSearchIndex = "public/search.json";

  // Index the data
  const index = indexData(data);

  let existingData;

  if (index && index.length > 0) {
    if (!fs.existsSync(pathToSearchIndex)) {
      console.log("File does not exist");
      await saveJson(index);
    } else {
      console.log("File exists");
      try {
        existingData = JSON.parse(fs.readFileSync(pathToSearchIndex, "utf8"));
        const mergedData = [...existingData, ...index];
        await saveJson(mergedData);
      } catch (error) {
        console.log("Failed to parse JSON", error);
      }
    }
  }

  // Search the data
  const searchResults = searchIndexForData(index, query);

  return { searchResults, totalSearchResults: searchResults.length };
};

const saveJson = async (data: any) => {
  if (!data) return console.log("No data to save");
  const dataToSave = { entries: data };
  const json = JSON.stringify(dataToSave, null, 2);
  await writeFile("public/search-index.json", json, "utf8")
    .then(() => {
      console.log("JSON file has been saved.");
    })
    .catch((err) => {
      console.log("An error occurred while writing JSON Object to File.");
      console.log(err);
    });
};
