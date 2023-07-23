type Feed = {
  id: string;
  title: string;
  updatedAt: string;
  authors: Record<string, string[]>;
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

type MailingListType = typeof BITCOINDEV | typeof LIGHTNINGDEV;

export const BITCOINDEV = "bitcoin-dev";
export const LIGHTNINGDEV = "lightning-dev";

type SearchIndexData = {
  title: string;
  authors: string[];
  summary: string;
  link?: string;
  path: string;
};

type SearchDataParams = {
  path?: string;
  query: {
    keyword?: string;
    author?: string;
  };
};

export type {
  Feed,
  EntryData,
  MailingListType,
  SearchIndexData,
  SearchDataParams,
};
