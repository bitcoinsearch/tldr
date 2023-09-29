export function addSpaceAfterPeriods(text: string): string {
  return text.replace(/\.(\S)/g, '. $1');
}

export function formattedDate(date: string): string {
  const dateObj = new Date(date);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
      hourCycle: 'h23',
      timeZoneName: 'short'
    }).format(dateObj)
     .replace('at', '');
  return formattedDate;
}

export const createPath = (path: string) => {
  const pathIndex = path.split("/").findIndex((x) => x === "static");
  const sliced_path = path.split("/").slice(pathIndex);
  sliced_path.shift();
  return sliced_path.join("/");
};

export const getContributors = (authors: Array<string>) => {
  return authors.length <= 1 ? [] : authors.slice(1);
};

export const createSummary = (summary: string) => {
  const findIndex = summary.split(". ").slice(0, 2);

  const line1 = findIndex[0].split(" ");
  const line2 = findIndex[1].split(" ");

  const line1LastItem = line1[line1.length - 1];
  const line2LastItem = line2[line2.length - 1];

  if (
    (line1LastItem.length <= 2 && line1LastItem.charAt(0) === line1LastItem.charAt(0).toUpperCase()) ||
    (line2LastItem.length <= 2 && line2LastItem.charAt(0) === line2LastItem.charAt(0).toUpperCase())
  ) {
    return summary.split(". ").slice(0, 3).join(". ");
  } else {
    return summary.split(". ").slice(0, 2).join(". ");
  }
};
