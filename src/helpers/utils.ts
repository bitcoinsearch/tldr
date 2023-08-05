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
