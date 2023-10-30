import Image from "next/image";
import React from "react";

import { SearchResults } from "./search-modal";
import { BITCOINDEV, LIGHTNINGDEV, SearchDataParams, MailingListType, EsSearchResult } from "@/helpers/types";
import { getStaticPathFromURL } from "@/helpers/utils";
import { extractAuthorsAndDates } from "@/helpers/convert-from-xml";
import Link from "next/link";

type SearchResultProps = {
  searchResults: SearchResults | undefined;
  isPending: boolean;
  searchQuery: SearchDataParams | null;
  showMoreResults: () => void;
  limit: number;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function SearchResult({
  searchResults,
  searchQuery,
  isPending,
  showMoreResults,
  limit,
  setOpen,
}: SearchResultProps) {
  if (isPending || !searchQuery?.query?.keyword && !searchQuery?.query?.author) return null;

  if (
    searchResults?.searchResults.length === 0 ||
    searchResults?.totalSearchResults === 0
  ) {
    return (
      <p className="text-center">
        Oops! we could not find what you are looking for. You can try searching
        for a similar keyword
      </p>
    );
  }
  console.log("gottt here")

  // function sortData() {
  //   if (!searchResults) return;
  //   let searchData: SearchResults["searchResults"];
  //   switch (searchQuery?.path) {
  //     case "bitcoin-dev":
  //       searchData = searchResults?.searchResults.filter((result) => {
  //         return result.path.includes(BITCOINDEV);
  //       });
  //       break;
  //     case "lightning-dev":
  //       searchData = searchResults?.searchResults.filter((result) => {
  //         return result.path.includes(LIGHTNINGDEV);
  //       });
  //       break;
  //     default:
  //       searchData = searchResults?.searchResults;
  //       break;
  //   }

  //   return searchData.length > 0 ? searchData.slice(0, limit) : [];
  // }

  const showMore = searchResults && limit >= searchResults?.totalSearchResults;
  const totalSearchResultsCount = searchResults?.totalSearchResults
    ? `See more results (+${searchResults?.totalSearchResults - limit})`
    : "";

  return (
    <div className="w-full">
      <ul className="mt-0">
        {searchResults?.searchResults?.map((result, index) => {
          console.log("git here")
          const data = result._source as EsSearchResult["_source"]
          const {id, author_list, title, summary, body, url} = data
          return <SearchPost key={id} id={id} authors={author_list} body={body} setOpen={setOpen} title={title} url={url} />
        })}
      </ul>
      <div className="flex items-center justify-center gap-2 mb-1">
        <button
          className={`text-sm text-center font-semibold text-[#B06B03] hover:underline ${
            showMore && "hidden"
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
  id: string;
  authors: string[];
  title: string;
  body: string;
  url: string;
  setOpen: (x: boolean) => void;
}

const SearchPost = ({id, authors, title, body, url, setOpen}: SearchPostProps) => {
  const path = getStaticPathFromURL(url, id)
  const type = path?.list
  if (!type) return null
  
  const isBitcoinDev = type === "bitcoin-dev"
  const headerText = isBitcoinDev ? "bitcoin-dev"
  : "lightning-dev"
  const headerImageSrc = isBitcoinDev ? "/images/btc.svg"
  : "/images/lightning-dev.svg"


  const originalAuthor = extractAuthorsAndDates(authors.pop() ?? "")[0]
  
  return (
    <li key={id} className="mb-6">
      <div className="flex items-center gap-2 mb-1">
        <Image
          src={headerImageSrc}
          alt={headerText}
          width={14}
          height={14}
        />
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
        Started by:{" "}
        <span className="font-medium">{originalAuthor}</span>
      </p>
    </li>
  );
}
