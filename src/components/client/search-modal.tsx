"use client";

import Image from "next/image";
import React, { useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";

import { SearchDataParams, SearchIndexData } from "@/helpers/types";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";

import { defaultFilter, filterReducer } from "./actions/filter-reducer";
import { getDataFromCachedIndex } from "./actions/get-search-data";
import SearchResult from "./search-result-ui";
import Spinner from "./spinner";

export type SearchResults = {
  searchResults: SearchIndexData[];
  totalSearchResults: number;
};

export type SearchQuery = {
  limit?: number;
} & SearchDataParams;

const DEBOUNCE_DELAY = 1200;
const DEFAULT_LIMIT_OF_RESULTS_TO_DISPLAY = 4;

const SearchBox = () => {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState<SearchQuery | null>(
    null
  );
  const [limit, setLimit] = React.useState<number>(
    DEFAULT_LIMIT_OF_RESULTS_TO_DISPLAY
  );
  const [searchResults, setSearchResults] = React.useState<SearchResults>();
  const [error, setError] = React.useState<Error>();

  const [filter, dispatch] = React.useReducer(filterReducer, defaultFilter);
  const [isPending, startTransition] = useTransition();

  const showDescription =
    !isPending &&
    !error &&
    searchResults?.totalSearchResults &&
    searchResults?.totalSearchResults > 0;

  const prevQueryRef = React.useRef(searchQuery);
  const searchFeedInputRef = React.useRef<HTMLInputElement>(null);

  const showMoreResults = () => {
    if (searchResults && limit >= searchResults?.totalSearchResults) return;
    setLimit((prev) => prev + 5);
  };

  const setSearchQueryPath = (path: string) => {
    setSearchQuery((prev) => ({
      path,
      query: {
        ...prev?.query,
      },
    }));
  };

  const getData = React.useCallback(async () => {
    if (searchQuery) {
      const data = await getDataFromCachedIndex(searchQuery);
      if (data) {
        setSearchResults({
          searchResults: data.filteredData,
          totalSearchResults: data.filteredDataLength,
        });
      }
      if (data instanceof Error) {
        setError(data);
        return;
      }
    }
  }, [searchQuery]);

  const debouncedSearch = useDebouncedCallback((value) => {
    setSearchQuery((prev) => ({
      path: prev?.path || "",
      query: {
        ...prev?.query,
        keyword: value,
      },
    }));
  }, DEBOUNCE_DELAY);

  const debouncedSearchAuthor = useDebouncedCallback((value) => {
    setSearchQuery((prev) => ({
      path: prev?.path || "",
      query: {
        ...prev?.query,
        author: value,
      },
    }));
  }, DEBOUNCE_DELAY);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && e.which === 75 && (e.metaKey || e.ctrlKey)) {
        setOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  React.useEffect(() => {
    if (searchQuery !== prevQueryRef.current) {
      if (
        (searchQuery?.query?.author === "" ||
          searchQuery?.query?.author === undefined) &&
        (searchQuery?.query?.keyword === "" ||
          searchQuery?.query?.keyword === undefined)
      ) {
        return;
      }
      startTransition(() => {
        getData();
      });
      return () => {
        debouncedSearch.cancel();
        debouncedSearchAuthor.cancel();
      };
    }

    prevQueryRef.current = searchQuery;
  }, [
    searchQuery,
    startTransition,
    getData,
    debouncedSearch,
    debouncedSearchAuthor,
  ]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      searchFeedInputRef.current?.focus();
    }, 100);

    if (!open) {
      setLimit(4);
    }

    return () => clearTimeout(timer);
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <div className="relative">
          <input
            name="searchbox"
            className="border-[1px] rounded-md border-[#ccc] w-[200px] md:w-[274px] py-2 pl-9"
            placeholder="search [cmd/ctrl+k]"
          />
          <Image
            className="absolute top-1/2 left-0 -translate-y-1/2 ml-2 pointer-events-none"
            src="/icons/search_icon.svg"
            alt="search_icon"
            width={24}
            height={24}
          />
        </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-slate-400 opacity-50 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow overflow-y-auto fixed top-[50%] left-[50%] max-h-[65vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="m-0 text-[16px] font-medium flex items-center gap-x-4">
            <span>Filter results by: </span>
            <div className="flex items-center gap-x-2">
              <button
                className={`border rounded py-1 px-2 text-xs hover:bg-slate-100 ${
                  filter.bitcoinDev && "bg-slate-100"
                }`}
                onClick={() => {
                  dispatch({ type: "bitcoinDev" });
                  setSearchQueryPath("bitcoin-dev");
                }}
              >
                bitcoin-dev
              </button>
              <button
                className={`border rounded py-1 px-2 text-xs hover:bg-slate-100 ${
                  filter.lightningDev && "bg-slate-100"
                }`}
                onClick={() => {
                  dispatch({ type: "lightningDev" });
                  setSearchQueryPath("lightning-dev");
                }}
              >
                lightning-dev
              </button>
              <button
                className={`border p-[6px] hover:bg-slate-100 focus:bg-slate-100 inline-flex h-[25px] w-[25px] appearance-none items-center justify-center focus:outline-none`}
                aria-label="clear-filter"
                onClick={() => {
                  dispatch({ type: "clear" });
                  setSearchQueryPath("");
                }}
              >
                <Cross2Icon />
              </button>
            </div>
          </Dialog.Title>
          <Dialog.Description
            className={`mt-[10px] mb-5 text-[15px] leading-normal ${
              showDescription ? "visible" : "hidden"
            }`}
          >
            Search results for{" "}
            {searchQuery?.query.keyword && (
              <span className="font-medium italic">
                {searchQuery.query.keyword}
              </span>
            )}
            {searchQuery?.query.author && (
              <span>
                {" "}
                {searchQuery?.query.keyword && "by"}{" "}
                <span className="font-medium italic">
                  {searchQuery.query.author}
                </span>
              </span>
            )}
          </Dialog.Description>
          <fieldset className="my-[15px] flex flex-col items-start gap-2">
            <label htmlFor="search"></label>
            <input
              className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] p-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_1.5px]"
              id="search"
              ref={searchFeedInputRef}
              placeholder="Search feed"
              onChange={(e) => debouncedSearch(e.target.value)}
            />
            <label htmlFor="search-author"></label>
            <input
              className="inline-flex h-[35px] w-[50%] flex-1 items-center justify-center rounded-[4px] p-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="search-author"
              placeholder="Optional: author name"
              onChange={(e) => debouncedSearchAuthor(e.target.value)}
            />
          </fieldset>
          <div className="mt-[25px] flex flex-col justify-center items-center">
            <Spinner isPending={isPending} />
            <SearchResult
              searchResults={searchResults}
              searchQuery={searchQuery}
              isPending={isPending}
              showMoreResults={showMoreResults}
              limit={limit}
            />
          </div>
          <Dialog.Close asChild>
            <button
              className="text-[10px] hover:bg-slate-300 bg-slate-200 focus:shadow-slate-300 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded focus:outline-none"
              aria-label="Close"
              onClick={() => {
                setSearchQuery(null);
                setSearchResults({ searchResults: [], totalSearchResults: 0 });
                setLimit(DEFAULT_LIMIT_OF_RESULTS_TO_DISPLAY);
                dispatch({ type: "clear" });
              }}
            >
              esc
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SearchBox;
