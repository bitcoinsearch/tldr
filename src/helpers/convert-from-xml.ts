import * as Cheerio from "cheerio";

import {ConvertedXML, FeedPage, ThreadNode, sortedAuthorData } from "./types";

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

export const convertXmlToText = async (
  xml: any,
  path?: string
): Promise<ConvertedXML> => {
  const $ = Cheerio.load(xml, {
    xml: {
      xmlMode: true,
    },
  });

  let formattedData: FeedPage = {} as FeedPage;
  const immediateLinkELements = $("feed").children(xmlElements.link);
  $("entry").each((_index, element) => {
    const author = $(xmlElements.author).children(xmlElements.name).text();
    let historyLinks: string[] = [];
    immediateLinkELements.each((_index, el) => {
      historyLinks.push(el.attribs["href"]);
    });

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
        historyLinks: historyLinks,
      },
    };

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

  if (Object.keys(authors).length === 0) {
    return str
  }

  return authors;
};

export const extractAuthorsDateTime = (str: string) => {
  const regex =
  /(.*?) (\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}(?:(?:\+\d{2}:\d{2})|(?:\s*\+\d{2}:\d{2})|))/gu;

  const groups: FeedPage["authors"] = [];
  let match;
  while ((match = regex.exec(str)) !== null) {
    let name = match[1];
    const date = match[2];
    const time = match[3];
    let threadDepth = 0;
    let messageId = "";

    // Extract threading information if present
    const depthMatch = name.match(/\[depth:(\d+)\]/);
    if (depthMatch) {
      threadDepth = parseInt(depthMatch[1], 10);
      name = name.replace(/\[depth:\d+\]/, "").trim();
    }

    const idMatch = name.match(/\[id:([^\]]+)\]/);
    if (idMatch) {
      messageId = idMatch[1];
      name = name.replace(/\[id:[^\]]+\]/, "").trim();
    }

    // sanitize the author name
    // check if the naame starts with two numbers
    // Todo: this is a hack, we should fix the regex instead
    // Exclude names with two consecutive digits
    if (/^\d{2}/.test(name)) {
      name = name.replace(/^\d{2}/, "");
    }
    
    groups.push({ 
      name, 
      date, 
      time, 
      threadDepth,
      messageId: messageId || undefined
    });
  }
  return groups;
};

export const buildThreadTree = (authors: sortedAuthorData[], historyLinks: string[]): ThreadNode[] => {
  const nodes: ThreadNode[] = authors.map((author, index) => ({
    author,
    link: historyLinks[index],
    index,
    depth: author.threadDepth || 0,
    children: [],
  }));

  const rootNodes: ThreadNode[] = [];
  const stack: ThreadNode[] = [];
  
  // Build tree based on depth levels
  for (const node of nodes) {
    // Remove nodes from stack that are at same or higher depth
    while (stack.length > 0 && stack[stack.length - 1].depth >= node.depth) {
      stack.pop();
    }
    
    if (stack.length === 0) {
      // This is a root node
      rootNodes.push(node);
    } else {
      // This is a child of the last node in stack
      const parent = stack[stack.length - 1];
      parent.children.push(node);
      node.parent = parent;
    }
    
    stack.push(node);
  }

  return rootNodes;
};
