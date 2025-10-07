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

for (let year = startYear; year <= currentYear; year++) {
  const folderName = `${mappedMonth}_${year}`;

  const bitcoinDevFolderPath = path.join(bitcoinDevBaseDir, folderName);
  const lightningDevFolderPath = path.join(lightningDevBaseDir, folderName);
  const delvingbitcoinFolderPath = path.join(delvingBitcoinBaseDir, folderName);

  if (fs.existsSync(bitcoinDevFolderPath)) {
    const files = fs
      .readdirSync(bitcoinDevFolderPath)
      .filter((f) => f.endsWith(".xml") && f.startsWith("combined"));

    for (const file of files) {
      const filePath = path.join(bitcoinDevFolderPath, file);
      const xmlData = fs.readFileSync(filePath, "utf-8");

      const title = extractTag(xmlData, "title");
      let summary = extractTag(xmlData, "summary");
      summary = (summary || "").split(".").slice(0, 2).join(".");
      const authors = extractAuthors(xmlData);
      const contributors = extractContributors(xmlData)
      const linkExtract = extractLink(xmlData).replace(".xml", "");
      let link = linkExtract.split("/");
      link[2] = link[2].replace(/^(m?[a-f0-9]{40}|[0-9]+)_/, "combined_");

      const dates = extractDates(xmlData);
      const file_path = bitcoinDevFolderPath.replace("public/static/", "");

      results.push({
        id: path.basename(file, ".xml"),
        title: (title || file).replace("Combined summary - ", ""),
        link: link.join("/"),
        published_at: dates.firstPostDate,
        summary: summary || null,
        authors: authors || null,
        n_threads: countAuthors(xmlData),
        file_path: `${file_path}/${file}`,
        dev_name: "bitcoin-dev",
        contributors,
        combined_summ_file_path: link.join("/"),
        ...dates,
      });
    }
  }
  if (fs.existsSync(lightningDevFolderPath)) {
    const files = fs
      .readdirSync(lightningDevFolderPath)
      .filter((f) => f.endsWith(".xml") && f.startsWith("combined"));

    for (const file of files) {
      const filePath = path.join(lightningDevFolderPath, file);
      const xmlData = fs.readFileSync(filePath, "utf-8");

      const title = extractTag(xmlData, "title");
      let summary = extractTag(xmlData, "summary");
      summary = (summary || "").split(".").slice(0, 2).join(".");
      const authors = extractAuthors(xmlData);
      const contributors = extractContributors(xmlData)
      const linkExtract = extractLink(xmlData).replace(".xml", "");
      let link = linkExtract.split("/");
      link[2] = link[2].replace(/^(m?[a-f0-9]{40}|[0-9]+)_/, "combined_");
      const dates = extractDates(xmlData);
      const file_path = lightningDevFolderPath.replace("public/static/", "");

      results.push({
        id: path.basename(file, ".xml"),
        title: (title || file).replace("Combined summary - ", ""),
        link: link.join("/"),
        published_at: dates.firstPostDate,
        summary: summary || null,
        authors: authors || null,
        n_threads: countAuthors(xmlData),
        file_path: `${file_path}/${file}`,
        dev_name: "lightning-dev",
        contributors,
        combined_summ_file_path: link.join("/"),
        ...dates,
      });
    }
  }

  if (fs.existsSync(delvingbitcoinFolderPath)) {
    const files = fs
      .readdirSync(delvingbitcoinFolderPath)
      .filter((f) => f.endsWith(".xml") && f.startsWith("combined"));

    for (const file of files) {
      const filePath = path.join(delvingbitcoinFolderPath, file);
      const xmlData = fs.readFileSync(filePath, "utf-8");

      const title = extractTag(xmlData, "title");
      let summary = extractTag(xmlData, "summary");
      summary = (summary || "").split(".").slice(0, 2).join(".");
      const authors = extractAuthors(xmlData);
      const contributors = extractContributors(xmlData)

      const linkExtract = extractLink(xmlData).replace(".xml", "");
      let link = linkExtract.split("/");
      link[2] = link[2].replace(/^(m?[a-f0-9]{40}|[0-9]+)_/, "combined_");

      const dates = extractDates(xmlData);
      const file_path = delvingBitcoinBaseDir.replace("public/static/", "");

      results.push({
        id: path.basename(file, ".xml"),
        title: (title || file).replace("Combined summary - ", ""),
        link: link.join("/"),
        published_at: dates.firstPostDate,
        summary: summary || null,
        authors: authors || null,
        n_threads: countAuthors(xmlData),
        file_path: `${file_path}/${file}`,
        dev_name: "delvingbitcoin",
        contributors,
        combined_summ_file_path: link.join("/"),
        ...dates,
      });
    }
  }
}

const output = { historicaldata: results };
const outPath = "public/historical.json";
console.log("Generated Historical Conversations sucessfully")
fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
