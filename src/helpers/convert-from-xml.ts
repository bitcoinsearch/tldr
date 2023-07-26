import * as Cheerio from "cheerio";

import { ConvertedXML, Feed, FeedPage } from "./types";

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

export const convertXmlToText = async (xml: any, path?: string) :Promise<ConvertedXML> => {
  const $ = Cheerio.load(xml, {
    xml: {
      xmlMode: true,
    },
  });

  let formattedData: FeedPage = {} as FeedPage;
  const immediateLinkELements = $("feed").children(xmlElements.link)
  $("entry").each((_index, element) => {
    const author = $(xmlElements.author).children(xmlElements.name).text();
    const entry = {
      id: $(element).find(xmlElements.id).text(),
      title: $(element).find(xmlElements.title).text(),
      updatedAt: $(element).find(xmlElements.updatedAt).text(),
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

    let historyLinks: string[] = []
    immediateLinkELements.each((_index, el) => {
      historyLinks.push(el.attribs["href"])
    }) 
    const threadAuthors = extractAuthorsDateTime(author);
    const newEntry = { ...entry, authors: threadAuthors, historyLinks };
    formattedData = newEntry;
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

export const extractAuthorsAndDates = (str: string) => {
  const NAME_WITH_DATE_REGEX = /(.*? \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/g;
  const matches = str.match(NAME_WITH_DATE_REGEX) || [];

  const authors: Record<string, string[]> = {};

  matches.forEach((match) => {
    const [name, date] = match.split(
      /\s(?=\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$)/
    );
    if (authors[name.trim()]) {
      authors[name.trim()].push(date);
    } else {
      authors[name.trim()] = [date];
    }
  });

  return authors;
};

export const extractAuthorsDateTime = (str: string) => {
  const regex = /([\w\s]+) (\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}(?:(?:\+\d{2}:\d{2})|(?:\s*\+\d{2}:\d{2})|))/g;

  const groups:FeedPage["authors"] = [];
  let match;
  while ((match = regex.exec(str)) !== null) {
    const name = match[1];
    const date = match[2];
    const time = match[3];
    groups.push({ name, date, time });
  }
  return groups;
}
