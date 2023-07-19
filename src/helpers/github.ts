import axios from "axios";
import * as cheerio from "cheerio";

import { providers } from "./providers";
import { Feed } from "./types";

const baseUrl = providers.github.url;

const xmlElements = {
  id: "id",
  title: "title",
  updatedAt: "updated",
  link: "link",
  summary: "summary",
  published: "published",
  generatedUrl: "link[rel='alternate']",
  href: "href",
  author: "author",
  name: "name",
};

export const fetchGithubData = async (path?: string) => {
  const { data } = await axios.get(
    `${baseUrl}${providers.github.endpoints.repos(
      path ? "static/" + path : "static"
    )}`,
    {
      headers: {
        Accept: "application/vnd.github.raw+json",
        Authorization: "Bearer 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",
      },
    }
  );
  return data;
};

export const convertXmlToText = async (path: string) => {
  const xml = await fetchGithubData(path);
  const $ = cheerio.load(xml, {
    xml: {
      xmlMode: true,
    },
  });

  const baseDirectory = path.split("/")[0];
  let formattedData: Feed = {} as Feed;
  $("entry").each((_index, element) => {
    const entry = {
      id: $(element).find(xmlElements.id).text(),
      title: $(element).find(xmlElements.title).text(),
      updatedAt: $(element).find(xmlElements.updatedAt).text(),
      author: $(xmlElements.author).children(xmlElements.name).text(),
      generatedUrl: $(element)
        .find(xmlElements.generatedUrl)
        .attr(xmlElements.href),
      entry: {
        id: $(element).find(xmlElements.id).text(),
        title: $(element).find(xmlElements.title).text(),
        updatedAt: $(element).find(xmlElements.updatedAt).text(),
        link: $(element).find(xmlElements.generatedUrl).attr(xmlElements.href),
        summary: $(element).find(xmlElements.summary).text(),
        published: $(element).find(xmlElements.published).text(),
      },
    };
    const authorValue = extractAuthor(entry.author);
    entry.author = authorValue;
    formattedData = entry;
  });

  const date = new Date(formattedData.entry.published);
  const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    date
  );
  const year = date.getFullYear();

  return {
    data: formattedData,
    month,
    year,
    path,
  };
};

export const fetchGithub = async () => {
  const baseLevelDirectory = await fetchGithubData();

  baseLevelDirectory.map(async (baseDir: any, index: number) => {
    if (index === 1) {
      await dirContentRecursion(baseDir);
    }
  });
};

export const dirContentRecursion = async (dir: any) => {
  const isDirectory = dir.type === "dir";
  const isFile = dir.type === "file";
  const relativePath = dir.path.split("static/")[1];
  if (isDirectory) {
    console.log(relativePath);
    const dirContent: any[] = await fetchGithubData(relativePath);
    const isFileList = dirContent[0].type === "file";
    const isDirList = dirContent[0].type === "dir";
    for (let i = 0; i < dirContent.length; i++) {
      if ((i >= 2 && isFileList) || (i >= 2 && isDirList)) {
        break;
      }
      await dirContentRecursion(dirContent[i]);
    }
  } else if (isFile) {
    // handle XML file
    convertXmlToText(relativePath);
  }
};

const extractAuthor = (str: string) => {
  // Regex to extract name (assumes any word characters at the start of the string before the date)
  const nameRegex = /^[\w\s]+(?=\s\d{4}-\d{2}-\d{2})/;
  const name = str.match(nameRegex)?.[0].trim() ?? "";

  return name;
};
