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

export const fetchGithubData = async (path: string) => {
  const { data } = await axios.get(
    `${baseUrl}${providers.github.endpoints.repos(path)}`,
    {
      headers: {
        Accept: "application/vnd.github.raw+json",
      },
    }
  );
  return data;
};

export const convertXmlToText = async () => {
  const xml = await fetchGithubData(
    "lightning-dev/April_2016/000507_Acknowledgements-in-BOLT-2.xml"
  );
  const $ = cheerio.load(xml, {
    xml: {
      xmlMode: true,
    },
  });
  const formattedData: Feed[] = [];
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
    formattedData.push(entry);
  });
  return formattedData;
};
