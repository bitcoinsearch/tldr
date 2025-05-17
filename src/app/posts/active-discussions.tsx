"use client";

import React from "react";
import Image from "next/image";
import { HomepageEntryData, SortKey } from "@/helpers/types";
import { getSortedPosts } from "@/helpers/utils";
import { PostsCard } from "../components/client/post-card";
import CategoriesNavigation from "../components/client/categories-navigation";

export const ActiveDiscussions = ({
  posts,
  dev,
}: {
  posts: (HomepageEntryData & {
    firstPostDate: string;
    lastPostDate: string;
  })[],
  dev?:SortKey;
}) => {

  const [sortKey, setSortKey] = React.useState<SortKey>( dev ? dev : "all");
  const [openPopUp, setOpenPopUp] = React.useState<boolean>(false);

  const memoizedPosts = React.useMemo(
    () => getSortedPosts(posts, sortKey),
    [posts, sortKey]
  );

  return (
    <div className="flex flex-col gap-6 max-w-[866px] mx-auto ">
      <section className="text-base font-gt-walsheim leading-[22.56px] flex items-center gap-4 justify-between">
        <CategoriesNavigation sortKey={sortKey} setSortKey={setSortKey} />

        <div className="flex items-center gap-4 relative">
          {openPopUp && (
            <section className="flex flex-col gap-3 bg-white p-6 rounded absolute top-10 right-0 shadow-sm border border-gray-custom-200">
              <p className="text-base leading-[22.56px]">Sort by</p>
              <section className="flex items-center gap-4">
                <button
                  className={`px-4 py-1 rounded-full text-sm text-nowrap leading-[19.74px]  ${
                    sortKey === "newest"
                      ? "bg-orange-custom-100 text-white"
                      : "bg-gray-custom-1000 text-black"
                  }`}
                  onClick={() => setSortKey("newest")}
                >
                  Newest First
                </button>
                <button
                  className={`px-4 py-1 rounded-full text-sm text-nowrap leading-[19.74px]  ${
                    sortKey === "oldest"
                      ? "bg-orange-custom-100 text-white"
                      : "bg-gray-custom-1000 text-black"
                  }`}
                  onClick={() => setSortKey("oldest")}
                >
                  Oldest First
                </button>
              </section>
            </section>
          )}
        </div>
      </section>

      <div className="flex items-center justify-between max-w-[866px] mx-auto w-full h-full">
        <section className="flex flex-col gap-4 md:gap-6 pb-[44px]">
          {!memoizedPosts.length ? (
            <p>
              Oops! No ongoing discussions this week. Check out the new posts
              above.
            </p>
          ) : (
            memoizedPosts.map((entry, index) => {
              return <PostsCard entry={entry} key={`${entry.id}-${index}`} />;
            })
          )}
        </section>
      </div>
    </div>
  );
};
