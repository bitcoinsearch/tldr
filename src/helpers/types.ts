import { BITCOINDEV, LIGHTNINGDEV } from "@/config/config";

const AUTHOR = "authors" as const;
const DOMAIN = "domain" as const;
const TAGS = "tags" as const;

type Feed = {
  id: string;
  title: string;
  updatedAt: string;
  authors: Record<string, string[]>;
  generatedUrl?: string;
  entry: EntryData;
};

type AuthorData = {
  name: string;
  date: string;
  time: string;
};

type FeedPage = {
  id: string;
  title: string;
  updatedAt: string;
  authors: AuthorData[];
  historyLinks?: string[];
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

type ConvertedXML = {
  data: FeedPage;
  month: string;
  year: number;
  path: string | undefined;
};

type MailingListType = typeof BITCOINDEV | typeof LIGHTNINGDEV;

type SearchIndexData = {
  title: string;
  authors: string[];
  summary: string;
  updatedAt: string;
  startedBy: string;
  path: string;
  score: number;
};

type SearchDataParams = {
  path: MailingListType | null;
  query: {
    keyword?: string;
    author?: string;
  };
  relevance?: "old-new" | "new-old";
};

type HomepageEntryData = {
  id: string;
  title: string;
  link: string;
  authors: string[];
  published_at: string;
  summary: string;
  n_threads: number;
  dev_name: string;
  contributors: string[];
  file_path: string;
};

type HomepageData = {
  header_summary: string;
  recent_posts: HomepageEntryData[];
  active_posts: HomepageEntryData[];
};

type XmlDataType = {
  data: Omit<FeedPage, "entry"> & {
    entry: Omit<EntryData, "link"> & { link: string };
  };
  month: string;
  path: string;
  year: number;
};

export type {
  AuthorData,
  Feed,
  FeedPage,
  EntryData,
  MailingListType,
  SearchIndexData,
  SearchDataParams,
  HomepageData,
  HomepageEntryData,
  ConvertedXML,
  XmlDataType,
};

export type FacetKeys = typeof AUTHOR | typeof DOMAIN | typeof TAGS;

export type Facet = {
  field: FacetKeys;
  value: string;
};

export type SortOption = "asc" | "desc";

export type SearchQuery = {
  queryString: string;
  authorString: string;
  size: number;
  page: number;
  sortFields: any[];
  mailListType: MailingListType | null;
};

export type EsSearchResult = {
  _id: string;
  _index: string;
  _source: {
    id: string;
    title: string;
    summary: string;
    author_list: Array<string>;
    body: string;
    body_type: string;
    created_at: Date;
    domain: string;
    indexed_at: string;
    url: string;
  };
};

export type NewsLetterData = {
  summary_of_threads_started_this_week: string;
  new_threads_this_week: Array<NewsLetter>;
  active_posts_this_week: Array<NewsLetter>;
};

export type NewsLetter = {
  id: string;
  title: string;
  link: string;
  authors: Array<string>;
  published_at: string;
  summary: string;
  n_threads: number;
  dev_name: string;
  contributors: Array<string>;
  file_path: string;
  combined_summ_file_path: string;
};
