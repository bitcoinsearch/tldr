export function addSpaceAfterPeriods(text: string): string {
  return text.replace(/\.(\S)/g, '. $1');
}
