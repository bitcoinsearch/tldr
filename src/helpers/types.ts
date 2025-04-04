import { urlMapping } from "@/config/config";
import { NextPage } from "next";

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
  historyLinks: string[];
};

type ConvertedXML = {
  data: FeedPage;
  month: string;
  year: number;
  path: string | undefined;
};

type MailingListType = keyof typeof urlMapping;

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
  combined_summ_file_path: string;
};

type HomepageData = {
  header_summary: string;
  recent_posts: HomepageEntryData[];
  active_posts: HomepageEntryData[];
  today_in_history_posts: HomepageEntryData[];
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
    authors: Array<string>;
    body: string;
    body_type: string;
    created_at: Date;
    domain: string;
    indexed_at: string;
    url: string;
  };
};

export type NewsLetterDataType = {
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

export type NewsLetterSet = {
  year: string;
  newsletters: Array<{ title: string; link: string }>;
};

export type SummaryData = {
  data: {
    authors: sortedAuthorData[];
    historyLinks: string[];
    id: string;
    title: string;
    updatedAt: string;
    generatedUrl?: string | undefined;
    entry: EntryData;
  };
  month: string;
  year: number;
  path: string | undefined;
};

export type sortedAuthorData = AuthorData & { initialIndex: number; dateInMS: number };

export type NewsletterData = {
  summary: string;
  url: string;
  dateRange: string;
  publishedAt: string;
  issueNumber: number;
};

export type Tweet = {
  tweet: string;
  name: string;
  username: string;
  profileImage: string;
  url: string;
};

export type PostSummaryData = {
  data: {
    authors: sortedAuthorData[];
    historyLinks: string[];
    id: string;
    title: string;
    updatedAt: string;
    generatedUrl?: string;
    entry: EntryData;
  };
  month: string;
  year: number;
  path: string | undefined;
};

export type SortKey = "newest" | "oldest" | "bitcoin-dev" | "delvingbitcoin" | "all";


// For params

export type NextParamsPage = { params: { path: string[], "reply-id"?:string }; searchParams: { replies: string } }