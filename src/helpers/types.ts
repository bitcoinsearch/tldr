type Feed = {
  id: string;
  title: string;
  updatedAt: string;
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

export type { Feed, EntryData };