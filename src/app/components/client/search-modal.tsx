"use client";

import React, { useState } from "react";
import { useMediaQuery } from "./hooks/use-media-query";
import { SearchResponseBody } from "@elastic/elasticsearch/lib/api/types";
import SearchIcon from "@/public/icons/search-icon";
import { baseUrl } from "@/helpers/utils";

export type SearchResults = {
  searchResults: SearchResponseBody[];
  totalSearchResults: number;
  bitcoinDevCount: number;
  lightningDevCount: number;
};

const SearchBox = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const inputContainerRef = React.useRef<HTMLDivElement>(null);
  const linkRef = React.useRef<HTMLAnchorElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    if (linkRef.current?.href) {
      linkRef.current.href = baseUrl(searchQuery);
      linkRef.current.click();
    }
  };
  return (
    <div className="relative" ref={inputContainerRef}>
      <a href="https://bitcoinsearch.xyz/" className="hidden" ref={linkRef}></a>
      <div
        className={`${
          isMobile ? "flex flex-col items-center justify-center" : "relative"
        }`}
      >
        {isMobile ? (
          <div className="py-1.5 px-3 rounded-full bg-orange-custom-100">
            <SearchIcon className="text-white h-6 w-6" />
          </div>
        ) : (
          <form onSubmit={onSubmit} className="hidden md:flex w-[320px] lg:w-[411px] h-[49px] border border-gray-custom-400 rounded-full items-center justify-between">
            <section className="w-fit absolute left-4">
              <SearchIcon className="text-gray-custom-500" />
            </section>
              <input
                name="searchbox"
                className="w-full h-full focus:outline-none pl-12 rounded-full bg-gray-custom-100 placeholder:text-gray-custom-500 placeholder:font-normal text-base"
                placeholder="Search"
                value={searchQuery}
                onChange={onChange}
              />
              <button
                type="submit"
                className="bg-orange-custom-100 py-[8.5px] px-4 rounded-full absolute right-1"
              >
                <SearchIcon className="text-white" />
              </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SearchBox;
