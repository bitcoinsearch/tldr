const fs = require("fs");
const path = require("path");
const bitcoinDevBaseDir = "public/static/static/bitcoin-dev";
const delvingBitcoinBaseDir = "public/static/static/delvingbitcoin";
const lightningDevBaseDir = "public/static/static/lightning-dev";

const mappingMonths = {
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

const now = new Date();
const month = now.toLocaleString("en-US", { month: "long" });
const mappedMonth = mappingMonths[month];
const currentYear = now.getFullYear();
const startYear = 2012;

let results = [];

// helper to extract <tag>value</tag>
function extractTag(content, tag) {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const match = content.match(regex);
  return match ? match[1].trim() : null;
}

// helper to extract authors
function extractAuthors(content) {

  const matches =
    content.match(/<author>[\s\S]*?<name>(.*?)<\/name>[\s\S]*?<\/author>/g) ||
    [];


  const authors = matches
    .map((m) => {
      const nameMatch = m.match(/<name>(.*?)<\/name>/);
      if (!nameMatch) return null;

      const full = nameMatch[1].trim();
      const parts = full.split(" ");
      const dateIndex = parts.findIndex((p) => /^\d{4}-\d{2}-\d{2}/.test(p));

      return dateIndex === -1
        ? full
        : parts.slice(0, dateIndex).join(" ");
    })
    .filter(Boolean);

  if (authors.length === 0) return [];

  const ordered = authors.reverse();

  const unique = [...new Set(ordered)];

  return unique;
}


function extractLink(content) {
  const regex = /<link[^>]*href=["']([^"']+)["']/i;
  const match = content.match(regex);
  return match ? match[1].trim() : null;
}

// Return all relative (local) href values from <link rel="alternate"> elements
function extractLocalLinks(content) {
  const regex = /<link[^>]*href=["']([^"']+)["'][^>]*>/gi;
  const links = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    const href = match[1].trim();
    if (!href.startsWith("http")) links.push(href);
  }
  return links;
}

// Read an individual message XML and return { name, date } using the new format
// (<author><name>…</name></author> + separate <timestamp>…</timestamp>)
function extractAuthorAndDateFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const nameMatch = content.match(/<author>\s*<name>([\s\S]*?)<\/name>\s*<\/author>/i);
    const tsMatch = content.match(/<timestamp>([\s\S]*?)<\/timestamp>/i);
    if (!nameMatch) return null;

    const rawName = nameMatch[1].trim();
    // Handle old embedded-date format ("Name 2012-04-11 18:39:40+00:00")
    const parts = rawName.split(" ");
    const dateIdx = parts.findIndex((p) => /^\d{4}-\d{2}-\d{2}/.test(p));
    const name = dateIdx === -1 ? rawName : parts.slice(0, dateIdx).join(" ");

    const tsRaw =
      dateIdx !== -1
        ? parts.slice(dateIdx).join(" ")
        : tsMatch
        ? tsMatch[1].trim()
        : null;
    const date = tsRaw ? new Date(tsRaw) : null;
    return { name, date: date && !isNaN(date) ? date : null };
  } catch (_) {
    return null;
  }
}

function extractContributors(xml) {
 const matches = [...xml.matchAll(/<name>(.*?)<\/name>/g)];
  if (matches.length === 0) return [];

  const authors = matches.map((m) => {
    let full = m[1].trim();

    const parts = full.split(" ");
    const dateIndex = parts.findIndex((p) => /^\d{4}-\d{2}-\d{2}/.test(p));
    if (dateIndex !== -1) full = parts.slice(0, dateIndex).join(" ");

    full = full.replace(/[.\s]+$/g, "").trim();

    return full;
  });

  const reversed = authors.reverse();

  const firstAuthor = reversed[0];

  const unique = [...new Set(reversed)].filter((name) => name !== firstAuthor);

  return unique;
}

function countAuthors(content) {
  const matches = content.match(/<author>[\s\S]*?<\/author>/g);
  return matches ? matches.length : 0;
}

