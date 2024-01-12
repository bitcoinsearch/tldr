import Image from "next/image";
import React from "react";

import { SearchResults } from "./search-modal";
import {
  SearchDataParams,
  EsSearchResult,
} from "@/helpers/types";
import { getStaticPathFromURL } from "@/helpers/utils";
import { extractAuthorsAndDates } from "@/helpers/convert-from-xml";
import Link from "next/link";
import { DEFAULT_LIMIT_OF_RESULTS_TO_DISPLAY } from "@/config/config";

type SearchResultProps = {
  searchResults: SearchResults;
  isPending: boolean;
  searchQuery: SearchDataParams | null;
  showMoreResults: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function SearchResult({
  searchResults,
  searchQuery,
  isPending,
  showMoreResults,
  setOpen,
}: SearchResultProps) {
  if (!searchQuery?.query?.keyword && !searchQuery?.query?.author) return null;

  if (
    !isPending &&
    (searchResults?.searchResults.length === 0 ||
      searchResults?.totalSearchResults === 0)
  ) {
    return (
      <p className="text-center">
        Oops! we could not find what you are looking for. You can try searching
        for a similar keyword
      </p>
    );
  }

  const pages = Math.floor(
    searchResults.totalSearchResults / DEFAULT_LIMIT_OF_RESULTS_TO_DISPLAY
  );
  const page = searchResults.searchResults.length;
  const showMore = page < pages;
  const totalSearchResultsCount = showMore
    ? `See more results (+${
        searchResults?.totalSearchResults -
        page * DEFAULT_LIMIT_OF_RESULTS_TO_DISPLAY
      })`
    : "";

  return (
    <div className="w-full">
      <ul className="mt-0">
        {searchResults.searchResults?.map((page, index) =>
          page?.hits.hits.map((result, index) => {
            const data = result._source as EsSearchResult["_source"];
            const { id, authors, title, body, url, domain } = data;
            return (
              <SearchPost
                key={`${index}_${id}`}
                data={data}
                setOpen={setOpen}
              />
            );
          })
        )}
      </ul>
      <div className="flex items-center justify-center gap-2 mb-1">
        <button
          className={`text-sm text-center font-semibold text-[#B06B03] hover:underline ${
            !showMore || isPending ? "hidden" : ""
          }`}
          onClick={showMoreResults}
        >
          {totalSearchResultsCount}
        </button>
      </div>
    </div>
  );
}

export default SearchResult;

type SearchPostProps = {
  data: EsSearchResult["_source"];
  setOpen: (x: boolean) => void;
};

const SearchPost = ({
  data,
  setOpen,
}: SearchPostProps) => {
  const {id, authors, title} = data
  const path = getStaticPathFromURL(data);
  const type = path?.list;
  if (!type) return null;

  const isBitcoinDev = type === "bitcoin-dev";
  const headerText = type;
  const headerImageSrc = isBitcoinDev
    ? "/images/btc.svg"
    : "/images/lightning-dev.svg";

  const extractedOriginalAuthor = extractAuthorsAndDates(
    authors[authors.length - 1]
  );
  const originalAuthor = typeof extractedOriginalAuthor === "string" ? extractedOriginalAuthor: Object.keys(extractedOriginalAuthor)[0];

  return (
    <li key={id} className="mb-6">
      <div className="flex items-center gap-2 mb-1">
        <Image src={headerImageSrc} alt={headerText} width={14} height={14} />
        <span className="text-xs font-semibold">{headerText}</span>
      </div>
      <Link
        href={path.url}
        onClick={() => setOpen(false)}
        className="hover:text-blue-600 underline text-sm capitalize"
      >
        {title}
      </Link>
      <p className="text-sm mt-1">
        Started by: <span className="font-medium">{originalAuthor}</span>
      </p>
    </li>
  );
};
