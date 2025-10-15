import * as Cheerio from "cheerio";

import {ConvertedXML, FeedPage } from "./types";

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
  const linkByAnchor: Record<string, string> = {};
  
  // Check for thread structure at feed level first
  const threadMessages = $("feed > thread > message");
  let authorsForFeed: FeedPage["authors"] = [];

  if (threadMessages.length > 0) {
    // Build a flat list preserving position, with depth/parent/reply metadata
    const messages: Array<{
      name: string;
      date: string;
      time: string;
      depth?: number;
      parent_id?: string;
      reply_to?: string;
      position?: number;
      anchor?: string;
    }> = [];

    threadMessages.each((_i, msg) => {
      const $msg = $(msg);
      const authorName = $msg.find("author").first().text();
      const timestamp = $msg.find("timestamp").first().text();
      // timestamp format: YYYY-MM-DDTHH:MM:SS.000Z or YYYY-MM-DD HH:MM:SS+00:00
      let date = "";
      let time = "";
      if (timestamp) {
        if (timestamp.includes("T")) {
          // ISO format: YYYY-MM-DDTHH:MM:SS.000Z
          const parts = timestamp.split("T");
          date = parts[0] || "";
          time = parts[1] ? parts[1].replace(/\.\d{3}Z$/, "") : "";
        } else {
          // Legacy format: YYYY-MM-DD HH:MM:SS+00:00
          const parts = timestamp.split(" ");
          date = parts[0] || "";
          time = parts.slice(1).join(" ") || "";
        }
      }

      // Create a more specific reply_to identifier
      let replyToText = $msg.attr("reply_to");
      if (replyToText && $msg.attr("parent_id")) {
        // Extract the parent anchor from parent_id to make it more specific
        const parentAnchor = $msg.attr("parent_id")?.split('-').slice(-1)[0];
        if (parentAnchor) {
          // Find the parent message to get its timestamp for more context
          let parentTimestamp = "";
          threadMessages.each((_, msgEl) => {
            const $msgEl = $(msgEl);
            if ($msgEl.attr("anchor") === parentAnchor) {
              parentTimestamp = $msgEl.find("timestamp").first().text();
              return false; // Break out of loop
            }
          });
          
          if (parentTimestamp) {
            const parentDate = parentTimestamp.split(" ")[0];
            const parentTime = parentTimestamp.split(" ")[1]?.split(":")[0] + ":" + parentTimestamp.split(" ")[1]?.split(":")[1];
            replyToText = `${replyToText} (${parentDate} ${parentTime})`;
          }
        }
      }

      const messageData = {
        name: authorName,
        date,
        time,
        depth: Number($msg.attr("depth")) || 0,
        parent_id: $msg.attr("parent_id"),
        reply_to: replyToText,
        position: Number($msg.attr("position")) || 0,
        anchor: $msg.attr("anchor"),
      };

      messages.push(messageData);
    });

    // Sort by position to match chronological thread overview
    messages.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

    authorsForFeed = messages as any;
  } else {
  }

  $("entry").each((_index, element) => {
    // New: collect all alternate links (per-message historical links)
    let historyLinks: string[] = [];
    immediateLinkELements.each((_index, el) => {
      historyLinks.push(el.attribs["href"]);
    });

    // Build anchor->link mapping by matching anchors in filenames.
    // Always add an index-based fallback so messages without anchors still get links.
    const normalizedLinks = historyLinks.map(l => l.replace(/\.xml$/, ""));
    const extractAnchorFromLink = (link: string): string | undefined => {
      const match = link.match(/\/(m[0-9a-f]+)_[^/]+$/i);
      return match?.[1];
    };

    // Ensure authors have a stable anchor whenever possible, even when XML omits it.
    if (authorsForFeed.length > 0) {
      authorsForFeed = authorsForFeed.map((author, idx) => {
        if (author.anchor) return author;
        const linkIndex = typeof author.position === "number" ? author.position : idx;
        const derivedAnchor = extractAnchorFromLink(normalizedLinks[linkIndex] || "");
        return derivedAnchor ? { ...author, anchor: derivedAnchor } : author;
      });
    }

    if (threadMessages.length > 0) {
      const threadMessageList: Array<{ name: string; date: string; time: string; anchor?: string }> = [];

      threadMessages.each((i, msg) => {
        const $msg = $(msg);
        const timestamp = $msg.find("timestamp").first().text() || "";
        const parts = timestamp.includes("T")
          ? timestamp.replace(/\.\d{3}Z$/, "").split("T")
          : timestamp.split(" ");
        const anchorFromXml = $msg.attr("anchor") || undefined;
        const anchorFromLink = extractAnchorFromLink(normalizedLinks[i] || "");

        threadMessageList.push({
          name: $msg.find("author").first().text(),
          date: parts[0] || "",
          time: parts[1] || "",
          anchor: anchorFromXml || anchorFromLink,
        });
      });

      // First pass: map by anchor when available.
      threadMessageList.forEach((m) => {
        if (!m.anchor) return;
        const matchingLink = normalizedLinks.find(link => link.includes(m.anchor!));
        if (matchingLink) {
          linkByAnchor[m.anchor] = matchingLink;
        }
      });

      // Second pass: fill any unmapped message using stable index order.
      threadMessageList.forEach((m, i) => {
        const ms = Date.parse(`${m.date}T${m.time}`);
        const fallbackKey = `${m.name}-${ms}`;
        const primaryKey = m.anchor || fallbackKey;
        if (!linkByAnchor[primaryKey] && normalizedLinks[i]) {
          linkByAnchor[primaryKey] = normalizedLinks[i];
        }
        // Also seed the name-date key to support components that use legacy lookup.
        if (!linkByAnchor[fallbackKey] && normalizedLinks[i]) {
          linkByAnchor[fallbackKey] = normalizedLinks[i];
        }
      });
    }

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

    // Use thread authors if found, otherwise fall back to legacy parsing
    if (authorsForFeed.length === 0) {
      // console.log("No thread structure found, parsing legacy flat author structure");
      
      // Handle old flat structure with multiple <author> elements
      const legacyAuthors = $("author > name");
      if (legacyAuthors.length > 0) {
        const messages: Array<{
          name: string;
          date: string;
          time: string;
          depth?: number;
          parent_id?: string;
          reply_to?: string;
          position?: number;
          anchor?: string;
        }> = [];

        legacyAuthors.each((_i, authorEl) => {
          const authorText = $(authorEl).text();
          const threadAuthors = extractAuthorsDateTime(authorText);
          
          // If extractAuthorsDateTime found datetime in the text, use it
          if (threadAuthors.length > 0) {
            // Convert legacy authors to new format
            threadAuthors.forEach((author, index) => {
              messages.push({
                name: author.name,
                date: author.date,
                time: author.time,
                depth: 0, // All legacy authors are treated as root level
                parent_id: undefined,
                reply_to: undefined,
                position: index,
                anchor: undefined,
              });
            });
          } else {
            // New structure: author name is plain text, timestamp is a separate element
            // Look for a sibling <timestamp> element at feed level
            const feedTimestamp = $("feed > timestamp").first().text();
            // Also check for entry > published as fallback
            const entryPublished = $(element).find(xmlElements.published).text();
            const timestamp = feedTimestamp || entryPublished || "";
            
            let date = "";
            let time = "";
            if (timestamp) {
              if (timestamp.includes("T")) {
                // ISO format: YYYY-MM-DDTHH:MM:SS+00:00 or YYYY-MM-DDTHH:MM:SS.000Z
                const parts = timestamp.split("T");
                date = parts[0] || "";
                time = parts[1] ? parts[1].replace(/\.\d{3}Z$/, "").replace(/\+\d{2}:\d{2}$/, "") : "";
              } else if (timestamp.includes(" ")) {
                // Legacy format: YYYY-MM-DD HH:MM:SS+00:00
                const parts = timestamp.split(" ");
                date = parts[0] || "";
                time = parts.slice(1).join(" ").replace(/\+\d{2}:\d{2}$/, "") || "";
              }
            }
            
            messages.push({
              name: authorText.trim(),
              date,
              time,
              depth: 0,
              parent_id: undefined,
              reply_to: undefined,
              position: messages.length,
              anchor: undefined,
            });
          }
        });

        authorsForFeed = messages as any;
        // console.log(`Parsed ${authorsForFeed.length} authors from legacy flat structure`);

        // Build name-date key → link mapping aligned by DOM order of <link> elements
        try {
          const normalizedLegacy = historyLinks.map(l => l.replace(/\.xml$/, ""));
          (messages as any[]).forEach((m, i) => {
            const key = `${m.name}-${Date.parse(m.date + "T" + m.time)}`;
            if (normalizedLegacy[i]) {
              linkByAnchor[key] = normalizedLegacy[i];
            }
          });
          const preview = Object.entries(linkByAnchor).slice(0, 5);
          // console.log("[convert-from-xml] legacy key->link size:", Object.keys(linkByAnchor).length, preview);
        } catch (e) {}
      } else {
        // Fallback to old single author parsing
        const author = $(xmlElements.author).children(xmlElements.name).text();
        const threadAuthors = extractAuthorsDateTime(author);
        
        if (threadAuthors.length > 0) {
          authorsForFeed = threadAuthors;
          console.log(`Parsed ${authorsForFeed.length} authors from single author fallback`);
        } else if (author.trim()) {
          // New structure: author name without datetime, get timestamp from separate element
          const feedTimestamp = $("feed > timestamp").first().text();
          const entryPublished = $(element).find(xmlElements.published).text();
          const timestamp = feedTimestamp || entryPublished || "";
          
          let date = "";
          let time = "";
          if (timestamp) {
            if (timestamp.includes("T")) {
              const parts = timestamp.split("T");
              date = parts[0] || "";
              time = parts[1] ? parts[1].replace(/\.\d{3}Z$/, "").replace(/\+\d{2}:\d{2}$/, "") : "";
            } else if (timestamp.includes(" ")) {
              const parts = timestamp.split(" ");
              date = parts[0] || "";
              time = parts.slice(1).join(" ").replace(/\+\d{2}:\d{2}$/, "") || "";
            }
          }
          
          authorsForFeed = [{
            name: author.trim(),
            date,
            time,
          }];
          console.log(`Parsed 1 author from new structure with separate timestamp`);
        }
      }
    }
    const newEntry = { ...entry, authors: authorsForFeed, historyLinks } as any;
    (newEntry as any).linkByAnchor = linkByAnchor;
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

    // sanitize the author name
    // check if the naame starts with two numbers
    // Todo: this is a hack, we should fix the regex instead
    // Exclude names with two consecutive digits
    if (/^\d{2}/.test(name)) {
      name = name.replace(/^\d{2}/, "");
    }
    groups.push({ name, date, time });
  }
  return groups;
};