function formatUTC(date) {
  return (
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
      hour12: false,
    })
      .format(date)
      .replace(",", "") + " UTC"
  );
}

function extractDates(content) {
  const matches =
    content.match(/<author>[\s\S]*?<name>(.*?)<\/name>[\s\S]*?<\/author>/g) ||
    [];
  const dates = [];

  matches.forEach((m) => {
    const nameMatch = m.match(/<name>(.*?)<\/name>/);
    if (!nameMatch) return;

    const full = nameMatch[1].trim();
    const parts = full.split(" ");
    const dateIndex = parts.findIndex((p) => /^\d{4}-\d{2}-\d{2}/.test(p));

    if (dateIndex === -1) return;

    const time = parts.slice(dateIndex).join(" ");
    const d = new Date(time);
    if (!isNaN(d)) dates.push(d);
  });

  if (dates.length === 0) return { firstPostDate: null, lastPostDate: null };

  const first = new Date(Math.min(...dates));
  const last = new Date(Math.max(...dates));

  return {
    firstPostDate: formatUTC(first),
    lastPostDate: formatUTC(last),
  };
}

function processFolder(folderPath, devName) {
  if (!fs.existsSync(folderPath)) return;

  const files = fs
    .readdirSync(folderPath)
    .filter((f) => f.endsWith(".xml") && f.startsWith("combined"));

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const xmlData = fs.readFileSync(filePath, "utf-8");

    const title = extractTag(xmlData, "title");
    let summary = extractTag(xmlData, "summary");
    summary = (summary || "").split(".").slice(0, 2).join(".");
    let authors = extractAuthors(xmlData);
    const contributors = extractContributors(xmlData);
    const linkExtract = extractLink(xmlData).replace(".xml", "");
    let link = linkExtract.split("/");
    link[2] = link[2].replace(/^(m?[a-f0-9]{40}|[0-9]+)_/, "combined_");

    let dates = extractDates(xmlData);

    // Fallback for old combined XMLs that have no <author> blocks: read linked files
    if (authors.length === 0) {
      const localLinks = extractLocalLinks(xmlData);
      const fileData = localLinks
        .map((href) =>
          extractAuthorAndDateFromFile(
            path.join("public/static/static", href)
          )
        )
        .filter(Boolean);

      if (fileData.length > 0) {
        authors = [...new Set(fileData.map((r) => r.name).filter(Boolean))];

        if (!dates.firstPostDate) {
          const validDates = fileData
            .map((r) => r.date)
            .filter((d) => d !== null);
          if (validDates.length > 0) {
            const first = new Date(Math.min(...validDates.map((d) => d.getTime())));
            const last = new Date(Math.max(...validDates.map((d) => d.getTime())));
            dates = {
              firstPostDate: formatUTC(first),
              lastPostDate: formatUTC(last),
            };
          }
        }
      }
    }

    const file_path = folderPath.replace("public/static/", "");

    results.push({
      id: path.basename(file, ".xml"),
      title: (title || file).replace("Combined summary - ", ""),
      link: link.join("/"),
      published_at: dates.firstPostDate,
      summary: summary || null,
      authors: authors || null,
      n_threads: countAuthors(xmlData),
      file_path: `${file_path}/${file}`,
      dev_name: devName,
      contributors,
      combined_summ_file_path: link.join("/"),
      ...dates,
    });
  }
}

for (let year = startYear; year <= currentYear; year++) {
  const folderName = `${mappedMonth}_${year}`;
  processFolder(path.join(bitcoinDevBaseDir, folderName), "bitcoin-dev");
  processFolder(path.join(lightningDevBaseDir, folderName), "lightning-dev");
  processFolder(path.join(delvingBitcoinBaseDir, folderName), "delvingbitcoin");
}

const output = { historicaldata: results };
const outPath = "public/historical.json";
console.log("Generated Historical Conversations sucessfully")
fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
