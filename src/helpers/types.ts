type Feed = {
  id: string;
  title: string;
  updatedAt: string;
  author: string;
  generatedUrl?: string;
  entry: EntryData;
};

type EntryData = {
  id: string;
  title: string;
  updatedAt: string;
  link?: string;
  summary: string;
  published: string;
};

type MailingListType = typeof BITCOINDEV | typeof LIGHTNINGDEV

export const BITCOINDEV = "bitcoin-dev"
export const LIGHTNINGDEV = "lightning-dev"

export type { Feed, EntryData, MailingListType };